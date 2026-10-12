import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { jsPDF } from 'npm:jspdf@4.2.1';
import { toBase64, fetchImageAsBase64 } from '../../shared/pdfHelpers.ts';
import { loadOfferCtx } from '../../shared/offerPdfContext.ts';
import { drawPricePage, drawRecapPage } from '../../shared/offerPdfBuilder.ts';

const STYLE = `Svislý plakát formátu A4 (poměr 210:297) pro značku MLŽIDLA.cz by HolmTec. Světlý, čistý, prémiový editorial styl: fotorealistická slunná zahrada/park s jemnou mlhou, v pravém horním rohu listy stromů s prosluněným světlem, dole měkký zvlněný světle zelený přechod. Barvy: bílá, tmavě zelená #4f6b2e, černá. Nadpisy velmi tučným bezpatkovým písmem (Manrope), druhý řádek nadpisu zeleně. Vlevo nahoře logo textem "MLŽIDLA.cz" s malým "by HolmTec" pod zelenou linkou. Ikony v kulatých světle zelených kruzích. Veškerý text správně česky s diakritikou, přesně jak je zadáno, žádné další texty, žádné ceny.`;
const FOOTER = `Dole patička: zelené zaoblené tlačítko s textem "Ukažte nám svůj prostor. →", vedle kontakt "Ing. Radek Meduna, meduna@holmtec.cz • +420 774 700 390" a vpravo "mlzidla.cz".`;
const LOCK = `PRODUKT MUSÍ BÝT TOTOŽNÝ s referenčními obrázky (stejná silueta, ohyby, počet trysek, nerez). Nic nepřidávej ani neměň.`;

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const projectOrderId = body.project_order_id;
    if (!projectOrderId) return Response.json({ error: 'Missing project_order_id' }, { status: 400 });

    const order = await base44.asServiceRole.entities.ProjectOrder.get(projectOrderId);
    if (!order) return Response.json({ error: 'Nabídka nenalezena.' }, { status: 404 });
    const { ctx, vizUrls, productUrls, quoteNum } = await loadOfferCtx(base44, order);

    const refs = [...productUrls.slice(0, 2), ...vizUrls.slice(0, 2)].filter(Boolean);
    const name = ctx.productName;
    const who = ctx.clientCompany || ctx.clientName;
    const goal = (ctx.goal || '').slice(0, 220);

    const pages: { key: string; prompt: string }[] = [
      { key: 'cover', prompt: `${STYLE} ${LOCK}\nTITULNÍ STRANA. Nadpis dvouřádkový: "Designová mlžítka." (černě) a "Chytrý provoz." (zeleně). Pod ním "Česká nerezová řešení pro města, parky a zahrady." Uprostřed velká fotografie produktu ${name} v zahradě s jemnou mlhou z trysek, drobný popisek "Ilustrační vizualizace". Dole název "${name}" tučně (poslední slovo zeleně)${ctx.smart ? ' a vpravo skupina tří ikon "Časové režimy", "Podle teploty", "Ovládání z mobilu" pod titulkem "AUTOMATIZACE / SUPLA"' : ''}. ${FOOTER}` },
      { key: 'solution', prompt: `${STYLE} ${LOCK}\nSTRANA ŘEŠENÍ. Nadpis "Řešení pro ${who}" (část po "pro" zeleně). Podtitul "${name} pro příjemné letní osvěžení." Krátký odstavec: "${goal}". Velká fotka produktu v prostředí odpovídajícím zadání: "${ctx.goal.slice(0, 160)}". Vpravo sloupec 5 položek s ikonami: Jemná vodní mlha; Bezpečné a atraktivní řešení; Nerezová konstrukce; Vhodné pro školy, parky a zahrady; Nízké provozní náklady (každá s jednou krátkou větou). Dole tři detailní fotky (tryska s mlhou, nerezový ohyb, produkt v prostoru) s popisky. ${FOOTER}` },
      { key: 'tech', prompt: `${STYLE} ${LOCK}\nTECHNICKÁ STRANA. Nadpis "Technické informace" a zeleně "${name}". Podtitul "Design, funkčnost a kvalita pro moderní veřejná prostranství." Produkt samostatně na světlém pozadí s kótami. Vlevo 6 ikon s řádky: Rozměr dle konfigurace; Materiál: nerezová ocel; Jemné mlžení pomocí trysek; Připojení vody dle konfigurace; Kotvení do zpevněného podkladu; Vhodné pro venkovní použití. Nevymýšlej konkrétní rozměry v mm. Dole 4 detailní fotky: tryska s mlhou, nerezový ohyb, kotvení do podkladu, detail trysky. ${FOOTER}` },
      { key: 'placement', prompt: `${STYLE} ${LOCK}\nSTRANA NÁVRH UMÍSTĚNÍ. Nadpis "Návrh umístění." a zeleně "Možnosti začlenění do prostoru." Tři zaoblené fotky pod sebou (${name} v zahradě školky, v parku, v odpočinkové zóně) s popisky "Zahrada MŠ", "Parkové prostředí", "Odpočinková zóna". Vpravo světle zelený sloupec 4 položek: Design, který zaujme; Příjemné osvěžení; Přirozené začlenění; Univerzální využití. ${FOOTER}` },
    ];
    if (ctx.smart) pages.push({ key: 'smart', prompt: `${STYLE} ${LOCK}\nSTRANA AUTOMATIZACE. Nadpis "Automatizace / SUPLA" (SUPLA zeleně), podnadpis zeleně "Chytré ovládání pro pohodlný provoz." Krátký text o ovládání mlžítka přes SUPLA. Vpravo ruka držící telefon s aplikací "supla" (zelené tlačítko "Spustit mlžítko", dlaždice Časový režim, Podle teploty, Harmonogram, Statistiky). Dole 5 ikon: Časové režimy; Spínání podle teploty; Ovládání z mobilu; Přehledný provoz; Možnost individuální konfigurace. Dole zelené tlačítko "Chytré řešení pro váš prostor. →" a "Funkce podle zvolené výbavy." ` });
    pages.push({ key: 'hero', prompt: `Svislý fotorealistický plakát A4 (210:297): ${name} v slunné zahradě s jemnou mlhou z trysek. ${LOCK} Vlevo nahoře tučný černý nadpis "${name}" (poslední slovo zeleně #4f6b2e), pod ním zelená linka a text "Příjemné letní osvěžení". Žádné jiné texty ani ceny.` });

    const results = await Promise.all(pages.map(async (p) => {
      try {
        const r = await base44.asServiceRole.integrations.Core.GenerateImage({ prompt: p.prompt, existing_image_urls: refs.length ? refs : undefined });
        return { key: p.key, url: r?.url || '' };
      } catch (e) { console.warn('Image page failed', p.key, e?.message); return { key: p.key, url: '' }; }
    }));
    const byKey: Record<string, string> = Object.fromEntries(results.map((r) => [r.key, r.url]));
    const generated = results.filter((r) => r.url);
    if (!generated.length) return Response.json({ error: 'Generování obrázků nabídky selhalo. Zkuste to znovu.' }, { status: 502 });

    // ── Sestavení PDF: obrázkové strany + přesná cenová strana a rekapitulace z dat ──
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let first = true;
    const addImagePage = async (url: string) => {
      const img = await fetchImageAsBase64(url, 25000);
      if (!img) return;
      if (!first) doc.addPage();
      first = false;
      doc.addImage(img.data, img.format, 0, 0, 210, 297, undefined, 'FAST');
    };
    for (const key of ['cover', 'solution', 'tech', 'placement', 'smart']) if (byKey[key]) await addImagePage(byKey[key]);
    if (!first) doc.addPage();
    first = false;
    drawPricePage(doc, ctx);
    if (byKey.hero) await addImagePage(byKey.hero);
    doc.addPage();
    drawRecapPage(doc, ctx);
    const pdfBytes = doc.output('arraybuffer');

    let pdfUrl = '';
    try {
      const up = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file: new Blob([pdfBytes], { type: 'application/pdf' }) });
      pdfUrl = up?.file_url || '';
      if (pdfUrl) await base44.asServiceRole.entities.ProjectOrder.update(order.id, { quote_pdf_url: pdfUrl });
    } catch (e) { console.warn('PDF upload failed', e?.message); }

    // Uložení stránek jako podklady nabídky
    for (const g of generated) {
      await base44.asServiceRole.entities.OfferAsset.create({
        inquiry_id: order.inquiry_id, inquiry_type: order.inquiry_type || 'poptavka', project_order_id: order.id,
        file_url: g.url, file_name: `nabidka-${quoteNum}-${g.key}.webp`, file_type: 'image/webp',
        asset_type: 'other', title: `Obrázková strana nabídky — ${g.key}`, generated_by_ai: true,
      }).catch(() => null);
    }

    return Response.json({
      ok: true, quote_number: quoteNum, pdf_url: pdfUrl,
      pdf_base64: pdfUrl ? undefined : toBase64(new Uint8Array(pdfBytes)),
      pages: generated, failed_pages: results.filter((r) => !r.url).map((r) => r.key),
      note: 'Obrázkové strany jsou AI ilustrace — texty ve vizuálech před odesláním zkontrolujte. Ceny jsou vykresleny z dat nabídky, ne AI.',
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
}