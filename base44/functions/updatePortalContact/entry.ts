import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const normalizeEmail = (value: unknown) => String(value || '').trim().toLowerCase();
const clean = (value: unknown, max: number) => String(value || '').trim().slice(0, max);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const sessionToken = clean(body.session_token, 200);
    const name = clean(body.name, 160);
    const email = normalizeEmail(body.email);
    const phone = clean(body.phone, 80);

    if (!sessionToken || !name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'invalid_contact' }, { status: 400 });
    }

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions?.[0];
    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      if (session?.id) await base44.asServiceRole.entities.PortalSession.delete(session.id).catch(() => null);
      return Response.json({ error: 'session_expired' }, { status: 401 });
    }

    const currentEmail = normalizeEmail(session.email);
    if (email !== currentEmail) {
      const [conflictingAccounts, conflictingInquiries, conflictingProjects] = await Promise.all([
        base44.asServiceRole.entities.PortalAccount.filter({ email }).catch(() => []),
        base44.asServiceRole.entities.Poptavka.filter({ email }).catch(() => []),
        base44.asServiceRole.entities.ProjectOrder.filter({ client_email: email }).catch(() => []),
      ]);
      if ([conflictingAccounts, conflictingInquiries, conflictingProjects].some((records) => (records || []).length > 0)) {
        return Response.json({ error: 'email_already_used' }, { status: 409 });
      }
    }

    const [poptavky, contacts, projects, accounts] = await Promise.all([
      base44.asServiceRole.entities.Poptavka.filter({ email: currentEmail }).catch(() => []),
      base44.asServiceRole.entities.ContactInquiry.filter({ email: currentEmail }).catch(() => []),
      base44.asServiceRole.entities.ProjectOrder.filter({ client_email: currentEmail }).catch(() => []),
      base44.asServiceRole.entities.PortalAccount.filter({ email: currentEmail }).catch(() => []),
    ]);
    const confirmedAt = new Date().toISOString();

    await Promise.all([
      ...(poptavky || []).map((item: any) => base44.asServiceRole.entities.Poptavka.update(item.id, {
        jmeno: name,
        email,
        telefon: phone,
        contact_confirmed_by_user: true,
        contact_confirmed_at: confirmedAt,
      })),
      ...(contacts || []).map((item: any) => base44.asServiceRole.entities.ContactInquiry.update(item.id, {
        name,
        email,
        phone,
      })),
      ...(projects || []).map((item: any) => base44.asServiceRole.entities.ProjectOrder.update(item.id, {
        client_name: name,
        client_email: email,
        client_phone: phone,
      })),
      ...(accounts || []).map((item: any) => base44.asServiceRole.entities.PortalAccount.update(item.id, { email })),
      base44.asServiceRole.entities.PortalSession.update(session.id, { email }),
    ]);

    return Response.json({
      ok: true,
      name,
      email,
      phone,
      confirmed_at: confirmedAt,
      updated: {
        inquiries: Number((poptavky || []).length) + Number((contacts || []).length),
        projects: Number((projects || []).length),
      },
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    });
  } catch (error) {
    console.error('updatePortalContact failed', error);
    return Response.json({ error: error?.message || 'update_failed' }, { status: 500 });
  }
});
