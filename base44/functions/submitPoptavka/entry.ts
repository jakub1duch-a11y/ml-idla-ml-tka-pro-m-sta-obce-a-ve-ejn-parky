import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const clean = (value: unknown, max: number) => String(value || '').trim().slice(0, max);
const emailValue = (value: unknown) => clean(value, 254).toLowerCase();
const allowedFields = [
  'telefon', 'firma', 'produkt', 'service_type', 'request_type', 'custom_shape',
  'source_project_order_id', 'installation_location', 'installation_option',
  'water_connection_state', 'surface_type', 'trench_length_m', 'needs_installation_quote',
  'quantity', 'attachment_urls', 'attachment_names', 'photo_count', 'requested_visualization',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const jmeno = clean(body.jmeno, 160);
    const email = emailValue(body.email);
    const zprava = clean(body.zprava, 6000);
    const useGoogleContact = body.use_google_contact === true;
    const privacyConsent = body.privacy_contact_consent === true;
    const contactConfirmed = body.contact_confirmed_by_user === true;

    if (!jmeno || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !zprava) {
      return Response.json({ error: 'invalid_inquiry' }, { status: 400 });
    }
    if (!privacyConsent || !contactConfirmed) {
      return Response.json({ error: 'contact_confirmation_required' }, { status: 400 });
    }

    const user = useGoogleContact ? await base44.auth.me().catch(() => null) : null;
    if (useGoogleContact && !user?.email) {
      return Response.json({ error: 'google_login_required' }, { status: 401 });
    }

    const confirmedAt = new Date().toISOString();
    const safeExtra: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) safeExtra[field] = body[field];
    }

    const created = await base44.asServiceRole.entities.Poptavka.create({
      ...safeExtra,
      jmeno,
      email,
      zprava,
      status: 'nova',
      offer_status: 'nova_poptavka',
      contact_source: useGoogleContact ? 'google_account' : 'manual',
      use_google_contact: useGoogleContact,
      google_contact_email: useGoogleContact ? emailValue(user.email) : '',
      google_contact_name: useGoogleContact ? clean(user.full_name || user.name || user.display_name, 160) : '',
      google_profile_image_url: useGoogleContact ? clean(user.profile_image_url || user.profile_picture || user.avatar_url || user.picture, 1000) : '',
      contact_confirmed_by_user: true,
      contact_confirmed_at: confirmedAt,
      privacy_contact_consent: true,
      privacy_contact_consent_at: confirmedAt,
    });

    return Response.json({ ok: true, inquiry: created }, {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    });
  } catch (error) {
    console.error('submitPoptavka failed', error);
    return Response.json({ error: error?.message || 'inquiry_failed' }, { status: 500 });
  }
});
