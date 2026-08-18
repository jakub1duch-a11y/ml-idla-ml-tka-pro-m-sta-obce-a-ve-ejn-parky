import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureOfferCaseFolders, uploadBytes } from '../../shared/offerDrive.ts';
import { findSmartControlPricing } from '../../shared/pricingSheet.ts';

const clean = (value: unknown) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { inquiry = {}, product = {}, quote = {}, presentation_url: presentationUrl, quote_pdf_url: quotePdfUrl, ar_url: arUrl, audience_variant: audienceVariant = 'custom' } = await req.json();
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });

    const issuedAt = quote.issued_at ? new Date(quote.issued_at) : new Date();
    const validUntil = quote.valid_until ? new Date(quote.valid_until) : new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const quoteNumber = quote.quote_number || `MLZ-${issuedAt.getFullYear()}-${String(Date.now()).slice(-6)}`;
    const gallery = (product.gallery_urls || []).filter(Boolean).slice(0, 10);
    const smartPricing = await findSmartControlPricing(base44);
    const waterManagementPrice = (smartPricing.component_water_meter_ex_vat || 0) + (smartPricing.component_liw01_ex_vat || 0);

    const content = `# MLŽIDLA.cz by HolmTec — zdrojový balíček obchodní nabídky\n\n` +
`## Identifikace nabídky\n- Číslo nabídky: ${quoteNumber}\n- Vystaveno: ${issuedAt.toLocaleDateString('cs-CZ')}\n- Platnost do: ${validUntil.toLocaleDateString('cs-CZ')}\n- Cílová varianta prezentace: ${audienceVariant}\n\n` +
`## Žadatel / odběratel\n- Jméno: ${clean(inquiry.name) || 'neuvedeno'}\n- Firma / organizace: ${clean(inquiry.company) || 'neuvedeno'}\n- E-mail: ${clean(inquiry.email) || 'neuvedeno'}\n- Telefon: ${clean(inquiry.phone) || 'neuvedeno'}\n- Zadání: ${clean(inquiry.message) || 'neuvedeno'}\n\n` +
`## Dodavatel\n- MLŽIDLA.cz by HolmTec\n- HolmTec s.r.o.\n- Kontaktní osoba: Ing. Radek Meduna\n- Telefon: +420 774 700 390\n- E-mail: meduna@holmtec.cz / info@mlzidla.cz\n- Adresa: Horní Staré Město 698, 541 02 Trutnov\n- IČ: 27486893\n- DIČ: CZ27486893\n\n` +
`## Vybraný produkt\n- Název: ${product.name}\n- Slug: ${product.slug || ''}\n- Stručný popis: ${clean(product.short_description)}\n- Materiál: ${clean(product.material)}\n- Výška / dosah: ${clean(product.coverage_area)}\n- Napájení / řízení: ${clean(product.power_supply)}\n\n` +
`## Smart řízení SUPLA — provozní vrstva mlžítek\nSUPLA prezentuj jako systém pro správu a automatizaci mlžítek, ne pouze jako aplikaci k ventilu. Umožňuje podle konfigurace vzdáleně řídit vodní větve a zóny, nastavit libovolné časové harmonogramy a cykly, používat automatické scénáře podle teploty a vlhkosti, sledovat spotřebu vody a stav provozu. Podle projektu lze doplnit integrační logiku s externím API počasí, například blokaci při dešti nebo nevhodných podmínkách. Funkci API počasí uváděj jako volitelnou projektovou integraci, nikoli jako standardní garantovanou funkci SUPLA.\n\n` +
`### Smart varianty a ceny bez DPH\n- PEVEKO SMART SUPLA Wi‑Fi ventil: ${smartPricing.component_wifi_valve_ex_vat > 0 ? `${smartPricing.component_wifi_valve_ex_vat.toLocaleString('cs-CZ')} Kč` : 'dle ceníku'}\n- SUPLA ROW‑02 Wi‑Fi spínací modul: ${smartPricing.component_row02_ex_vat > 0 ? `${smartPricing.component_row02_ex_vat.toLocaleString('cs-CZ')} Kč` : 'dle ceníku'}\n- Měření a správa spotřeby vody — ENBRA + LIW‑01: ${waterManagementPrice > 0 ? `${waterManagementPrice.toLocaleString('cs-CZ')} Kč` : 'dle ceníku'}\n- Teplota a vlhkost — SUPLA THW‑01: ${smartPricing.component_thw01_ex_vat > 0 ? `${smartPricing.component_thw01_ex_vat.toLocaleString('cs-CZ')} Kč` : 'dle ceníku'}\n- Kompletní projektové SUPLA řízení: ${smartPricing.complete_supla_ex_vat > 0 ? `${smartPricing.complete_supla_ex_vat.toLocaleString('cs-CZ')} Kč` : 'dle konfigurace'}\n- Externí API počasí / nestandardní automatizační logika: individuální nacenění podle rozsahu integrace.\n\n` +
`## Cena\n- Cena projektu bez DPH: ${quote.final_total ? `${Number(quote.final_total).toLocaleString('cs-CZ')} Kč` : 'dle potvrzené konfigurace'}\n- Cena produktu: ${quote.base_price ? `${Number(quote.base_price).toLocaleString('cs-CZ')} Kč` : 'neuvedeno'}\n- Instalace: ${quote.installation ? `${Number(quote.installation).toLocaleString('cs-CZ')} Kč` : 'neuvedeno'}\n- Sleva: ${quote.discount_percent ? `${quote.discount_percent} %` : '0 %'}\n\n` +
`## Odkazy\n- PDF cenová nabídka: ${quotePdfUrl || 'bude doplněna'}\n- Google prezentace: ${presentationUrl || 'bude doplněna'}\n- AR / vizualizace: ${arUrl || 'není k dispozici'}\n- Zákaznický portál: https://mlzidla.cz/muj-projekt\n- Smart řízení: https://mlzidla.cz/smart-ovladani\n\n` +
`## Produktové a realizační obrázky\n${[product.image_url, ...gallery].filter(Boolean).map((url, index) => `${index + 1}. ${url}`).join('\n') || 'Nejsou připojeny.'}\n\n` +
`## Zadání pro NotebookLM / AI prezentaci\nVytvoř profesionální českou obchodní prezentaci pro konkrétního žadatele. Má působit prémiově, důvěryhodně a emočně, ale bez nátlakového prodeje. Používej pouze fakta z tohoto podkladu. Přizpůsob argumentaci cílové variantě ${audienceVariant}. Struktura: titulní slide klient + produkt; potřeba prostoru a očekávaný přínos; produkt a design; technické řešení; Smart řízení; reference; vizualizace ve vlastním prostoru; cena + platnost; další krok: objednat / prodloužit platnost / uvést orientační termín. Branding MLŽIDLA.cz by HolmTec, tmavě modrá / petrol / tyrkysová, velké fotografie, minimum textu.\n`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const folders = await ensureOfferCaseFolders(accessToken, { quoteNumber, clientName: inquiry.company || inquiry.name || inquiry.email, issuedAt });
    const filename = `${quoteNumber}-${(product.slug || 'produkt')}-notebooklm-source.md`;
    const uploaded = await uploadBytes(accessToken, folders.sourceFolderId, new TextEncoder().encode(content), filename, 'text/markdown');

    return Response.json({ success: true, file_id: uploaded.id, source_url: uploaded.url, filename, drive_case_folder_id: folders.caseFolderId, source_folder_id: folders.sourceFolderId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
