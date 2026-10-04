import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const TOPICS = new Set(['offers', 'news_products', 'studies', 'personalized_settings']);
const CONSENT_VERSION = '2026-09-email-preferences-v1';

const clean = (value: unknown, max = 200) => String(value || '').trim().slice(0, max);
const normalizeEmail = (value: unknown) => clean(value, 320).toLowerCase();
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const action = clean(body.action, 20) || 'save';
    const sessionToken = clean(body.session_token, 200);
    let email = '';
    let name = '';
    let identitySource = 'signed_in_account';
    let accountUserId = '';

    if (sessionToken) {
      const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
      const session = sessions?.[0];
      if (!session || new Date(session.expires_at).getTime() < Date.now()) {
        if (session?.id) await base44.asServiceRole.entities.PortalSession.delete(session.id).catch(() => null);
        return Response.json({ error: 'session_expired' }, { status: 401 });
      }
      email = normalizeEmail(session.email);
      identitySource = 'customer_portal';
    } else {
      const user = await base44.auth.me().catch(() => null);
      email = normalizeEmail(user?.email);
      name = clean(user?.full_name || user?.name, 160);
      accountUserId = clean(user?.id, 200);
    }

    if (!email || !validEmail(email)) {
      return Response.json({ error: 'verified_email_required' }, { status: 401 });
    }

    const records = await base44.asServiceRole.entities.NewsletterLead.filter({ email }).catch(() => []);

    if (action === 'get') {
      const record = [...(records || [])].sort((a: any, b: any) =>
        new Date(b.last_preferences_update_at || b.updated_date || b.created_date || 0).getTime()
        - new Date(a.last_preferences_update_at || a.updated_date || a.created_date || 0).getTime()
      )[0] || null;

      return Response.json({
        ok: true,
        email,
        name: record?.name || name,
        marketing_consent: Boolean(record?.marketing_consent && record?.status !== 'unsubscribed'),
        topics: Array.isArray(record?.topics) ? record.topics.filter((topic: string) => TOPICS.has(topic)) : [],
        status: record?.status || 'not_subscribed',
      }, {
        headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
      });
    }

    if (action !== 'save') {
      return Response.json({ error: 'invalid_action' }, { status: 400 });
    }

    const marketingConsent = body.marketing_consent === true;
    const topics = [...new Set((Array.isArray(body.topics) ? body.topics : [])
      .map((topic: unknown) => clean(topic, 80))
      .filter((topic: string) => TOPICS.has(topic)))];

    if (marketingConsent && topics.length === 0) {
      return Response.json({ error: 'topic_required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const pageViews = Math.max(0, Math.min(10000, Number(body.page_view_count_at_signup) || 0));
    const payload: Record<string, unknown> = {
      email,
      name: clean(body.name || name, 160),
      source: clean(body.source, 80) || identitySource,
      topics,
      marketing_consent: marketingConsent,
      status: marketingConsent ? 'active' : 'unsubscribed',
      consent_version: CONSENT_VERSION,
      identity_source: identitySource,
      verified_account: true,
      account_user_id: accountUserId,
      portal_manageable: true,
      page_view_count_at_signup: pageViews,
      last_preferences_update_at: now,
    };

    if (marketingConsent) payload.consent_at = now;
    else payload.consent_revoked_at = now;

    if ((records || []).length > 0) {
      await Promise.all(records.map((record: any) =>
        base44.asServiceRole.entities.NewsletterLead.update(record.id, payload)
      ));
    } else {
      await base44.asServiceRole.entities.NewsletterLead.create(payload);
    }

    return Response.json({
      ok: true,
      email,
      marketing_consent: marketingConsent,
      topics,
      status: marketingConsent ? 'active' : 'unsubscribed',
      saved_at: now,
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    });
  } catch (error) {
    console.error('saveEmailPreferences failed', error);
    return Response.json({ error: error?.message || 'save_failed' }, { status: 500 });
  }
});
