import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

const clean = (value: unknown) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

// Simple shared-secret check for external intake.
// External web forms send this in the X-Intake-Key header.
const INTAKE_KEY = Deno.env.get('INTAKE_KEY') || 'mlzidla-intake-2026';

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // Accept either X-Intake-Key header or Bearer token
    const intakeKey = req.headers.get('x-intake-key') || '';
    const bearer = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    const providedKey = intakeKey || bearer;

    // Allow requests without key from the app itself (same-origin), require key from external
    const origin = req.headers.get('origin') || '';
    const referer = req.headers.get('referer') || '';
    const isSameOrigin = origin.includes('base44.app') || referer.includes('base44.app');

    if (!isSameOrigin && providedKey !== INTAKE_KEY) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
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

    const base44 = createClientFromRequest(req);

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
});