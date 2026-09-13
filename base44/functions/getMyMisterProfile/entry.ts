import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const sessionToken = String(body.session_token || '');
    const projectId = String(body.project_order_id || '');
    if (!sessionToken || !projectId) return Response.json({ error: 'missing_session_or_project' }, { status: 400 });

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions?.find((item:any) => item.token === sessionToken);
    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      return Response.json({ error: 'session_expired' }, { status: 401 });
    }

    const project = await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(() => null);
    if (!project || String(project.client_email || '').toLowerCase() !== String(session.email || '').toLowerCase()) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }

    const [payments, productionOrders, devices, documents, offerAssets] = await Promise.all([
      base44.asServiceRole.entities.ProjectPayment.filter({ project_order_id: projectId }).catch(() => []),
      base44.asServiceRole.entities.ProductionOrder.filter({ project_order_id: projectId }).catch(() => []),
      base44.asServiceRole.entities.MisterDevice.filter({ project_order_id: projectId }).catch(() => []),
      base44.asServiceRole.entities.MisterDocument.filter({ project_order_id: projectId }).catch(() => []),
      base44.asServiceRole.entities.OfferAsset.filter({ project_order_id: projectId }).catch(() => []),
    ]);

    const device = devices?.[0] || null;
    const [telemetry, preferences] = device ? await Promise.all([
      base44.asServiceRole.entities.MisterTelemetry.filter({ device_id: device.id }, '-period_end', 180).catch(() => []),
      base44.asServiceRole.entities.MisterControlPreference.filter({ device_id: device.id }, '-created_date', 10).catch(() => []),
    ]) : [[], []];

    const products = project.product_slug
      ? await base44.asServiceRole.entities.Product.filter({ slug: project.product_slug }).catch(() => [])
      : [];
    const product = products?.[0] || null;

    const virtualDocuments:any[] = [];
    if (project.quote_pdf_url) virtualDocuments.push({ document_type:'quote', title:'Cenová nabídka', file_url:project.quote_pdf_url, source:'offer', sort_order:10 });
    if (project.presentation_pdf_url) virtualDocuments.push({ document_type:'proposal', title:'Návrh projektu / prezentace', file_url:project.presentation_pdf_url, source:'offer', sort_order:20 });
    if (project.order_confirmation_pdf_url) virtualDocuments.push({ document_type:'handover', title:'Potvrzení objednávky', file_url:project.order_confirmation_pdf_url, source:'offer', sort_order:30 });
    (offerAssets || []).filter((asset:any) => asset.selected_for_offer && asset.file_url).forEach((asset:any, index:number) => virtualDocuments.push({
      document_type: asset.asset_type === 'generated_visualization' ? 'visualization' : 'other',
      title: asset.title || asset.file_name || 'Dokument projektu', file_url: asset.file_url, source:'offer', sort_order:40 + index,
    }));
    (product?.documents_urls || []).filter(Boolean).forEach((url:string, index:number) => virtualDocuments.push({
      document_type:'other', title:`Technický dokument produktu ${index + 1}`, file_url:url, source:'product', sort_order:60 + index,
    }));

    const combinedDocs = [...(documents || []).filter((d:any) => d.client_visible !== false), ...virtualDocuments]
      .filter((doc:any, index:number, arr:any[]) => doc.file_url && arr.findIndex((x:any) => x.file_url === doc.file_url) === index)
      .sort((a:any,b:any) => Number(a.sort_order || 0) - Number(b.sort_order || 0));

    const totals = (telemetry || []).reduce((acc:any, row:any) => ({
      misting_hours: acc.misting_hours + Number(row.misting_hours || 0),
      cycle_count: acc.cycle_count + Number(row.cycle_count || 0),
      estimated_water_l: acc.estimated_water_l + Number(row.estimated_water_l || 0),
    }), { misting_hours: 0, cycle_count: 0, estimated_water_l: 0 });

    return Response.json({
      ok: true,
      project: {
        id: project.id, quote_number: project.quote_number, project_name: project.project_name,
        product_name: project.product_name, product_slug: project.product_slug, status: project.status,
        delivery_location: project.delivery_location, completion_date: project.completion_date,
      },
      production_order: productionOrders?.[0] || null,
      payments: payments || [],
      device,
      telemetry: telemetry || [],
      telemetry_totals: totals,
      control_preference: preferences?.[0] || null,
      documents: combinedDocs,
      supla: {
        connected: device?.supla_connection_status === 'connected',
        status: device?.supla_connection_status || 'not_connected',
        available_after_authorization: true,
      },
    }, { headers: { 'Cache-Control':'no-store', 'Pragma':'no-cache', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'my_mister_failed' }, { status: 500 });
  }
});