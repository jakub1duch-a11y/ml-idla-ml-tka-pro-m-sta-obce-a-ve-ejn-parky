import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();
    const otp = (body.otp || '').trim();

    if (!email || !otp) return Response.json({ error: 'Email and code are required' }, { status: 400 });

    const records = await base44.asServiceRole.entities.PortalOtp.filter({ email }, '-created_date', 1);
    const record = records[0];

    if (!record || new Date(record.expires_at).getTime() < Date.now()) {
      if (record) await base44.asServiceRole.entities.PortalOtp.delete(record.id);
      return Response.json({ error: 'invalid_or_expired' }, { status: 401 });
    }

    // Lock out after 5 failed attempts to prevent brute-forcing the 6-digit code
    if ((record.attempts || 0) >= 5) {
      await base44.asServiceRole.entities.PortalOtp.delete(record.id);
      return Response.json({ error: 'invalid_or_expired' }, { status: 401 });
    }

    if (record.otp_code !== otp) {
      await base44.asServiceRole.entities.PortalOtp.update(record.id, { attempts: (record.attempts || 0) + 1 });
      return Response.json({ error: 'invalid_or_expired' }, { status: 401 });
    }

    await base44.asServiceRole.entities.PortalOtp.delete(record.id);

    const inquiries = await base44.asServiceRole.entities.ContactInquiry.filter({ email });
    const projects = await base44.asServiceRole.entities.ProjectOrder.filter({ client_email: email });

    // Issue a short-lived server-side session token so subsequent privileged
    // actions (e.g. approving a quote) can be verified against the OTP-confirmed
    // identity instead of trusting client-side state.
    const existingSessions = await base44.asServiceRole.entities.PortalSession.filter({ email });
    for (const s of existingSessions) {
      await base44.asServiceRole.entities.PortalSession.delete(s.id);
    }
    const sessionToken = crypto.randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    await base44.asServiceRole.entities.PortalSession.create({ email, token: sessionToken, expires_at: sessionExpiresAt });

    return Response.json({ verified: true, email, inquiries, projects, session_token: sessionToken });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});