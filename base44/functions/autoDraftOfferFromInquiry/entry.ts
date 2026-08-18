import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { CUSTOM_COST_KEYS, estimateCustomConceptPricing, findPricingForProduct, validatedCatalogFallback } from '../../shared/pricingSheet.ts';

const AUDIENCES = ['city_public', 'residential', 'wellness_hospitality', 'architecture_design', 'custom'];

const clean = (value: unknown) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const short = (value: unknown, max = 1200) => clean(value).slice(0, max);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const inquiryId = body?.inquiry_id || body?.event?.entity_id || body?.data?.id;
    const inquiryType = body?.inquiry_type === 'contact' ? 'contact' : 'poptavka';
    const force = Boolean(body?.force);
    if (!inquiryId) return Response.json({ error: 'Missing inquiry id' }, { status: 400 });

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

    const existingOrders = await base44.asServiceRole.entities.ProjectOrder.filter({ inquiry_id: inquiryId });
    if (!force && existingOrders?.length) {
      const existingAssets = await base44.asServiceRole.entities.OfferAsset.filter({ inquiry_id: inquiryId });
      const visual = (existingAssets || []).find((item) => item.asset_type === 'generated_visualization');
      return Response.json({
        ok: true,
        reused: true,
        project_order: existingOrders[0],
        visualization_url: visual?.file_url || '',
        product_id: existingOrders[0]?.product_id || '',
        product_slug: existingOrders[0]?.product_slug || '',
        audience_variant: existingOrders[0]?.presentation_variant || 'custom',
      });
    }

    const products = await base44.asServiceRole.entities.Product.list();
    if (!products?.length) return Response.json({ error: 'Product catalog is empty' }, { status: 400 });

    const catalog = products.slice(0, 80).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: short(product.short_description, 260),
      price_from: Number(product.price_from || 0),
      material: clean(product.material),
    }));

    const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Jsi seniorní obchodně-technický návrhář MLŽIDLA.cz / HolmTec. Z textové poptávky vytvoř pracovní koncept obchodní nabídky. Neomezuj se pouze na katalog: nejprve rozhodni product_mode = \"catalog\" nebo \"custom\". Katalog použij, když existující produkt opravdu odpovídá zadání. Pokud klient žádá vlastní tvar, symbol, atypické řešení, nový rozměr nebo produkt, který v katalogu není, zvol product_mode = \"custom\" a navrhni nový, reálně vyrobitelný koncept. Pokud text zmiňuje BENDY nebo jednoduchý tvar J a nepožaduje zásadně jiný tvar, preferuj skutečný produkt BENDY. Z textu VŽDY vytěž požadovaný počet kusů: například 1 kus = requested_quantity 1, tři kusy = 3. Pokud počet není uveden, použij 1. Pokud klient žádá více variant, alternativ, konfigurací nebo počtů, vypiš je do requested_variants (např. [\"1 ks\",\"3 ks\"] nebo [\"BENDY\",\"LINEA\"]) a všechny explicitně požadované počty současně vrať číselně v requested_quantities (např. [1,3]). visualization_scenes musí obsahovat jednu konkrétní fotorealistickou scénu pro každou požadovanou variantu; pokud varianty nejsou požadované, jednu scénu. Vždy také odvoď people_context: kdo bude prostor přirozeně používat podle poptávky. Pokud jde o domov pro seniory, seniorskou zahradu, sociální nebo zdravotní zařízení, uveď starší dospělé osoby cca 65+ v přirozených situacích (chůze, posezení, rozhovor, případně doprovod/personál). U školy/školky uveď věkově odpovídající děti s dohledem dospělých, u sportoviště sportující návštěvníky, u náměstí běžné obyvatele a návštěvníky. Lidé mají podporovat měřítko, účel a atmosféru prostoru, nikdy nezakrývat produkt. Neimituj konkrétní skutečné osoby ani identitu klienta. Neuváděj ani nevymýšlej neověřené tlaky, průtoky, spotřebu nebo termíny. U katalogového produktu cenu nevymýšlej. U custom produktu ale vytvoř výrobní cost_plan pouze z níže uvedených povolených kalkulačních klíčů; cenu pak dopočítá systém z reálných sazeb MLŽNÉHO DISKU, ne LLM. Výstup musí být vhodný pro následné vytvoření klientské nabídky.

POPTÁVKA:
Jméno: ${clean(inquiry.jmeno)}
Organizace: ${clean(inquiry.firma)}
Produkt z formuláře: ${clean(inquiry.produkt)}
Text: ${short(inquiry.zprava, 5000)}

KATALOG PRODUKTŮ:
${JSON.stringify(catalog)}

Pravidla návrhu mlžítka: minimalistické, čisté, reálně vyrobitelné. Pro CUSTOM návrh preferuj jednoduchou výrobu: ideálně jeden souvislý trubkový profil nebo co nejméně dílů; pokud možno ohyby v jedné rovině; plynulé rádiusy bez zbytečně těsných nebo složených 3D ohybů; minimum svarů; minimum samostatných ramen; standardní trubky z kalkulační tabulky; patku/kotvení řeš jednoduše a servisovatelně; trysky osazuj přímo do hlavní konstrukce; připojení vody navrhni skrytě a dostupně pro servis. Čistá linie a proporce mají přednost před dekorativní složitostí. Návrh musí být vyrobitelný běžnými procesy dělení, ohýbání trubek, TIG/MIG svařování, broušení/saténování, závitování a testování. Pokud tvar vyžaduje složitou 3D geometrii, navrhni jednodušší ekvivalent se stejným vizuálním významem. Pro kalkulační základ používej standardní profily dostupné v tabulce: jekl 70×70×3 nebo trubky Ø76,1×3; Ø60,3×3,6; Ø52×3; Ø42,4×3,6; Ø40×3; Ø33,7×3. Materiálový základ kalkulace je nerez 1.4301 / AISI 304; pokud zadání výslovně požaduje AISI 316L, uveď requires_316l = true a systém přidá upozornění k přepočtu materiálu. U BENDY jeden štíhlý nerezový profil s jediným plynulým horním obloukem, žádné výhonky, větve, hadice, kabely ani přídavná ramena.\n\nPovolené cost_plan.rate_key hodnoty pro CUSTOM: ${CUSTOM_COST_KEYS.join(', ')}. Pro každý použitý klíč vrať realistické množství a krátké zdůvodnění. Nezapočítávej položku, kterou návrh nepotřebuje.`,
      response_json_schema: {
        type: 'object',
        properties: {
          product_mode: { type: 'string', enum: ['catalog', 'custom'] },
          product_id: { type: 'string' },
          product_name: { type: 'string' },
          custom_product: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              design_description: { type: 'string' },
              material: { type: 'string' },
              primary_profile: { type: 'string' },
              dimensions_summary: { type: 'string' },
              bend_strategy: { type: 'string' },
              weld_strategy: { type: 'string' },
              nozzle_strategy: { type: 'string' },
              water_connection_strategy: { type: 'string' },
              manufacture_steps: { type: 'array', items: { type: 'string' } },
              simplicity_score: { type: 'number' },
              requires_316l: { type: 'boolean' },
              cost_plan: { type: 'array', items: { type: 'object', properties: { rate_key: { type: 'string' }, quantity: { type: 'number' }, rationale: { type: 'string' } }, required: ['rate_key','quantity'] } },
              production_notes: { type: 'string' },
            },
          },
          audience_variant: { type: 'string', enum: AUDIENCES },
          project_title: { type: 'string' },
          client_summary: { type: 'string' },
          solution_summary: { type: 'string' },
          benefits: { type: 'array', items: { type: 'string' } },
          visual_scene: { type: 'string' },
          confidence_note: { type: 'string' },
          requested_quantity: { type: 'integer' },
          requested_variants: { type: 'array', items: { type: 'string' } },
          requested_quantities: { type: 'array', items: { type: 'integer' } },
          visualization_scenes: { type: 'array', items: { type: 'string' } },
          people_context: { type: 'string' },
        },
        required: ['product_mode', 'audience_variant', 'project_title', 'client_summary', 'solution_summary', 'visual_scene', 'requested_quantity'], 
      },
    });

    let product = products.find((item) => item.id === analysis?.product_id);
    if (!product && analysis?.product_name) product = products.find((item) => clean(item.name).toLowerCase() === clean(analysis.product_name).toLowerCase());
    if (!product && inquiry.produkt) {
      const needle = clean(inquiry.produkt).toLowerCase();
      product = products.find((item) => `${item.name || ''} ${item.slug || ''}`.toLowerCase().includes(needle));
    }
    if (!product) product = products[0];

    // Ceník na MLŽNÉM DISKU je primární zdroj ceny. Katalog je jen bezpečný fallback.
    const pricing = await findPricingForProduct(base44, product, inquiry.zprava || '');
    const sheetUnitPrice = pricing.matched ? Number(pricing.offer_price_ex_vat || 0) : 0;
    const catalogFallbackPrice = validatedCatalogFallback(product);
    const unitPrice = sheetUnitPrice || catalogFallbackPrice;
    const pricingSource = sheetUnitPrice > 0 ? 'mlzny_disk' : catalogFallbackPrice > 0 ? 'catalog' : 'manual_required';

    const isBendy = /bendy/i.test(`${product.name || ''} ${product.slug || ''}`);
    const allProductRefs = [product.image_url, ...(product.gallery_urls || [])]
      .filter(Boolean)
      .filter((url, index, all) => all.indexOf(url) === index);
    const realProductRefs = allProductRefs.filter((url) => !/generated[_-]?image|copilot|gemini/i.test(String(url)));
    const refs = (realProductRefs.length ? realProductRefs : allProductRefs).slice(0, 4);
    const linkedAssets = await base44.asServiceRole.entities.OfferAsset.filter({ inquiry_id: inquiryId }).catch(() => []);
    const sourcePhoto = (linkedAssets || []).find((item) => item.asset_type === 'source_photo' && item.file_url)
      || (linkedAssets || []).find((item) => String(item.file_type || '').startsWith('image/') && item.asset_type !== 'generated_visualization' && item.file_url);
    const imageReferences = sourcePhoto?.file_url ? [sourcePhoto.file_url, ...refs].slice(0, 5) : refs;
    const sceneMode = sourcePhoto?.file_url
      ? `SCENE LOCK: PRVNÍ referenční obrázek je skutečná fotografie prostoru klienta. Zachovej jeho kompozici, perspektivu, architekturu, cesty, lavičky, zeleň, mobiliář, světlo a všechny existující prvky. Scénu nepřestavuj; pouze realisticky osaď vybraný produkt do vhodného místa.`
      : `TEXT CONCEPT MODE: klient nedodal použitelnou fotografii prostoru. Vytvoř proto věrohodnou ilustrační projektovou scénu podle textové poptávky a jasně ji pojmi jako koncept, nikoli jako dokumentaci skutečného stavu.`;
    const productLock = isBendy
      ? `BENDY PRODUCT LOCK: zachovej čistý reálný výrobek podle referencí. Jedna štíhlá broušená nerezová trubka, rovný svislý dřík a jediný plynulý horní oblouk. U každého samostatného BENDY zobraz maximálně 2 malé reálné kovové trysky, pouze pokud jejich poloha odpovídá referenčním fotografiím skutečného produktu. Pokud je poloha trysek na referenci čitelná, kopíruj ji přesně. Nevymýšlej další trysky. Jemná mlha musí vycházet fyzicky pouze z otvorů těchto trysek a ve směru jejich skutečné orientace; žádná mlha nesmí vznikat z povrchu trubky, spojů, patky ani z volného prostoru. Žádné výhonky, větve, hadice, kabely, boční trubky, přídavná ramena, dekorace ani sekundární konstrukce.`
      : `PRODUCT LOCK: zachovej siluetu, proporce, materiál a konstrukční charakter skutečného produktu podle referenčních obrázků. Produkt kreativně nepřepracovávej. Zachovej počet nosných trubek/profilů, typ ohybů, spoje, patku nebo kotvení a skutečné umístění trysek. Nevytvářej hybrid více různých výrobků.`;

    const requestedQuantity = Math.max(1, Math.min(100, Number(analysis?.requested_quantity || 1)));
    const requestedVariants = Array.isArray(analysis?.requested_variants) ? analysis.requested_variants.map(clean).filter(Boolean).slice(0, 4) : [];
    const requestedQuantities = Array.isArray(analysis?.requested_quantities)
      ? analysis.requested_quantities.map((value) => Math.max(1, Math.min(100, Number(value || 1)))).filter((value, index, all) => all.indexOf(value) === index).slice(0, 4)
      : [];
    const visualizationScenes = Array.isArray(analysis?.visualization_scenes) && analysis.visualization_scenes.length
      ? analysis.visualization_scenes.map(clean).filter(Boolean).slice(0, 4)
      : [clean(analysis?.visual_scene)].filter(Boolean);
    // Pokud klient uvede více počtů (např. „nacenit 1 ks a 3 ks“), každý počet je samostatná cenová i vizuální varianta.
    // Pokud LLM vrátí jen textové varianty, množství vytěžíme i z jejich názvů.
    const quantityVariantsFromLabels = requestedVariants.map((label) => {
      const match = label.match(/(\d+)\s*(?:ks|kus|kusy|kusů)?/i);
      return match ? Math.max(1, Math.min(100, Number(match[1]))) : null;
    }).filter(Boolean) as number[];
    const allRequestedQuantities = [...requestedQuantities, ...quantityVariantsFromLabels]
      .filter((value, index, all) => all.indexOf(value) === index);
    const variantLabels = requestedVariants.length
      ? requestedVariants
      : allRequestedQuantities.length > 1
        ? allRequestedQuantities.map((quantity) => `${quantity} ks ${product.name}`)
        : [`${requestedQuantity} ks ${product.name}`];
    const variantSpecs = variantLabels.map((label, index) => {
      const quantityMatch = label.match(/(\d+)\s*(?:ks|kus|kusy|kusů)?/i);
      const quantity = quantityMatch ? Math.max(1, Number(quantityMatch[1])) : (allRequestedQuantities[index] || requestedQuantity);
      return { label, quantity, unit_price: unitPrice, price: unitPrice > 0 ? unitPrice * quantity : 0 };
    });

    const generatedVisualizations: any[] = [];
    for (let variantIndex = 0; variantIndex < variantSpecs.length; variantIndex += 1) {
      const variant = variantSpecs[variantIndex];
      try {
        const imageParams: any = {
        prompt: `Vytvoř profesionální ULTRAREALISTICKOU fotografickou vizualizaci pro obchodní nabídku MLŽIDLA.cz.

${sceneMode}

Projekt klienta: ${short(inquiry.zprava, 2200)}
Navržené prostředí: ${short(visualizationScenes[variantIndex] || visualizationScenes[0] || analysis?.visual_scene, 1200)}
Varianta nabídky: ${variant.label}. Na scéně zobraz přesně ${variant.quantity} ks stejného vybraného produktu, pokud text varianty výslovně nepožaduje jiný katalogový typ.
Vybraný produkt: ${product.name}.
${productLock}

LIDÉ A REÁLNÉ UŽÍVÁNÍ PROSTORU: ${short(analysis?.people_context, 700) || 'Přidej několik přirozeně působících uživatelů odpovídajících účelu prostoru podle poptávky.'} Pokud poptávka zmiňuje domov pro seniory, seniory, pečovatelskou službu nebo obdobné zařízení, zobraz několik starších dospělých osob přibližně 65+, přirozeně oblečených, část při klidné chůzi a část při posezení či rozhovoru; lze přidat jednoho člena personálu nebo doprovodu. Osoby nesmí působit aranžovaně, nesmí překrývat konstrukci ani trysky a nesmí být dominantnější než návrh mlžítka. Nezobrazuj známé ani konkrétní skutečné osoby.

PRODUCT IDENTITY CHECK: produkt musí být na první pohled totožný s MASTER referencemi. Pokud jsou reference fotografie produktu, dej geometrické a konstrukční přesnosti přednost před estetickou stylizací. Přesně dodrž počet ${variant.quantity} ks; jednotlivé kusy neslučuj, nezrcadli do nového tvaru a nevytvářej další kusy v pozadí. Trysky musí být malé kovové komponenty fyzicky osazené přímo do konstrukce a jejich poloha, počet a orientace se musí řídit skutečnými referencemi produktu. Mlha smí vycházet výhradně z trysek a musí začínat přesně v jejich ústí; vytvoř jemný krátký kužel mlhy, který se přirozeně rozptyluje do vzduchu. Nepřidávej viditelné hadice ani kabely, pokud nejsou součástí MASTER reference.

Architektonický styl: klidný, prémiový, realistický, český veřejný nebo zahradní prostor podle zadání. Prvek osaď bezpečně k pěší trase nebo pobytové zóně, ne jako překážku. Přidej pouze jemnou realistickou mlhu z viditelných kovových trysek. Bez louží, bez grafických overlayů, bez textů, bez loga, bez nereálných světelných efektů. Výsledek má být použitelný jako vizuální návrh v klientské prezentaci.`,
        existing_image_urls: imageReferences,
      };
        const imageResult = await base44.asServiceRole.integrations.Core.GenerateImage(imageParams);
        if (imageResult?.url) generatedVisualizations.push({ url: imageResult.url, label: variant.label, quantity: variant.quantity });
      } catch (visualError) {
        console.warn('Auto visualization failed', visualError);
      }
    }
    const visualizationUrl = generatedVisualizations[0]?.url || '';

    const audienceVariant = AUDIENCES.includes(analysis?.audience_variant) ? analysis.audience_variant : 'custom';
    const projectTitle = clean(analysis?.project_title) || `${product.name} — ${inquiry.firma || inquiry.jmeno}`;
    const clientSummary = clean(analysis?.client_summary) || short(inquiry.zprava, 1200);
    const solutionSummary = clean(analysis?.solution_summary) || clean(product.short_description) || `Návrh řešení ${product.name}`;
    const benefits = Array.isArray(analysis?.benefits) ? analysis.benefits.map(clean).filter(Boolean).slice(0, 5) : [];

    let order = existingOrders?.[0] || null;
    const orderData = {
      inquiry_id: inquiryId,
      inquiry_type: inquiryType,
      project_name: projectTitle,
      client_name: inquiry.jmeno,
      client_email: inquiry.email,
      client_phone: inquiry.telefon || '',
      client_company: inquiry.firma || '',
      description: `${clientSummary}\n\nNavržené řešení: ${solutionSummary}${benefits.length ? `\n\nPřínosy: ${benefits.join(' · ')}` : ''}`.slice(0, 2000),
      product_id: product.id,
      product_slug: product.slug || '',
      product_name: product.name,
      presentation_variant: audienceVariant,
      smart_control_included: false,
      status: 'draft',
      total_price: unitPrice > 0 ? unitPrice * requestedQuantity : 0,
      sender_email: 'meduna@holmtec.cz',
      bcc_recipients: ['jakub1duch@gmail.com', 'duch@holmtec.cz', 'meduna@holmtec.cz'],
      supplier_name: 'HolmTec s.r.o. — MLŽIDLA.cz',
      supplier_contact_name: 'Ing. Radek Meduna',
      supplier_email: 'meduna@holmtec.cz',
      supplier_phone: '+420 774 700 390',
      customer_message: `Automaticky připravený koncept z textové poptávky. ${clean(analysis?.confidence_note)}`.slice(0, 1000),
      shared_token: order?.shared_token || crypto.randomUUID(),
    };

    order = order?.id
      ? await base44.asServiceRole.entities.ProjectOrder.update(order.id, orderData)
      : await base44.asServiceRole.entities.ProjectOrder.create(orderData);

    const visualAssets = [];
    const visualizationDbAssets = [];
    const offerVariants = [];
    for (let i = 0; i < generatedVisualizations.length; i += 1) {
      const visual = generatedVisualizations[i];
      const variant = variantSpecs[i] || variantSpecs[0];
      const variantKey = `${String.fromCharCode(65 + i)}-${variant.quantity}ks`;
      const asset = await base44.asServiceRole.entities.OfferAsset.create({
        inquiry_id: inquiryId,
        inquiry_type: inquiryType,
        project_order_id: order.id,
        file_url: visual.url,
        file_name: `${product.slug || 'mlzitko'}-${inquiryId.slice(-6)}-varianta-${i + 1}-${Date.now()}.webp`,
        file_type: 'image/webp',
        asset_type: 'generated_visualization',
        title: `AI vizualizace — ${visual.label}`,
        description: `${sourcePhoto?.file_url ? `Ultrarealistická varianta ${visual.label} vytvořená podle textu poptávky a fotografie prostoru.` : `Ultrarealistická konceptuální varianta ${visual.label} vytvořená podle textu poptávky.`}${analysis?.people_context ? ` Uživatelé prostoru: ${clean(analysis.people_context)}` : ''}`.slice(0, 1000),
        selected_for_offer: true,
        generated_by_ai: true,
      });
      visualAssets.push(asset);

      try {
        const visualizationAsset = await base44.asServiceRole.entities.VisualizationAsset.create({
          title: `AI vizualizace — ${visual.label}`,
          image_url: visual.url,
          product_slug: product.slug || '',
          product_name: product.name,
          configuration: visual.quantity === 1 ? 'single' : visual.quantity === 2 ? 'duo' : visual.quantity === 3 ? 'trio' : 'custom',
          quantity: visual.quantity,
          environment: audienceVariant === 'residential' ? 'rezidencni_zahrada' : audienceVariant === 'city_public' ? 'mestsky_park' : 'custom',
          scene_description: `${visualizationScenes[i] || visualizationScenes[0] || analysis?.visual_scene || ''}${analysis?.people_context ? ` Uživatelé prostoru: ${clean(analysis.people_context)}` : ''}`.trim(),
          source_inquiry_id: inquiryId,
          offer_variant_key: variantKey,
          generation_prompt: `Automatická vizualizace z textu poptávky: ${short(inquiry.zprava, 1500)}${analysis?.people_context ? ` | Kontext osob: ${short(analysis.people_context, 300)}` : ''}`,
          reference_image_urls: imageReferences,
          material: product.material || 'nerez',
          is_master_geometry_locked: true,
          approval_status: 'needs_review',
          approved_for_presentation: false,
          is_primary_for_variant: true,
          sort_order: i,
        });
        visualizationDbAssets.push(visualizationAsset);

        const offerVariant = await base44.asServiceRole.entities.OfferVariant.create({
          project_order_id: order.id,
          inquiry_id: inquiryId,
          variant_key: variantKey,
          variant_name: visual.label || variant.label,
          product_slug: product.slug || '',
          product_name: product.name,
          quantity: variant.quantity,
          configuration: variant.quantity === 1 ? 'single' : variant.quantity === 2 ? 'duo' : variant.quantity === 3 ? 'trio' : 'custom',
          environment: audienceVariant,
          unit_price: unitPrice,
          products_subtotal: unitPrice > 0 ? unitPrice * variant.quantity : 0,
          total_price: unitPrice > 0 ? unitPrice * variant.quantity : 0,
          price_status: unitPrice > 0 ? 'complete' : 'missing_price',
          line_items: unitPrice > 0 ? [{ label: product.name, quantity: variant.quantity, unit: 'ks', unit_price: unitPrice, total: unitPrice * variant.quantity, source: pricingSource === 'mlzny_disk' ? pricing.source : 'Product.price_from' }] : [],
          visualization_asset_ids: [visualizationAsset.id],
          primary_visualization_id: visualizationAsset.id,
          presentation_title: visual.label || variant.label,
          presentation_text: solutionSummary,
          status: 'needs_review',
          sort_order: i,
        });
        offerVariants.push(offerVariant);

      } catch (dbError) {
        console.warn('Variant / visualization DB indexing failed', dbError);
      }
    }
    const asset = visualAssets[0] || null;

    try {
      if (inquiryType === 'contact') await base44.asServiceRole.entities.ContactInquiry.update(inquiryId, { status: 'in_progress' });
      else await base44.asServiceRole.entities.Poptavka.update(inquiryId, { status: 'v_reseni' });
    } catch (_) {}

    return Response.json({
      ok: true,
      reused: false,
      project_order: order,
      visualization_asset: asset,
      visualization_url: visualizationUrl,
      product_id: product.id,
      product_slug: product.slug || '',
      product_name: product.name,
      product_price_from: unitPrice,
      pricing: {
        source: pricingSource,
        source_label: pricingSource === 'mlzny_disk' ? pricing.source : pricingSource === 'catalog' ? 'Katalog Product.price_from' : 'Ruční nacenění',
        sheet_key: pricing.sheet_key || '',
        sheet_spec: pricing.sheet_spec || '',
        unit_price: unitPrice,
        note: pricing.note || '',
      },
      requested_quantity: requestedQuantity,
      requested_variants: variantSpecs.map((variant) => ({ ...variant, price: unitPrice > 0 ? unitPrice * variant.quantity : 0, price_source: pricingSource, pricing_label: pricingSource === 'mlzny_disk' ? pricing.source : pricingSource })),
      visualization_urls: generatedVisualizations.map((item) => item.url),
      visualization_assets: visualAssets,
      visualization_db_assets: visualizationDbAssets,
      offer_variants: offerVariants,
      audience_variant: audienceVariant,
      ai_content: {
        project_goal: clientSummary,
        solution_summary: `${solutionSummary}${variantSpecs.length ? ` Nabídka počítá s variantami: ${variantSpecs.map((variant) => `${variant.label}${unitPrice > 0 ? ` — ${new Intl.NumberFormat('cs-CZ').format(unitPrice * variant.quantity)} Kč bez DPH` : ''}`).join('; ')}.` : ''}`,
        benefits,
        next_step: 'Po odsouhlasení konceptu upřesníme technické návaznosti, rozsah dodávky a finální cenu.',
        presentation_title: projectTitle,
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
});
