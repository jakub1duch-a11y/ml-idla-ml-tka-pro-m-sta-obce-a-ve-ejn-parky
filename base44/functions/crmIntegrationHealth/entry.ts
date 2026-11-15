import { createClientFromRequest } from 'npm:@base44/sdk@0.8.61';
import { getBusinessConnectorStatus } from '../../shared/businessWorkflowGuard.mjs';

// Admin-only, read-only health probe. No customer data, tokens or prices are returned.
const PORTAL_ID = 149778217;
const SHEET_ID = '1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE';
const PRICING_SHEET_ID = '1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8';
const SAFE_HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

async function checkHubSpot(base44) {
  try {
    const connection = await base44.asServiceRole.connectors.getConnection('hubspot');
    if (!connection?.accessToken) return { ready: false, reason: 'oauth_missing' };
    const request = (path) => fetch('https://api.hubapi.com' + path, {
      headers: { Authorization: 'Bearer ' + connection.accessToken, Accept: 'application/json' },
      signal: AbortSignal.timeout(12000)
    });
    const identityResponse = await request('/integrations/v1/me');
    if (!identityResponse.ok) return { ready: false, reason: 'oauth_http_' + identityResponse.status };
    const identity = await identityResponse.json();
    const connectedPortal = Number(identity.portalId || identity.hubId || 0);
    if (connectedPortal !== PORTAL_ID) {
      return { ready: false, reason: 'wrong_portal', connected_portal: connectedPortal || null };
    }
    const stagesResponse = await request('/crm/v3/pipelines/deals');
    if (!stagesResponse.ok) return { ready: true, portal: PORTAL_ID, pipeline_verified: false, reason: 'pipelines_http_' + stagesResponse.status };
    const pipelines = await stagesResponse.json();
    const businessPipeline = (pipelines.results || []).find(p => p.id === '4351532258');
    return {
      ready: true, portal: PORTAL_ID,
      pipeline_verified: Boolean(businessPipeline),
      pipeline_id: businessPipeline?.id || null,
      stages: businessPipeline?.stages?.length || 0,
      stage_target: 8,
      pipeline_needs_review: !businessPipeline || businessPipeline.stages.length !== 8,
      reason: null
    };
  } catch {
    return { ready: false, reason: 'oauth_or_api_unavailable' };
  }
}

async function verifySheets(base44) {
  const check = await getBusinessConnectorStatus(base44, 'googlesheets');
  if (!check.ready) return { ...check, source_access: false };
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + SHEET_ID + '?fields=spreadsheetId,sheets.properties.title';
    const response = await fetch(url, { headers: { Authorization: 'Bearer ' + accessToken }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) return { ...check, source_access: false, reason: 'sheets_http_' + response.status };
    const value = await response.json();
    const tabs = (value.sheets || []).map(s => s.properties?.title);
    return { ...check, source_access: tabs.includes('KONTAKTY – VŠE') && tabs.includes('CRM – Příležitosti'),
      main_sheet_verified: tabs.includes('KONTAKTY – VŠE'), offers_sheet_verified: tabs.includes('CRM – Cenové nabídky'),
      source_id: SHEET_ID, pricing_source_id: PRICING_SHEET_ID };
  } catch { return { ...check, source_access: false, reason: 'sheets_api_unavailable' }; }
}

export default async function(req) {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!user) return Response.json({ ok: false, error: 'unauthorized' }, { status: 401, headers: SAFE_HEADERS });
  if (user.role !== 'admin') return Response.json({ ok: false, error: 'forbidden' }, { status: 403, headers: SAFE_HEADERS });
  if (req.method !== 'POST') return Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405, headers: SAFE_HEADERS });
  const [hubspot, sheets, gmail, drive] = await Promise.all([
    checkHubSpot(base44),
    verifySheets(base44),
    getBusinessConnectorStatus(base44, 'gmail'),
    getBusinessConnectorStatus(base44, 'googledrive'),
  ]);
  return Response.json({
    ok: true, mode: 'read_only', checked_at: new Date().toISOString(),
    expected_hubspot_portal: PORTAL_ID,
    hubspot, sheets, gmail, drive,
    can_auto_sync: false,
    can_send_mail: false,
    requires_product_master_approval: true,
    requires_live_pricing: true,
    canva: { integration: 'external_mcp', automatic_export_verified: false },
    note: 'Běh neprovádí importy, neodesílá e-maily, neprovádí změny v HubSpotu ani Google Workspace.'
  }, { headers: SAFE_HEADERS });
}
