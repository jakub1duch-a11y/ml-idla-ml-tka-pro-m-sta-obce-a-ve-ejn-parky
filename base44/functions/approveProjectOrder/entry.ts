import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { jsPDF } from 'npm:jspdf@4.0.0';
import { ensureOfferCaseFolders, uploadBytes, moveCaseToClosedOrders } from '../../shared/offerDrive.ts';

const toBase64 = (bytes: Uint8Array) => { let binary = ''; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); };
async function loadFont(doc: any) {
  try {
    const response = await fetch('https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans%5Bwdth,wght%5D.ttf');
    if (!response.ok) return;
    doc.addFileToVFS('NotoSans.ttf', toBase64(new Uint8Array(await response.arrayBuffer())));
    doc.addFont('NotoSans.ttf', 'NotoSans', 'normal', 'Identity-H');
    doc.setFont('NotoSans', 'normal');
  } catch (_) {}
}
const money = (value: unknown) => new Intl.NumberFormat('cs-CZ').format(Math.round(Number(value || 0)));
const TEAM_BCC = ['jakub1duch@gmail.com', 'duch@holmtec.cz', 'meduna@holmtec.cz'];
const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';
const SITE_URL = 'https://mlzidla.cz';
const CONTACT_EMAIL = 'meduna@holmtec.cz';
const INFO_EMAIL = 'info@mlzidla.cz';
const CONTACT_PHONE = '+420 774 700 390';

const toBase64Url = (bytes: Uint8Array) => toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const utf8Base64 = (value: string) => toBase64(new TextEncoder().encode(value));
const encodeHeader = (value: string) => `=?UTF-8?B?${utf8Base64(value)}?=`;
const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[char] as string));

function buildOrderConfirmationHtml(project: any, approvedAt: string) {
  const pdfLink = project.order_confirmation_pdf_url ? `<a href="${escapeHtml(project.order_confirmation_pdf_url)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 18px;border-radius:999px;background:#0e5b67;color:#fff;text-decoration:none;font-size:13px;font-weight:700">Otevřít potvrzení objednávky</a>` : '';
  return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#eef3f4;font-family:Arial,'Helvetica Neue',sans-serif;color:#10242b"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td align="center" style="padding:28px 14px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;background:#fff;border:1px solid #dbe5e7;border-radius:22px;overflow:hidden"><tr><td style="background:#0d2d38;padding:28px 34px"><table width="100%"><tr><td><img src="${LOGO_URL}" width="190" alt="MLŽIDLA" style="display:block;width:190px;max-width:72%;height:auto"></td><td align="right" style="font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:#8bcfda">Potvrzení objednávky</td></tr></table></td></tr><tr><td style="padding:36px 34px"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#0e7584;font-weight:700">Objednávka byla přijata</div><h1 style="margin:10px 0 14px;font-size:28px;color:#0d2d38">Děkujeme, ${escapeHtml(project.client_name || '')}.</h1><p style="margin:0;font-size:15px;line-height:1.7;color:#50666c">Elektronicky jste potvrdili cenovou nabídku a objednali uvedené řešení. Níže uvádíme základní rekapitulaci a další postup.</p><div style="margin:24px 0;padding:20px;border:1px solid #e1e9ea;border-radius:16px;background:#f5f8f8"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#6e858b;margin-bottom:10px">Shrnutí objednávky</div><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="padding:5px 0;color:#7a8d92;font-size:13px">Číslo nabídky</td><td align="right" style="padding:5px 0;color:#17343d;font-size:13px;font-weight:700">${escapeHtml(project.quote_number || '—')}</td></tr><tr><td style="padding:5px 0;color:#7a8d92;font-size:13px">Projekt</td><td align="right" style="padding:5px 0;color:#17343d;font-size:13px;font-weight:700">${escapeHtml(project.project_name || project.product_name || '—')}</td></tr><tr><td style="padding:5px 0;color:#7a8d92;font-size:13px">Cena bez DPH</td><td align="right" style="padding:5px 0;color:#17343d;font-size:13px;font-weight:700">${project.total_price ? `${money(project.total_price)} Kč` : 'dle nabídky'}</td></tr><tr><td style="padding:5px 0;color:#7a8d92;font-size:13px">Potvrzeno</td><td align="right" style="padding:5px 0;color:#17343d;font-size:13px;font-weight:700">${new Date(approvedAt).toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })}</td></tr></table></div>${pdfLink}<a href="${SITE_URL}/muj-projekt" style="display:inline-block;margin:0 8px 8px 0;padding:12px 18px;border-radius:999px;background:#dff7fa;color:#0d2d38;text-decoration:none;font-size:13px;font-weight:700">Můj projekt</a><div style="margin-top:26px;padding:22px;border-radius:16px;background:#0d2d38;color:#fff"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#61d5e5">Co bude následovat</div><p style="margin:9px 0 0;font-size:13px;line-height:1.7;color:#d7e8eb">Náš tým objednávku zkontroluje, naváže technickým upřesněním a potvrdí výrobní, dodací nebo realizační harmonogram. Pokud bude potřeba doplnit podklady, ozveme se vám přímo.</p><div style="margin-top:16px;font-size:13px;line-height:1.8;color:#cce4e8"><strong style="color:#fff">Ing. Radek Meduna</strong><br>${CONTACT_PHONE}<br><a href="mailto:${CONTACT_EMAIL}" style="color:#61d5e5;text-decoration:none">${CONTACT_EMAIL}</a><br><a href="mailto:${INFO_EMAIL}" style="color:#61d5e5;text-decoration:none">${INFO_EMAIL}</a></div></div></td></tr><tr><td align="center" style="padding:22px;background:#f5f8f8;border-top:1px solid #e1e9ea;color:#7a8d92;font-size:11px;line-height:1.6">MLŽIDLA® / HolmTec s.r.o. · Trutnov · Česká republika · <a href="${SITE_URL}" style="color:#0e7584;text-decoration:none">mlzidla.cz</a></td></tr></table></td></tr></table></body></html>`;
}

function buildOrderConfirmationMime(project: any, approvedAt: string, pdfBytes: Uint8Array | null, pdfFilename: string) {
  const outer = `order-${crypto.randomUUID()}`;
  const alt = `alt-${crypto.randomUUID()}`;
  const subject = `Potvrzení objednávky ${project.quote_number || ''} | MLŽIDLA®`.replace('  ', ' ');
  const text = `Dobrý den ${project.client_name || ''},\n\nděkujeme. Vaše objednávka k nabídce ${project.quote_number || '—'} byla úspěšně potvrzena.\nProjekt: ${project.project_name || project.product_name || '—'}\nCena bez DPH: ${project.total_price ? `${money(project.total_price)} Kč` : 'dle nabídky'}\nPotvrzeno: ${new Date(approvedAt).toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })}\n\nNáš tým nyní naváže technickým upřesněním a potvrzením harmonogramu.\n\nIng. Radek Meduna\n${CONTACT_PHONE}\n${CONTACT_EMAIL}\n${INFO_EMAIL}`;
  const html = buildOrderConfirmationHtml(project, approvedAt);
  const lines = [
    `From: ${encodeHeader('MLŽIDLA.cz by HolmTec')} <me>`,
    `Reply-To: ${CONTACT_EMAIL}`,
    `To: ${project.client_email}`,
    `Bcc: ${TEAM_BCC.join(', ')}`,
    `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${outer}"`, '',
    `--${outer}`, `Content-Type: multipart/alternative; boundary="${alt}"`, '',
    `--${alt}`, 'Content-Type: text/plain; charset="UTF-8"', 'Content-Transfer-Encoding: base64', '', utf8Base64(text),
    `--${alt}`, 'Content-Type: text/html; charset="UTF-8"', 'Content-Transfer-Encoding: base64', '', utf8Base64(html),
    `--${alt}--`
  ];
  if (pdfBytes && pdfBytes.length) {
    lines.push(`--${outer}`, `Content-Type: application/pdf; name="${pdfFilename}"`, 'Content-Transfer-Encoding: base64', `Content-Disposition: attachment; filename="${pdfFilename}"`, '', toBase64(pdfBytes));
  }
  lines.push(`--${outer}--`, '');
  return new TextEncoder().encode(lines.join('\r\n'));
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const projectId = body.project_id;
    const sessionToken = body.session_token;
    const acceptTerms = body.accept_terms === true;
    const acceptanceName = String(body.acceptance_name || '').trim();
    const acceptanceUserAgent = String(body.acceptance_user_agent || '').slice(0, 500);

    if (!projectId || !sessionToken) return Response.json({ error: 'Missing project_id or session_token' }, { status: 400 });
    if (!acceptTerms) return Response.json({ error: 'terms_not_accepted' }, { status: 400 });
    if (typeof projectId !== 'string' || typeof sessionToken !== 'string') return Response.json({ error: 'Invalid input types' }, { status: 400 });

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionToken)) return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions.find((s) => s.token === sessionToken);
    if (!session || new Date(session.expires_at).getTime() < Date.now()) return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });

    const project = await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(() => null);
    if (!project) return Response.json({ error: 'not_found' }, { status: 404 });
    if ((project.client_email || '').toLowerCase() !== session.email.toLowerCase()) return Response.json({ error: 'forbidden' }, { status: 403 });
    if (!['sent', 'viewed', 'extension_requested'].includes(project.status)) return Response.json({ error: 'invalid_status' }, { status: 400 });

    if (project.valid_until && new Date(project.valid_until).getTime() < Date.now()) {
      await base44.asServiceRole.entities.ProjectOrder.update(projectId, { status: 'expired' });
      return Response.json({ error: 'offer_expired' }, { status: 410 });
    }

    const approvedAt = new Date().toISOString();
    let updated = await base44.asServiceRole.entities.ProjectOrder.update(projectId, {
      status: 'approved',
      approved_at: approvedAt,
      acceptance_terms_version: 'MLZIDLA-OBCHODNI-PODMINKY-v1',
      acceptance_name: acceptanceName || project.client_name || '',
      acceptance_user_agent: acceptanceUserAgent,
      last_customer_action_at: approvedAt,
    });

    let archiveWarning = '';
    let orderPdfBytes: Uint8Array | null = null;
    let orderPdfFilename = '';
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
      const folders = await ensureOfferCaseFolders(accessToken, {
        quoteNumber: project.quote_number || `OBJ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        clientName: project.client_company || project.client_name || project.client_email,
        issuedAt: project.issued_at || approvedAt,
      });

      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      await loadFont(doc);
      const W = 210, M = 16; const navy = [10,22,40], petrol = [11,72,96], accent = [43,191,207], muted = [82,100,112], pale = [244,248,249];
      doc.setFillColor(...navy); doc.rect(0,0,W,43,'F'); doc.setFillColor(...accent); doc.rect(0,39,58,4,'F');
      doc.setTextColor(...accent); doc.setFontSize(20); doc.text('MLŽIDLA.cz', M, 18); doc.setTextColor(188,205,214); doc.setFontSize(7); doc.text('by HolmTec · potvrzení objednávky', M, 26);
      doc.setTextColor(255,255,255); doc.setFontSize(10); doc.text('POTVRZENÍ OBJEDNÁVKY', W-M, 16, { align:'right' }); doc.setTextColor(188,205,214); doc.setFontSize(7); doc.text(`Nabídka ${project.quote_number || '—'}`, W-M, 24, { align:'right' }); doc.text(new Date(approvedAt).toLocaleString('cs-CZ'), W-M, 31, { align:'right' });

      let y=55;
      doc.setFillColor(...pale); doc.roundedRect(M,y,86,42,2,2,'F'); doc.roundedRect(M+92,y,86,42,2,2,'F');
      doc.setTextColor(...accent); doc.setFontSize(7); doc.text('OBJEDNATEL',M+5,y+8); doc.setTextColor(...navy); doc.setFontSize(10); doc.text(project.client_name || '—',M+5,y+17); doc.setTextColor(...muted); doc.setFontSize(7.2); doc.text([project.client_company,project.client_email,project.client_phone].filter(Boolean),M+5,y+24);
      doc.setTextColor(...accent); doc.setFontSize(7); doc.text('DODAVATEL',M+97,y+8); doc.setTextColor(...navy); doc.setFontSize(9.5); doc.text('MLŽIDLA.cz by HolmTec',M+97,y+17); doc.setTextColor(...muted); doc.setFontSize(7.2); doc.text(['HolmTec s.r.o.','Ing. Radek Meduna','+420 774 700 390','meduna@holmtec.cz'],M+97,y+24); y+=55;

      doc.setTextColor(...petrol); doc.setFontSize(9); doc.text('POTVRZENÝ ROZSAH',M,y); y+=9;
      const rows = [
        ['Projekt', project.project_name], ['Produkt', project.product_name], ['Číslo nabídky', project.quote_number], ['Cena bez DPH', project.total_price ? `${money(project.total_price)} Kč` : 'dle nabídky'], ['Způsob předání', project.delivery_method], ['Místo realizace / předání', project.delivery_location]
      ].filter(([,v])=>v);
      rows.forEach(([label,value],i)=>{if(i%2===0){doc.setFillColor(248,251,251);doc.rect(M,y,W-2*M,10,'F');}doc.setTextColor(...muted);doc.setFontSize(7.5);doc.text(String(label),M+5,y+6.3);doc.setTextColor(...navy);doc.text(doc.splitTextToSize(String(value),105)[0],M+70,y+6.3);y+=10;});

      y+=9; doc.setFillColor(...petrol); doc.roundedRect(M,y,W-2*M,45,2,2,'F'); doc.setTextColor(...accent); doc.setFontSize(7); doc.text('ELEKTRONICKÉ POTVRZENÍ',M+6,y+8); doc.setTextColor(255,255,255); doc.setFontSize(10.5); doc.text('Objednávka byla potvrzena zákazníkem.',M+6,y+18); doc.setTextColor(218,231,235); doc.setFontSize(7.5);
      const confirmLines=[`Potvrzující osoba: ${acceptanceName || project.client_name || 'neuvedeno'}`,`Potvrzeno: ${new Date(approvedAt).toLocaleString('cs-CZ')}`,`Podmínky: MLZIDLA-OBCHODNI-PODMINKY-v1`,`E-mail objednatele: ${project.client_email}`]; doc.text(confirmLines,M+6,y+27); y+=58;

      doc.setTextColor(...petrol); doc.setFontSize(9); doc.text('CO NÁSLEDUJE',M,y); y+=8; doc.setTextColor(...muted); doc.setFontSize(8);
      doc.text(doc.splitTextToSize('Po přijetí objednávky navazuje výrobní příprava, potvrzení technických detailů, kotvení a rozvodů, případně příprava realizace. Konkrétní termín výroby, dodání nebo montáže bude potvrzen podle rozsahu zakázky a dohodnutého harmonogramu.',W-2*M),M,y);

      doc.setDrawColor(215,225,228); doc.line(M,279,W-M,279); doc.setTextColor(...muted); doc.setFontSize(6.5); doc.text('MLŽIDLA.cz by HolmTec · HolmTec s.r.o. · Horní Staré Město 698 · 541 02 Trutnov',M,285); doc.text('IČ 27486893 · DIČ CZ27486893 · +420 774 700 390 · meduna@holmtec.cz · info@mlzidla.cz',M,290);

      const pdfBytes = new Uint8Array(doc.output('arraybuffer'));
      const filename = `04-OBJEDNAVKA-POTVRZENI-${project.quote_number || projectId}.pdf`;
      orderPdfBytes = pdfBytes;
      orderPdfFilename = filename;
      const uploaded = await uploadBytes(accessToken, folders.orderFolderId, pdfBytes, filename, 'application/pdf');
      const caseUrl = `https://drive.google.com/drive/folders/${folders.caseFolderId}`;
      updated = await base44.asServiceRole.entities.ProjectOrder.update(projectId, { order_confirmation_pdf_url: uploaded.url, drive_case_folder_id: folders.caseFolderId, drive_case_folder_url: caseUrl });
      await moveCaseToClosedOrders(accessToken, folders.caseFolderId);
    } catch (archiveError) {
      archiveWarning = archiveError?.message || 'Drive archive failed';
      console.error('Order archive failed', archiveError);
    }

    let emailWarning = '';
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
      const raw = buildOrderConfirmationMime(updated, approvedAt, orderPdfBytes, orderPdfFilename || `potvrzeni-objednavky-${project.quote_number || projectId}.pdf`);
      const sendResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: toBase64Url(raw) }),
      });
      if (!sendResponse.ok) emailWarning = `Potvrzovací e-mail se nepodařilo odeslat: ${await sendResponse.text()}`;
    } catch (emailError) {
      emailWarning = emailError?.message || 'Potvrzovací e-mail se nepodařilo odeslat.';
      console.error('Order confirmation email failed', emailError);
    }

    await base44.asServiceRole.entities.PortalSession.delete(session.id);
    return Response.json({ ok: true, project: updated, archive_warning: archiveWarning || undefined, email_warning: emailWarning || undefined });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
