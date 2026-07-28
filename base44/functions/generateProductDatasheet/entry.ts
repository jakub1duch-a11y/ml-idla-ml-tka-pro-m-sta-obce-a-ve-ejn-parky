import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { product } = body;
    if (!product || !product.name) {
      return Response.json({ error: 'Product data required' }, { status: 400 });
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PW = 210; const PH = 297;
    const ML = 14; const MR = 14; const CW = PW - ML - MR;

    // ── HEADER BAND ──────────────────────────────────────────────────────────
    doc.setFillColor(13, 17, 23);
    doc.rect(0, 0, PW, 38, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('HolmTec s.r.o.', ML, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(34, 211, 238);
    doc.text('mlzidla.cz', ML, 22);

    doc.setTextColor(100, 120, 140);
    doc.setFontSize(8);
    doc.text('TECHNICKÝ LIST / DATASHEET', PW - MR, 15, { align: 'right' });

    const dateStr = new Date().toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(dateStr, PW - MR, 22, { align: 'right' });

    // cyan accent line
    doc.setDrawColor(34, 211, 238);
    doc.setLineWidth(0.5);
    doc.line(ML, 32, PW - MR, 32);

    // ── CATEGORY TAG ─────────────────────────────────────────────────────────
    let y = 50;
    doc.setFillColor(34, 211, 238, 0.15);
    doc.setFillColor(230, 252, 255);
    doc.roundedRect(ML, y - 5, 38, 7, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(0, 150, 170);
    doc.text('NÍZKOTLAKÉ MLŽÍTKO', ML + 2, y);

    // ── PRODUCT NAME ─────────────────────────────────────────────────────────
    y += 9;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(13, 17, 23);
    doc.text(product.name, ML, y);

    // ── SHORT DESCRIPTION ────────────────────────────────────────────────────
    if (product.short_description) {
      y += 9;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 100, 120);
      const sdLines = doc.splitTextToSize(product.short_description, CW);
      doc.text(sdLines, ML, y);
      y += sdLines.length * 5.5;
    }

    // divider
    y += 4;
    doc.setDrawColor(220, 228, 236);
    doc.setLineWidth(0.3);
    doc.line(ML, y, PW - MR, y);
    y += 8;

    // ── TECHNICAL SPECS TABLE ─────────────────────────────────────────────────
    const specs = [
      product.pressure && ['Provozní tlak', product.pressure],
      product.micron_size && ['Průměr kapky', `${product.micron_size} μm`],
      product.water_consumption && ['Spotřeba vody', product.water_consumption],
      product.material && ['Materiál', product.material],
      product.coverage_area && ['Výška / dosah', product.coverage_area],
      product.power_supply && ['Napájení a řízení', product.power_supply],
      ['Povrch', 'Broušený / kartáčovaný'],
      ['Výroba', 'Zakázková, 6–8 týdnů'],
      ['Certifikace', 'Potravinářský nerez AISI 316L'],
      ['Záruka', '24 měsíců'],
    ].filter(Boolean) as string[][];

    if (specs.length > 0) {
      // Table header
      doc.setFillColor(13, 17, 23);
      doc.rect(ML, y, CW, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('TECHNICKÉ PARAMETRY', ML + 3, y + 5.2);
      y += 8;

      specs.forEach(([param, value], i) => {
        const rowH = 7;
        // alternating row bg
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(ML, y, CW, rowH, 'F');
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(param, ML + 3, y + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(value, ML + 70, y + 4.8);

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(ML, y + rowH, PW - MR, y + rowH);

        y += rowH;
      });
      y += 10;
    }

    // ── DESCRIPTION SECTION ───────────────────────────────────────────────────
    if (product.description) {
      const cleanDesc = product.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanDesc.length > 10) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(13, 17, 23);
        doc.text('POPIS PRODUKTU', ML, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const descLines = doc.splitTextToSize(cleanDesc.slice(0, 800), CW);
        doc.text(descLines, ML, y);
        y += descLines.length * 4.8 + 10;
      }
    }

    // ── SAFETY NOTICE ─────────────────────────────────────────────────────────
    if (y > PH - 55) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(0.4);
    doc.roundedRect(ML, y, CW, 18, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(120, 80, 0);
    doc.text('⚠ BEZPEČNOSTNÍ UPOZORNĚNÍ', ML + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 70, 0);
    const safetyText = 'Produkt je určen výhradně pro ochlazování a estetické ztvárnění prostoru (nízkotlaké mlžení 2–7 bar). Není určen k mechanické zátěži (věšení, lezení, skákání). Provoz výhradně v souladu s instalačním manuálem HolmTec.';
    const safetyLines = doc.splitTextToSize(safetyText, CW - 8);
    doc.text(safetyLines, ML + 4, y + 12);
    y += 24;

    // ── CTA BAND ─────────────────────────────────────────────────────────────
    if (y > PH - 38) { doc.addPage(); y = 20; }
    doc.setFillColor(230, 252, 255);
    doc.roundedRect(ML, y, CW, 20, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(0, 120, 150);
    doc.text('Konzultace a poptávka zdarma', ML + 5, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 90, 120);
    doc.text('Odpovídáme do 24 h · 3D vizualizace do 48 h · Instalace na klíč', ML + 5, y + 14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 140, 170);
    doc.text('mlzidla.cz · +420 774 700 390 · obchod1@holmtec.cz', PW - MR - 5, y + 11, { align: 'right' });

    // ── FOOTER ────────────────────────────────────────────────────────────────
    doc.setFillColor(13, 17, 23);
    doc.rect(0, PH - 18, PW, 18, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(150, 160, 170);
    doc.text('HolmTec s.r.o. · Horní staré město 698, 541 02 Trutnov · IČO: 27486893', ML, PH - 10);
    doc.setTextColor(34, 211, 238);
    doc.text('mlzidla.cz', PW - MR, PH - 10, { align: 'right' });

    // ── ENCODE & RETURN ───────────────────────────────────────────────────────
    const pdfOutput = doc.output('arraybuffer');
    const uint8 = new Uint8Array(pdfOutput);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
    const pdf_base64 = btoa(binary);

    const filename = `HolmTec-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-datasheet.pdf`;
    return Response.json({ pdf_base64, filename });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});