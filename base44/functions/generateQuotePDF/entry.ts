import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { inquiry, items, notes, collabType, volumeDiscount, discountAmt, totalAfterDiscount, quoteNumber } = body;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, M = 16;
    const cyan = [34, 211, 238];
    const ink = [13, 17, 23];
    const textLight = [226, 232, 240];
    const textMuted = [148, 163, 184];

    // ── HEADER: Gradient-like background
    doc.setFillColor(...ink);
    doc.rect(0, 0, W, 60, 'F');
    
    // Top accent bar
    doc.setFillColor(...cyan);
    doc.rect(0, 0, W, 4, 'F');

    // Logo section
    doc.setTextColor(...cyan);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('HolmTec', M, 20);

    doc.setTextColor(...textMuted);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Industrial Serenity | Mlžné sochy & instalace', M, 27);
    doc.text('obchod1@holmtec.cz | +420 774 700 390 | holmtec.cz', M, 32);

    // Right side: Document info
    doc.setTextColor(...textLight);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CENOVÁ NABÍDKA', W - M, 18, { align: 'right' });

    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    doc.setFont('helvetica', 'normal');
    doc.text(`Číslo: ${quoteNumber || 'HT-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-5)}`, W - M, 26, { align: 'right' });
    doc.text(`Vystaveno: ${new Date().toLocaleDateString('cs-CZ')}`, W - M, 32, { align: 'right' });
    doc.text('Platnost: 30 dní', W - M, 38, { align: 'right' });

    // Type badge
    if (collabType) {
      doc.setFillColor(20, 60, 70);
      doc.roundedRect(W - M - 80, 45, 80, 8, 2, 2, 'F');
      doc.setFontSize(7.5);
      doc.setTextColor(...cyan);
      doc.setFont('helvetica', 'bold');
      doc.text(`TYP: ${collabType.toUpperCase()}`, W - M - 76, 50);
    }

    let y = 72;

    // ── CLIENT INFO CARD
    doc.setFillColor(19, 28, 39);
    doc.roundedRect(M, y, W - 2 * M, 32, 3, 3, 'F');
    
    doc.setFontSize(7.5);
    doc.setTextColor(...cyan);
    doc.setFont('helvetica', 'bold');
    doc.text('ZÁKAZNÍK', M + 6, y + 8);
    
    doc.setFontSize(11.5);
    doc.setTextColor(...textLight);
    doc.text(inquiry.name || '—', M + 6, y + 17);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    doc.text(inquiry.email || '', M + 6, y + 24);
    if (inquiry.phone) doc.text(inquiry.phone, M + 6, y + 29);
    
    if (inquiry.company) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textLight);
      doc.setFontSize(9.5);
      doc.text(inquiry.company, W - M - 6, y + 17, { align: 'right' });
    }
    y += 42;

    // ── ITEMS TABLE
    doc.setFillColor(...ink);
    doc.rect(M, y, W - 2 * M, 10, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(...cyan);
    doc.setFont('helvetica', 'bold');
    doc.text('POLOŽKA', M + 5, y + 6.5);
    doc.text('SPECIFIKACE', M + 70, y + 6.5);
    doc.text('KS', M + 118, y + 6.5, { align: 'center' });
    doc.text('CENA/KS (Kč)', M + 138, y + 6.5, { align: 'right' });
    doc.text('CELKEM (Kč)', W - M - 5, y + 6.5, { align: 'right' });
    y += 10;

    let baseTotal = 0;
    (items || []).forEach((item, i) => {
      const rowTotal = (item.qty || 1) * (item.price || 0);
      baseTotal += rowTotal;
      const dark = i % 2 === 0;
      doc.setFillColor(dark ? 26 : 22, dark ? 37 : 32, dark ? 53 : 44);
      doc.rect(M, y, W - 2 * M, 10, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(...textLight);
      doc.setFont('helvetica', 'bold');
      doc.text(item.name || '', M + 5, y + 6.5);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...textMuted);
      if (item.spec) {
        const specText = doc.splitTextToSize(item.spec, 44);
        doc.text(specText[0], M + 70, y + 6.5);
      }
      
      doc.setFontSize(9);
      doc.setTextColor(...textLight);
      doc.text(String(item.qty || 1), M + 118, y + 6.5, { align: 'center' });
      doc.text(Number(item.price || 0).toLocaleString('cs-CZ'), M + 138, y + 6.5, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(Number(rowTotal).toLocaleString('cs-CZ'), W - M - 5, y + 6.5, { align: 'right' });
      y += 10;
    });

    // ── PRICING SUMMARY
    y += 5;
    
    // Subtotal
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    doc.setFont('helvetica', 'normal');
    doc.text('Mezisoučet:', W - M - 55, y);
    doc.text(`${Number(baseTotal).toLocaleString('cs-CZ')} Kč`, W - M - 5, y, { align: 'right' });
    y += 8;

    // Volume discount
    const discount = discountAmt || 0;
    const finalTotal = totalAfterDiscount || baseTotal;
    if (discount > 0 && volumeDiscount > 0) {
      doc.setTextColor(52, 211, 153);
      doc.setFont('helvetica', 'bold');
      doc.text(`Množstevní sleva ${volumeDiscount}%:`, W - M - 55, y);
      doc.setTextColor(52, 211, 153);
      doc.text(`−${Number(discount).toLocaleString('cs-CZ')} Kč`, W - M - 5, y, { align: 'right' });
      y += 8;
    }

    // Total bar
    doc.setFillColor(...cyan);
    doc.rect(M, y, W - 2 * M, 14, 'F');
    doc.setFontSize(12);
    doc.setTextColor(...ink);
    doc.setFont('helvetica', 'bold');
    doc.text('CELKEM BEZ DPH:', M + 5, y + 9.5);
    doc.text(`${Number(finalTotal).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 9.5, { align: 'right' });
    y += 14;

    // Tax info
    doc.setFontSize(8.5);
    doc.setTextColor(...textMuted);
    doc.setFont('helvetica', 'normal');
    doc.text(`DPH 21%: ${Number(finalTotal * 0.21).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 5, { align: 'right' });
    
    doc.setFontSize(11);
    doc.setTextColor(...textLight);
    doc.setFont('helvetica', 'bold');
    doc.text(`CELKEM S DPH: ${Number(finalTotal * 1.21).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 12, { align: 'right' });
    y += 20;

    // ── SERVICES SECTION
    if (collabType && collabType !== 'Cena produktu') {
      doc.setFillColor(13, 30, 40);
      doc.roundedRect(M, y, W - 2 * M, 28, 3, 3, 'F');
      doc.setFontSize(7.5);
      doc.setTextColor(...cyan);
      doc.setFont('helvetica', 'bold');
      doc.text('SOUČÁST NABÍDKY', M + 5, y + 7);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...textMuted);
      const services = [];
      if (collabType.includes('spolupráce')) services.push('• Projektová konzultace a návrh na míru', '• Koordinace realizace, dohled nad instalací', '• Pozáruční servisní podpora');
      if (collabType.includes('dokumentace')) services.push('• Výkresová dokumentace (DWG/PDF)', '• Technické listy a certifikáty materiálů', '• Instalační manuál');
      if (collabType.includes('3D') || collabType.includes('vizualizace')) services.push('• 3D model produktu (STEP/OBJ/FBX)', '• Fotorealistické rendery', '• Vizualizace v kontextu prostoru');
      if (collabType.includes('Kombinace') || collabType.includes('množstevní')) services.push('• Množstevní sleva aplikována automaticky', '• Společná logistika a instalace', '• Komplexní záruční servis');
      if (services.length === 0) services.push('• Odborná konzultace k projektu', '• Technická podpora při realizaci');
      doc.text(services.slice(0, 3).join('\n'), M + 5, y + 15);
    }

    // ── NOTES
    if (notes) {
      const noteStart = collabType && collabType !== 'Cena produktu' ? y + 32 : y;
      doc.setFillColor(19, 28, 39);
      doc.roundedRect(M, noteStart, W - 2 * M, 26, 3, 3, 'F');
      doc.setFontSize(7.5);
      doc.setTextColor(...cyan);
      doc.setFont('helvetica', 'bold');
      doc.text('POZNÁMKY & PODMÍNKY', M + 5, noteStart + 7);
      doc.setFontSize(8.5);
      doc.setTextColor(...textMuted);
      doc.setFont('helvetica', 'normal');
      const noteLines = doc.splitTextToSize(notes, W - 2 * M - 10);
      doc.text(noteLines.slice(0, 2), M + 5, noteStart + 15);
    }

    // ── FOOTER
    doc.setFillColor(...ink);
    doc.rect(0, 281, W, 16, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...textMuted);
    doc.setFont('helvetica', 'normal');
    doc.text('HolmTec | obchod1@holmtec.cz | +420 774 700 390 | holmtec.cz', W / 2, 286, { align: 'center' });
    doc.setTextColor(...cyan);
    doc.setFont('helvetica', 'bold');
    doc.text(`Platnost nabídky: 30 dní od ${new Date().toLocaleDateString('cs-CZ')}`, W / 2, 291, { align: 'center' });
    doc.setTextColor(...textMuted);
    doc.setFontSize(6);
    doc.text('Nabídka vygenerována automatickým systémem HolmTec', W / 2, 295, { align: 'center' });

    const pdfBytes = doc.output('arraybuffer');
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=nabidka-holmtec-${quoteNumber || 'draft'}.pdf`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});