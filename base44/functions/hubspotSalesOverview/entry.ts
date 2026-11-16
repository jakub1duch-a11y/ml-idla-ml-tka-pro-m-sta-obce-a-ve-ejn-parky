import { createClientFromRequest } from 'npm:@base44/sdk@0.8.61';

// Admin-only, read-only dashboard. HubSpot is the CRM source of truth;
// GA4 stays the aggregate website analytics source of truth.
const PORTAL = 149778217;
const PIPELINE = '4351532258';
const HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const MAX_RECENT_DEALS = 8;
const STAGES = [
  { id: '6441744588', label: 'Nová poptávka' },
  { id: '6441744589', label: 'Upřesnění zadání' },
  { id: '6441744590', label: 'Příprava nabídky' },
  { id: '6441744591', label: 'Nabídka odeslána' },
  { id: '6441744592', label: 'Vyhráno' },
  { id: '6441744593', label: 'Prohráno' },
];

async function requestHubSpot(token, path, body = null) {
  const response = await fetch('https://api.hubapi.com' + path, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('hubspot_http_' + response.status);
  return response.json();
}

function stageQuery(stage) {
  return {
    filterGroups: [{ filters: [
      { propertyName: 'pipeline', operator: 'EQ', value: PIPELINE },
      ...(stage ? [{ propertyName: 'dealstage', operator: 'EQ', value: stage }] : []),
    ] }],
    properties: ['dealname', 'dealstage', 'pipeline', 'hs_lastmodifieddate'],
    limit: stage ? 1 : MAX_RECENT_DEALS,
    ...(!stage ? { sorts: [{ propertyName: 'hs_lastmodifieddate', direction: 'DESCENDING' }] } : {}),
  };
}

export default async function (req) {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!user) return Response.json({ ok: false, error: 'unauthorized' }, { status: 401, headers: HEADERS });
  if (user.role !== 'admin') return Response.json({ ok: false, error: 'forbidden' }, { status: 403, headers: HEADERS });
  if (req.method !== 'POST') return Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405, headers: HEADERS });
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('hubspot');
    if (!accessToken) throw new Error('hubspot_auth_missing');
    const identity = await requestHubSpot(accessToken, '/integrations/v1/me');
    const connectedPortal = Number(identity.portalId || identity.hubId || 0);
    if (connectedPortal !== PORTAL) {
      return Response.json({ ok: false, error: 'hubspot_wrong_portal', connected_portal_id: connectedPortal || null, expected_portal_id: PORTAL }, { status: 409, headers: HEADERS });
    }
    const pipeline = await requestHubSpot(accessToken, '/crm/v3/pipelines/deals/' + PIPELINE);
    const actualStages = new Set((pipeline.stages || []).map(s => String(s.id)));
    if (STAGES.some(s => !actualStages.has(s.id))) {
      return Response.json({ ok: false, error: 'hubspot_pipeline_changed', portal_id: PORTAL }, { status: 409, headers: HEADERS });
    }

    const [recent, ...stageQueries] = await Promise.all([
      requestHubSpot(accessToken, '/crm/v3/objects/deals/search', stageQuery(null)),
      ...STAGES.map(s => requestHubSpot(accessToken, '/crm/v3/objects/deals/search', stageQuery(s.id))),
    ]);

    const stages = STAGES.map((s, i) => ({
      id: s.id, label: s.label, count: Number(stageQueries[i]?.total || 0),
    }));
    const count = stages.reduce((sum, s) => sum + s.count, 0);

    const deals = (recent.results || []).filter(row => /^[0-9]+$/.test(String(row.id || ''))).map(row => ({
      id: String(row.id),
      name: String(row.properties?.dealname || 'Obchodní případ').slice(0, 180),
      stage_id: String(row.properties?.dealstage || ''),
      updated_at: row.properties?.hs_lastmodifieddate || null,
      url: 'https://app-eu1.hubspot.com/contacts/' + PORTAL + '/record/0-3/' + row.id + '?utm_source=mlzidla_admin&utm_medium=crm_link&utm_campaign=offer_workflow',
    }));

    return Response.json({
      ok: true, portal_id: PORTAL, pipeline_id: PIPELINE, pipeline_label: pipeline.label || 'MLŽIDLA',
      mode: 'read_only', count, stages, recent_deals: deals,
      recent_deals_limit: MAX_RECENT_DEALS, checked_at: new Date().toISOString(),
      analytics_note: 'HubSpot CRM measures deal progression. GA4 measures consented site traffic; never mix their denominators.',
      communication_note: 'Email delivery and reply states require evidence from Gmail SENT or the CRM timeline, not offer draft creation.',
    }, { headers: HEADERS });
  } catch (e) {
    const error = String(e?.message || '');
    return Response.json({ ok: false, error: /^hubspot_(http_[0-9]{3}|auth_missing)$/.test(error) ? error : 'hubspot_sales_overview_unavailable' }, { status: 503, headers: HEADERS });
  }
}
