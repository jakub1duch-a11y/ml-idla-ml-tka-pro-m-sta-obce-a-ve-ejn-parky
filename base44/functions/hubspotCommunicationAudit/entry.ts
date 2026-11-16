import { createClientFromRequest } from 'npm:@base44/sdk@0.8.61';

const PORTAL_ID = 149778217;
const HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const PROPERTIES = ['hs_email_subject','hs_email_status','hs_email_direction','hs_email_text','hs_timestamp'];
const classify = (subject = '') => {
  const s = String(subject).toLowerCase();
  if (/mlžidla|mlzidla|mlžítk|mlzitk|mlžic|mlzic|hmlov|hmlov|mlžen|mlzen/.test(s)) return 'mlzidla';
  if (/holmtec|ohýbán|ohyb|trubk|svářen|svaren|cnc|součástk|soucastk|výrob|vyrob/.test(s)) return 'holmtec_candidate';
  return 'unassigned';
};
const safe = (v, max = 18000) => String(v ?? '').slice(0,max);
async function api(token, path, options = {}) {
  const response = await fetch('https://api.hubapi.com' + path, {
    ...options,
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    redirect: 'error',
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error('hubspot_http_' + response.status);
  return response.json();
}
export default async function(req) {
  if (req.method !== 'POST') return Response.json({ok:false,error:'method_not_allowed'},{status:405,headers:HEADERS});
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!user || user.role !== 'admin') return Response.json({ok:false,error:'admin_required'},{status:403,headers:HEADERS});
  const input = await req.json().catch(() => ({}));
  const limit = Math.min(100, Math.max(1, Number.parseInt(String(input.limit || 30),10) || 30));
  const after = /^\\d{1,30}$/.test(String(input.after || '')) ? String(input.after) : undefined;
  try {
    const connection = await base44.asServiceRole.connectors.getConnection('hubspot');
    if (!connection?.accessToken) throw new Error('hubspot_auth_missing');
    const identity = await api(connection.accessToken, '/integrations/v1/me');
    const connected = Number(identity.portalId || identity.hubId || 0);
    if (connected !== PORTAL_ID) {
      return Response.json({ok:false,error:'wrong_hubspot_portal',expected_portal:PORTAL_ID,connected_portal:connected || null},{status:409,headers:HEADERS});
    }
    const body = {limit,properties:PROPERTIES,sorts:[{propertyName:'hs_timestamp',direction:'DESCENDING'}],...(after ? {after} : {})};
    const result = await api(connection.accessToken, '/crm/v3/objects/emails/search', {method:'POST',body:JSON.stringify(body)});
    return Response.json({
      ok:true, mode:'read_only', portal_id:PORTAL_ID, checked_at:new Date().toISOString(),
      total:Number(result.total || 0), next_after:result.paging?.next?.after || null,
      messages:(result.results || []).map((item) => {
        const p = item.properties || {};
        const subject = safe(p.hs_email_subject,300);
        const text = safe(p.hs_email_text,18000);
        return {
          id:String(item.id),
          subject,
          status:safe(p.hs_email_status,40),
          direction:safe(p.hs_email_direction,60),
          timestamp:p.hs_timestamp || p.hs_createdate || null,
          body_text:text,
          is_customer_agent:/MLZIDLAcz Customer Agent/i.test(text),
          brand_hint:classify(subject)
        };
      })
    },{headers:HEADERS});
  } catch(error) {
    const code = String(error?.message || 'hubspot_unavailable');
    return Response.json({ok:false,error:/^(hubspot_http_\\d{3}|hubspot_auth_missing)$/.test(code)?code:'hubspot_unavailable'}, {status:503,headers:HEADERS});
  }
}
