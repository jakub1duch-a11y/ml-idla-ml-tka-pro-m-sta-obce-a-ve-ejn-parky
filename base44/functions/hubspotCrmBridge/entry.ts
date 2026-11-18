import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const isEmail = (v: string) => /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(v);

export default async function(req: Request): Promise<Response> {
  if (req.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405, headers });
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!user || user.role !== 'admin') return Response.json({ error: 'forbidden' }, { status: 403, headers });
  const body = await req.json().catch(() => ({}));
  const action = body.action === 'match_contact' ? 'match_contact' : 'status';
  const email = String(body.email || '').trim().toLowerCase();
  if (action === 'match_contact' && !isEmail(email))
    return Response.json({ error: 'invalid_email' }, { status: 422, headers });
  let token: string;
  try {
    const connection = await base44.asServiceRole.connectors.getConnection('hubspot');
    token = connection.accessToken;
    if (!token) throw Error('no_token');
  } catch {
    return Response.json({ error: 'hubspot_not_connected', connected: false, writes_enabled: false }, { status: 503, headers });
  }
  try {
    const url = action === 'status'
      ? 'https://api.hubapi.com/crm/v3/objects/contacts?limit=1&properties=email'
      : 'https://api.hubapi.com/crm/v3/objects/contacts/search';
    const response = await fetch(url, {
      method: action === 'status' ? 'GET' : 'POST',
      headers: {
        'Authorization': 'Bearer ' + token, 'Accept': 'application/json',
        ...(action === 'match_contact' ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(action === 'match_contact' ? { body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
        properties: ['email', 'firstname', 'lastname', 'company', 'jobtitle'],
        limit: 3,
      }) } : {}),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      const error = [401,403].includes(response.status) ? 'hubspot_access_denied'
        : response.status === 429 ? 'hubspot_rate_limited' : 'hubspot_api_unavailable';
      return Response.json({ error, connected: true, writes_enabled: false, http_status: response.status }, { status: 502, headers });
    }
    const result = await response.json();
    if (action === 'status') {
      return Response.json({
        ok: true, connected: true, read_verified: true, writes_enabled: false,
        identity_verified: false, reason: 'Před zápisem je třeba potvrdit správný firemní HubSpot portál.',
        checked_at: new Date().toISOString(),
      }, { headers });
    }
    const matches = (result.results || []).slice(0, 3).map((record: any) => ({
      id: String(record.id || '').slice(0, 40),
      email: String(record.properties?.email || '').slice(0, 150),
      name: [record.properties?.firstname,record.properties?.lastname].filter(Boolean).join(' ').slice(0, 160),
      company: String(record.properties?.company || '').slice(0, 160),
      jobtitle: String(record.properties?.jobtitle || '').slice(0, 120),
    }));
    // A matching HubSpot record is for human comparison, never an automatic CRM overwrite.
    return Response.json({ ok: true, queried_email: email, matches, total: Number(result.total || matches.length), writes_enabled: false }, { headers });
  } catch {
    return Response.json({ error: 'hubspot_unavailable', writes_enabled: false }, { status: 502, headers });
  }
}