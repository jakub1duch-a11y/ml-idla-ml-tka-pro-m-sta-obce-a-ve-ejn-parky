import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({error:'Forbidden'}, {status:403});
    const body = await req.json();
    if (body.action === 'mark_sent') {
      if (!body.notice_id) return Response.json({error:'Missing notice_id'}, {status:400});
      await base44.asServiceRole.entities.AdminInquiryNotice.update(body.notice_id, {status:'sent'});
      return Response.json({ok:true});
    }
    if (!['Poptavka','ContactInquiry'].includes(body.entity_name) || !body.inquiry_id) return Response.json({error:'Invalid inquiry'}, {status:400});
    const inquiry = await base44.asServiceRole.entities[body.entity_name].get(body.inquiry_id);
    if (!inquiry) return Response.json({error:'Not found'}, {status:404});
    const admins = await base44.asServiceRole.entities.User.filter({role:'admin'});
    const recipients = [...new Set(admins.map(a=>a.email).filter(Boolean))];
    if (body.dry_run === true) return Response.json({ok:true,dry_run:true,recipient_count:recipients.length,entity_name:body.entity_name,inquiry_id:inquiry.id});
    const results = [];
    // Single creates intentionally fire the per-recipient delivery workflow.
    for (const recipient of recipients) {
      const dedup_key = `admin-inquiry-v1:${body.entity_name}:${inquiry.id}:${recipient}`;
      const existing = await base44.asServiceRole.entities.AdminInquiryNotice.filter({dedup_key}, {limit:1});
      if (existing.items.length) {results.push({skipped:true}); continue;}
      await base44.asServiceRole.entities.AdminInquiryNotice.create({
        dedup_key, recipient, entity_name:body.entity_name, inquiry_id:inquiry.id, status:'pending',
        customer_name:escape(inquiry.jmeno || inquiry.name),customer_email:escape(inquiry.email),
        customer_phone:escape(inquiry.telefon || inquiry.phone),company:escape(inquiry.firma || inquiry.company),
        product:escape(inquiry.produkt || inquiry.product_id),message:escape(inquiry.zprava || inquiry.message),
        source:escape(inquiry.service_type || (body.entity_name === 'Poptavka' ? 'Poptávkový formulář' : 'Kontaktní formulář')),
        received_at:escape(new Date(inquiry.created_date).toLocaleString('cs-CZ',{timeZone:'Europe/Prague'}))
      });
      results.push({queued:true});
    }
    return Response.json({ok:true,queued:results.filter(r=>r.queued).length,skipped:results.filter(r=>r.skipped).length});
  } catch(error) {return Response.json({error:error.message}, {status:500});}
}