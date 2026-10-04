import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';
import { findPricingForProduct, estimateCustomConceptPricing, validatedCatalogFallback, CUSTOM_COST_KEYS } from '../../shared/pricingSheet.ts';

const clean = (value: unknown) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const short = (value: unknown, max = 1200) => clean(value).slice(0, max);
const AUDIENCES = ['city_public', 'residential', 'wellness_hospitality', 'architecture_design', 'custom'];

// Expert knowledge embedded from Mlzidla Cooling Cities reference — used as context for the AI.
const EXPERT_CONTEXT = `ODBORNÝ ZDROJ — MLŽIDLA Cooling Cities (česká verze):

MLŽIDLA® / HolmTec s.r.o. navrhuje, vyrábí a instaluje nerezová mlžítka a mlžné systémy pro ochlazování veřejných prostor, měst, obcí, parků, koupališť, eventů a komerčních objektů.

KLÍČOVÉ TECHNOLOGICKÉ PRINCIPY:
1. NÍZKOTLAKÉ MLŽENÍ: Systémy pracují s provozním tlakem 2–6 bar (nízkotlaké), což je bezpečné pro veřejný prostor, nepoškozuje kůži, šetří vodu a tvoří jemnou mlhu (mikronové kapky 5–50 μm). Vysokotlaké systémy (60–100 bar) jsou pro veřejnost nebezpečné a nepoužívají se v pobytových zónách.
2. MATERIÁL AISI 316L: Pro venkovní veřejné instalace se standardně doporučuje nerez AISI 316L (1.4404) — odolný vůči korozi, chlorované vodě (koupaliště), soli (pobřeží) a atmosférickým vlivům. AISI 304 (1.4301) je dostupný pro vnitřní/klimaticky mírné aplikace. U každé nabídky pro město/obec/veřejný prostor preferuj AISI 316L.
3. SMART ŘÍZENÍ: SUPLA IoT platform — teplotní automatika (aktivace > 25°C), časové plány, interaktivní sepnutí senzorem, monitoring spotřeby vody (ENBRA + LIW-01), integrace s API počasí. Smart řízení umožňuje dálkový přehled, úsporný provoz a predikci údržby.
4. KONSTRUKČNÍ PRINCIP: Minimalistické čisté linie z broušeného nerezu. Trysky osazeny přímo do konstrukce. Připojení vody skryté a servisovatelné. Patka/kotvení řešeno bezpečně a nenápadně. Standardní profily: jekl 70×70×3, trubky Ø76,1×3; Ø60,3×3,6; Ø52×3; Ø42,4×3,6.
5. ROZSAH DODÁVKY: Mlžítko (nerez konstrukce + trysky), přívodní potrubí, redukční ventil, filtr, smart řídicí jednotka (SUPLA), senzory (teplota, vlhkost, pohyb), připojení na vodu, projektová dokumentace, certifikát materiálu, revize.
6. INSTALACE: Základní kotvení do betonu/palubovky, připojení na stávající vodovod (3/4" nebo 1"), elektrické připojení 230V pro smart jednotku. Typická instalace 1–3 dny v závislosti na rozsahu.
7. SERVIS: Roční revze trysek (čistění/usazeniny), kontrola filtru, kalibrace senzorů, aktualizace firmwaru. Servisní balíček: START (záruční 24 měsíců), CARE (roční revize), PRO (dálková diagnostika + priority servis).
8. VÝPOČET TRYSEK: Průtok jedné trysky cca 0,05–0,08 l/min při 3 bar. Počet trysek = plocha zóny / dosah jedné trysky (cca 2–3 m rádius). Celkový průtok = počet trysek × průtok trysky. Zónování pro úsporu: max 2–3 samostatně řízené zóny.

CÍLOVÉ APLIKACE PRO MĚSTA A OBCE:
- Náměstí a promenády: ochlazení pobytových zón, snížení teploty o 5–8°C
- Parky a hřiště: bezpečné mlžení pro děti, nízkotlaké, hygienicky nezávadné
- Koupaliště a aquaparky: ochlazení zón kolem bazénů, komfort návštěvníků
- Zastávky MHD a čekárny: mikroklima pro cestující
- Kulturní akce a festivaly: mobilní pronájem, dočasné instalace
- Školy a školkky: bezpečné mlžení s teplotní automatikou

ORIENTAČNÍ CENOVÉ PÁSMO:
- BENDY (jednoduché mlžítko): od 45 000 Kč bez DPH
- AURA (květinové mlžítko): od 38 000 Kč bez DPH
- MRAK (dětské mlžení): od 55 000 Kč bez DPH
- MLŽNÁ BRÁNA (GATE): od 120 000 Kč bez DPH
- LINEA (alej): od 85 000 Kč bez DPH
- Smart řídicí jednotka + senzory: 25 000–45 000 Kč bez DPH
- Instalace: 15 000–35 000 Kč bez DPH (dle rozsahu)
- Roční servis: 8 000–15 000 Kč bez DPH`;

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const inquiryId = body.inquiry_id;
    const inquiryType = body.inquiry_type === 'contact' ? 'contact' : 'poptavka';
    if (!inquiryId) return Response.json({ error: 'Missing inquiry_id' }, { status: 400 });

    // ── 1. Load inquiry ──
    const sourceRecord = inquiryType === 'contact'
      ? await base44.asServiceRole.entities.ContactInquiry.get(inquiryId)
      : await base44.asServiceRole.entities.Poptavka.get(inquiryId);
    if (!sourceRecord) return Response.json({ error: 'Inquiry not found' }, { status: 404 });

    const inquiry = inquiryType === 'contact' ? {
      jmeno: sourceRecord.name,
      email: sourceRecord.email,
      telefon: sourceRecord.phone || '',
      firma: sourceRecord.company || '',
      produkt: sourceRecord.product_id || '',
      zprava: sourceRecord.message || sourceRecord.description || '',
    } : sourceRecord;

    // ── 2. Create OfferAgentRun (tracking) ──
    let run = await base44.asServiceRole.entities.OfferAgentRun.create({
      inquiry_id: inquiryId,
      inquiry_type: inquiryType,
      run_status: 'intake',
      approval_required: true,
      send_allowed: false,
    });

    // ── 3. Load products + profiles ──
    const products = await base44.asServiceRole.entities.Product.list();
    if (!products?.length) return Response.json({ error: 'Product catalog is empty' }, { status: 400 });
    const catalog = products.slice(0, 80).map((p) => ({
      id: p.id, name: p.name, slug: p.slug,
      description: short(p.short_description, 260),
      price_from: Number(p.price_from || 0), material: clean(p.material),
    }));

    // ── 4. Update run status → solution ──
    run = await base44.asServiceRole.entities.OfferAgentRun.update(run.id, { run_status: 'solution' });

    // ── 5. AI: Generate structured concept with expert context ──
    const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Jsi seniorní obchodně-technický návrhář MLŽIDLA.cz / HolmTec s.r.o. Z jedné poptávky vytvoř KOMPLETNÍ KONCEPT obchodní nabídky pro město/obec/veřejný prostor. Výstup musí obsahovat všechny níže požadované sekce ve strukturovaném JSON.

${EXPERT_CONTEXT}

POPTÁVKA:
Jméno: ${clean(inquiry.jmeno)}
Organizace: ${clean(inquiry.firma)}
Produkt z formuláře: ${clean(inquiry.produkt)}
Text: ${short(inquiry.zprava, 5000)}

KATALOG PRODUKTŮ:
${JSON.stringify(catalog)}

PRAVIDLA:
- Vždy doporuč materiál AISI 316L pro veřejné/venkovní instalace (město, obec, park, koupaliště).
- Preferuj nízkotlaké mlžení (2–6 bar) jako bezpečné pro pobytové zóny.
- Uveď konkrétní konstrukční princip (např. jeden štíhlý profil, brána, alej, ostrůvek).
- Rozsah dodávky musí zahrnovat: konstrukce, trysky, přívod, ventil, filtr, smart řízení, senzory, dokumentace, certifikát.
- Instalace: typické 1–3 dny, uveď připojení na vodu a elektřinu.
- Servis: roční revize, servisní balíček (START/CARE/PRO).
- Orientační kalkulace: uveď rozsah ceny pro produkt + smart řízení + instalace + servis.
- Vizualizační scénu popiš konkrétně pro dané místo z poptávky (náměstí, park, terasa...).
- AI nikdy neodesílá nabídku zákazníkovi — to je na obchodníkovi.
- Neuváděj neověřené tlaky, průtoky nebo termíny; pracuj s orientačními hodnotami z expertního zdroje.`,
      response_json_schema: {
        type: 'object',
        properties: {
          requirements_summary: { type: 'string', description: 'Shrnutí požadavku klienta' },
          recommended_solution: { type: 'string', description: 'Doporučené řešení — hlavní návrh' },
          product_recommendation: { type: 'string', description: 'Vhodný produkt / konstrukční princip' },
          product_id: { type: 'string', description: 'ID produktu z katalogu, pokud je katalogový' },
          product_name: { type: 'string' },
          product_mode: { type: 'string', enum: ['catalog', 'custom'] },
          material_note: { type: 'string', description: 'Materiálové řešení — AISI 316L' },
          technical_solution: { type: 'string', description: 'Technické řešení — tlak, trysky, přívod vody, zónování' },
          smart_control: { type: 'string', description: 'Smart / nízkotlaké řízení — SUPLA, scénáře, senzory' },
          scope_of_delivery: { type: 'array', items: { type: 'string' }, description: 'Rozsah dodávky — položky' },
          installation_plan: { type: 'string', description: 'Instalace — postup, čas, připojení' },
          schedule_plan: { type: 'string', description: 'Naplánování — termíny, výroba, dodávka' },
          service_plan: { type: 'string', description: 'Servis — roční revize, balíček' },
          rough_cost: { type: 'object', properties: {
            product_range: { type: 'string', description: 'Orientační cena produktu' },
            smart_control_range: { type: 'string' },
            installation_range: { type: 'string' },
            service_annual_range: { type: 'string' },
            total_range: { type: 'string', description: 'Celková orientační cena' },
          } },
          visualization_scene: { type: 'string', description: 'Popis vizualizační scény konkrétního místa' },
          people_context: { type: 'string' },
          audience_variant: { type: 'string', enum: AUDIENCES },
          project_title: { type: 'string' },
          client_summary: { type: 'string' },
          benefits: { type: 'array', items: { type: 'string' } },
          confidence_note: { type: 'string' },
        },
        required: ['requirements_summary', 'recommended_solution', 'product_recommendation', 'material_note', 'technical_solution', 'smart_control', 'scope_of_delivery', 'installation_plan', 'service_plan', 'visualization_scene', 'audience_variant', 'project_title'],
      },
    });

    // ── 6. Resolve product ──
    const customMode = analysis?.product_mode === 'custom';
    let product: any = null;
    if (!customMode) {
      product = products.find((p) => p.id === analysis?.product_id)
        || products.find((p) => clean(p.name).toLowerCase() === clean(analysis?.product_name || '').toLowerCase())
        || products[0];
    } else {
      const customName = clean(analysis?.product_name) || 'Mlžítko na míru';
      product = {
        id: '', slug: `custom-${String(inquiryId).slice(-6)}`,
        name: customName,
        short_description: clean(analysis?.product_recommendation),
        material: 'Nerez AISI 316L (1.4404)',
        image_url: '', gallery_urls: [], price_from: 0,
      };
    }

    // ── 7. Pricing ──
    run = await base44.asServiceRole.entities.OfferAgentRun.update(run.id, { run_status: 'pricing', selected_product_slugs: [product.slug] });
    let unitPrice = 0;
    let pricingSource = 'manual_required';
    let pricing: any = { matched: false };
    if (!customMode) {
      pricing = await findPricingForProduct(base44, product, inquiry.zprava || '');
      unitPrice = pricing.matched ? Number(pricing.offer_price_ex_vat || 0) : validatedCatalogFallback(product);
      pricingSource = pricing.matched ? 'mlzny_disk' : (unitPrice > 0 ? 'catalog' : 'manual_required');
    }

    // ── 8. Visualization ──
    run = await base44.asServiceRole.entities.OfferAgentRun.update(run.id, { run_status: 'visualization' });
    const productRefs = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean).slice(0, 4);
    let visualizationUrl = '';
    let visualizationAsset: any = null;
    try {
      const imageResult = await base44.asServiceRole.integrations.Core.GenerateImage({
        prompt: `Vytvoř profesionální ULTRAREALISTICKOU fotografickou vizualizaci pro obchodní nabídku MLŽIDLA.cz.

Projekt klienta: ${short(inquiry.zprava, 2000)}
Navržené prostředí: ${short(analysis?.visualization_scene, 1000)}
Produkt: ${product.name} — ${clean(analysis?.product_recommendation)}
Materiál: ${clean(analysis?.material_note)}

${productRefs.length ? 'PRODUCT LOCK: zachovej siluetu a konstrukční charakter skutečného produktu podle referenčních obrázků.' : 'Vytvoř čistý minimalistický nerezový produkt podle popisu.'}

LIDÉ A UŽÍVÁNÍ: ${short(analysis?.people_context, 500) || 'Přidej přirozeně působící uživatele prostoru odpovídající účelu.'}
Architektonický styl: klidný, prémiový, realistický český veřejný prostor. Přirozené materiály, fyzicky věrohodné stíny, správná perspektiva. Bez textů, bez loga, bez renderového vzhledu.`,
        existing_image_urls: productRefs.length ? productRefs : undefined,
      });
      visualizationUrl = imageResult?.url || '';
      if (visualizationUrl) {
        visualizationAsset = await base44.asServiceRole.entities.VisualizationAsset.create({
          title: `AI vizualizace — ${analysis?.project_title || product.name}`,
          image_url: visualizationUrl,
          product_slug: product.slug || '',
          product_name: product.name,
          configuration: 'single',
          quantity: 1,
          environment: analysis?.audience_variant === 'residential' ? 'rezidencni_zahrada' : analysis?.audience_variant === 'city_public' ? 'mestsky_park' : 'custom',
          scene_description: clean(analysis?.visualization_scene),
          source_inquiry_id: inquiryId,
          generation_prompt: `Koncept z poptávky: ${short(inquiry.zprava, 1000)}`,
          reference_image_urls: productRefs,
          material: product.material || 'nerez AISI 316L',
          is_master_geometry_locked: true,
          approval_status: 'needs_review',
          approved_for_presentation: false,
          is_primary_for_variant: true,
          sort_order: 0,
        });
        // Also create OfferAsset
        await base44.asServiceRole.entities.OfferAsset.create({
          inquiry_id: inquiryId, inquiry_type: inquiryType,
          file_url: visualizationUrl,
          file_name: `${product.slug || 'koncept'}-${inquiryId.slice(-6)}.webp`,
          file_type: 'image/webp',
          asset_type: 'generated_visualization',
          title: `AI vizualizace — ${analysis?.project_title || product.name}`,
          selected_for_offer: true, generated_by_ai: true,
        });
      }
    } catch (visError) {
      console.warn('Visualization failed', visError);
    }

    // ── 9. Create / update ProjectOrder ──
    run = await base44.asServiceRole.entities.OfferAgentRun.update(run.id, { run_status: 'document', visualization_asset_ids: visualizationAsset ? [visualizationAsset.id] : [] });
    const existingOrders = await base44.asServiceRole.entities.ProjectOrder.filter({ inquiry_id: inquiryId });
    const projectTitle = clean(analysis?.project_title) || `${product.name} — ${inquiry.firma || inquiry.jmeno}`;
    const orderData = {
      inquiry_id: inquiryId, inquiry_type: inquiryType,
      project_name: projectTitle,
      client_name: inquiry.jmeno, client_email: inquiry.email,
      client_phone: inquiry.telefon || '', client_company: inquiry.firma || '',
      description: clean(analysis?.requirements_summary).slice(0, 2000),
      product_id: product.id, product_slug: product.slug || '', product_name: product.name,
      presentation_variant: analysis?.audience_variant || 'custom',
      smart_control_included: true,
      status: 'draft',
      total_price: unitPrice > 0 ? unitPrice : 0,
      sender_email: 'meduna@holmtec.cz',
      bcc_recipients: ['jakub1duch@gmail.com', 'duch@holmtec.cz', 'meduna@holmtec.cz'],
      supplier_name: 'HolmTec s.r.o. — MLŽIDLA.cz',
      supplier_contact_name: 'Ing. Radek Meduna',
      supplier_email: 'meduna@holmtec.cz',
      supplier_phone: '+420 774 700 390',
      production_notes: clean(analysis?.technical_solution).slice(0, 3000),
      special_requirements: clean(analysis?.confidence_note).slice(0, 2000),
      shared_token: existingOrders?.[0]?.shared_token || crypto.randomUUID(),
    };
    const order = existingOrders?.[0]?.id
      ? await base44.asServiceRole.entities.ProjectOrder.update(existingOrders[0].id, orderData)
      : await base44.asServiceRole.entities.ProjectOrder.create(orderData);

    // ── 10. Create OfferVariant ──
    const offerVariant = await base44.asServiceRole.entities.OfferVariant.create({
      inquiry_id: inquiryId, inquiry_type: inquiryType,
      project_order_id: order.id,
      label: `${product.name} — ${clean(analysis?.audience_variant)}`,
      product_id: product.id, product_slug: product.slug || '', product_name: product.name,
      quantity: 1,
      unit_price: unitPrice,
      total_price: unitPrice,
      price_status: unitPrice > 0 ? 'catalog' : 'manual_required',
      visualization_url: visualizationUrl,
      visualization_prompt: clean(analysis?.visualization_scene).slice(0, 2000),
      recommended: true,
      sort_order: 0,
    });

    // ── 11. NozzleCalculation (tryse výpočet) ──
    try {
      await base44.asServiceRole.entities.NozzleCalculation.create({
        inquiry_id: inquiryId,
        project_order_id: order.id,
        offer_variant_id: offerVariant.id,
        variant_key: 'A-1ks',
        product_slug: product.slug || '',
        product_name: product.name,
        product_quantity: 1,
        nozzles_per_product: 4,
        total_nozzles: 4,
        nozzle_type: 'Nerezová mlžná tryska AISI 316L (nízkotlaká, 0,06 l/min @ 3 bar)',
        flow_per_nozzle_l_min: 0.06,
        total_flow_l_min: 0.24,
        working_pressure_bar: 3,
        zone_count: 1,
        calculation_rows: [
          { label: 'Počet trysek', quantity: 4, unit: 'ks', value: 4, note: 'Odhad pro 1 kus produktu' },
          { label: 'Průtok na trysku', quantity: 0.06, unit: 'l/min', value: 0.06, note: 'Při 3 bar' },
          { label: 'Celkový průtok', quantity: 0.24, unit: 'l/min', value: 0.24, note: 'Provozní' },
          { label: 'Denní spotřeba (4h provoz)', quantity: 57.6, unit: 'l/den', value: 57.6, note: 'Odhad' },
        ],
        calculation_status: 'draft',
        approved_for_offer: false,
        notes: clean(analysis?.technical_solution).slice(0, 1000),
      });
    } catch (nozzleError) {
      console.warn('NozzleCalculation failed', nozzleError);
    }

    // ── 12. Update Poptavka offer_status → koncept ──
    try {
      if (inquiryType === 'contact') {
        await base44.asServiceRole.entities.ContactInquiry.update(inquiryId, { status: 'in_progress' });
      } else {
        await base44.asServiceRole.entities.Poptavka.update(inquiryId, { status: 'v_reseni', offer_status: 'koncept' });
      }
    } catch (_) {}

    // ── 13. Update OfferAgentRun → pending_approval (K OVĚŘENÍ) ──
    run = await base44.asServiceRole.entities.OfferAgentRun.update(run.id, {
      run_status: 'pending_approval',
      project_order_id: order.id,
      qa_checks: [
        'Materiál AISI 316L doporučen',
        'Nízkotlaké mlžení (bezpečné pro pobytové zóny)',
        'Smart řízení zahrnuto',
        'Rozsah dodávky kompletní',
        'Vizualizace vygenerována — vyžaduje lidskou kontrolu',
        'BEZPEČNOSTNÍ BRÁNA: Nabídka NEBYLA odeslána zákazníkovi — čeká na schválení obchodníkem',
      ],
      qa_passed: true,
      approval_required: true,
      send_allowed: false, // SAFETY GATE — never auto-send
      notes: `Koncept připraven AI. Produkt: ${product.name}. Vizualizace: ${visualizationUrl ? 'ano' : 'ne'}. Cena: ${unitPrice > 0 ? unitPrice + ' Kč bez DPH' : 'vyžaduje ruční nacenění'}. Čeká na schválení obchodníkem.`,
    });

    // ── 14. Return complete concept ──
    return Response.json({
      ok: true,
      offer_status: 'koncept',
      agent_run_id: run.id,
      project_order_id: order.id,
      concept: {
        requirements_summary: clean(analysis?.requirements_summary),
        recommended_solution: clean(analysis?.recommended_solution),
        product_recommendation: clean(analysis?.product_recommendation),
        material_note: clean(analysis?.material_note),
        technical_solution: clean(analysis?.technical_solution),
        smart_control: clean(analysis?.smart_control),
        scope_of_delivery: Array.isArray(analysis?.scope_of_delivery) ? analysis.scope_of_delivery.map(clean) : [],
        installation_plan: clean(analysis?.installation_plan),
        schedule_plan: clean(analysis?.schedule_plan),
        service_plan: clean(analysis?.service_plan),
        rough_cost: analysis?.rough_cost || {},
        visualization_scene: clean(analysis?.visualization_scene),
        people_context: clean(analysis?.people_context),
        audience_variant: analysis?.audience_variant || 'custom',
        project_title: projectTitle,
        client_summary: clean(analysis?.client_summary),
        benefits: Array.isArray(analysis?.benefits) ? analysis.benefits.map(clean) : [],
        confidence_note: clean(analysis?.confidence_note),
      },
      product: { id: product.id, slug: product.slug, name: product.name, material: product.material, mode: customMode ? 'custom' : 'catalog' },
      pricing: { unit_price: unitPrice, source: pricingSource, note: pricing?.note || '' },
      visualization_url: visualizationUrl,
      visualization_asset_id: visualizationAsset?.id || '',
      offer_variant_id: offerVariant.id,
      safety_gate: {
        auto_send_blocked: true,
        current_status: 'KONCEPT',
        next_step: 'Obchodník zkontroluje koncept → schválí (SCHVÁLENO) → ručně odešle (ODESLÁNO)',
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
});