import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// MLŽIDLA: schválené vizualizace => pouze Stories; publikované reference a nové
// produkty => Instagram feed + NEPUBLIKOVANÝ článek. Facebook pouze přes
// uživatelem zapnuté sdílení Instagramu; tato funkce Facebook nikdy nevolá.
const DAY = 86400000;
const ROOT = 'https://mlzidla.cz';
const hashtags = '#mlzidla #mlzitka #mestskeochlazovani #architektura #verejnyprostor';
const clamp = (value, min, max, fallback) => Math.min(max, Math.max(min, Number(value) || fallback));
const inWindow = (row, cutoff, useUpdate = false) => {
  const stamp = useUpdate ? row.updated_date || row.created_date : row.created_date;
  return Boolean(stamp && new Date(stamp).getTime() >= cutoff);
};
const safe = (value, maximum = 450) => String(value || '').trim().slice(0, maximum);
const hash = (value) => {
  let h = 2166136261;
  for (const ch of String(value || '')) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0).toString(36);
};
const slugify = (value) => safe(value, 80).toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const uniqueUrls = (values) => [...new Set(values.filter(Boolean))];

function summarize(kind, record, product) {
  if (kind === 'visualization') {
    return {
      title: 'Nová vizualizace: ' + (product?.name || record.product_name || record.product_slug),
      caption: 'Jak může vypadat ' + (product?.name || record.product_name || 'mlžítko') +
        ' v novém prostoru? ' + safe(record.scene_description || '', 130) +
        '\n\nIlustrační vizualizace. Více o produktu: ' + ROOT + '/produkt/' + encodeURIComponent(record.product_slug) +
        '\n\n' + hashtags,
      link: ROOT + '/produkt/' + encodeURIComponent(record.product_slug),
      note: 'Stories 9:16 (1080×1920), produkt přesně dle schválené MASTER geometrie, bez vodoznaku. Jedná se o vizualizaci, ne o dokončenou realizaci.',
      image: record.image_url,
      shortDescription: safe(record.scene_description, 300),
      isReal: false
    };
  }
  const isReference = kind === 'realization';
  const name = safe(record.name || 'Mlžidla');
  const productName = isReference ? safe(record.product_used) : name;
  const details = isReference ? safe(record.description, 1000) : safe(record.description || record.short_description, 1000);
  const location = isReference && record.location ? ' v lokalitě ' + safe(record.location) : '';
  return {
    title: (isReference ? 'Nová realizace: ' : 'Představujeme: ') + name,
    caption: (isReference ? 'Nová realizace Mlžidla.cz' + location + ': ' : 'Představujeme produkt Mlžidla.cz: ') + name +
      '.\n\n' + safe(details, 370) + (isReference && productName ? '\nPoužitý produkt: ' + productName + '.' : '') +
      '\n\nVíce informací: ' + (isReference ? ROOT + '/reference' : ROOT + '/produkt/' + encodeURIComponent(record.slug)) +
      '\n\n' + hashtags,
    link: isReference ? ROOT + '/reference' : ROOT + '/produkt/' + encodeURIComponent(record.slug),
    note: isReference
      ? 'Použít jen autentické fotografie realizace, uvést pouze ověřené místo a produkt. Canva feed 4:5 (1080×1350).'
      : 'Nový produkt. Canva feed/carousel 4:5 (1080×1350). Geometrie produktu musí odpovídat MASTER.',
    image: record.image_url || record.visual_master_reference_url,
    shortDescription: details,
    isReal: isReference,
    productName,
    location: isReference ? safe(record.location) : '',
  };
}

async function editorialText(base44, kind, data, product) {
  // AI dostává pouze whitelist ověřených údajů a výslovné pravidlo nic nedomýšlet.
  const facts = {
    content_type: kind, title: data.title, description: data.shortDescription,
    product: data.productName || safe(product?.name), location: data.location,
    link: data.link, illustration: !data.isReal,
    price: null, performance: null,
  };
  try {
    const generated = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: 'Jsi odborný editor značky Mlžidla.cz. Napiš český profesionální marketingový článek s úvodním perexem, strukturovanými nadpisy ## a ###, autentickým technickým kontextem a věcným CTA. Čerpej VÝHRADNĚ z faktů v JSON. NIKDY nevymýšlej materiál, cenu, tlak, trysky, klienta, lokalitu, účinnost, reference ani normy. Pokud jde o vizualizaci, označ ji jako ilustrační a ne jako realizaci. Vyhni se tvrzení o garantovaném ochlazení nebo zdravotním efektu. Výstup: JSON {title, perex, content, instagram_caption, seo_description}. Fakta: ' + JSON.stringify(facts),
      response_json_schema: {
        type: 'object', properties: {
          title: {type:'string'}, perex:{type:'string'}, content:{type:'string'},
          instagram_caption:{type:'string'}, seo_description:{type:'string'}
        },
        required:['title','perex','content','instagram_caption','seo_description']
      }
    });
    if (generated && typeof generated.content === 'string' && generated.content.trim()) return {
      title: safe(generated.title, 130) || data.title,
      perex: safe(generated.perex, 350),
      content: generated.content.slice(0, 14000),
      instagram_caption: safe(generated.instagram_caption, 2000) + '\n\n' + hashtags,
      seo_description: safe(generated.seo_description, 155)
    };
  } catch (_error) {
    // Nedostupné AI nesmí zabránit vzniku konceptu. Vytvoří se ověřený návrh.
  }
  const perex = data.shortDescription ? safe(data.shortDescription, 260) : data.title + ' – projekt Mlžidla.cz.';
  const source = data.isReal ? 'realizace' : 'produktu';
  return {
    title: data.title,
    perex,
    content: '## ' + data.title + '\n\n' + perex +
      '\n\n## Co je pro tento projekt důležité\n\n' +
      (data.shortDescription || 'Podrobnosti budou doplněny po redakční kontrole.') +
      '\n\n## Použití a návrh\n\nU každého ' + source +
      ' ověřujeme konkrétní rozměry, konfiguraci a vhodnost pro daný prostor. ' +
      'Technické informace vycházejí z dokumentace příslušného výrobku.\n\n' +
      (data.productName ? '### Související produkt\n\n' + data.productName + '\n\n' : '') +
      '## Další informace\n\n[Více informací na Mlžidla.cz](' + data.link + ').',
    instagram_caption: data.caption,
    seo_description: safe(perex, 155)
  };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Pouze administrátor.' }, { status: 403 });
    const payload = await req.json().catch(() => ({}));
    const dryRun = payload.dryRun !== false;
    const confirmed = payload.confirmed === true;
    if (!dryRun && !confirmed) return Response.json({ error: 'Vytvoření konceptů vyžaduje potvrzení.' }, { status: 400 });
    const days = clamp(payload.days, 1, 60, 14);
    const limit = clamp(payload.maxItems, 1, 20, 8);
    const cutoff = Date.now() - days * DAY;
    const [visualizations, realizations, products, posts, blogs] = await Promise.all([
      base44.asServiceRole.entities.VisualizationAsset.list('-created_date', 250),
      base44.asServiceRole.entities.Realizace.list('-created_date', 250),
      base44.asServiceRole.entities.Product.list('-created_date', 250),
      base44.asServiceRole.entities.MarketingPost.list('-created_date', 1000),
      base44.asServiceRole.entities.BlogPost.list('-created_date', 350),
    ]);
    const bySlug = new Map(products.filter(x=>x.slug).map(x=>[x.slug,x]));
    const known = new Set(posts.map(x=>x.admin_sync_key).filter(Boolean));
    const existingBlogs = new Set(blogs.map(x=>x.slug).filter(Boolean));
    const candidates = [];
    for (const visual of visualizations) {
      if (!inWindow(visual,cutoff,true) || visual.approval_status !== 'approved' ||
          !visual.approved_for_presentation || !visual.is_master_geometry_locked ||
          !visual.image_url || !visual.product_slug || !bySlug.has(visual.product_slug)) continue;
      const key = 'marketing:v1:visualization:' + visual.id + ':' + hash(visual.image_url);
      if (!known.has(key)) candidates.push({kind:'visualization', key, record:visual, product:bySlug.get(visual.product_slug)});
    }
    for (const ref of realizations) {
      if (!inWindow(ref,cutoff) || ref.published !== true || !ref.image_url) continue;
      const key = 'marketing:v1:realization:' + ref.id;
      if (!known.has(key)) candidates.push({kind:'realization', key, record:ref});
    }
    for (const product of products) {
      if (!inWindow(product,cutoff) || !product.slug || product.slug.startsWith('archived-') ||
          !product.visual_master_verified || !(product.visual_master_reference_url || product.image_url)) continue;
      const key = 'marketing:v1:product:' + product.id;
      if (!known.has(key)) candidates.push({kind:'product', key, record:product, product});
    }
    candidates.sort((a,b) => new Date(b.record.updated_date || b.record.created_date || 0) -
      new Date(a.record.updated_date || a.record.created_date || 0));
    const selected = candidates.slice(0,limit);
    const preview = selected.map(item => ({
      key: item.key,
      kind: item.kind,
      title: summarize(item.kind,item.record,item.product).title,
      willCreate: item.kind === 'visualization' ? ['Instagram Stories'] : ['Instagram feed','Blog draft'],
      imageUrl: summarize(item.kind,item.record,item.product).image,
    }));
    if (dryRun) return Response.json({ok:true,dryRun:true,found:candidates.length,preview,
      note:'Pouze kontrola. Bez nových konceptů a bez publikace. Facebook se nikdy nepublikuje samostatně.'});
    const created = [];
    const errors = [];
    for (const item of selected) {
      try {
        // Kontrola idempotence před zápisem – opakovaný průchod stejný signál přeskočí.
        if (known.has(item.key)) continue;
        const info = summarize(item.kind,item.record,item.product);
        const isStory = item.kind === 'visualization';
        const editorial = isStory ? null : await editorialText(base44,item.kind,info,item.product);
        const contentGroupId = 'mlzidla-' + hash(item.key);
        const post = await base44.asServiceRole.entities.MarketingPost.create({
          title: info.title, platform: 'instagram', post_format: isStory ? 'story' : 'feed',
          caption: isStory ? info.caption : editorial.instagram_caption, caption_instagram: isStory ? info.caption : editorial.instagram_caption,
          image_url: info.image, content_group_id: contentGroupId,
          product_slugs: item.kind === 'visualization' ? [item.record.product_slug] :
            item.kind === 'product' ? [item.record.slug] : [],
          realization_ids: item.kind === 'realization' ? [item.record.id] : [],
          source_type:'ai_recommendation',
          source_brief: JSON.stringify({kind:item.kind,sourceId:item.record.id,canvaBrief:info.note,
            facebook:'Pouze přes ověřené sdílení Instagramu na facebookovou stránku; NEPŘIDÁVAT vlastní FB post.',
            humanReview:true}),
          visual_style:'MLŽIDLA brand / Canva / bez watermarku / geometrie MASTER',
          visual_prompt:info.note, status:'draft', scheduled_date:null, ai_generated: Boolean(editorial),
          admin_sync_key: item.key, cta_url: info.link
        });
        known.add(item.key);
        const result = {kind:item.kind,postId:post.id,title:info.title,blogId:null};
        if (!isStory) {
          const blogSlug = slugify('marketing-' + item.kind + '-' + item.record.id);
          if (!existingBlogs.has(blogSlug)) {
            const blog = await base44.asServiceRole.entities.BlogPost.create({
              title:editorial.title,slug:blogSlug,
              category:item.kind === 'realization' ? 'realizace' : 'novinky',
              audience:'firmy', perex:editorial.perex,content:editorial.content,
              image_url:info.image,image_alt:item.kind === 'realization'
                ? 'Fotografie realizace ' + safe(item.record.name,150)
                : 'Fotografie produktu ' + safe(item.record.name,150),
              related_links:[{label:'Produkt nebo související informace',url:info.link}],
              related_product_slugs:item.kind === 'product' ? [item.record.slug] : [],
              seo_title:editorial.title,seo_description:editorial.seo_description,
              location_context:info.location || '', published:false,instagram_posted:false,
              tags:['mlzidla',item.kind === 'realization' ? 'realizace' : 'novy-produkt']
            });
            result.blogId = blog.id;
            existingBlogs.add(blogSlug);
          }
        }
        created.push(result);
      } catch (error) {
        errors.push({key:item.key,error:String(error?.message || error)});
      }
    }
    return Response.json({ok:errors.length===0,dryRun:false,found:candidates.length,created,errors,
      note:'Uloženy pouze koncepty. Žádná publikace na Instagram, Facebook ani web.'});
  } catch (error) {
    return Response.json({error:String(error?.message || error)}, {status:500});
  }
}