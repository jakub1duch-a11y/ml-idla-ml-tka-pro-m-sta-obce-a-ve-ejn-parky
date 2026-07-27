import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import MailComposer from 'npm:mailcomposer@4.0.2';

const TEAM_RECIPIENTS = 'jakub1duch@gmail.com, meduna@holmtec.cz';

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function createRawEmail(options) {
  return new Promise((resolve, reject) => {
    new MailComposer(options).compile().build((error, message) => {
      if (error) return reject(error);
      resolve(message.toString('base64url'));
    });
  });
}

async function sendEmail(accessToken, options) {
  const raw = await createRawEmail(options);
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
  if (!response.ok) throw new Error(JSON.stringify(await response.json().catch(() => ({}))));
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const isAutomationEvent = body?.event?.entity_name === 'Poptavka';

    if (!isAutomationEvent) {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
      if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const entityId = body?.event?.entity_id || body?.data?.id;
    if (!entityId) return Response.json({ error: 'Missing entity id' }, { status: 400 });

    const inquiry = await base44.asServiceRole.entities.Poptavka.get(entityId);
    if (!inquiry) return Response.json({ error: 'Not found' }, { status: 404 });

    const { jmeno, email, telefon, firma, produkt, zprava } = inquiry;
    if (!jmeno || !email || !zprava) return Response.json({ error: 'Missing required fields' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const sender = 'Mlzidla.cz <me>';
    const inquiryName = firma || jmeno;
    const teamHtml = `<h1>Nová poptávka z webu Mlzidla.cz</h1><table><tr><td><strong>Jméno</strong></td><td>${escapeHtml(jmeno)}</td></tr><tr><td><strong>Firma</strong></td><td>${escapeHtml(firma || '—')}</td></tr><tr><td><strong>E-mail</strong></td><td>${escapeHtml(email)}</td></tr><tr><td><strong>Telefon</strong></td><td>${escapeHtml(telefon || '—')}</td></tr><tr><td><strong>Produkt</strong></td><td>${escapeHtml(produkt || '—')}</td></tr></table><h2>Zpráva</h2><p>${escapeHtml(zprava).replace(/\n/g, '<br>')}</p>`;
    const customerText = `Vážený pane / Vážená paní,\n\nděkuji Vám za zájem o naše služby a za zaslání poptávky k projektu ochlazování veřejného či soukromého prostoru.\n\nVelmi si této příležitosti vážíme. Vaše zadání ohledně mlžících systémů zpracujeme a nejpozději do 24 hodin Vás budeme kontaktovat, abychom si upřesnili technické detaily a mohl jsem pro Vás vypracovat přesnou cenovou nabídku na míru vašemu projektu.\n\nPokud byste mezitím potřebovali cokoliv doplnit, neváhejte mě kontaktovat na níže uvedených údajích.\nInformace o našich technologiích najdete také na webu - https://mlzidla.cz\n\nPřeji Vám úspěšný den a těšíme se na spolupráci.\n\nS pozdravem\nIng. Radek Meduna - Výrobní ředitel Mlzidla.cz\n\nKontaktní údaje:\nKontakt: Ing. Radek Meduna\nTelefon: +420 774 700 390\nhttps://Mlzidla.cz`;

    await sendEmail(accessToken, {
      from: sender,
      to: TEAM_RECIPIENTS,
      replyTo: email,
      subject: `💦💦Nová popávka z webu - mlžidla.cz / ${inquiryName}`,
      text: `Jméno: ${jmeno}\nFirma: ${firma || '—'}\nE-mail: ${email}\nTelefon: ${telefon || '—'}\nProdukt: ${produkt || '—'}\n\nZpráva:\n${zprava}`,
      html: teamHtml,
    });

    await sendEmail(accessToken, {
      from: sender,
      to: email,
      subject: 'Děkujeme za poptávku po mlžném systému – Mlzidla.cz',
      text: customerText,
      html: customerText.split('\n').map((line) => line ? `<p>${escapeHtml(line)}</p>` : '<br>').join(''),
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});