import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    // Triggered by the "Poptávka create" entity automation — only trust the actual
    // stored record fetched fresh from the DB, never attacker-supplied fields.
    const entityId = body?.event?.entity_id || body?.data?.id;
    if (!entityId) return Response.json({ error: 'Missing entity id' }, { status: 400 });

    let record;
    try {
      record = await base44.asServiceRole.entities.Poptavka.get(entityId);
    } catch (e) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    if (!record) return Response.json({ error: 'Not found' }, { status: 404 });

    const { jmeno, email, telefon, firma, produkt, zprava } = record;

    if (!jmeno || !email || !zprava) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const rows = [
      ['Jméno', jmeno || '—'],
      ['Email', email || '—'],
      ['Telefon', telefon || '—'],
      ['Firma', firma || '—'],
      ['Produkt', produkt || '—'],
    ].map(([label, value]) =>
      `<tr><td style="padding:8px 12px;color:#94a3b8;font-size:13px;width:130px;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#e2e8f0;font-size:13px;">${value}</td></tr>`
    ).join('');

    const html = `
      <div style="background:#0d1117;padding:40px 20px;font-family:'DM Sans',sans-serif;min-height:100vh;">
        <div style="max-width:560px;margin:0 auto;background:#131c27;border-radius:16px;overflow:hidden;border:1px solid #1e293b;">
          <div style="background:#0891b2;padding:28px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.03em;">Nová poptávka — MLZIDLA.CZ</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Právě přišla nová nezávazná poptávka z webu.-MLZIDLA.CZ.</p>
          </div>
          <div style="padding:24px 32px;">
            <table style="width:100%;border-collapse:collapse;background:#1a2535;border-radius:12px;overflow:hidden;">
              ${rows}
            </table>
            <div style="margin-top:20px;padding:16px 20px;background:#0f1f2e;border-radius:12px;border-left:3px solid #22d3ee;">
              <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Zpráva</p>
              <p style="margin:0;color:#e2e8f0;font-size:14px;line-height:1.6;">${zprava || '—'}</p>
            </div>
            <div style="margin-top:24px;text-align:center;">
              <a href="mailto:${email}" style="display:inline-block;padding:12px 28px;background:#22d3ee;color:#0d1117;font-weight:700;font-size:13px;border-radius:100px;text-decoration:none;">
                Odpovědět klientovi →
              </a>
            </div>
          </div>
          <div style="padding:16px 32px;background:#0d1117;text-align:center;">
            <p style="margin:0;color:#334155;font-size:11px;">HolmTec · mlzidla.cz · Trutnov, ČR</p>
          </div>
        </div>
      </div>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'obchod1@holmtec.cz',
      subject: `Nová poptávka: ${jmeno || 'Neznámý'} — ${produkt || 'neurčený produkt'}`,
      body: html,
      from_name: 'mlzidla.CZ-Web',
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});