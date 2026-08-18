import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const normalizeQuote = (value: unknown) => String(value || '').trim().toUpperCase();
const normalizeEmail = (value: unknown) => String(value || '').trim().toLowerCase();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const quoteNumber = normalizeQuote(body.quote_number);
    let email = normalizeEmail(body.email);

    if (!quoteNumber && !email) {
      return Response.json({ error: 'Email or quote number is required' }, { status: 400 });
    }

    let hasAccessTarget = false;

    if (quoteNumber) {
      const projects = await base44.asServiceRole.entities.ProjectOrder.filter({ quote_number: quoteNumber });
      const project = projects?.[0];
      if (project?.client_email) {
        email = normalizeEmail(project.client_email);
        hasAccessTarget = true;
      }
    } else {
      const contactInquiries = await base44.asServiceRole.entities.ContactInquiry.filter({ email });
      const projects = await base44.asServiceRole.entities.ProjectOrder.filter({ client_email: email });
      hasAccessTarget = contactInquiries.length > 0 || projects.length > 0;
    }

    if (hasAccessTarget && email) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const existing = await base44.asServiceRole.entities.PortalOtp.filter({ email });
      for (const rec of existing) {
        await base44.asServiceRole.entities.PortalOtp.delete(rec.id);
      }

      await base44.asServiceRole.entities.PortalOtp.create({ email, otp_code: otpCode, expires_at: expiresAt });

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject: quoteNumber ? `Přístup k nabídce ${quoteNumber} | MLŽIDLA®` : 'Ověřovací kód | MLŽIDLA® Můj projekt',
        body: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d2d38;color:#e6f4f7;padding:32px;border-radius:18px;">
            <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#61d5e5;margin-bottom:8px;">MLŽIDLA® by HolmTec</div>
            <h1 style="font-size:24px;margin:0;color:#ffffff;">Přístup do Můj projekt</h1>
            <p style="color:#a8c4ca;font-size:13px;line-height:1.7;margin:10px 0 24px;">${quoteNumber ? `Ověřujeme přístup k cenové nabídce <strong style="color:#ffffff;">${quoteNumber}</strong>.` : 'Ověřujeme přístup k vašim projektům a cenovým nabídkám.'}</p>
            <div style="margin:24px 0;padding:18px;background:#113b47;border:1px solid #245966;border-radius:14px;text-align:center;">
              <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8bcfda;margin-bottom:8px;">Ověřovací kód</div>
              <p style="font-size:34px;font-weight:bold;letter-spacing:6px;color:#61d5e5;margin:0;">${otpCode}</p>
            </div>
            <p style="line-height:1.7;color:#cfe4e8;font-size:13px;">Kód platí 10 minut. Po ověření uvidíte dokumenty, vizualizace, stav nabídky a další kroky projektu.</p>
            <p style="margin-top:24px;padding-top:20px;border-top:1px solid #24505c;color:#7998a0;font-size:11px;line-height:1.6;">Kód nikomu nepřeposílejte. Pokud jste o přístup nežádali, tento e-mail ignorujte.</p>
          </div>
        `,
      });
    }

    // Z bezpečnostních důvodů neprozrazujeme, zda číslo nabídky/e-mail existuje.
    return Response.json({ ok: true, access_mode: quoteNumber ? 'quote' : 'email' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});