import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { normalizePortalEmail } from '../../shared/clientPortal.ts';

const clean = (value: unknown, max = 2000) => String(value || '').trim().slice(0, max);

const STATUS_LABELS: Record<string, string> = {
  draft: 'Nabídka se připravuje',
  pending_approval: 'Probíhá kontrola nabídky',
  sent: 'Nabídka odeslána klientovi',
  viewed: 'Klient si prohlédl nabídku',
  extension_requested: 'Klient žádá prodloužení platnosti',
  approved: 'Objednáno klientem',
  expired: 'Platnost nabídky skončila',
  rejected: 'Odmítnuto',
  in_production: 'Ve výrobě',
  ready: 'Připraveno k předání',
  delivered: 'Doručeno / realizováno',
};

function buildProjectSummary(project: any, product: any): string {
  const lines: string[] = [];
  lines.push(`Projekt: ${clean(project.project_name || project.product_name || 'Bez názvu', 120)}`);
  if (project.quote_number) lines.push(`Číslo nabídky: ${clean(project.quote_number, 60)}`);
  lines.push(`Stav: ${STATUS_LABELS[project.status] || clean(project.status, 60) || 'Neznámý'}`);
  if (product?.name) lines.push(`Produkt: ${clean(product.name, 120)}`);
  if (product?.material) lines.push(`Materiál: ${clean(product.material, 120)}`);
  if (product?.pressure) lines.push(`Provozní tlak: ${clean(product.pressure, 120)}`);
  if (product?.water_consumption) lines.push(`Spotřeba vody: ${clean(product.water_consumption, 120)}`);
  if (product?.power_supply) lines.push(`Napájení: ${clean(product.power_supply, 120)}`);
  if (product?.coverage_area) lines.push(`Pokrytí: ${clean(product.coverage_area, 120)}`);
  if (project.description) lines.push(`Popis projektu: ${clean(project.description, 600)}`);
  if (project.total_price != null && Number.isFinite(Number(project.total_price))) lines.push(`Cena nabídky bez DPH: ${Number(project.total_price).toLocaleString('cs-CZ')} Kč`);
  if (project.valid_until) lines.push(`Platnost nabídky do: ${new Date(project.valid_until).toLocaleDateString('cs-CZ')}`);
  if (project.completion_date) lines.push(`Plánované dokončení: ${new Date(project.completion_date).toLocaleDateString('cs-CZ')}`);
  if (project.delivery_method) lines.push(`Způsob dodání: ${clean(project.delivery_method, 60)}`);
  if (project.smart_control_included) lines.push(`Zahrnuje chytré ovládání: ano`);
  if (project.special_requirements) lines.push(`Zvláštní požadavky: ${clean(project.special_requirements, 400)}`);
  return lines.join('\n');
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const email = normalizePortalEmail(user?.email);

    if (!email) return Response.json({ error: 'unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });

    const body = await req.json().catch(() => ({}));
    const rawMessages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const messages = rawMessages
      .map((item: any) => ({ role: item?.role === 'assistant' ? 'assistant' : 'user', text: clean(item?.text, 1800) }))
      .filter((item: any) => item.text);

    if (!messages.length) return Response.json({ error: 'missing_message' }, { status: 400 });

    // Load the user's projects and related product details.
    const projectsPage = await base44.asServiceRole.entities.ProjectOrder.filter(
      { client_email: email },
      { sort: '-created_date', limit: 20, fields: ['id', 'project_name', 'product_name', 'product_id', 'product_slug', 'quote_number', 'status', 'description', 'total_price', 'valid_until', 'completion_date', 'delivery_method', 'smart_control_included', 'special_requirements', 'created_date'] }
    ).catch(() => ({ items: [] }));

    const projects = (projectsPage.items || []).filter((p: any) => !['draft', 'pending_approval'].includes(p.status));

    // Load product details for each project (max 5 to stay efficient).
    const productFetches = projects.slice(0, 5).map(async (project: any) => {
      if (project.product_id) return base44.asServiceRole.entities.Product.filter({ id: project.product_id }, { limit: 1, fields: ['name', 'material', 'pressure', 'water_consumption', 'power_supply', 'coverage_area'] }).catch(() => ({ items: [] }));
      if (project.product_slug) return base44.asServiceRole.entities.Product.filter({ slug: project.product_slug }, { limit: 1, fields: ['name', 'material', 'pressure', 'water_consumption', 'power_supply', 'coverage_area'] }).catch(() => ({ items: [] }));
      return { items: [] };
    });
    const productPages = await Promise.all(productFetches);

    const projectSummaries = projects.map((project: any, i: number) => {
      const product = productPages[i]?.items?.[0] || null;
      return buildProjectSummary(project, product);
    });

    // Load general verified catalog for product questions not tied to a specific order.
    const catalogPage = await base44.asServiceRole.entities.Product.list('name', 40).catch(() => ({ items: [] }));
    const catalog = (catalogPage.items || []).map((p: any) => ({
      name: clean(p.name, 120),
      slug: clean(p.slug, 120),
      material: clean(p.material, 80),
      pressure: clean(p.pressure, 80),
      water_consumption: clean(p.water_consumption, 80),
      coverage_area: clean(p.coverage_area, 80),
      power_supply: clean(p.power_supply, 80),
    })).filter((p: any) => p.name);

    const conversation = messages.map((m: any) => `${m.role === 'assistant' ? 'ASISTENT' : 'KLIENT'}: ${m.text}`).join('\n');

    const hasProjects = projectSummaries.length > 0;

    const prompt = `Jsi AI asistent MLŽIDLA® pro registrované klienty v sekci „Můj projekt". Klient je přihlášen a má přístup ke svým zakázkám.

Úkol:
- odpovídej na technické dotazy klienta týkající se jeho konkrétních zakázek a objednávek;
- pokud se klient ptá na konkrétní projekt, vycházej z JEHO ZAKÁZEK níže;
- vysvětluj technické parametry, postupy instalace, údržbu, přípravu provozu a na co si dát pozor;
- pomoz s přípravou místa, přívodem vody, kotvením, povrchem a provozními podmínkami;
- pokud se klient ptá na obecný produkt, který nemá ve svých zakázkách, použij OVĚŘENÝ KATALOG;
- pokud chybí důležitý údaj, zeptej se jednou stručnou otázkou.

Pevná pravidla:
- Odpovídej pouze na základě ověřených dat z JEHO ZAKÁZEK a OVĚŘENÉHO KATALOGU — nevymýšlej technické údaje, ceny, termíny ani parametry.
- Ceny neupravuj, nepotvrzuj objednávky ani termíny; pro tyto úkony odkazuj klienta na tým v detailu projektu.
- Pokud klient žádá změnu řešení, úpravu nabídky nebo potvrzení termínu, doporuč mu předat dotaz týmu pomocí tlačítka „Předat týmu".
- Konkrétní technický údaj smíš uvést jen tehdy, když je přesně uveden v datech níže.
- Pokud údaj není k dispozici, napiš „tento údaj je potřeba ověřit s týmem podle konkrétního projektu".
- Piš česky, přirozeně, stručně, 2–4 kratší odstavce.
- Nevyžaduj osobní údaje — klient je již přihlášen a jeho e-mail je systému znám.
- Na konci můžeš jednou nabídnout, že se klient může obrátit na tým přímým dotazem v detailu projektu.

${hasProjects ? `JEHO ZAKÁZKY:\n${projectSummaries.map((s, i) => `--- Zakázka ${i + 1} ---\n${s}`).join('\n\n')}` : 'Klient zatím nemá žádné aktivní zakázky. Odpovídej obecně na základě katalogu a doporuč vytvořit poptávku.'}

OVĚŘENÝ KATALOG:
${JSON.stringify(catalog)}

KONVERZACE:
${conversation}

Vrať JSON s:
reply = odpověď klientovi,
topic = velmi krátké téma konverzace,
suggested_questions = 2 až 4 krátké navazující otázky relevantní k jeho zakázkám.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          reply: { type: 'string' },
          topic: { type: 'string' },
          suggested_questions: { type: 'array', items: { type: 'string' } },
        },
        required: ['reply'],
      },
    });

    return Response.json({
      reply: clean((response as any)?.reply, 5000),
      topic: clean((response as any)?.topic, 240),
      has_projects: hasProjects,
      project_count: projects.length,
      suggested_questions: Array.isArray((response as any)?.suggested_questions) ? (response as any).suggested_questions.slice(0, 4) : [],
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'portal_chat_failed' }, { status: 500 });
  }
}