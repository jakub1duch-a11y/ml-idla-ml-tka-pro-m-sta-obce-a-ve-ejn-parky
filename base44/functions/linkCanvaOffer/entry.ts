import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const clean = (value: unknown) => String(value || '').trim();
const validCanvaUrl = (input: unknown): boolean => {
  const value = clean(input);
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && (url.hostname === 'www.canva.com' || url.hostname === 'canva.com')
      && /^\/(?:design\/|d\/|brand\/brand-templates\/)/.test(url.pathname)
      && value.length <= 1200;
  } catch { return false; }
};

// Důvěryhodný administrátorský bridge: uchovává odkaz na originální Canva design
// přímo u konkrétní ProjectOrder. Nezískává ani nezveřejňuje přístupové tokeny.
Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const projectOrderId = clean(body.project_order_id);
    if (!projectOrderId) return Response.json({ error: 'missing_project_order_id' }, { status: 400 });
    const order = await base44.asServiceRole.entities.ProjectOrder.get(projectOrderId).catch(() => null);
    if (!order?.id) return Response.json({ error: 'project_order_not_found' }, { status: 404 });

    const design = body.canva_design_url === undefined ? (order.canva_design_url || '') : clean(body.canva_design_url);
    const supla = body.canva_supla_design_url === undefined ? (order.canva_supla_design_url || '') : clean(body.canva_supla_design_url);
    if (!validCanvaUrl(design) || !validCanvaUrl(supla)) {
      return Response.json({ error: 'Neplatný odkaz na návrh Canva. Použijte URL designu z canva.com.' }, { status: 400 });
    }
    const status = design && supla ? 'linked' : 'not_linked';
    const updated = await base44.asServiceRole.entities.ProjectOrder.update(projectOrderId, {
      canva_design_url: design,
      canva_supla_design_url: supla,
      canva_sync_status: status,
    });
    return Response.json({
      ok: true,
      project_order_id: projectOrderId,
      quote_number: updated.quote_number || order.quote_number || '',
      inquiry_id: updated.inquiry_id || order.inquiry_id,
      canva_design_url: design,
      canva_supla_design_url: supla,
      canva_sync_status: status,
      note: 'Canva odkazy jsou přiřazeny ke konkrétní nabídce. Pro skutečný export a automatické vyplnění je ještě nutné dokončit Canva Connect OAuth.',
    }, { headers: { 'Cache-Control':'no-store' } });
  } catch (error) {
    return Response.json({ error: String((error as Error)?.message || error) }, { status: 500 });
  }
});
