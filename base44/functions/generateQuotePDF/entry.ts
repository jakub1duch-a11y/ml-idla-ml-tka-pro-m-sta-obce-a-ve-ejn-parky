import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { inquiry, items, notes, imageUrl } = body;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, M = 20;

    // Header background
    doc.setFillColor(13, 17, 23);
    doc.rect(0, 0, W, 50, 'F');

    doc.setTextColor(34, 211, 238);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('HolmTec', M, 22);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Mlžné sochy & instalace  |  obchod1@holmtec.cz', M, 30);
    doc.text('Trutnov, Česká republika', M, 36);

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CENOVÁ NABÍDKA', W - M, 22, { align: 'right' });

    const quoteNum = `HT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(`Číslo: ${quoteNum}`, W - M, 30, { align: 'right' });
    doc.text(`Datum: ${new Date().toLocaleDateString('cs-CZ')}`, W - M, 36, { align: 'right' });

    let y = 60;

    // Client info
    doc.setFillColor(19, 28, 39);
    doc.roundedRect(M, y, W - 2 * M, 32, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('ZÁKAZNÍK', M + 8, y + 8);
    doc.setFontSize(11);
    doc.setTextColor(226, 232, 240);
    doc.setFont('helvetica', 'bold');
    doc.text(inquiry.name || '—', M + 8, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`${inquiry.email || ''}  ${inquiry.phone || ''}`, M + 8, y + 23);
    if (inquiry.company) doc.text(inquiry.company, M + 8, y + 29);
    y += 42;

    // Items table
    doc.setFillColor(13, 17, 23);
    doc.rect(M, y, W - 2 * M, 10, 'F');
    doc.setFontSize(8);
    doc.setTextColor(34, 211, 238);
    doc.setFont('helvetica', 'bold');
    doc.text('POLOŽKA', M + 5, y + 6.5);
    doc.text('MNOŽSTVÍ', M + 85, y + 6.5);
    doc.text('CENA/KS (Kč)', M + 110, y + 6.5);
    doc.text('CELKEM (Kč)', M + 145, y + 6.5);
    y += 10;

    let totalPrice = 0;
    (items || []).forEach((item, i) => {
      const rowTotal = (item.qty || 1) * (item.price || 0);
      totalPrice += rowTotal;
      doc.setFillColor(i % 2 === 0 ? 26 : 19, i % 2 === 0 ? 37 : 28, i % 2 === 0 ? 53 : 39);
      doc.rect(M, y, W - 2 * M, 9, 'F');
      doc.setFontSize(9);
      doc.setTextColor(226, 232, 240);
      doc.setFont('helvetica', 'normal');
      doc.text(item.name || '', M + 5, y + 6);
      doc.text(String(item.qty || 1), M + 90, y + 6, { align: 'center' });
      doc.text(Number(item.price || 0).toLocaleString('cs-CZ'), M + 130, y + 6, { align: 'right' });
      doc.text(Number(rowTotal).toLocaleString('cs-CZ'), W - M - 5, y + 6, { align: 'right' });
      y += 9;
    });

    // Total
    y += 4;
    doc.setFillColor(34, 211, 238);
    doc.rect(M, y, W - 2 * M, 12, 'F');
    doc.setFontSize(11);
    doc.setTextColor(13, 17, 23);
    doc.setFont('helvetica', 'bold');
    doc.text('CELKEM bez DPH:', M + 5, y + 8);
    doc.text(`${Number(totalPrice).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 8, { align: 'right' });
    y += 12;

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(`DPH 21%: ${Number(totalPrice * 0.21).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 8, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    doc.setFont('helvetica', 'bold');
    doc.text(`Celkem s DPH: ${Number(totalPrice * 1.21).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 16, { align: 'right' });
    y += 24;

    // Notes
    if (notes) {
      doc.setFillColor(19, 28, 39);
      doc.roundedRect(M, y, W - 2 * M, 24, 3, 3, 'F');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('POZNÁMKY', M + 5, y + 7);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      const noteLines = doc.splitTextToSize(notes, W - 2 * M - 10);
      doc.text(noteLines.slice(0, 2), M + 5, y + 14);
      y += 30;
    }

    // Footer
    doc.setFillColor(13, 17, 23);
    doc.rect(0, 280, W, 17, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('HolmTec  |  obchod1@holmtec.cz  |  +420 774 700 390  |  holmtec.cz', W / 2, 289, { align: 'center' });
    doc.setTextColor(34, 211, 238);
    doc.text('Platnost nabídky: 30 dní od data vystavení', W / 2, 293, { align: 'center' });

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