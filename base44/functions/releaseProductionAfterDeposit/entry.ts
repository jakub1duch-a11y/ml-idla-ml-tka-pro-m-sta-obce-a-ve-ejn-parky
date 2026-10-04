import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const productionId = String(body.production_order_id || '');
    const paymentReference = String(body.payment_reference || '').slice(0, 200);
    if (!productionId) return Response.json({ error: 'production_order_id_required' }, { status: 400 });

    const production = await base44.asServiceRole.entities.ProductionOrder.get(productionId).catch(() => null);
    if (!production) return Response.json({ error: 'production_order_not_found' }, { status: 404 });

    const project = await base44.asServiceRole.entities.ProjectOrder.get(production.project_order_id).catch(() => null);
    if (!project) return Response.json({ error: 'project_order_not_found' }, { status: 404 });

    const payments = await base44.asServiceRole.entities.ProjectPayment.filter({ project_order_id: project.id });
    const deposit = (payments || []).find((p:any) => p.payment_type === 'deposit');
    if (!deposit) return Response.json({ error: 'deposit_payment_missing' }, { status: 409 });

    const paidAt = new Date().toISOString();
    const productionStart = paidAt.slice(0,10);
    const updatedDeposit = await base44.asServiceRole.entities.ProjectPayment.update(deposit.id, {
      status: 'paid',
      paid_at: paidAt,
      payment_reference: paymentReference || deposit.payment_reference || '',
      production_released_at: paidAt,
    });

    const updatedProduction = await base44.asServiceRole.entities.ProductionOrder.update(production.id, {
      status: 'in_production',
      production_start_date: productionStart,
      production_notes: `${production.production_notes || ''}\nZáloha potvrzena ${new Date(paidAt).toLocaleString('cs-CZ')}; výroba uvolněna.`.trim(),
    });

    const updatedProject = await base44.asServiceRole.entities.ProjectOrder.update(project.id, {
      status: 'in_production',
      production_start_date: productionStart,
    });

    const devices = await base44.asServiceRole.entities.MisterDevice.filter({ project_order_id: project.id }).catch(() => []);
    let device = devices?.[0] || null;
    if (!device) {
      device = await base44.asServiceRole.entities.MisterDevice.create({
        project_order_id: project.id,
        client_email: project.client_email || '',
        product_slug: project.product_slug || '',
        product_name: project.product_name || project.project_name || 'Mlžítko',
        device_name: project.product_name || project.project_name || 'Moje mlžítko',
        installation_location: project.delivery_location || '',
        control_mode: project.smart_control_included ? 'smart' : 'manual',
        supla_connection_status: 'not_connected',
        notes: 'Zařízení založeno při uvolnění zakázky do výroby. Sériové číslo doplnit při výrobě/předání.',
      });
    }

    return Response.json({ ok: true, payment: updatedDeposit, production_order: updatedProduction, project: updatedProject, device }, {
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'release_failed' }, { status: 500 });
  }
});