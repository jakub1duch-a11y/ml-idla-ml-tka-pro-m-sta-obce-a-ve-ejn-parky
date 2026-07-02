import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const TOPICS = [
  { prompt: 'Mlžná odpočinková zóna v přehřátém městě — návrh prostoru s mlžnými sochami různých tvarů jako spirály, oblouky, stromy, kruhy. Popis vizuálního efektu jemné vodní mlhy rozptylující se do okolí a přinášející příjemné ochlazení v horkých dnech.', category: 'inspirace', tags: ['mlžení', 'odpočinková zóna', 'ochlazení', 'město', 'design'] },
  { prompt: 'Inventivní nápady na mlžítka pro veřejné prostory — netradiční tvary mlžných soch: hvězdice, vlny, abstraktní geometrie. Jak jemná vodní mlha 5–10 µm ochlazuje vzduch bez pocitu mokra a vytváří atmosféru i v letních vedrech.', category: 'inspirace', tags: ['mlžítka', 'inovace', 'tvary', 'design', 'léto'] },
  { prompt: 'Mlžné sochy jako dominanta náměstí — různé tvary soch (strom, mrak, portál, spirála) a jejich vliv na mikroklima. Mlha jemně rozptyluje vodní kapičky do okolí a přináší ochlazení v horkých letních dnech pro procházející lidi.', category: 'inspirace', tags: ['mlžné sochy', 'náměstí', 'mikroklima', 'ochlazení', 'architektura'] },
  { prompt: 'Jak navrhnout ideální mlžnou chladicí zónu pro park nebo zahradu — výběr tvaru mlžítka, rozmístění v prostoru, technické parametry. Jemná mlha rozptylující se do okolí jako přirozené ochlazení pro návštěvníky.', category: 'technika', tags: ['chladicí zóna', 'zahrada', 'park', 'technické parametry', 'mlha'] },
  { prompt: 'Mlžné instalace pro letní festivaly a eventy — WOW efekt mlžných portálů a soch různých tvarů. Mlžítka jemně rozptylující vodní mlhu do okolí jako součást zážitkového designu veřejného prostoru.', category: 'inspirace', tags: ['festival', 'event', 'mlžná brána', 'zážitek', 'léto'] },
  { prompt: 'Mlžení v horkém létě — vědecké vysvětlení jak mikro-kapičky vodní mlhy 5–10 µm ochlazují vzduch odpařováním. Různé produkty a tvary mlžítek vhodné pro různé prostory od soukromé zahrady po veřejné náměstí.', category: 'technika', tags: ['fyzika mlžení', 'ochlazení', 'věda', 'léto', 'technologie'] },
  { prompt: 'Inspirace pro mlžné sochy netradičních tvarů — tentokrát zaměřeno na geometrické formy: krystal, duna, lineární prvky. Jak tyto abstraktní mlžné sochy přinášejí atmosféru a jemné ochlazení mlhou rozptýlenou do okolí.', category: 'inspirace', tags: ['geometrie', 'abstraktní design', 'mlžné sochy', 'ochlazení', 'prostor'] },
];

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    // For scheduled automation — use service role
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

    // 1. Generate text content
    const textResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Jsi expert copywriter pro českou firmu HolmTec, která vyrábí luxusní mlžné sochy a chladicí instalace z nerezové oceli AISI 304/316L.
Napiš inspirativní blogový příspěvek na téma: "${topic.prompt}".
Tón: inspirativní, poetický, ale konkrétní. Jazyk: čeština. 
Výstup jako JSON: title (poutavý název, max 80 znaků), perex (2 věty max, láká ke čtení), content (plný text markdown, min 500 slov, použij nadpisy ##, ### odrážky, buď konkrétní a vizuální).`,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          perex: { type: 'string' },
          content: { type: 'string' },
        }
      }
    });

    // 2. Generate a concept product image
    const imagePrompt = `Futuristic stainless steel misting sculpture in a modern urban plaza, architectural design, soft water mist floating in air, industrial minimalist aesthetic, photorealistic, dramatic lighting, deep dark background, cyan mist glow, art installation, Czech design`;
    
    const imageResult = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt: imagePrompt,
    });

    // 3. Save the blog post as a draft
    const post = {
      title: textResult.title || 'Mlžení v letním městě',
      slug: slugify(textResult.title || 'mlzeni-letni-mesto') + '-' + Date.now().toString().slice(-4),
      category: topic.category,
      perex: textResult.perex || '',
      content: textResult.content || '',
      image_url: imageResult.url || '',
      published: false,
      tags: topic.tags,
      published_date: new Date().toISOString().split('T')[0],
    };

    const created = await base44.asServiceRole.entities.BlogPost.create(post);

    return Response.json({ ok: true, post_id: created.id, title: post.title, image_url: post.image_url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});