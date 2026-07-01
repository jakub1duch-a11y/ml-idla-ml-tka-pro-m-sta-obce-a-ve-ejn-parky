import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();

    if (!email) return Response.json({ error: 'Email is required' }, { status: 400 });

    const inqs = await base44.asServiceRole.entities.ContactInquiry.filter({ email });
    const projs = await base44.asServiceRole.entities.ProjectOrder.filter({ client_email: email });

    if (inqs.length === 0 && projs.length === 0) {
      return Response.json({ error: 'not_found' }, { status: 404 });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Remove any previous pending codes for this email
    const existing = await base44.asServiceRole.entities.PortalOtp.filter({ email });
    for (const rec of existing) {
      await base44.asServiceRole.entities.PortalOtp.delete(rec.id);
    }

    await base44.asServiceRole.entities.PortalOtp.create({ email, otp_code: otpCode, expires_at: expiresAt });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: 'Ověřovací kód - HolmTec Můj Projekt',
      body: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e2e8f0;padding:32px;border-radius:12px;">
          <h1 style="color:#22d3ee;font-size:22px;margin:0;">Ověřovací kód</h1>
          <p style="color:#64748b;font-size:13px;margin:6px 0 24px;">HolmTec — Můj Projekt</p>
          <p style="line-height:1.7;">Váš ověřovací kód pro přístup k projektům:</p>
          <div style="margin:24px 0;padding:16px;background:#131c27;border-radius:8px;border-left:3px solid #22d3ee;text-align:center;">
            <p style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#22d3ee;margin:0;">${otpCode}</p>
          </div>
          <p style="line-height:1.7;color:#cbd5e1;">Kód platí 10 minut. Nezadávejte jej nikomu jinému.</p>
          <p style="margin-top:24px;padding-top:20px;border-top:1px solid #1e2a3a;color:#475569;font-size:12px;">
            HolmTec s.r.o. | Mlžné sochy & instalace | holmtec.cz
          </p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});