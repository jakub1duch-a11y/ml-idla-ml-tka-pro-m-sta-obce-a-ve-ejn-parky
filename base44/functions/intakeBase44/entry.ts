import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

const clean = (value: unknown) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

export default async function(req: Request) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const source = clean(body.source || body.service_type || 'web_intake');

    // Required fields
    const jmeno = clean(body.jmeno || body.name || '');
    const email = clean(body.email || '');
    const zprava = clean(body.zprava || body.message || body.note || '');

    if (!jmeno || !email || !zprava) {
      return Response.json({
        error: 'Missing required fields: jmeno (name), email, zprava (message)',
      }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Create Poptavka record — RLS allows public create
    const poptavka = await base44.asServiceRole.entities.Poptavka.create({
      jmeno,
      email,
      telefon: clean(body.telefon || body.phone || ''),
      firma: clean(body.firma || body.company || body.organization || ''),
      produkt: clean(body.produkt || body.product_interest || body.product || ''),
      service_type: source,
      request_type: body.request_type && ['standard', 'other_product', 'custom_design'].includes(body.request_type)
        ? body.request_type
        : 'standard',
      custom_shape: clean(body.custom_shape || ''),
      attachment_urls: Array.isArray(body.attachment_urls) ? body.attachment_urls.filter(Boolean) : [],
      attachment_names: Array.isArray(body.attachment_names) ? body.attachment_names.filter(Boolean) : [],
      zprava,
      status: 'nova',
      offer_status: 'nova_poptavka',
    });

    // Notify admin team via Slack (if available)
    try {
      await base44.asServiceRole.functions.invoke('notifySlackNewInquiry', {
        inquiry_id: poptavka.id,
        inquiry_type: 'poptavka',
        source,
      });
    } catch (_) {}

    return Response.json({
      ok: true,
      inquiry_id: poptavka.id,
      offer_status: 'nova_poptavka',
      message: 'Poptávka přijata. Tým MLŽIDLA připraví koncept nabídky.',
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
}