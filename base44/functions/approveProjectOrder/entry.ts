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
      const uploaded = await uploadBytes(accessToken, folders.orderFolderId, pdfBytes, filename, 'application/pdf');
      const caseUrl = `https://drive.google.com/drive/folders/${folders.caseFolderId}`;
      updated = await base44.asServiceRole.entities.ProjectOrder.update(projectId, { order_confirmation_pdf_url: uploaded.url, drive_case_folder_id: folders.caseFolderId, drive_case_folder_url: caseUrl });
      await moveCaseToClosedOrders(accessToken, folders.caseFolderId);
    } catch (archiveError) {
      archiveWarning = archiveError?.message || 'Drive archive failed';
      console.error('Order archive failed', archiveError);
    }

    await base44.asServiceRole.entities.PortalSession.delete(session.id);
    return Response.json({ ok: true, project: updated, archive_warning: archiveWarning || undefined });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
