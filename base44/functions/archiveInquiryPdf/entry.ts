import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { jsPDF } from 'npm:jspdf@4.0.0';
import { ensureOfferCaseFolders, uploadBytes } from '../../shared/offerDrive.ts';

const toBase64 = (bytes: Uint8Array) => { let binary = ''; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); };
const safe = (value: unknown) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
async function loadFont(doc: any) {
  const response = await fetch('https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans%5Bwdth,wght%5D.ttf');
  if (!response.ok) return;
  doc.addFileToVFS('NotoSans.ttf', toBase64(new Uint8Array(await response.arrayBuffer())));
  doc.addFont('NotoSans.ttf', 'NotoSans', 'normal', 'Identity-H'); doc.setFont('NotoSans', 'normal');
}

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { inquiry = {}, quote_number: quoteNumber, issued_at: issuedAt, project_order_id: projectOrderId } = await req.json();
    if (!quoteNumber || !inquiry?.email) return Response.json({ error: 'quote_number and inquiry required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const folders = await ensureOfferCaseFolders(accessToken, { quoteNumber, clientName: inquiry.company || inquiry.name || inquiry.email, issuedAt: issuedAt || new Date().toISOString() });
    const doc = new jsPDF({ unit: 'mm', format: 'a4' }); await loadFont(doc);
    const W = 210, M = 16; const navy = [10,22,40], petrol = [11,72,96], accent = [43,191,207], muted = [82,100,112], pale = [244,248,249];
    doc.setFillColor(...navy); doc.rect(0,0,W,43,'F'); doc.setFillColor(...accent); doc.rect(0,39,52,4,'F');
    doc.setTextColor(...accent); doc.setFontSize(20); doc.text('MLŽIDLA.cz',M,18); doc.setTextColor(188,205,214); doc.setFontSize(7); doc.text('by HolmTec · archiv obchodního případu',M,26);
    doc.setTextColor(255,255,255); doc.setFontSize(10); doc.text('PŘÍCHOZÍ POPTÁVKA',W-M,16,{align:'right'}); doc.setTextColor(188,205,214); doc.setFontSize(7); doc.text(`Případ ${quoteNumber}`,W-M,24,{align:'right'}); doc.text(`Přijato ${new Date(inquiry.created_date || issuedAt || Date.now()).toLocaleString('cs-CZ')}`,W-M,31,{align:'right'});
    let y=54; doc.setFillColor(...pale); doc.roundedRect(M,y,W-2*M,49,2,2,'F'); doc.setTextColor(...accent); doc.setFontSize(7); doc.text('ŽADATEL / KONTAKT',M+6,y+8);
    doc.setTextColor(...navy); doc.setFontSize(12); doc.text(safe(inquiry.name)||'Neuvedeno',M+6,y+17); doc.setTextColor(...muted); doc.setFontSize(8);
    const contact=[safe(inquiry.company),safe(inquiry.email),safe(inquiry.phone||inquiry.telefon),safe(inquiry.location||inquiry.lokalita)].filter(Boolean); doc.text(contact.length?contact:['Kontaktní údaje nebyly uvedeny.'],M+6,y+25); y+=61;
    doc.setTextColor(...petrol); doc.setFontSize(9); doc.text('ZADÁNÍ ZÁKAZNÍKA',M,y); y+=8; doc.setTextColor(...navy); doc.setFontSize(9);
    const message=safe(inquiry.message||inquiry.description||inquiry.poznamka||'Bez textového zadání.'); const lines=doc.splitTextToSize(message,W-2*M); doc.text(lines,M,y); y+=Math.min(95,lines.length*5+10);
    const details=[['Produkt / zájem',inquiry.product||inquiry.product_name||inquiry.typ_produktu],['Typ prostoru',inquiry.space_type||inquiry.typ_prostoru],['Lokalita',inquiry.location||inquiry.lokalita],['Rozpočet',inquiry.budget||inquiry.rozpocet],['Požadovaný termín',inquiry.timeline||inquiry.termin],['Zdroj',inquiry.source||inquiry.utm_source]].filter(([,v])=>safe(v));
    if(details.length&&y<235){doc.setFillColor(...petrol);doc.rect(M,y,W-2*M,8,'F');doc.setTextColor(255,255,255);doc.setFontSize(7.5);doc.text('STRUKTUROVANÉ ÚDAJE',M+5,y+5.2);y+=8;details.forEach(([label,value],i)=>{if(i%2===0){doc.setFillColor(248,251,251);doc.rect(M,y,W-2*M,9,'F');}doc.setTextColor(...muted);doc.setFontSize(7.2);doc.text(String(label),M+5,y+5.8);doc.setTextColor(...navy);doc.text(doc.splitTextToSize(safe(value),108)[0],M+65,y+5.8);y+=9;});}
    doc.setDrawColor(215,225,228);doc.line(M,279,W-M,279);doc.setTextColor(...muted);doc.setFontSize(6.5);doc.text('Archivní záznam příchozí poptávky · MLŽIDLA.cz by HolmTec · HolmTec s.r.o.',M,285);doc.text('Horní Staré Město 698 · 541 02 Trutnov · +420 774 700 390 · meduna@holmtec.cz · info@mlzidla.cz',M,290);
    const bytes=new Uint8Array(doc.output('arraybuffer')); const filename=`01-POPTAVKA-${quoteNumber}-${new Date().toISOString().slice(0,10)}.pdf`; const uploaded=await uploadBytes(accessToken,folders.inquiryFolderId,bytes,filename,'application/pdf'); const caseUrl=`https://drive.google.com/drive/folders/${folders.caseFolderId}`;
    if(projectOrderId){await base44.asServiceRole.entities.ProjectOrder.update(projectOrderId,{inquiry_pdf_url:uploaded.url,drive_case_folder_id:folders.caseFolderId,drive_case_folder_url:caseUrl});}
    return Response.json({success:true,inquiry_pdf_url:uploaded.url,inquiry_pdf_file_id:uploaded.id,drive_case_folder_id:folders.caseFolderId,drive_case_folder_url:caseUrl,filename});
  } catch(error){return Response.json({error:error.message},{status:500});}
}
