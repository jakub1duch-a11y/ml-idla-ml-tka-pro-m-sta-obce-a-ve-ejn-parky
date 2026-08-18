import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

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
      prompt: `Jsi seniorní obchodně-technický návrhář MLŽIDLA.cz / HolmTec. Z textové poptávky vytvoř pracovní koncept obchodní nabídky. Vyber pouze existující produkt z katalogu níže. Pokud text zmiňuje BENDY nebo jednoduchý tvar J, preferuj skutečný produkt BENDY. Z textu VŽDY vytěž požadovaný počet kusů: například 1 kus = requested_quantity 1, tři kusy = 3. Pokud počet není uveden, použij 1. Pokud klient žádá více variant, alternativ, konfigurací nebo počtů, vypiš je do requested_variants (např. [\"1 ks\",\"3 ks\"] nebo [\"BENDY\",\"LINEA\"]). visualization_scenes musí obsahovat jednu konkrétní fotorealistickou scénu pro každou požadovanou variantu; pokud varianty nejsou požadované, jednu scénu. Neuváděj ani nevymýšlej neověřené tlaky, průtoky, spotřebu, termíny nebo jednotkové ceny mimo katalog. Výstup musí být vhodný pro následné vytvoření klientské nabídky.

POPTÁVKA:
Jméno: ${clean(inquiry.jmeno)}
Organizace: ${clean(inquiry.firma)}
Produkt z formuláře: ${clean(inquiry.produkt)}
Text: ${short(inquiry.zprava, 5000)}

KATALOG PRODUKTŮ:
${JSON.stringify(catalog)}

Pravidla návrhu mlžítka: minimalistické, čisté, reálně vyrobitelné. U BENDY jeden štíhlý nerezový profil s jediným plynulým horním obloukem, žádné výhonky, větve, hadice, kabely ani přídavná ramena.`,
      response_json_schema: {
        type: 'object',
        properties: {
          product_id: { type: 'string' },
          product_name: { type: 'string' },
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
        },
        required: ['product_id', 'audience_variant', 'project_title', 'client_summary', 'solution_summary', 'visual_scene', 'requested_quantity'], 
      },
    });

    let product = products.find((item) => item.id === analysis?.product_id);
    if (!product && analysis?.product_name) product = products.find((item) => clean(item.name).toLowerCase() === clean(analysis.product_name).toLowerCase());
    if (!product && inquiry.produkt) {
      const needle = clean(inquiry.produkt).toLowerCase();
      product = products.find((item) => `${item.name || ''} ${item.slug || ''}`.toLowerCase().includes(needle));
    }
    if (!product) product = products[0];

    const isBendy = /bendy/i.test(`${product.name || ''} ${product.slug || ''}`);
    const refs = [product.image_url, ...(product.gallery_urls || [])]
      .filter(Boolean)
      .filter((url, index, all) => all.indexOf(url) === index)
      .slice(0, 4);
    const linkedAssets = await base44.asServiceRole.entities.OfferAsset.filter({ inquiry_id: inquiryId }).catch(() => []);
    const sourcePhoto = (linkedAssets || []).find((item) => item.asset_type === 'source_photo' && item.file_url)
      || (linkedAssets || []).find((item) => String(item.file_type || '').startsWith('image/') && item.asset_type !== 'generated_visualization' && item.file_url);
    const imageReferences = sourcePhoto?.file_url ? [sourcePhoto.file_url, ...refs].slice(0, 5) : refs;
    const sceneMode = sourcePhoto?.file_url
      ? `SCENE LOCK: PRVNÍ referenční obrázek je skutečná fotografie prostoru klienta. Zachovej jeho kompozici, perspektivu, architekturu, cesty, lavičky, zeleň, mobiliář, světlo a všechny existující prvky. Scénu nepřestavuj; pouze realisticky osaď vybraný produkt do vhodného místa.`
      : `TEXT CONCEPT MODE: klient nedodal použitelnou fotografii prostoru. Vytvoř proto věrohodnou ilustrační projektovou scénu podle textové poptávky a jasně ji pojmi jako koncept, nikoli jako dokumentaci skutečného stavu.`;
    const productLock = isBendy
      ? `BENDY PRODUCT LOCK: zachovej čistý reálný výrobek podle referencí. Jedna štíhlá broušená nerezová trubka, rovný svislý dřík a jediný plynulý horní oblouk. Malé kovové trysky jsou přímo v hlavní trubce. Žádné výhonky, větve, hadice, kabely, boční trubky, přídavná ramena, dekorace ani sekundární konstrukce.`
      : `PRODUCT LOCK: zachovej siluetu, proporce, materiál a konstrukční charakter skutečného produktu podle referenčních obrázků. Produkt kreativně nepřepracovávej.`;

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
      const unitPrice = Number(product.price_from || 0);
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
      total_price: Number(product.price_from || 0) > 0 ? Number(product.price_from || 0) * requestedQuantity : 0,
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
    for (let i = 0; i < generatedVisualizations.length; i += 1) {
      const visual = generatedVisualizations[i];
      const asset = await base44.asServiceRole.entities.OfferAsset.create({
        inquiry_id: inquiryId,
        inquiry_type: inquiryType,
        project_order_id: order.id,
        file_url: visual.url,
        file_name: `${product.slug || 'mlzitko'}-${inquiryId.slice(-6)}-varianta-${i + 1}-${Date.now()}.webp`,
        file_type: 'image/webp',
        asset_type: 'generated_visualization',
        title: `AI vizualizace — ${visual.label}`,
        description: sourcePhoto?.file_url ? `Ultrarealistická varianta ${visual.label} vytvořená podle textu poptávky a fotografie prostoru.` : `Ultrarealistická konceptuální varianta ${visual.label} vytvořená podle textu poptávky.`,
        selected_for_offer: true,
        generated_by_ai: true,
      });
      visualAssets.push(asset);
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
      product_price_from: Number(product.price_from || 0),
      requested_quantity: requestedQuantity,
      requested_variants: variantSpecs.map((variant) => ({ ...variant, price: Number(product.price_from || 0) > 0 ? Number(product.price_from || 0) * variant.quantity : 0 })),
      visualization_urls: generatedVisualizations.map((item) => item.url),
      visualization_assets: visualAssets,
      audience_variant: audienceVariant,
      ai_content: {
        project_goal: clientSummary,
        solution_summary: `${solutionSummary}${variantSpecs.length ? ` Nabídka počítá s variantami: ${variantSpecs.map((variant) => `${variant.label}${Number(product.price_from || 0) > 0 ? ` — ${new Intl.NumberFormat('cs-CZ').format(Number(product.price_from || 0) * variant.quantity)} Kč bez DPH` : ''}`).join('; ')}.` : ''}`,
        benefits,
        next_step: 'Po odsouhlasení konceptu upřesníme technické návaznosti, rozsah dodávky a finální cenu.',
        presentation_title: projectTitle,
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
});
