import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { jsPDF } from 'npm:jspdf@4.0.0';

const VAT_RATE = 21;
const SIGNATURE = 'Ing. Radek Meduna';
const CONTACT_EMAIL = 'obchod1@holmtec.cz';
const CONTACT_PHONE = '+420 774 700 390';
const BANK_ACCOUNT = '213837170/0300';

const money = (value: unknown) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 }).format(Number(value || 0));

function buildPaymentPdf(project: any, type: 'deposit' | 'final', amountExVat: number, dueDate: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, M = 18;
  const amountVat = amountExVat * VAT_RATE / 100;
  const amountIncVat = amountExVat + amountVat;
  const isDeposit = type === 'deposit';

  doc.setFillColor(10, 38, 49); doc.rect(0, 0, W, 50, 'F');
  doc.setFillColor(45, 194, 211); doc.rect(0, 46, 72, 4, 'F');
  doc.setTextColor(45, 194, 211); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.text('MLZIDLA.cz', M, 20);
  doc.setTextColor(210, 230, 234); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text('HolmTec s.r.o. | Horní Staré Město 698 | 541 02 Trutnov', M, 29);
  doc.setTextColor(255,255,255); doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
  doc.text(isDeposit ? 'ZÁLOHOVÁ VÝZVA K ÚHRADĚ 50 %' : 'DOPLATEK 50 % — PODKLAD K PŘEDÁNÍ', W-M, 18, { align: 'right' });
  doc.setTextColor(181, 208, 215); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
  doc.text(`Nabídka: ${project.quote_number || '—'}`, W-M, 27, { align:'right' });
  doc.text(`Interní reference: ${isDeposit ? 'ZAL' : 'DOP'}-${project.quote_number || project.id}`, W-M, 34, { align:'right' });

  let y = 64;
  doc.setTextColor(12, 45, 56); doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text('ODBĚRATEL', M, y);
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(70, 87, 94);
  y += 8; doc.text(project.client_name || '—', M, y);
  if (project.client_company) { y += 6; doc.text(project.client_company, M, y); }
  y += 6; doc.text(project.client_email || '', M, y);

  y += 16;
  doc.setFillColor(244, 248, 249); doc.roundedRect(M, y, W - 2*M, 55, 3, 3, 'F');
  doc.setTextColor(12,45,56); doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.text('PLATEBNÍ REKAPITULACE', M+7, y+10);
  doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(72,92,99);
  const rows = [
    ['Projekt', project.project_name || project.product_name || '—'],
    ['Produkt', project.product_name || '—'],
    ['Základ bez DPH', `${money(amountExVat)} Kč`],
    [`DPH ${VAT_RATE} %`, `${money(amountVat)} Kč`],
    ['K úhradě vč. DPH', `${money(amountIncVat)} Kč`],
    ['Splatnost', new Date(dueDate).toLocaleDateString('cs-CZ')],
    ['Účet', BANK_ACCOUNT],
  ];
  rows.forEach(([label, value], i) => {
    const rowY = y + 18 + i * 5;
    doc.setTextColor(100,116,121); doc.text(label, M+7, rowY);
    doc.setTextColor(20,54,65); doc.setFont('helvetica', i === 4 ? 'bold' : 'normal'); doc.text(String(value), W-M-7, rowY, { align:'right' });
  });

  y += 70;
  doc.setFillColor(12, 60, 73); doc.roundedRect(M, y, W - 2*M, 33, 3, 3, 'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(9);
  doc.text(isDeposit ? 'VÝROBA SE UVOLNÍ PO POTVRZENÍ PŘIJETÍ ZÁLOHY.' : 'DOPLATEK SE VYSTAVUJE / POTVRZUJE KE DNI PŘEDÁNÍ.', M+7, y+10);
  doc.setTextColor(205,227,232); doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
  const info = isDeposit
    ? 'Tento dokument je platební podklad / proforma. Není daňovým dokladem. Daňový a účetní doklad se čísluje ve fakturačním systému HolmTec.'
    : 'Tento dokument je připravený podklad pro závěrečné vyúčtování. Finální účetní doklad se vystaví při předání a zohlední uhrazenou zálohu.';
  doc.text(doc.splitTextToSize(info, W-2*M-14), M+7, y+18);

  y += 48;
  doc.setTextColor(12,45,56); doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text(SIGNATURE, M, y);
  doc.setTextColor(80,100,107); doc.setFont('helvetica','normal'); doc.setFontSize(8);
  doc.text(`MLŽIDLA® / HolmTec s.r.o. · ${CONTACT_PHONE} · ${CONTACT_EMAIL}`, M, y+7);
  doc.text('IČ 27486893 · DIČ CZ27486893 · Horní Staré Město 698, 541 02 Trutnov', M, y+13);

  return new Uint8Array(doc.output('arraybuffer'));
}

async function uploadPdf(base44: any, bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const result = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file: blob });
  return result?.file_url || result?.url || '';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const projectId = String(body.project_order_id || '');
    const orderSource = ['portal','email','admin'].includes(body.order_source) ? body.order_source : 'admin';
    if (!projectId) return Response.json({ error: 'project_order_id_required' }, { status: 400 });

    const project = await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(() => null);
    if (!project) return Response.json({ error: 'project_not_found' }, { status: 404 });
    if (!['approved','in_production','ready','delivered'].includes(project.status)) {
      return Response.json({ error: 'offer_must_be_approved_first' }, { status: 409 });
    }

    const totalExVat = Number(project.total_price || 0);
    if (!(totalExVat > 0)) return Response.json({ error: 'missing_total_price' }, { status: 409 });
    const half = Math.round(totalExVat * 50) / 100;

    let production = (await base44.asServiceRole.entities.ProductionOrder.filter({ project_order_id: projectId }, '-created_date', 1))?.[0] || null;
    const payments = await base44.asServiceRole.entities.ProjectPayment.filter({ project_order_id: projectId });
    let deposit = (payments || []).find((p:any) => p.payment_type === 'deposit') || null;
    let finalPayment = (payments || []).find((p:any) => p.payment_type === 'final') || null;

    const today = new Date();
    const depositDue = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);
    const amountIncVat = Math.round(half * (1 + VAT_RATE/100) * 100) / 100;

    if (!deposit) {
      const pdf = buildPaymentPdf(project, 'deposit', half, depositDue);
      const invoiceUrl = await uploadPdf(base44, pdf, `ZALOHA-50-${project.quote_number || project.id}.pdf`);
      deposit = await base44.asServiceRole.entities.ProjectPayment.create({
        project_order_id: projectId,
        inquiry_number: project.inquiry_id || '',
        quote_number: project.quote_number || '',
        client_name: project.client_name || '',
        client_email: project.client_email || '',
        payment_type: 'deposit',
        invoice_url: invoiceUrl,
        amount_ex_vat: half,
        vat_rate: VAT_RATE,
        amount_inc_vat: amountIncVat,
        deposit_percent: 50,
        status: 'issued',
        issued_at: new Date().toISOString(),
        due_date: depositDue,
        production_release_required: true,
        notes: '50% zálohová výzva. Výroba se uvolní až po potvrzení úhrady.',
      });
      await base44.asServiceRole.entities.MisterDocument.create({
        project_order_id: projectId, client_email: project.client_email || '', product_slug: project.product_slug || '',
        document_type: 'deposit', title: 'Zálohová výzva k úhradě 50 %', file_url: invoiceUrl,
        version: '1', client_visible: true, source: 'generated', sort_order: 80,
      }).catch(() => null);
    }

    if (!finalPayment) {
      const placeholderDue = project.completion_date || project.delivery_date || new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0,10);
      const pdf = buildPaymentPdf(project, 'final', half, placeholderDue);
      const invoiceUrl = await uploadPdf(base44, pdf, `DOPLATEK-50-${project.quote_number || project.id}.pdf`);
      finalPayment = await base44.asServiceRole.entities.ProjectPayment.create({
        project_order_id: projectId,
        inquiry_number: project.inquiry_id || '',
        quote_number: project.quote_number || '',
        client_name: project.client_name || '',
        client_email: project.client_email || '',
        payment_type: 'final',
        invoice_url: invoiceUrl,
        amount_ex_vat: half,
        vat_rate: VAT_RATE,
        amount_inc_vat: amountIncVat,
        deposit_percent: 50,
        status: 'draft',
        due_date: placeholderDue,
        production_release_required: false,
        notes: 'Připravený podklad pro doplatek 50 %. Finální doklad potvrdit ke dni předání.',
      });
      await base44.asServiceRole.entities.MisterDocument.create({
        project_order_id: projectId, client_email: project.client_email || '', product_slug: project.product_slug || '',
        document_type: 'final_payment', title: 'Doplatek 50 % — podklad k předání', file_url: invoiceUrl,
        version: '1', client_visible: true, source: 'generated', sort_order: 90,
      }).catch(() => null);
    }

    if (!production) {
      production = await base44.asServiceRole.entities.ProductionOrder.create({
        project_order_id: projectId,
        inquiry_id: project.inquiry_id || '',
        quote_number: project.quote_number || '',
        client_name: project.client_name || '',
        client_email: project.client_email || '',
        product_slug: project.product_slug || '',
        product_name: project.product_name || project.project_name || '',
        order_source: orderSource,
        source_reference: String(body.source_reference || ''),
        status: deposit.status === 'paid' ? 'deposit_paid' : 'awaiting_deposit',
        total_price_ex_vat: totalExVat,
        deposit_amount_ex_vat: half,
        final_amount_ex_vat: Math.round((totalExVat - half) * 100) / 100,
        deposit_payment_id: deposit.id,
        final_payment_id: finalPayment.id,
        signature_name: SIGNATURE,
        production_notes: 'Výroba nesmí být spuštěna před potvrzením úhrady 50% zálohy.',
      });
    } else {
      production = await base44.asServiceRole.entities.ProductionOrder.update(production.id, {
        deposit_payment_id: deposit.id,
        final_payment_id: finalPayment.id,
        status: deposit.status === 'paid' && production.status === 'awaiting_deposit' ? 'deposit_paid' : production.status,
      });
    }

    return Response.json({ ok: true, production_order: production, deposit_payment: deposit, final_payment: finalPayment }, {
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'production_workflow_failed' }, { status: 500 });
  }
});