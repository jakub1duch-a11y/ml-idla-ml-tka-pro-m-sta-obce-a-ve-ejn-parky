import { jsPDF } from 'npm:jspdf@4.0.0';
import { PDF, addBrandFooters, addProductImage, cleanText, drawBrandHeader, drawSectionTitle, ensureSpace, pdfBase64, registerCzechFonts } from '../../shared/pdfBrand.js';

const manuals = {
  installation: {
    title: 'INSTALAČNÍ MANUÁL', intro: 'Odborný postup přípravy, kotvení, připojení vody a prvního spuštění.',
    steps: [['1. Kontrola místa', 'Ověřte rovný podklad, bezpečné odstupy, směr větru a vedení vody.'], ['2. Stavební příprava', 'Připravte kotevní body nebo betonový základ podle technického výkresu produktu.'], ['3. Osazení konstrukce', 'Manipulujte ve dvou osobách. Konstrukci vyrovnejte a dotáhněte kotevní prvky.'], ['4. Připojení vody', 'Použijte uzavírací ventil, filtr a vhodné tlakové spojky. Před připojením potrubí propláchněte.'], ['5. Montáž trysek', 'Trysky instalujte čistým nástrojem bez nadměrného dotažení a ověřte správný směr kuželu.'], ['6. První spuštění', 'Pomalu otevřete ventil, zkontrolujte těsnost a postupně nastavte provozní tlak.']],
    checks: ['pevnost kotvení', 'těsnost všech spojů', 'čistota filtru', 'rovnoměrný obraz mlhy', 'bezpečný prostor kolem zařízení'],
  },
  maintenance: {
    title: 'MANUÁL ÚDRŽBY', intro: 'Pravidelná péče pro stabilní výkon, čistý mlžný obraz a dlouhou životnost.',
    steps: [['Před každou sezónou', 'Zkontrolujte kotvení, povrch konstrukce, filtr, ventily, hadice a jednotlivé trysky.'], ['Čištění trysek', 'Trysku demontujte, propláchněte a usazeniny odstraňte vhodným přípravkem. Otvor nečistěte drátem.'], ['Filtrace vody', 'Filtrační vložku kontrolujte podle kvality vody a při poklesu průtoku ji vyčistěte nebo vyměňte.'], ['Nerezový povrch', 'Použijte měkkou utěrku a přípravek na nerez. Nepoužívejte chlorové ani abrazivní prostředky.'], ['Zazimování', 'Uzavřete přívod, vypusťte vodu, profoukněte systém a citlivé prvky skladujte v suchu.'], ['Servisní kontrola', 'Při nerovnoměrném rozstřiku, netěsnosti nebo poškození zařízení odstavte a kontaktujte servis.']],
    checks: ['čisté trysky', 'průchodný filtr', 'těsné spoje', 'funkční ventil', 'vypuštěný systém před mrazem'],
  },
};

Deno.serve(async (req) => {
  try {
    const { product, documentType = 'installation' } = await req.json();
    if (!product?.name || !manuals[documentType]) return Response.json({ error: 'Invalid manual request' }, { status: 400 });
    const manual = manuals[documentType];
    const doc = new jsPDF({ unit: 'mm', format: 'a4' }); await registerCzechFonts(doc);
    drawBrandHeader(doc, manual.title, `${product.name} · vydání ${new Date().toLocaleDateString('cs-CZ')}`);
    let y = 54;
    doc.setFont('DejaVu', 'bold'); doc.setFontSize(23); doc.setTextColor(...PDF.ink); doc.text(product.name, PDF.margin, y);
    doc.setFont('DejaVu', 'normal'); doc.setFontSize(9); doc.setTextColor(...PDF.muted); doc.text(doc.splitTextToSize(manual.intro, 104), PDF.margin, y + 8);
    await addProductImage(doc, product.image_url, 132, 49, 63, 49); y = 111;

    y = drawSectionTitle(doc, documentType === 'installation' ? 'Postup instalace' : 'Plán údržby', y);
    for (const [heading, text] of manual.steps) {
      y = ensureSpace(doc, y, 24, manual.title);
      doc.setFillColor(248, 250, 252); doc.roundedRect(PDF.margin, y - 4, 180, 20, 2, 2, 'F');
      doc.setFillColor(...PDF.cyan); doc.circle(PDF.margin + 6, y + 5, 3.2, 'F');
      doc.setFont('DejaVu', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...PDF.ink); doc.text(heading, PDF.margin + 13, y + 2);
      doc.setFont('DejaVu', 'normal'); doc.setFontSize(7.7); doc.setTextColor(...PDF.muted); doc.text(doc.splitTextToSize(text, 161), PDF.margin + 13, y + 8);
      y += 24;
    }

    y = ensureSpace(doc, y + 2, 45, manual.title); y = drawSectionTitle(doc, 'Kontrolní seznam', y + 2);
    manual.checks.forEach((item, index) => { const x = index % 2 === 0 ? PDF.margin : 108; const row = Math.floor(index / 2); doc.setDrawColor(...PDF.cyan); doc.rect(x, y + row * 9 - 3, 4, 4); doc.setFont('DejaVu', 'normal'); doc.setFontSize(7.7); doc.setTextColor(...PDF.ink); doc.text(item, x + 7, y + row * 9); });
    y += Math.ceil(manual.checks.length / 2) * 9 + 8;

    y = ensureSpace(doc, y, 38, manual.title); y = drawSectionTitle(doc, 'Technické údaje produktu', y);
    const specs = [['Tlak', product.pressure], ['Spotřeba', product.water_consumption], ['Materiál', product.material], ['Napájení', product.power_supply]].filter(([, value]) => value);
    specs.forEach(([label, value], index) => { doc.setFont('DejaVu', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...PDF.muted); doc.text(label, PDF.margin + (index % 2) * 92, y + Math.floor(index / 2) * 10); doc.setFont('DejaVu', 'normal'); doc.setTextColor(...PDF.ink); doc.text(cleanText(value), PDF.margin + 24 + (index % 2) * 92, y + Math.floor(index / 2) * 10); });

    addBrandFooters(doc);
    const suffix = documentType === 'installation' ? 'instalacni-manual' : 'manual-udrzby';
    const filename = `mlzidla-cz-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-${suffix}.pdf`;
    return Response.json({ pdf_base64: pdfBase64(doc), filename });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
});