import { createClientFromRequest } from 'npm:@base44/sdk@0.8.61';

// Interní diagnostika: pouze čtení, bez vytváření kontaktů, Deals či importů.
const TARGET_PORTAL = 149778217;
const HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

async function readHubSpot(token, path) {
  const response = await fetch('https://api.hubapi.com' + path, {
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) return { ok: false, status: response.status };
  const data = await response.json().catch(() => ({}));
  return { ok: true, data };
}

export default async function (req) {
  const base44 = createClientFromRequest(req);
  const actor = await base44.auth.me().catch(() => null);
  if (!actor) return Response.json({ ok: false, error: 'unauthorized' }, { status: 401, headers: HEADERS });
  if (actor.role !== 'admin') return Response.json({ ok: false, error: 'forbidden' }, { status: 403, headers: HEADERS });
  if (req.method !== 'POST') return Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405, headers: HEADERS });

  try {
    const connection = await base44.asServiceRole.connectors.getConnection('hubspot');
    if (!connection?.accessToken) {
      return Response.json({ ok: false, state: 'disconnected', error: 'hubspot_oauth_missing',
        expected_portal_id: TARGET_PORTAL, write_enabled: false }, { status: 503, headers: HEADERS });
    }
    const identity = await readHubSpot(connection.accessToken, '/integrations/v1/me');
    if (!identity.ok) return Response.json({ ok: false, state: 'identity_unverified',
      error: 'hubspot_identity_http_' + identity.status, expected_portal_id: TARGET_PORTAL,
      write_enabled: false }, { status: 503, headers: HEADERS });
    const connectedPortal = Number(identity.data.portalId || identity.data.hubId || 0);
    if (!Number.isSafeInteger(connectedPortal) || connectedPortal !== TARGET_PORTAL) {
      return Response.json({ ok: false, state: 'wrong_portal',
        expected_portal_id: TARGET_PORTAL, connected_portal_id: connectedPortal || null,
        write_enabled: false }, { status: 409, headers: HEADERS });
    }
    const crm = await readHubSpot(connection.accessToken, '/crm/v3/objects/contacts?limit=1');
    const stage = await readHubSpot(connection.accessToken, '/crm/v3/pipelines/deals/4351532258');
    return Response.json({
      ok: crm.ok && stage.ok, state: crm.ok && stage.ok ? 'verified_read_only' : 'permission_or_pipeline_error',
      portal_id: connectedPortal, expected_portal_id: TARGET_PORTAL,
      checks: { oauth_identity: true, crm_contacts_read: crm.ok, deal_pipeline_read: stage.ok,
        pipeline_stage_count: stage.ok && Array.isArray(stage.data.stages) ? stage.data.stages.length : null },
      crm_http_status: crm.ok ? 200 : crm.status, pipeline_http_status: stage.ok ? 200 : stage.status,
      write_enabled: false, checked_at: new Date().toISOString()
    }, { status: crm.ok && stage.ok ? 200 : 503, headers: HEADERS });
  } catch (_) {
    return Response.json({ ok: false, state: 'unavailable', error: 'hubspot_health_unavailable',
      expected_portal_id: TARGET_PORTAL, write_enabled: false }, { status: 503, headers: HEADERS });
  }
}
