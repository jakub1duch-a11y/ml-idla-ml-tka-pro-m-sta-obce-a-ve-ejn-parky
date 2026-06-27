import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { inquiry, items, notes, collabType, volumeDiscount, discountAmt, totalAfterDiscount } = body;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, M = 18;

    // ── HEADER BG
    doc.setFillColor(13, 17, 23);
    doc.rect(0, 0, W, 54, 'F');

    // Logo
    doc.setTextColor(34, 211, 238);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('HolmTec', M, 22);

    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Mlžné sochy & instalace  |  obchod1@holmtec.cz  |  +420 774 700 390', M, 30);
    doc.text('Trutnov, Česká republika  |  holmtec.cz', M, 36);

    // Title + quote number
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CENOVÁ NABÍDKA', W - M, 22, { align: 'right' });

    const quoteNum = `HT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`Číslo: ${quoteNum}`, W - M, 30, { align: 'right' });
    doc.text(`Datum: ${new Date().toLocaleDateString('cs-CZ')}`, W - M, 36, { align: 'right' });
    doc.text('Platnost: 30 dní', W - M, 42, { align: 'right' });

    // Collab type badge
    if (collabType) {
      doc.setFillColor(34, 211, 238, 0.15);
      doc.setFillColor(20, 60, 70);
      doc.roundedRect(M, 44, 80, 7, 2, 2, 'F');
      doc.setFontSize(7.5);
      doc.setTextColor(34, 211, 238);
      doc.setFont('helvetica', 'bold');
      doc.text(`TYP: ${collabType.toUpperCase()}`, M + 4, 49);
    }

    let y = 64;

    // ── CLIENT BOX
    doc.setFillColor(19, 28, 39);
    doc.roundedRect(M, y, W - 2 * M, 34, 3, 3, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.text('ZÁKAZNÍK', M + 6, y + 8);
    doc.setFontSize(11);
    doc.setTextColor(226, 232, 240);
    doc.text(inquiry.name || '—', M + 6, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(inquiry.email || '', M + 6, y + 23);
    if (inquiry.phone) doc.text(inquiry.phone, M + 6, y + 29);
    if (inquiry.company) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 220, 230);
      doc.text(inquiry.company, W - M - 6, y + 16, { align: 'right' });
    }
    y += 44;

    // ── ITEMS TABLE HEADER
    doc.setFillColor(13, 17, 23);
    doc.rect(M, y, W - 2 * M, 10, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(34, 211, 238);
    doc.setFont('helvetica', 'bold');
    doc.text('POLOŽKA', M + 5, y + 6.5);
    doc.text('SPECIFIKACE', M + 70, y + 6.5);
    doc.text('KS', M + 118, y + 6.5, { align: 'center' });
    doc.text('CENA/KS', M + 138, y + 6.5, { align: 'right' });
    doc.text('CELKEM', W - M - 5, y + 6.5, { align: 'right' });
    y += 10;

    let baseTotal = 0;
    (items || []).forEach((item, i) => {
      const rowTotal = (item.qty || 1) * (item.price || 0);
      baseTotal += rowTotal;
      const dark = i % 2 === 0;
      doc.setFillColor(dark ? 26 : 22, dark ? 37 : 32, dark ? 53 : 44);
      doc.rect(M, y, W - 2 * M, 10, 'F');
      doc.setFontSize(8.5);
      doc.setTextColor(226, 232, 240);
      doc.setFont('helvetica', 'bold');
      doc.text(item.name || '', M + 5, y + 6.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      if (item.spec) {
        const specText = doc.splitTextToSize(item.spec, 44);
        doc.text(specText[0], M + 70, y + 6.5);
      }
      doc.setFontSize(8.5);
      doc.setTextColor(226, 232, 240);
      doc.text(String(item.qty || 1), M + 118, y + 6.5, { align: 'center' });
      doc.text(Number(item.price || 0).toLocaleString('cs-CZ'), M + 138, y + 6.5, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(Number(rowTotal).toLocaleString('cs-CZ'), W - M - 5, y + 6.5, { align: 'right' });
      y += 10;
    });

    // ── TOTALS
    y += 4;

    // Subtotal line
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Mezisoučet:', W - M - 55, y);
    doc.text(`${Number(baseTotal).toLocaleString('cs-CZ')} Kč`, W - M - 5, y, { align: 'right' });
    y += 7;

    // Volume discount
    const discount = discountAmt || 0;
    const finalTotal = totalAfterDiscount || baseTotal;
    if (discount > 0 && volumeDiscount > 0) {
      doc.setTextColor(52, 211, 153);
      doc.text(`Množstevní sleva ${volumeDiscount}%:`, W - M - 55, y);
      doc.text(`−${Number(discount).toLocaleString('cs-CZ')} Kč`, W - M - 5, y, { align: 'right' });
      y += 7;
    }

    // Total bar
    doc.setFillColor(34, 211, 238);
    doc.rect(M, y, W - 2 * M, 13, 'F');
    doc.setFontSize(11);
    doc.setTextColor(13, 17, 23);
    doc.setFont('helvetica', 'bold');
    doc.text('CELKEM bez DPH:', M + 5, y + 9);
    doc.text(`${Number(finalTotal).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 9, { align: 'right' });
    y += 13;

    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(`DPH 21%: ${Number(finalTotal * 0.21).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 8, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    doc.setFont('helvetica', 'bold');
    doc.text(`Celkem s DPH: ${Number(finalTotal * 1.21).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 16, { align: 'right' });
    y += 26;

    // ── NOTES
    if (notes) {
      doc.setFillColor(19, 28, 39);
      doc.roundedRect(M, y, W - 2 * M, 28, 3, 3, 'F');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'bold');
      doc.text('POZNÁMKY & PODMÍNKY', M + 5, y + 8);
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      const noteLines = doc.splitTextToSize(notes, W - 2 * M - 10);
      doc.text(noteLines.slice(0, 3), M + 5, y + 16);
      y += 34;
    }

    // ── SERVICES SECTION (if collab type is not plain product)
    if (collabType && collabType !== 'Cena produktu') {
      doc.setFillColor(13, 30, 40);
      doc.roundedRect(M, y, W - 2 * M, 30, 3, 3, 'F');
      doc.setFontSize(7.5);
      doc.setTextColor(34, 211, 238);
      doc.setFont('helvetica', 'bold');
      doc.text('SOUČÁST NABÍDKY — DOPLŇKOVÉ SLUŽBY', M + 5, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      const services = [];
      if (collabType.includes('spolupráce')) services.push('• Projektová konzultace a návrh řešení na míru', '• Koordinace realizace a dohled nad instalací', '• Pozáruční servisní podpora');
      if (collabType.includes('dokumentace')) services.push('• Výkresová dokumentace (DWG/PDF)', '• Technické listy a certifikáty materiálů', '• Instalační manuál');
      if (collabType.includes('vizualizace') || collabType.includes('3D')) services.push('• 3D model produktu (STEP/OBJ/FBX)', '• Fotorealistické rendery pro architektonickou dokumentaci', '• Vizualizace do kontextu prostoru (na vyžádání)');
      if (collabType.includes('Kombinace') || collabType.includes('množstevní')) services.push('• Množstevní sleva automaticky kalkulována', '• Společná logistika a instalace', '• Komplexní záruční servis celé sestavy');
      if (services.length === 0) services.push('• Odborná konzultace k projektu', '• Technická podpora při realizaci');
      doc.text(services.slice(0, 3).join('\n'), M + 5, y + 16);
    }

    // ── FOOTER
    doc.setFillColor(13, 17, 23);
    doc.rect(0, 281, W, 16, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('HolmTec  |  obchod1@holmtec.cz  |  +420 774 700 390  |  holmtec.cz  |  Trutnov, ČR', W / 2, 289, { align: 'center' });
    doc.setTextColor(34, 211, 238);
    doc.setFont('helvetica', 'bold');
    doc.text(`Platnost nabídky ${quoteNum}: 30 dní od ${new Date().toLocaleDateString('cs-CZ')}`, W / 2, 294, { align: 'center' });

    const pdfBytes = doc.output('arraybuffer');
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=nabidka-${quoteNum}.pdf`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});