import { clientInquiryView, clientProjectView } from './clientPortal.ts';
const purchased = ['approved', 'in_production', 'ready', 'delivered'];
const headers = { 'Cache-Control': 'no-store' };
export async function registeredPortal(base44, email, body) {
  const entities = base44.asServiceRole.entities;
  const options = { sort: '-created_date', limit: 12, ...(typeof body.cursor === 'string' ? { cursor: body.cursor } : {}) };
  if (body.tab === 'documents' && body.project_id) {
    const project = await entities.ProjectOrder.get(String(body.project_id));
    if (!project || String(project.client_email || '').trim().toLowerCase() !== email || !purchased.includes(project.status)) return Response.json({ error: 'forbidden' }, { status: 403, headers });
    const page = await entities.MisterDocument.filter({ project_order_id: project.id, client_visible: true }, options);
    const productPage = project.product_id ? await entities.Product.filter({ id: project.product_id }, { limit: 1 }) : project.product_slug ? await entities.Product.filter({ slug: project.product_slug }, { limit: 1 }) : { items: [] };
    const docs = page.items.map(d => ({ id: d.id, title: d.title, file_url: d.file_url, version: d.version, document_type: d.document_type }));
    if (!body.cursor) (productPage.items[0]?.documents_urls || []).forEach((file_url, i) => docs.push({ id: `product-${i}`, title: `Technická dokumentace · ${productPage.items[0].name} · ${i + 1}`, file_url }));
    for (const doc of docs) if (String(doc.file_url).startsWith('private/')) { const signed = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: doc.file_url }); doc.file_url = signed.signed_url; }
    return Response.json({ ...page, items: docs }, { headers });
  }
  if (body.tab === 'inquiries') {
    const source = body.source === 'contact' ? 'ContactInquiry' : 'Poptavka';
    const page = await entities[source].filter({ email }, options);
    return Response.json({ ...page, items: page.items.map(clientInquiryView) }, { headers });
  }
  const query = { client_email: email, ...(body.tab === 'documents' ? { status: { $in: purchased } } : {}) };
  const page = await entities.ProjectOrder.filter(query, options);
  const items = page.items.map(project => {
    if (['draft', 'pending_approval'].includes(project.status)) return { id: project.id, project_name: project.project_name, status: project.status, created_date: project.created_date };
    return clientProjectView(project);
  });
  const [groups, inquiries, contacts] = await Promise.all([
    entities.ProjectOrder.aggregate({ query: { client_email: email }, groupBy: 'status' }),
    entities.Poptavka.count({ email }), entities.ContactInquiry.count({ email }),
  ]);
  const totals = { projects: 0, awaiting: 0, purchased: 0, inquiries: inquiries + contacts, standard: inquiries, contact: contacts };
  groups.rows.forEach(row => { totals.projects += row.count; if (['sent', 'viewed', 'extension_requested'].includes(row.status)) totals.awaiting += row.count; if (purchased.includes(row.status)) totals.purchased += row.count; });
  return Response.json({ ...page, items, totals }, { headers });
}