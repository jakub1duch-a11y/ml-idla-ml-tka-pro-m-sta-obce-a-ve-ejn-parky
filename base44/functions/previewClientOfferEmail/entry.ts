import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { buildClientOfferEmail, loadOfferEmailData } from '../../shared/clientOfferEmail.ts';

const clean = (v: unknown, max = 2000) => String(v || '').trim().slice(0, max);

// Pouze bezpečný náhled: žádné odeslání testovací ani zákaznické zprávy.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });

    const body = await req.json().catch(() => ({}));
    const projectId = clean(body.project_id || body.project_order_id);
    const sendTest = Boolean(body.test_email);
    if (sendTest) return Response.json({ok:false,error:'test_send_disabled_use_preview_only'}, {status:403,headers:{'Cache-Control':'no-store'}});

    if (!projectId) return Response.json({ error: 'missing_project_id' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

    const loaded = await loadOfferEmailData(base44, projectId);
    if (!loaded) return Response.json({ error: 'not_found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    const { data, project } = loaded;
    const email = buildClientOfferEmail(data);

    return Response.json({
      ok: true,
      preview: true,
      subject: email.subject,
      html: email.html,
      text: email.text,
      recipient: project.client_email,
      project_id: projectId,
      quote_number: project.quote_number,
      project_name: project.project_name,
      visualizations: data.visualizations,
      visualizations_count: data.visualizations.length,
      attachments: data.attachments,
      smart_control_included: data.smartControlIncluded,
      portal_url: data.portalUrl,
      total_price: data.totalPrice,
      valid_until: data.validUntil,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'preview_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}