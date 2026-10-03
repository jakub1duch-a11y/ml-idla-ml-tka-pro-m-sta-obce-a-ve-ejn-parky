import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

const clean = (value: unknown, max = 2000) => String(value || '').trim().slice(0, max);

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const rawMessages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const messages = rawMessages
      .map((item: any) => ({
        role: item?.role === 'assistant' ? 'assistant' : 'user',
        text: clean(item?.text, 1800),
      }))
      .filter((item: any) => item.text);

    if (!messages.length) return Response.json({ error: 'missing_message' }, { status: 400 });

    const products = await base44.asServiceRole.entities.Product.list('name', 80).catch(() => []);
    const verifiedProducts = (products || []).map((product: any) => ({
      name: clean(product.name, 120),
      slug: clean(product.slug, 120),
      short_description: clean(product.short_description, 500),
      description: clean(product.description, 900),
      material: clean(product.material, 120),
      pressure: clean(product.pressure, 120),
      water_consumption: clean(product.water_consumption, 120),
      coverage_area: clean(product.coverage_area, 120),
      power_supply: clean(product.power_supply, 120),
      location_context: clean(product.location_context, 300),
      use_cases: Array.isArray(product.use_cases) ? product.use_cases.slice(0, 8) : [],
      price_from: typeof product.price_from === 'number' ? product.price_from : null,
    })).filter((product: any) => product.name);

    const conversation = messages.map((message: any) =>
      `${message.role === 'assistant' ? 'ASISTENT' : 'KLIENT'}: ${message.text}`
    ).join('\n');

    const prompt = `Jsi veřejný AI poradce značky MLŽIDLA® / HolmTec pro nízkotlaká mlžítka a ochlazování prostoru.

Úkol:
- pomoz návštěvníkovi vybrat vhodný typ řešení podle prostoru, povrchu, způsobu použití a dostupného přívodu vody;
- vysvětli obecný postup instalace, přípravu místa a na co dát pozor;
- doporuč, jaké informace nebo fotografie má klient dodat pro přesný návrh;
- pokud je to vhodné, doporuč konkrétní produkty pouze z OVĚŘENÉHO KATALOGU níže;
- pokud chybí důležitý údaj, zeptej se jednou stručnou otázkou.

Pevná pravidla:
- Nevymýšlej ceny, rozměry, tlaky, průtoky, materiály, termíny ani jiné technické údaje.
- Konkrétní technický údaj nebo cenu smíš uvést jen tehdy, když je přesně uveden v OVĚŘENÉM KATALOGU.
- Pokud údaj v katalogu není, napiš "je potřeba ověřit podle konkrétního projektu".
- Nezaměňuj produktové řady ani jejich geometrii.
- U stavebních a instalačních kroků dávej praktické obecné doporučení, ale upozorni na ověření přívodu vody, povrchu, kotvení, odvodnění/provozu a místních podmínek.
- Piš česky, přirozeně, stručně, 2–5 kratších odstavců.
- Nevyžaduj osobní údaje v každé odpovědi. Na konci můžeš jednou přirozeně nabídnout, že po zanechání jména a telefonu se ozve tým do 24 hodin.
- AI podpora je dostupná 24/7; lidský kontakt neslibuj dříve než "do 24 hodin".
- Nevydávej odhad za ověřený fakt.

OVĚŘENÝ KATALOG:
${JSON.stringify(verifiedProducts)}

KONVERZACE:
${conversation}

Vrať JSON s:
reply = odpověď klientovi,
topic = velmi krátké téma konverzace,
recommended_products = pouze názvy produktů, které opravdu vycházejí z katalogu,
follow_up_questions = 2 až 4 krátké klikatelné pokračovací otázky.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          reply: { type: 'string' },
          topic: { type: 'string' },
          recommended_products: { type: 'array', items: { type: 'string' } },
          follow_up_questions: { type: 'array', items: { type: 'string' } }
        },
        required: ['reply']
      }
    });

    return Response.json({
      reply: clean((response as any)?.reply, 5000),
      topic: clean((response as any)?.topic, 240),
      recommended_products: Array.isArray((response as any)?.recommended_products) ? (response as any).recommended_products.slice(0, 5) : [],
      follow_up_questions: Array.isArray((response as any)?.follow_up_questions) ? (response as any).follow_up_questions.slice(0, 4) : [],
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'advisor_failed' }, { status: 500 });
  }
}
