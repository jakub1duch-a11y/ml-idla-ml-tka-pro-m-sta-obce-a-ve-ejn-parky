import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { jsPDF } from 'npm:jspdf@4.2.1';
import { clean, fetchSuplaPricing } from '../../shared/suplaPricing.ts';
import { ensureOfferCaseFolders, uploadBytes } from '../../shared/offerDrive.ts';

const short = (value: unknown, max = 2000) => clean(value).slice(0, max);

const toBase64 = (bytes: Uint8Array) => {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

async function fetchImageAsBase64(url: string): Promise<{ data: string; format: string } | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    const buffer = new Uint8Array(await blob.arrayBuffer());
    const base64 = toBase64(buffer);
    const format = blob.type.includes('png') ? 'PNG' : 'JPEG';
    return { data: base64, format };
  } catch {
    return null;
  }
}

async function loadFont(doc: any): Promise<boolean> {
  try {
    const response = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/NotoSans%5Bwdth%2Cwght%5D.ttf');
    if (!response.ok) return false;
    const fontBytes = new Uint8Array(await response.arrayBuffer());
    if (fontBytes.length < 1000) return false;
    const fontBase64 = toBase64(fontBytes);
    doc.addFileToVFS('NotoSans.ttf', fontBase64);
    doc.addFont('NotoSans.ttf', 'NotoSans', 'normal');
    doc.setFont('NotoSans', 'normal');
    return true;
  } catch (e) {
    console.warn('Font load failed', e?.message || e);
    return false;
  }
}

const stripDiacritics = (text: string) => text
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const inquiryId = body.inquiry_id;
    const inquiryType = body.inquiry_type === 'contact' ? 'contact' : 'poptavka';
    const projectOrderId = body.project_order_id;

    if (!inquiryId && !projectOrderId) {
      return Response.json({ error: 'Missing inquiry_id or project_order_id' }, { status: 400 });
    }

    // ── Load ProjectOrder ──
    let order: any = null;
    if (projectOrderId) {
      order = await base44.asServiceRole.entities.ProjectOrder.get(projectOrderId);
    } else if (inquiryId) {
      const orders = await base44.asServiceRole.entities.ProjectOrder.filter({ inquiry_id: inquiryId });
      order = orders?.[0] || null;
    }
    if (!order) {
      return Response.json({ error: 'Koncept nebyl nalezen. Nejprve připravte koncept nabídky.' }, { status: 404 });
    }

    // ── Load OfferVariants ──
    const variants = await base44.asServiceRole.entities.OfferVariant.filter({ project_order_id: order.id }).catch(() => []);

    // ── Load visualization assets ──
    const effectiveInquiryId = order.inquiry_id || inquiryId;
    const assets = await base44.asServiceRole.entities.OfferAsset.filter({ inquiry_id: effectiveInquiryId }).catch(() => []);
    const visualizations = (assets || [])
      .filter((a) => a.asset_type === 'generated_visualization' && a.file_url)
      .map((a) => ({ url: a.file_url, title: a.title || '' }));

    // Fallback to variant visualization URLs
    if (!visualizations.length && variants?.length) {
      variants.forEach((v) => {
        if (v.visualization_url) visualizations.push({ url: v.visualization_url, title: v.label || v.product_name || '' });
      });
    }

    // ── Fetch SUPLA pricing ──
    const suplaPricing = await fetchSuplaPricing(base44);

    // ── Generate PDF ──
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    // Strip non-ASCII from all text (default helvetica doesn't support Czech diacritics)
    const _ascii = (s: any): string => {
      if (s == null) return '';
      const str = typeof s === 'string' ? s : String(s);
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, '');
    };
    const _origText = doc.text.bind(doc);
    (doc as any).text = function(text: any, x: any, y: any, options?: any) {
      if (text == null) return;
      if (typeof text === 'string') text = _ascii(text);
      else if (Array.isArray(text)) {
        text = text.map((t) => _ascii(t));
        if (text.length === 0) return;
      } else text = _ascii(text);
      return _origText(text, x, y, options);
    };
    const _origSplit = doc.splitTextToSize.bind(doc);
    (doc as any).splitTextToSize = function(text: any, ...args: any[]) {
      return _origSplit(_ascii(text), ...args);
    };
    const W = 210, H = 297, M = 16;
    const ink = '#0D1117';
    const cyan = '#22D3EE';
    const textLight = '#E2E8F0';
    const textMuted = '#94A3B8';
    const paleBg = '#F4F8FA';

    // Font loading disabled — using default helvetica with ASCII fallback
    const fontLoaded = false;
    const pt = (value: unknown) => stripDiacritics(clean(value)).replace(/[^\x20-\x7E]/g, '');

    const quoteNum = order.quote_number || `HT-${new Date().getFullYear()}-${String(order.id || Date.now()).slice(-5)}`;

    // ── PAGE 1: COVER ──
    doc.setFillColor(ink);
    doc.rect(0, 0, W, 60, 'F');
    doc.setFillColor(cyan);
    doc.rect(0, 0, W, 4, 'F');

    doc.setTextColor(cyan);
    doc.setFontSize(22);
    doc.text('MLŽIDLA® / HolmTec', M, 20);

    doc.setTextColor(textMuted);
    doc.setFontSize(8);
    doc.text('Nerezová mlžítka a chladicí systémy pro veřejný prostor', M, 27);
    doc.text('meduna@holmtec.cz  |  +420 774 700 390  |  mlzidla.cz', M, 32);

    doc.setTextColor(textLight);
    doc.setFontSize(15);
    doc.text('KONCEPT NABÍDKY', W - M, 18, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(textMuted);
    doc.text(`Číslo: ${quoteNum}`, W - M, 26, { align: 'right' });
    doc.text(`Vystaveno: ${new Date().toLocaleDateString('cs-CZ')}`, W - M, 32, { align: 'right' });
    doc.text('Koncept — neoficiální', W - M, 38, { align: 'right' });

    let y = 72;

    // Client info
    doc.setFillColor(ink);
    doc.rect(M, y, W - 2 * M, 32, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(cyan);
    doc.text('KLIENT', M + 6, y + 8);

    doc.setFontSize(11);
    doc.setTextColor(textLight);
    doc.text(clean(order.client_name) || '—', M + 6, y + 17);

    doc.setFontSize(9);
    doc.setTextColor(textMuted);
    doc.text(clean(order.client_email) || '', M + 6, y + 24);
    if (order.client_phone) doc.text(clean(order.client_phone), M + 6, y + 29);

    if (order.client_company) {
      doc.setTextColor(textLight);
      doc.setFontSize(9.5);
      doc.text(clean(order.client_company), W - M - 6, y + 17, { align: 'right' });
    }
    y += 42;

    // Project title
    doc.setFontSize(7.5);
    doc.setTextColor(cyan);
    doc.text('PROJEKT', M, y);
    y += 6;

    doc.setFontSize(13);
    doc.setTextColor(ink);
    const titleLines = doc.splitTextToSize(clean(order.project_name) || 'Návrh řešení', W - 2 * M);
    doc.text(titleLines.slice(0, 2), M, y + 3);
    y += 10 + (titleLines.length > 1 ? 5 : 0);

    // Description
    if (order.description) {
      doc.setFontSize(7.5);
      doc.setTextColor(cyan);
      doc.text('SHRNUTÍ POŽADAVKU', M, y);
      y += 6;

      doc.setFontSize(9.5);
      doc.setTextColor('#333333');
      const descLines = doc.splitTextToSize(clean(order.description), W - 2 * M);
      doc.text(descLines.slice(0, 8), M, y + 3);
      y += Math.min(8, descLines.length) * 5 + 4;
    }

    // Product
    if (order.product_name) {
      doc.setFontSize(7.5);
      doc.setTextColor(cyan);
      doc.text('DOPORUČENÉ ŘEŠENÍ', M, y);
      y += 6;

      doc.setFontSize(11);
      doc.setTextColor(ink);
      doc.text(clean(order.product_name), M, y + 2);
      y += 8;
    }

    // Technical solution
    if (order.production_notes) {
      doc.setFontSize(7.5);
      doc.setTextColor(cyan);
      doc.text('TECHNICKÉ ŘEŠENÍ', M, y);
      y += 6;

      doc.setFontSize(9);
      doc.setTextColor('#333333');
      const techLines = doc.splitTextToSize(clean(order.production_notes), W - 2 * M);
      const maxLines = Math.floor((H - y - 25) / 4.5);
      doc.text(techLines.slice(0, maxLines), M, y + 3);
    }

    // ── PAGE 2: VISUALIZATION ──
    if (visualizations.length) {
      doc.addPage();
      doc.setFillColor(ink);
      doc.rect(0, 0, W, 20, 'F');
      doc.setTextColor(cyan);
      doc.setFontSize(10);
      doc.text('VIZUALIZACE ŘEŠENÍ', M, 13);

      const imgY = 25;
      const imgHeight = H - 30 - M;
      const imgWidth = W - 2 * M;

      const img = await fetchImageAsBase64(visualizations[0].url);
      if (img) {
        try {
          doc.addImage(img.data, img.format, M, imgY, imgWidth, imgHeight, undefined, 'FAST');
        } catch {
          doc.setTextColor(textMuted);
          doc.setFontSize(10);
          doc.text('Vizualizace není dostupná.', M, 40);
        }
      } else {
        doc.setTextColor(textMuted);
        doc.setFontSize(10);
        doc.text('Vizualizaci se nepodařilo načíst.', M, 40);
      }

      // Additional visualizations (up to 2 more)
      for (let i = 1; i < Math.min(visualizations.length, 3); i++) {
        doc.addPage();
        doc.setFillColor(ink);
        doc.rect(0, 0, W, 20, 'F');
        doc.setTextColor(cyan);
        doc.setFontSize(10);
        doc.text(`VIZUALIZACE — ${clean(visualizations[i].title) || `VARIANTA ${i + 1}`}`, M, 13);

        const img2 = await fetchImageAsBase64(visualizations[i].url);
        if (img2) {
          try {
            doc.addImage(img2.data, img2.format, M, imgY, imgWidth, imgHeight, undefined, 'FAST');
          } catch {}
        }
      }
    }

    // ── PAGE 3: PRICE CALCULATION ──
    doc.addPage();
    doc.setFillColor(ink);
    doc.rect(0, 0, W, 20, 'F');
    doc.setTextColor(cyan);
    doc.setFontSize(10);
    doc.text('CENOVÁ KALKULACE', M, 13);

    y = 30;

    // Table header
    doc.setFillColor(ink);
    doc.rect(M, y, W - 2 * M, 10, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(cyan);
    doc.text('POLOŽKA', M + 5, y + 6.5);
    doc.text('KS', M + 115, y + 6.5, { align: 'center' });
    doc.text('CENA/KS (Kč)', M + 145, y + 6.5, { align: 'right' });
    doc.text('CELKEM (Kč)', W - M - 5, y + 6.5, { align: 'right' });
    y += 10;

    let baseTotal = 0;
    const lineItems: any[] = [];

    // Product variants
    (variants || []).forEach((v) => {
      const qty = Number(v.quantity || 1);
      const unit = Number(v.unit_price || 0);
      const total = Number(v.total_price || (unit * qty));
      baseTotal += total;
      lineItems.push({
        name: clean(v.product_name) || clean(v.label) || 'Produkt',
        spec: clean(v.label) || '',
        qty,
        unit,
        total,
      });
    });

    // If no variants, use product name from order
    if (!lineItems.length && order.product_name) {
      const total = Number(order.total_price || 0);
      baseTotal = total;
      lineItems.push({
        name: clean(order.product_name),
        spec: '',
        qty: 1,
        unit: total,
        total,
      });
    }

    // SUPLA package
    if (suplaPricing && suplaPricing.standard_price_ex_vat > 0) {
      const suplaTotal = suplaPricing.standard_price_ex_vat;
      baseTotal += suplaTotal;
      lineItems.push({
        name: 'SUPLA Smart řízení (Standard)',
        spec: 'NC ventil + ROW-02 + LIW-01 + vodoměr + programování',
        qty: 1,
        unit: suplaTotal,
        total: suplaTotal,
      });
    }

    // Render line items
    lineItems.forEach((item, i) => {
      const dark = i % 2 === 0;
      doc.setFillColor(dark ? '#F8FAFC' : '#FCFDFF');
      doc.rect(M, y, W - 2 * M, 12, 'F');

      doc.setFontSize(9);
      doc.setTextColor(ink);
      doc.text(item.name, M + 5, y + 5);

      doc.setFontSize(7.5);
      doc.setTextColor(textMuted);
      if (item.spec) {
        const specLines = doc.splitTextToSize(item.spec, 60);
        doc.text(specLines[0], M + 5, y + 9.5);
      }

      doc.setFontSize(9);
      doc.setTextColor(ink);
      doc.text(String(item.qty), M + 115, y + 6.5, { align: 'center' });
      doc.text(Number(item.unit).toLocaleString('cs-CZ'), M + 145, y + 6.5, { align: 'right' });
      doc.text(Number(item.total).toLocaleString('cs-CZ'), W - M - 5, y + 6.5, { align: 'right' });
      y += 12;
    });

    // Summary
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor('#333333');
    doc.text('Mezisoučet bez DPH:', W - M - 60, y);
    doc.text(`${Number(baseTotal).toLocaleString('cs-CZ')} Kč`, W - M - 5, y, { align: 'right' });
    y += 8;

    doc.setFontSize(8.5);
    doc.setTextColor(textMuted);
    doc.text(`DPH 21%: ${Number(baseTotal * 0.21).toLocaleString('cs-CZ')} Kč`, W - M - 5, y, { align: 'right' });
    y += 8;

    // Total bar
    doc.setFillColor(cyan);
    doc.rect(M, y, W - 2 * M, 14, 'F');
    doc.setFontSize(12);
    doc.setTextColor(ink);
    doc.text('CELKEM S DPH:', M + 5, y + 9.5);
    doc.text(`${Number(baseTotal * 1.21).toLocaleString('cs-CZ')} Kč`, W - M - 5, y + 9.5, { align: 'right' });
    y += 22;

    // Note
    doc.setFontSize(8);
    doc.setTextColor(textMuted);
    doc.text('Ceny jsou orientační, platnost 30 dní. Finální nabídka po potvrzení technických parametrů.', M, y);

    // ── PAGE 4: SUPLA SPECIFICATION ──
    if (suplaPricing) {
      doc.addPage();
      doc.setFillColor(ink);
      doc.rect(0, 0, W, 20, 'F');
      doc.setTextColor(cyan);
      doc.setFontSize(10);
      doc.text('SUPLA CHYTRÉ ŘÍZENÍ — SPECIFIKACE', M, 13);

      y = 30;

      // Package
      doc.setFillColor(paleBg);
      doc.rect(M, y, W - 2 * M, 24, 'F');
      doc.setFontSize(8);
      doc.setTextColor(cyan);
      doc.text('BALÍČEK SUPLA STANDARD', M + 5, y + 7);

      doc.setFontSize(11);
      doc.setTextColor(ink);
      doc.text(`Cena bez DPH: ${Number(suplaPricing.standard_price_ex_vat).toLocaleString('cs-CZ')} Kč`, M + 5, y + 14);
      doc.setFontSize(9);
      doc.setTextColor(textMuted);
      doc.text(`Cena s DPH: ${Number(suplaPricing.standard_price_inc_vat).toLocaleString('cs-CZ')} Kč`, M + 5, y + 20);
      y += 30;

      // Components
      doc.setFontSize(8);
      doc.setTextColor(cyan);
      doc.text('KOMPONENTY', M, y);
      y += 6;

      const components = [
        ['SUPLA ROW-02 — řídicí jednotka', suplaPricing.components.row02],
        ['SUPLA LIW-01 — monitoring spotřeby vody', suplaPricing.components.liw01],
        ['Servomotorický ventil NC', suplaPricing.components.nc_valve],
        ['Elektronický vodoměr', suplaPricing.components.water_meter],
        ['Chytrý ventil PEVEKO (premium)', suplaPricing.components.smart_valve_peveko],
        ['SUPLA THW-01 — teplotní senzor (volitelný)', suplaPricing.components.thw01],
      ];

      components.forEach(([label, price]) => {
        doc.setFontSize(9);
        doc.setTextColor('#333333');
        doc.text(String(label), M + 2, y);
        doc.text(`${Number(price).toLocaleString('cs-CZ')} Kč`, W - M - 5, y, { align: 'right' });
        y += 5.5;
      });

      y += 6;

      // Premium
      if (suplaPricing.premium_price_ex_vat > 0) {
        doc.setFillColor(paleBg);
        doc.rect(M, y, W - 2 * M, 16, 'F');
        doc.setFontSize(8);
        doc.setTextColor(cyan);
        doc.text('PREMIUM VARIANTA', M + 5, y + 6);
        doc.setFontSize(9.5);
        doc.setTextColor(ink);
        doc.text(`SUPLA Premium (PEVEKO + THW-01): ${Number(suplaPricing.premium_price_ex_vat).toLocaleString('cs-CZ')} Kč bez DPH`, M + 5, y + 12);
        y += 22;
      }

      // Scenarios
      doc.setFontSize(8);
      doc.setTextColor(cyan);
      doc.text('PROVOZNÍ SCÉNÁŘE', M, y);
      y += 6;

      const scenarios = [
        'Automatická aktivace při teplotě > 25 °C',
        'Časové plány (ráno / odpoledne / večer)',
        'Dálkové ovládání přes SUPLA Cloud / mobilní aplikaci',
        'Monitoring spotřeby vody (LIW-01 + vodoměr)',
        'Predikce údržby a diagnostika trysek',
        'Integrace s API počasí pro prediktivní řízení',
      ];

      scenarios.forEach((s) => {
        doc.setFontSize(8.5);
        doc.setTextColor('#333333');
        doc.text(`• ${s}`, M + 2, y);
        y += 5;
      });

      y += 6;

      // Architecture
      doc.setFontSize(8);
      doc.setTextColor(cyan);
      doc.text('ARCHITEKTURA', M, y);
      y += 6;

      doc.setFontSize(8.5);
      doc.setTextColor('#333333');
      const archText = 'Standard používá NC servoventil + SUPLA ROW-02. Chytrý PEVEKO ventil je alternativní premium varianta. THW-01 je volitelný. SUPLA Cloud a mobilní aplikace nemají povinné předplatné. Self-hosting a vlastní API integrace mohou mít samostatné provozní náklady.';
      const archLines = doc.splitTextToSize(archText, W - 2 * M);
      doc.text(archLines, M, y);

      // Phases
      y += archLines.length * 5 + 8;
      doc.setFontSize(8);
      doc.setTextColor(cyan);
      doc.text('FÁZE NASAZENÍ', M, y);
      y += 6;

      const phases = [
        ['Fáze 1: Analýza a prototyp', '2–4 týdny', 'Zmapování stávající infrastruktury, návrh zapojení a komunikační logiky SUPLA / API.'],
        ['Fáze 2: Konfigurace řízení a scénářů', 'dle rozsahu', 'SUPLA konfigurace, časové scénáře, dálkové ovládání, měření spotřeby a provozní logika.'],
        ['Fáze 3: Testování, nasazení a předání', 'dle termínu', 'Kompletace, oživení, testování, konfigurace přístupu, základní zaškolení a předání.'],
      ];

      phases.forEach(([title, timing, scope]) => {
        doc.setFontSize(9);
        doc.setTextColor(ink);
        doc.text(title, M + 2, y);
        doc.setFontSize(7.5);
        doc.setTextColor(textMuted);
        doc.text(timing, W - M - 5, y, { align: 'right' });
        y += 4.5;
        doc.setFontSize(8);
        doc.setTextColor('#333333');
        const scopeLines = doc.splitTextToSize(scope, W - 2 * M - 4);
        doc.text(scopeLines, M + 4, y);
        y += scopeLines.length * 4 + 4;
      });
    }

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFillColor(ink);
      doc.rect(0, H - 14, W, 14, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(textMuted);
      doc.text('MLŽIDLA® / HolmTec s.r.o.  |  meduna@holmtec.cz  |  +420 774 700 390  |  mlzidla.cz', W / 2, H - 9, { align: 'center' });
      doc.setTextColor(cyan);
      doc.text(`Koncept nabídky — ${quoteNum}  ·  strana ${p}/${pageCount}`, W / 2, H - 4, { align: 'center' });
    }

    const pdfBytes = doc.output('arraybuffer');

    // Try uploading to storage for permanent access
    let pdfUrl = '';
    try {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const uploadResult = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file: blob });
      pdfUrl = uploadResult?.file_url || '';
      if (pdfUrl) {
        await base44.asServiceRole.entities.ProjectOrder.update(order.id, { quote_pdf_url: pdfUrl });
      }
    } catch (uploadError) {
      console.warn('PDF upload failed, falling back to base64', uploadError);
    }

    // Upload to shared Google Drive for the sales team
    let driveUrl = '';
    let driveFolderUrl = '';
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
      const folders = await ensureOfferCaseFolders(accessToken, {
        quoteNumber: quoteNum,
        clientName: order.client_name || order.client_email || 'klient',
        issuedAt: new Date().toISOString(),
      });
      const uploaded = await uploadBytes(accessToken, folders.offerFolderId, new Uint8Array(pdfBytes), `Koncept_${quoteNum}.pdf`, 'application/pdf');
      driveUrl = uploaded.url;
      driveFolderUrl = `https://drive.google.com/drive/folders/${folders.caseFolderId}`;
    } catch (driveError) {
      console.warn('Google Drive upload failed', driveError?.message || driveError);
    }

    if (pdfUrl) {
      return Response.json({ ok: true, pdf_url: pdfUrl, drive_url: driveUrl, drive_folder_url: driveFolderUrl, quote_number: quoteNum });
    }

    // Base64 fallback
    const base64 = toBase64(new Uint8Array(pdfBytes));
    return Response.json({ ok: true, pdf_base64: base64, drive_url: driveUrl, drive_folder_url: driveFolderUrl, filename: `koncept-${quoteNum}.pdf`, quote_number: quoteNum });
  } catch (error) {
    console.error('PDF gen error:', error?.message || String(error));
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
}