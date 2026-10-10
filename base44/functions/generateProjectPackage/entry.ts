import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { jsPDF } from 'npm:jspdf@4.2.1';
import { clean, pt, fetchImageAsBase64, buildReference, formatDate, PDF_COLORS, INSTALLATION_LABELS, WATER_LABELS, SURFACE_LABELS } from '../../shared/pdfHelpers.ts';

const { INK, CYAN, CYAN_DARK, TEXT_MUTED, TEXT_BODY, PANEL_BG } = PDF_COLORS;

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const inquiryId = clean(body.inquiry_id, 100);
    const projectOrderId = clean(body.project_order_id, 100);
    const dryRun = Boolean(body.dry_run);
    const previewOnly = Boolean(body.preview);

    if (!inquiryId && !projectOrderId) return Response.json({ error: 'missing_inquiry_or_project' }, { status: 400 });

    // ── Načtení dat ──
    let inquiry: any = null;
    let order: any = null;

    if (projectOrderId) {
      order = await base44.asServiceRole.entities.ProjectOrder.get(projectOrderId).catch(() => null);
      if (order?.inquiry_id) inquiry = await base44.asServiceRole.entities.Poptavka.get(order.inquiry_id).catch(() => null);
    } else if (inquiryId) {
      inquiry = await base44.asServiceRole.entities.Poptavka.get(inquiryId).catch(() => null);
      const orders = await base44.asServiceRole.entities.ProjectOrder.filter({ inquiry_id: inquiryId }).catch(() => ({ items: [] }));
      order = orders?.items?.[0] || null;
    }

    if (!inquiry && !order) return Response.json({ error: 'not_found' }, { status: 404 });

    const effectiveInquiryId = inquiry?.id || order?.inquiry_id || inquiryId;
    const reference = buildReference(effectiveInquiryId || order?.id || '');

    // ── Načtení variant a produktů ──
    const [variantsPage, assetsPage] = await Promise.all([
      order ? base44.asServiceRole.entities.OfferVariant.filter({ project_order_id: order.id }).catch(() => ({ items: [] })) : Promise.resolve({ items: [] }),
      effectiveInquiryId ? base44.asServiceRole.entities.OfferAsset.filter({ inquiry_id: effectiveInquiryId }).catch(() => ({ items: [] })) : Promise.resolve({ items: [] }),
    ]);
    const variants = variantsPage?.items || [];
    const assets = assetsPage?.items || [];

    // ── Načtení produktů pro varianty ──
    const productIds = [...new Set([
      ...variants.map((v: any) => v.product_id).filter(Boolean),
      order?.product_id,
    ])].filter(Boolean) as string[];

    const products: any[] = [];
    if (productIds.length) {
      const productPage = await base44.asServiceRole.entities.Product.filter({ id: { $in: productIds } }, { limit: 20, fields: ['name', 'slug', 'image_url', 'image_alt', 'short_description', 'material', 'micron_size', 'water_consumption', 'pressure', 'coverage_area', 'power_supply', 'price_from', 'documents_urls'] }).catch(() => ({ items: [] }));
      products.push(...(productPage?.items || []));
    }
    // Fallback: pokud nejsou varianty, zkus najít produkt podle názvu z poptávky
    if (!products.length && inquiry?.produkt) {
      const produktField = clean(inquiry.produkt, 200);
      if (produktField.length > 2) {
        const stopWords = new Set(['mlzidlo', 'mlzitko', 'mlzne', 'mlha', 'mlhou', 'pro', 'na', 'ai', 'jeste', 'nevim']);
        const keywords = produktField.toLowerCase().split(/[\s,\/\-_]+/).filter((w) => w.length > 2 && !stopWords.has(w));
        for (const term of [produktField, ...keywords]) {
          if (products.length) break;
          const byName = await base44.asServiceRole.entities.Product.filter({ name: { $regex: term, $options: 'i' } }, { limit: 3, fields: ['name', 'slug', 'image_url', 'image_alt', 'short_description', 'material', 'micron_size', 'water_consumption', 'pressure', 'coverage_area', 'power_supply', 'price_from', 'documents_urls'] }).catch(() => ({ items: [] }));
          if (byName?.items?.length) products.push(...byName.items);
        }
      }
    }

    // ── Vizualizace ──
    const visualizations = (assets || [])
      .filter((a: any) => a.asset_type === 'generated_visualization' && a.file_url)
      .sort((a: any, b: any) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((a: any) => ({ url: a.file_url, title: a.title || '', verified: !a.generated_by_ai }));
    if (!visualizations.length && variants.length) {
      variants.forEach((v: any) => { if (v.visualization_url) visualizations.push({ url: v.visualization_url, title: v.label || v.product_name || '', verified: false }); });
    }
    // Fallback na produktové fotky (ověřené)
    if (!visualizations.length && products.length) {
      products.forEach((p: any) => { if (p.image_url) visualizations.push({ url: p.image_url, title: p.name || '', verified: true }); });
    }

    // ── Cenové údaje ──
    const lineItems: any[] = [];
    let baseTotal = 0;
    let hasAllPrices = true;

    variants.forEach((v: any) => {
      const qty = Number(v.quantity || 1);
      const unit = Number(v.unit_price || 0);
      const total = Number(v.total_price || (unit * qty));
      if (v.price_status === 'manual_required' || unit === 0) hasAllPrices = false;
      baseTotal += total;
      lineItems.push({ name: clean(v.product_name) || clean(v.label) || 'Produkt', spec: clean(v.label) || '', qty, unit, total, price_status: v.price_status || 'catalog' });
    });

    if (!lineItems.length && order?.product_name) {
      const total = Number(order.total_price || 0);
      if (total === 0) hasAllPrices = false;
      baseTotal = total;
      lineItems.push({ name: clean(order.product_name), spec: '', qty: 1, unit: total, total, price_status: total > 0 ? 'catalog' : 'manual_required' });
    }

    const vat = Math.round(baseTotal * 0.21);
    const totalIncVat = Math.round(baseTotal * 1.21);

    // ── Souhrn zadání z poptávky ──
    const summaryFields: Array<[string, string]> = [];
    if (reference) summaryFields.push(['Reference poptavky', `P-${reference}`]);
    if (inquiry?.created_date) summaryFields.push(['Datum poptavky', formatDate(inquiry.created_date)]);
    if (inquiry?.jmeno) summaryFields.push(['Jmeno', clean(inquiry.jmeno, 160)]);
    if (inquiry?.email) summaryFields.push(['E-mail', clean(inquiry.email, 254)]);
    if (inquiry?.telefon) summaryFields.push(['Telefon', clean(inquiry.telefon, 60)]);
    if (inquiry?.firma) summaryFields.push(['Firma / organizace', clean(inquiry.firma, 200)]);
    if (inquiry?.produkt) summaryFields.push(['Zajem o produkt', clean(inquiry.produkt, 200)]);
    if (inquiry?.quantity && Number(inquiry.quantity) > 1) summaryFields.push(['Pocet kusu', String(inquiry.quantity)]);
    if (inquiry?.installation_location) summaryFields.push(['Lokalita instalace', clean(inquiry.installation_location, 200)]);
    if (inquiry?.installation_option && INSTALLATION_LABELS[inquiry.installation_option]) summaryFields.push(['Rozsah instalace', INSTALLATION_LABELS[inquiry.installation_option]]);
    if (inquiry?.water_connection_state && WATER_LABELS[inquiry.water_connection_state]) summaryFields.push(['Stav privodu vody', WATER_LABELS[inquiry.water_connection_state]]);
    if (inquiry?.surface_type && SURFACE_LABELS[inquiry.surface_type]) summaryFields.push(['Typ povrchu', SURFACE_LABELS[inquiry.surface_type]]);
    if (inquiry?.needs_installation_quote) summaryFields.push(['Poptavka po instalaci', 'Ano']);
    if (inquiry?.requested_visualization) summaryFields.push(['Pozadavek na vizualizaci', 'Ano']);
    if (inquiry?.custom_shape) summaryFields.push(['Vlastni tvar / predstava', clean(inquiry.custom_shape, 300)]);
    if (inquiry?.zprava) summaryFields.push(['Zprava', clean(inquiry.zprava, 500)]);

    // ── Preview režim: vrátí strukturu bez generování PDF ──
    if (previewOnly) {
      return Response.json({
        ok: true, preview: true,
        reference: `P-${reference}`,
        inquiry: inquiry ? { jmeno: inquiry.jmeno, email: inquiry.email, produkt: inquiry.produkt } : null,
        order: order ? { project_name: order.project_name, status: order.status, quote_number: order.quote_number } : null,
        products: products.map((p: any) => ({ name: p.name, slug: p.slug, has_image: Boolean(p.image_url) })),
        variants: variants.map((v: any) => ({ label: v.label, product_name: v.product_name, quantity: v.quantity, unit_price: v.unit_price, price_status: v.price_status })),
        visualizations: visualizations.map((v: any) => ({ url: v.url, verified: v.verified })),
        line_items: lineItems,
        has_all_prices: hasAllPrices,
        base_total: baseTotal, vat, total_inc_vat: totalIncVat,
        summary_fields: summaryFields,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // ── Generování PDF ──
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, H = 297, M = 16;
    let y = 0;

    // Helper: hlavička stránky
    const pageHeader = (label: string) => {
      doc.setFillColor(INK);
      doc.rect(0, 0, W, 20, 'F');
      doc.setFillColor(CYAN);
      doc.rect(0, 0, W, 1.5, 'F');
      doc.setTextColor(CYAN);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(pt(label), M, 13);
      doc.setTextColor(TEXT_MUTED);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(`P-${reference}`, W - M, 13, { align: 'right' });
    };

    // Helper: patička stránky
    const pageFooter = (pageNum: number, total: number) => {
      doc.setFillColor(INK);
      doc.rect(0, H - 14, W, 14, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(TEXT_MUTED);
      doc.setFont('helvetica', 'normal');
      doc.text('MLZIDLA / HolmTec s.r.o.  |  meduna@holmtec.cz  |  +420 774 700 390  |  mlzidla.cz', W / 2, H - 9, { align: 'center' });
      doc.setTextColor(CYAN);
      doc.text(`Projektovy baliceke — P-${reference}  ·  strana ${pageNum}/${total}`, W / 2, H - 4, { align: 'center' });
    };

    // Helper: sekce label
    const sectionLabel = (label: string, yy: number) => {
      doc.setFontSize(7.5);
      doc.setTextColor(CYAN_DARK);
      doc.setFont('helvetica', 'bold');
      doc.text(pt(label), M, yy);
      return yy + 6;
    };

    // ════════ STRANA 1: TITULNÍ STRANA ════════
    doc.setFillColor(INK);
    doc.rect(0, 0, W, 60, 'F');
    doc.setFillColor(CYAN);
    doc.rect(0, 0, W, 4, 'F');

    doc.setTextColor(CYAN);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MLZIDLA / HolmTec', M, 20);

    doc.setTextColor(TEXT_MUTED);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Nerezova mlzitka a chladici systemy pro verejny prostor', M, 27);
    doc.text('meduna@holmtec.cz  |  +420 774 700 390  |  mlzidla.cz', M, 32);

    doc.setTextColor('#e2e8f0');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJEKTOVY BALICEEK', W - M, 18, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cislo: P-${reference}`, W - M, 26, { align: 'right' });
    doc.text(`Vystaveno: ${new Date().toLocaleDateString('cs-CZ')}`, W - M, 32, { align: 'right' });

    y = 72;

    // Klient
    doc.setFillColor(INK);
    doc.rect(M, y, W - 2 * M, 30, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(CYAN);
    doc.setFont('helvetica', 'bold');
    doc.text('KLIENT', M + 6, y + 8);

    doc.setFontSize(11);
    doc.setTextColor('#e2e8f0');
    doc.setFont('helvetica', 'normal');
    doc.text(pt(inquiry?.jmeno || order?.client_name || '—'), M + 6, y + 17);

    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED);
    if (inquiry?.email || order?.client_email) doc.text(pt(inquiry?.email || order?.client_email), M + 6, y + 24);
    if (inquiry?.firma || order?.client_company) {
      doc.setTextColor('#e2e8f0');
      doc.setFontSize(9.5);
      doc.text(pt(inquiry?.firma || order?.client_company), W - M - 6, y + 17, { align: 'right' });
    }
    y += 40;

    // Projekt
    y = sectionLabel('PROJEKT', y);
    doc.setFontSize(13);
    doc.setTextColor(INK);
    doc.setFont('helvetica', 'bold');
    const projectTitle = pt(order?.project_name || inquiry?.produkt || 'Navrh reseni');
    const titleLines = doc.splitTextToSize(projectTitle, W - 2 * M);
    doc.text(titleLines.slice(0, 2), M, y + 3);
    y += 10 + (titleLines.length > 1 ? 5 : 0);

    // Hlavní produktová fotografie
    const heroProduct = products[0];
    const heroImage = visualizations[0]?.url || heroProduct?.image_url;
    if (heroImage) {
      const img = await fetchImageAsBase64(heroImage);
      if (img) {
        try {
          const imgY = y + 2;
          const imgH = Math.min(H - imgY - 40, 120);
          doc.addImage(img.data, img.format, M, imgY, W - 2 * M, imgH, undefined, 'FAST');
          y = imgY + imgH + 4;
          // Štítek vizuálu
          doc.setFontSize(7);
          doc.setTextColor(TEXT_MUTED);
          doc.setFont('helvetica', 'italic');
          const visualLabel = visualizations[0]?.verified
            ? (visualizations[0]?.url === heroProduct?.image_url ? 'Realna fotografie produktu' : 'Navrhova vizualizace (k overeni)')
            : 'Navrhova vizualizace (k overeni)';
          doc.text(pt(visualLabel), M, y);
          y += 6;
        } catch {}
      }
    }

    // ════════ STRANA 2: SOUHRN ZADÁNÍ ════════
    doc.addPage();
    pageHeader('SOUHRN ZADANI');
    y = 30;

    if (summaryFields.length) {
      doc.setFillColor(PANEL_BG);
      doc.rect(M, y, W - 2 * M, 6 + summaryFields.length * 6, 'F');
      doc.setFontSize(9);
      doc.setTextColor(TEXT_BODY);
      doc.setFont('helvetica', 'normal');
      summaryFields.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(pt(`${label}:`), M + 5, y + 6);
        doc.setFont('helvetica', 'normal');
        const valLines = doc.splitTextToSize(pt(value), W - 2 * M - 50);
        doc.text(valLines.slice(0, 2), M + 50, y + 6);
        y += 6;
      });
      y += 8;
    }

    // Popis projektu z order
    if (order?.description) {
      y = sectionLabel('POPIS PROJEKTU', y);
      doc.setFontSize(9.5);
      doc.setTextColor(TEXT_BODY);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(pt(order.description), W - 2 * M);
      doc.text(descLines.slice(0, 10), M, y + 3);
      y += Math.min(10, descLines.length) * 5 + 6;
    }

    // Technické poznámky
    if (order?.production_notes) {
      y = sectionLabel('TECHNICKE POZNAMKY', y);
      doc.setFontSize(9);
      doc.setTextColor(TEXT_BODY);
      doc.setFont('helvetica', 'normal');
      const techLines = doc.splitTextToSize(pt(order.production_notes), W - 2 * M);
      doc.text(techLines.slice(0, 8), M, y + 3);
    }

    // ════════ STRANA 3+: PRODUKTOVÉ LISTY ════════
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      doc.addPage();
      pageHeader(`PRODUKTOVY LIST — ${i + 1}/${products.length}`);
      y = 28;

      // Název produktu
      doc.setFontSize(16);
      doc.setTextColor(INK);
      doc.setFont('helvetica', 'bold');
      doc.text(pt(product.name || 'Produkt'), M, y + 5);
      y += 12;

      // Produktová fotka
      if (product.image_url) {
        const img = await fetchImageAsBase64(product.image_url);
        if (img) {
          try {
            const imgH = 80;
            doc.addImage(img.data, img.format, M, y, W - 2 * M, imgH, undefined, 'FAST');
            y += imgH + 4;
            doc.setFontSize(7);
            doc.setTextColor(TEXT_MUTED);
            doc.setFont('helvetica', 'italic');
            doc.text(pt('Realna fotografie produktu'), M, y);
            y += 6;
          } catch {}
        }
      }

      // Krátký popis
      if (product.short_description) {
        y = sectionLabel('POPIS', y);
        doc.setFontSize(9.5);
        doc.setTextColor(TEXT_BODY);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(pt(product.short_description), W - 2 * M);
        doc.text(descLines.slice(0, 6), M, y + 3);
        y += Math.min(6, descLines.length) * 5 + 4;
      }

      // Technické parametry
      y = sectionLabel('TECHNICKE PARAMETRY', y);
      doc.setFontSize(9);
      doc.setTextColor(TEXT_BODY);
      doc.setFont('helvetica', 'normal');
      const specs: Array<[string, string]> = [
        ['Material', clean(product.material)],
        ['Velikost kapek', clean(product.micron_size)],
        ['Spotreba vody', clean(product.water_consumption)],
        ['Provozní tlak', clean(product.pressure)],
        ['Pokryti', clean(product.coverage_area)],
        ['Napajeni', clean(product.power_supply)],
      ].filter(([, v]) => v);
      specs.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(pt(`${label}:`), M + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.text(pt(value), M + 55, y);
        y += 5.5;
      });

      // Orientační cena
      if (product.price_from && Number(product.price_from) > 0) {
        y += 4;
        doc.setFillColor(PANEL_BG);
        doc.rect(M, y, W - 2 * M, 12, 'F');
        doc.setFontSize(9);
        doc.setTextColor(CYAN_DARK);
        doc.setFont('helvetica', 'bold');
        doc.text(pt('Orientacni cena od:'), M + 5, y + 8);
        doc.setTextColor(INK);
        doc.text(`${Number(product.price_from).toLocaleString('cs-CZ')} Kc bez DPH`, W - M - 5, y + 8, { align: 'right' });
      }
    }

    // ════════ STRANA: VIZUÁLNÍ NÁVRH ════════
    if (visualizations.length) {
      doc.addPage();
      pageHeader('VIZUALNI NAVRH RESENI');
      y = 28;

      doc.setFontSize(9);
      doc.setTextColor(TEXT_BODY);
      doc.setFont('helvetica', 'normal');
      const introText = 'Nasledujici vizualizace znazornuji navrhovane reseni ve vasem prostoru. Technicke provedeni a rozmery budou upresneny v nabidce.';
      const introLines = doc.splitTextToSize(pt(introText), W - 2 * M);
      doc.text(introLines, M, y);
      y += introLines.length * 5 + 6;

      for (let i = 0; i < Math.min(visualizations.length, 3); i++) {
        const viz = visualizations[i];
        if (i > 0) { doc.addPage(); pageHeader(`VIZUALIZACE — ${i + 1}`); y = 28; }
        const imgY = y;
        const imgHeight = H - imgY - 30;
        const imgWidth = W - 2 * M;
        const img = await fetchImageAsBase64(viz.url);
        if (img) {
          try {
            doc.addImage(img.data, img.format, M, imgY, imgWidth, imgHeight, undefined, 'FAST');
          } catch {
            doc.setTextColor(TEXT_MUTED);
            doc.setFontSize(10);
            doc.text(pt('Vizualizaci se nepodarilo nacist.'), M, 40);
          }
        } else {
          doc.setTextColor(TEXT_MUTED);
          doc.setFontSize(10);
          doc.text(pt('Vizualizaci se nepodarilo nacist.'), M, 40);
        }
        // Štítek
        doc.setFontSize(8);
        doc.setTextColor(TEXT_MUTED);
        doc.setFont('helvetica', 'italic');
        const label = viz.verified ? 'Realna fotografie produktu / overeny vizual' : 'Navrhova vizualizace (k overeni shody produktove varianty)';
        doc.text(pt(label), M, H - 20);
        if (viz.title) doc.text(pt(viz.title), M, H - 16);
      }
    }

    // ════════ STRANA: CENOVÁ NABÍDKA ════════
    doc.addPage();
    pageHeader('CENOVA NABIDKA');
    y = 30;

    if (!hasAllPrices) {
      doc.setFillColor('#fff8e1');
      doc.rect(M, y, W - 2 * M, 16, 'F');
      doc.setFontSize(9);
      doc.setTextColor('#b8860b');
      doc.setFont('helvetica', 'bold');
      doc.text(pt('KONCEPT K DOPLNENI — nektere ceny nejsou potvrzene z katalogu.'), M + 5, y + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor('#8b6914');
      doc.text(pt('Finální ceny doplnime po overeni technickych parametru.'), M + 5, y + 12);
      y += 22;
    }

    // Tabulka
    doc.setFillColor(INK);
    doc.rect(M, y, W - 2 * M, 10, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(CYAN);
    doc.setFont('helvetica', 'bold');
    doc.text('POLozKA', M + 5, y + 6.5);
    doc.text('KS', M + 115, y + 6.5, { align: 'center' });
    doc.text('CENA/KS (Kc)', M + 145, y + 6.5, { align: 'right' });
    doc.text('CELKEM (Kc)', W - M - 5, y + 6.5, { align: 'right' });
    y += 10;

    lineItems.forEach((item, i) => {
      const dark = i % 2 === 0;
      doc.setFillColor(dark ? '#f8fafc' : '#fcfdff');
      doc.rect(M, y, W - 2 * M, 12, 'F');
      doc.setFontSize(9);
      doc.setTextColor(INK);
      doc.setFont('helvetica', 'normal');
      doc.text(pt(item.name), M + 5, y + 5);
      if (item.spec) {
        doc.setFontSize(7.5);
        doc.setTextColor(TEXT_MUTED);
        const specLines = doc.splitTextToSize(pt(item.spec), 60);
        doc.text(specLines[0], M + 5, y + 9.5);
      }
      doc.setFontSize(9);
      doc.setTextColor(INK);
      doc.text(String(item.qty), M + 115, y + 6.5, { align: 'center' });
      doc.text(item.unit > 0 ? Number(item.unit).toLocaleString('cs-CZ') : '—', M + 145, y + 6.5, { align: 'right' });
      doc.text(item.total > 0 ? Number(item.total).toLocaleString('cs-CZ') : '—', W - M - 5, y + 6.5, { align: 'right' });
      y += 12;
    });

    // Součty
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(TEXT_BODY);
    doc.setFont('helvetica', 'normal');
    doc.text('Mezisoucet bez DPH:', W - M - 60, y);
    doc.text(baseTotal > 0 ? `${Number(baseTotal).toLocaleString('cs-CZ')} Kc` : '—', W - M - 5, y, { align: 'right' });
    y += 8;
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT_MUTED);
    doc.text(`DPH 21%: ${baseTotal > 0 ? Number(vat).toLocaleString('cs-CZ') : '—'} Kc`, W - M - 5, y, { align: 'right' });
    y += 8;

    // Celkem
    doc.setFillColor(CYAN);
    doc.rect(M, y, W - 2 * M, 14, 'F');
    doc.setFontSize(12);
    doc.setTextColor(INK);
    doc.setFont('helvetica', 'bold');
    doc.text('CELKEM S DPH:', M + 5, y + 9.5);
    doc.text(baseTotal > 0 ? `${Number(totalIncVat).toLocaleString('cs-CZ')} Kc` : '—', W - M - 5, y + 9.5, { align: 'right' });
    y += 22;

    // Poznámka
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED);
    doc.setFont('helvetica', 'normal');
    const noteText = hasAllPrices
      ? 'Ceny jsou orientacni, platnost 30 dnu. Finalni nabídka po potvrzeni technickych parametru.'
      : 'Tento dokument je koncept k doplneni. Finální ceny budou doplneny po overeni technickych parametru.';
    doc.text(pt(noteText), M, y);

    // ════════ STRANA: POSTUP SPOLUPRÁCE ════════
    doc.addPage();
    pageHeader('POSTUP SPOLUPRACE');
    y = 30;

    const steps = [
      { num: '1', title: 'Overeni zadani a podkladu mista', desc: 'Proverime vami dodane podklady, fotky mista a technicke parametry. Pri chybejicich informacich vas pozadame o doplneni.' },
      { num: '2', title: 'Doplneni technickych detailu', desc: 'Upresnime privod vody, typ povrchu, zpusob kotveni a pripadne smart rizeni. Overime proveditelnost.' },
      { num: '3', title: 'Odsouhlaseni navrhu', desc: 'Predstavime vizualni navrh a technicke reseni. Pripadne upravy provedeme pred finální nabidkou.' },
      { num: '4', title: 'Schvaleni nezavadne nabidky', desc: 'Po odsouhlaseni navrhu vystavime finální cenovou nabidku s platnosti 30 dnu. K schvaleni slouzi klientsky portal.' },
      { num: '5', title: 'Dohoda terminu a podminek', desc: 'Po schvaleni nabidky se dohodneme na terminu vyroby, dodani a pripadne instalace. Ujasnime platebni podminky.' },
      { num: '6', title: 'Realizace a predani / podpora', desc: 'Provedeme vyrobu, dodani a instalaci. Po predani zajistime technickou podporu a servis.' },
    ];

    steps.forEach((step, i) => {
      if (y > H - 50) { doc.addPage(); pageHeader('POSTUP SPOLUPRACE (pokr.)'); y = 30; }

      // Číslo kroku
      doc.setFillColor(CYAN);
      doc.circle(M + 6, y + 4, 5, 'F');
      doc.setFontSize(9);
      doc.setTextColor(INK);
      doc.setFont('helvetica', 'bold');
      doc.text(String(i + 1), M + 6, y + 5.5, { align: 'center' });

      // Název
      doc.setFontSize(11);
      doc.setTextColor(INK);
      doc.setFont('helvetica', 'bold');
      doc.text(pt(step.title), M + 16, y + 3);

      // Popis
      doc.setFontSize(9);
      doc.setTextColor(TEXT_BODY);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(pt(step.desc), W - 2 * M - 16);
      doc.text(descLines.slice(0, 3), M + 16, y + 8);
      y += 8 + Math.min(3, descLines.length) * 5 + 6;
    });

    // Kontaktní závěr
    y += 6;
    if (y > H - 50) { doc.addPage(); pageHeader('KONTAKT'); y = 30; }
    doc.setFillColor(PANEL_BG);
    doc.rect(M, y, W - 2 * M, 36, 'F');
    doc.setFontSize(8);
    doc.setTextColor(CYAN_DARK);
    doc.setFont('helvetica', 'bold');
    doc.text('KONTAKT', M + 6, y + 8);
    doc.setFontSize(12);
    doc.setTextColor(INK);
    doc.text('Ing. Radek Meduna', M + 6, y + 16);
    doc.setFontSize(9);
    doc.setTextColor(TEXT_BODY);
    doc.setFont('helvetica', 'normal');
    doc.text('MLZIDLA.cz by HolmTec', M + 6, y + 22);
    doc.text('+420 774 700 390  |  meduna@holmtec.cz', M + 6, y + 28);
    doc.text('mlzidla.cz', M + 6, y + 33);

    // Patičky na všech stranách
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      pageFooter(p, pageCount);
    }

    const pdfBytes = doc.output('arraybuffer');

    // ── Dry-run: vrátí metadata bez uložení ──
    if (dryRun) {
      return Response.json({
        ok: true, dry_run: true,
        reference: `P-${reference}`,
        page_count: pageCount,
        products_count: products.length,
        variants_count: variants.length,
        visualizations_count: visualizations.length,
        has_all_prices: hasAllPrices,
        base_total: baseTotal, vat, total_inc_vat: totalIncVat,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // ── Uložení PDF do privátního úložiště ──
    const filename = `projektovy-balicek-P-${reference}.pdf`;
    const file = new File([pdfBytes], filename, { type: 'application/pdf' });
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadPrivateFile({ file });
    const fileUri = uploadResult?.file_uri || '';

    if (!fileUri) return Response.json({ error: 'upload_failed' }, { status: 500 });

    // ── Vytvoření MisterDocument záznamu ──
    const clientEmail = clean(inquiry?.email || order?.client_email || '', 254).toLowerCase();
    const quoteNumber = order?.quote_number || `P-${reference}`;
    const version = new Date().toISOString().slice(0, 10);
    const title = `Projektovy baliceek — ${order?.project_name || inquiry?.produkt || 'Navrh reseni'} — P-${reference}`;

    const docRecord = await base44.asServiceRole.entities.MisterDocument.create({
      project_order_id: order?.id || '',
      client_email: clientEmail,
      product_slug: order?.product_slug || products[0]?.slug || '',
      document_type: 'proposal',
      title,
      file_url: fileUri,
      version,
      client_visible: false, // Koncept — admin musí schválit zveřejnění
      source: 'generated',
      sort_order: 0,
      notes: `Auto-generovano ${new Date().toLocaleString('cs-CZ')}. Reference: P-${reference}. ${hasAllPrices ? '' : 'Koncept k doplneni — nejsou vsechny ceny.'}`,
    });

    return Response.json({
      ok: true,
      document_id: docRecord.id,
      file_uri: fileUri,
      reference: `P-${reference}`,
      page_count: pageCount,
      quote_number: quoteNumber,
      has_all_prices: hasAllPrices,
      client_visible: false,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('generateProjectPackage error:', error?.message || String(error));
    return Response.json({ error: error?.message || 'project_package_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}