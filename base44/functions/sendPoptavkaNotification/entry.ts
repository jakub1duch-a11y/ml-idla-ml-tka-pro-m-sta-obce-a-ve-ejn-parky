import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const TEAM_RECIPIENTS = ['meduna@holmtec.cz', 'jakub1duch@gmail.com', 'duch@holmtec.cz'];
const ENGINEER_EMAIL = 'meduna@holmtec.cz';
const INFO_EMAIL = 'info@mlzidla.cz';
const PHONE_DISPLAY = '+420 774 700 390';
const PHONE_HREF = '+420774700390';
const SITE_URL = 'https://mlzidla.cz';
const INSTAGRAM_URL = 'https://www.instagram.com/mlzidla/';
const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';
const INSTAGRAM_QR_URL = `${SITE_URL}/media/instagram-mlzidla-qr.svg`;

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function encodeRFC2047(str) {
  const encoded = btoa(unescape(encodeURIComponent(str)));
  return `=?UTF-8?B?${encoded}?=`;
}

function buildMimeMessage({ from, to, subject, body, replyTo }) {
  const encodedSubject = encodeRFC2047(subject);
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : '',
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    body,
  ].filter(Boolean).join('\r\n');

  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sendGmail(accessToken, { to, subject, body, replyTo }) {
  const raw = buildMimeMessage({
    from: 'MLŽIDLA.cz <me>',
    to,
    subject,
    body,
    replyTo,
  });

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  return { to, ok: response.ok, status: response.status };
}

function buildTeamEmail({ jmeno, email, telefon, firma, produkt, zprava }) {
  const rows = [
    ['Jméno', jmeno || '—'],
    ['E-mail', email || '—'],
    ['Telefon', telefon || '—'],
    ['Firma', firma || '—'],
    ['Produkt / projekt', produkt || '—'],
  ].map(([label, value]) =>
    `<tr><td style="padding:8px 12px;color:#94a3b8;font-size:13px;width:130px;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#e2e8f0;font-size:13px;">${escapeHtml(value)}</td></tr>`
  ).join('');

  return `
    <div style="margin:0;background:#071922;padding:40px 20px;font-family:Arial,'Helvetica Neue',sans-serif;">
      <div style="max-width:620px;margin:0 auto;background:#0d2d38;border-radius:18px;overflow:hidden;border:1px solid #194b59;">
        <div style="background:#0e5b67;padding:26px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:21px;line-height:1.3;">Nová poptávka — MLŽIDLA.cz</h1>
          <p style="margin:6px 0 0;color:#c7f5fb;font-size:13px;">Nová nezávazná poptávka byla právě odeslána z webu.</p>
        </div>
        <div style="padding:26px 32px;">
          <table role="presentation" style="width:100%;border-collapse:collapse;background:#102f3b;border-radius:12px;">${rows}</table>
          <div style="margin-top:20px;padding:18px 20px;background:#092530;border-radius:12px;border-left:3px solid #61d5e5;">
            <div style="color:#8fb5bf;font-size:11px;text-transform:uppercase;letter-spacing:.12em;margin-bottom:7px;">Zpráva klienta</div>
            <div style="color:#e7f5f7;font-size:14px;line-height:1.65;">${escapeHtml(zprava || '—').replace(/\n/g, '<br>')}</div>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:${encodeURIComponent(email)}" style="display:inline-block;padding:13px 26px;background:#61d5e5;color:#071922;font-weight:700;font-size:13px;border-radius:999px;text-decoration:none;">Odpovědět klientovi →</a>
          </div>
        </div>
      </div>
    </div>`;
}

function buildCustomerEmail({ jmeno, firma, produkt, zprava }) {
  const safeName = escapeHtml(jmeno || '');
  const safeCompany = escapeHtml(firma || '');
  const safeProduct = escapeHtml(produkt || 'Váš projekt');
  const safeMessage = escapeHtml(zprava || '').replace(/\n/g, '<br>');

  return `<!doctype html>
<html lang="cs">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef3f4;font-family:Arial,'Helvetica Neue',sans-serif;color:#10242b;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Děkujeme. Vaši poptávku jsme přijali a náš technický tým ji začne zpracovávat.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef3f4;width:100%;">
    <tr><td align="center" style="padding:28px 14px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:680px;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #dbe5e7;box-shadow:0 12px 36px rgba(13,45,56,.08);">
        <tr>
          <td style="background:#0d2d38;padding:28px 34px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
              <td valign="middle"><img src="${LOGO_URL}" width="190" alt="MLŽIDLA" style="display:block;width:190px;max-width:72%;height:auto;border:0;"></td>
              <td align="right" valign="middle" style="color:#8bcfda;font-size:11px;letter-spacing:.13em;text-transform:uppercase;white-space:nowrap;">Potvrzení poptávky</td>
            </tr></table>
          </td>
        </tr>

        <tr><td style="padding:38px 34px 24px;">
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#0e7584;font-weight:700;margin-bottom:12px;">Poptávka byla přijata</div>
          <h1 style="margin:0 0 16px;font-size:30px;line-height:1.18;color:#0d2d38;font-weight:700;">Děkujeme, ${safeName}.</h1>
          <p style="margin:0;font-size:16px;line-height:1.7;color:#4d6269;">Vaši nezávaznou poptávku jsme úspěšně přijali. Náš technický tým ji projde a připraví další postup podle typu prostoru, produktu a požadovaného způsobu instalace.</p>
        </td></tr>

        <tr><td style="padding:0 34px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f8f8;border:1px solid #e1e9ea;border-radius:16px;">
            <tr><td style="padding:20px 22px;">
              <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6e858b;margin-bottom:8px;">Shrnutí vaší poptávky k našemu nacenění</div>
              <div style="font-size:18px;line-height:1.4;color:#0d2d38;font-weight:700;">${safeProduct || 'Projekt mlžení'}</div>
              ${safeCompany ? `<div style="margin-top:6px;font-size:13px;color:#71858a;">${safeCompany}</div>` : ''}
              <div style="margin-top:14px;font-size:12px;line-height:1.55;color:#7a8d92;">Níže uvádíme informace, ze kterých budeme vycházet při technickém posouzení a přípravě cenové nabídky.</div>
              ${safeMessage ? `<div style="margin-top:14px;padding-top:16px;border-top:1px solid #dde7e9;font-size:13px;line-height:1.6;color:#5f747a;">${safeMessage}</div>` : ''}
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:0 34px 32px;">
          <h2 style="margin:0 0 18px;font-size:21px;color:#0d2d38;">Co bude následovat</h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr><td width="42" valign="top" style="padding:0 0 18px;"><div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;background:#dff7fa;color:#0e5b67;font-weight:700;font-size:13px;">1</div></td><td valign="top" style="padding:4px 0 18px;font-size:14px;line-height:1.55;color:#50666c;"><strong style="color:#17343d;">Technické posouzení.</strong> Projdeme záměr, typ prostoru a vhodnou produktovou konfiguraci.</td></tr>
            <tr><td width="42" valign="top" style="padding:0 0 18px;"><div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;background:#dff7fa;color:#0e5b67;font-weight:700;font-size:13px;">2</div></td><td valign="top" style="padding:4px 0 18px;font-size:14px;line-height:1.55;color:#50666c;"><strong style="color:#17343d;">Doplnění podkladů.</strong> Pokud bude potřeba, ozveme se kvůli rozměrům, fotografii prostoru, přívodu vody nebo způsobu kotvení.</td></tr>
            <tr><td width="42" valign="top" style="padding:0 0 18px;"><div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;background:#dff7fa;color:#0e5b67;font-weight:700;font-size:13px;">3</div></td><td valign="top" style="padding:4px 0 18px;font-size:14px;line-height:1.55;color:#50666c;"><strong style="color:#17343d;">Návrh řešení.</strong> Doporučíme vhodný produkt, rozsah systému, řízení a podle projektu připravíme cenovou nabídku nebo vizualizaci.</td></tr>
            <tr><td width="42" valign="top"><div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;background:#dff7fa;color:#0e5b67;font-weight:700;font-size:13px;">4</div></td><td valign="top" style="padding:4px 0;font-size:14px;line-height:1.55;color:#50666c;"><strong style="color:#17343d;">Realizace.</strong> Po odsouhlasení řešíme výrobu, instalaci, uvedení do provozu a následný servis podle rozsahu projektu.</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:0 34px 34px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0d2d38;border-radius:18px;color:#ffffff;">
            <tr><td style="padding:24px 24px;">
              <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#61d5e5;margin-bottom:8px;">Technický kontakt</div>
              <div style="font-size:20px;line-height:1.35;font-weight:700;color:#ffffff;">Ing. Radek Meduna</div>
              <div style="margin-top:12px;font-size:14px;line-height:1.9;color:#cce4e8;">
                <a href="tel:${PHONE_HREF}" style="color:#ffffff;text-decoration:none;">${PHONE_DISPLAY}</a><br>
                <a href="mailto:${ENGINEER_EMAIL}" style="color:#61d5e5;text-decoration:none;">${ENGINEER_EMAIL}</a><br>
                <a href="mailto:${INFO_EMAIL}" style="color:#61d5e5;text-decoration:none;">${INFO_EMAIL}</a>
              </div>
              <div style="margin-top:18px;">
                <a href="mailto:${ENGINEER_EMAIL}" style="display:inline-block;background:#61d5e5;color:#09242d;text-decoration:none;font-size:13px;font-weight:700;padding:12px 20px;border-radius:999px;">Napsat technikovi →</a>
              </div>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:0 34px 36px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
            <td valign="middle" style="padding-right:18px;">
              <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#7c9095;margin-bottom:7px;">Sledujte realizace</div>
              <div style="font-size:19px;line-height:1.35;font-weight:700;color:#0d2d38;margin-bottom:10px;">MLŽIDLA® na Instagramu</div>
              <p style="margin:0 0 13px;font-size:13px;line-height:1.55;color:#667b81;">Inspirace z realizací, nové produkty a ukázky mlžení v reálném prostoru.</p>
              <a href="${INSTAGRAM_URL}" style="color:#0e7584;text-decoration:none;font-size:13px;font-weight:700;">@mlzidla →</a>
            </td>
            <td width="126" align="right" valign="middle"><a href="${INSTAGRAM_URL}"><img src="${INSTAGRAM_QR_URL}" width="116" height="116" alt="QR kód na Instagram MLŽIDLA" style="display:block;width:116px;height:116px;border:1px solid #e1e9ea;border-radius:12px;padding:5px;background:#ffffff;"></a></td>
          </tr></table>
        </td></tr>

        <tr><td align="center" style="background:#f5f8f8;border-top:1px solid #e1e9ea;padding:24px 26px 28px;">
          <div style="font-size:13px;color:#37535b;font-weight:700;">MLŽIDLA® / HolmTec s.r.o.</div>
          <div style="margin-top:6px;font-size:12px;line-height:1.7;color:#7a8d92;">Trutnov · Česká republika · <a href="${SITE_URL}" style="color:#0e7584;text-decoration:none;">mlzidla.cz</a></div>
          <div style="margin-top:10px;font-size:11px;line-height:1.6;color:#98a7ab;">Tento e-mail byl odeslán automaticky jako potvrzení poptávky z webu MLŽIDLA.cz. Na zprávu můžete odpovědět a spojit se přímo s naším týmem.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const entityId = body?.event?.entity_id || body?.data?.id;
    if (!entityId) return Response.json({ error: 'Missing entity id' }, { status: 400 });

    let record;
    try {
      record = await base44.asServiceRole.entities.Poptavka.get(entityId);
    } catch (_error) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    if (!record) return Response.json({ error: 'Not found' }, { status: 404 });

    const { jmeno, email, telefon, firma, produkt, zprava } = record;
    if (!jmeno || !email || !zprava) return Response.json({ error: 'Missing required fields' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const teamBody = buildTeamEmail({ jmeno, email, telefon, firma, produkt, zprava });
    const teamSubject = `Nová poptávka: ${jmeno || 'Neznámý'} — ${produkt || 'neurčený projekt'}`;
    const teamResults = await Promise.all(TEAM_RECIPIENTS.map((to) => sendGmail(accessToken, {
      to,
      subject: teamSubject,
      body: teamBody,
      replyTo: email,
    })));

    const customerBody = buildCustomerEmail({ jmeno, firma, produkt, zprava });
    const customerResult = await sendGmail(accessToken, {
      to: email,
      subject: 'Poptávku jsme přijali | MLŽIDLA®',
      body: customerBody,
      replyTo: ENGINEER_EMAIL,
    });

    const failed = [...teamResults, customerResult].filter((result) => !result.ok);
    if (failed.length) {
      return Response.json({ error: 'Notification delivery failed', teamResults, customerResult }, { status: 500 });
    }

    return Response.json({ ok: true, teamResults, customerResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});