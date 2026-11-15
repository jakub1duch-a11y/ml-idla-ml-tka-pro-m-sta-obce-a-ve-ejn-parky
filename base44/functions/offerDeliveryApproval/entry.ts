import { createClientFromRequest } from 'npm:@base44/sdk@0.8.61';
import { buildClientOfferEmail, loadOfferEmailData } from '../../shared/clientOfferEmail.ts';
import { buildMimeMessage, mimeToBase64Url } from '../../shared/customerEmails.ts';
import { assertBusinessAccount, getVerifiedGoogleAccount } from '../../shared/businessWorkflowGuard.mjs';
const APP='6a3ee88c10959cd3588c4d68', HUB=149778217, SENDER='meduna@holmtec.cz';
const H={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const safe=v=>String(v||'').trim().replace(/[\r\n]/g,' ').slice(0,250);
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const arr=v=>Array.isArray(v)?v:(v?.items||[]);
const checks=['recipient_and_pdf','product_and_geometry','pricing_vat','brand_and_attachments'];
function source(url) {
  try {
    const u=new URL(url);
    if(u.protocol!=='https:')return null;
    const drive=u.hostname==='drive.google.com'&&u.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]{15,})/);
    if(drive)return {kind:'drive',id:drive[1]};
    if(u.hostname==='base44.app'&&u.pathname.startsWith('/api/apps/'+APP+'/files/mp/public/'))return {kind:'base44',url:u.href};
  }catch{}
  return null;
}
async function json(url,token,body=null) {
  const r=await fetch(url,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,redirect:'error',signal:AbortSignal.timeout(14000)});
  if(!r.ok)throw new Error('http_'+r.status);
  return await r.json();
}
async function pdf(base44,url,name) {
  const s=source(url);if(!s)throw new Error('pdf_untrusted_url');
  let r;
  if(s.kind==='drive') {
    const c=await base44.asServiceRole.connectors.getConnection('googledrive');
    assertBusinessAccount(await getVerifiedGoogleAccount(c?.accessToken,'googledrive'),'googledrive');
    r=await fetch('https://www.googleapis.com/drive/v3/files/'+s.id+'?alt=media',{headers:{Authorization:'Bearer '+c.accessToken},redirect:'error',signal:AbortSignal.timeout(20000)});
  }else r=await fetch(s.url,{redirect:'error',signal:AbortSignal.timeout(20000)});
  if(!r.ok||Number(r.headers.get('content-length')||0)>8000000)throw new Error('pdf_unavailable');
  const bytes=new Uint8Array(await r.arrayBuffer());
  if(bytes.length<5||bytes.length>8000000||new TextDecoder().decode(bytes.subarray(0,5))!=='%PDF-')throw new Error('pdf_invalid');
  return {filename:name,content:bytes,contentType:'application/pdf'};
}
export default async function(req) {
  const base44=createClientFromRequest(req),user=await base44.auth.me().catch(()=>null);
  if(!user||user.role!=='admin')return Response.json({ok:false,error:'admin_required'},{status:403,headers:H});
  if(req.method!=='POST')return Response.json({ok:false,error:'method_not_allowed'},{status:405,headers:H});
  const input=await req.json().catch(()=>({})),id=safe(input.project_id);
  if(!/^[a-zA-Z0-9_-]{8,100}$/.test(id))return Response.json({ok:false,error:'invalid_project'},{status:400,headers:H});
  try{
    const loaded=await loadOfferEmailData(base44,id);
    if(!loaded)return Response.json({ok:false,error:'not_found'},{status:404,headers:H});
    const {project,data}=loaded,to=safe(project.client_email).toLowerCase(),email=buildClientOfferEmail(data);
    const blockers=[];
    if(!emailOk(to))blockers.push('Neplatná adresa zákazníka.');
    if(!project.quote_pdf_url||!source(project.quote_pdf_url))blockers.push('Chybí ověřitelné cenové PDF.');
    if(!project.quote_number||!Number(project.total_price)||Number(project.total_price)<=0)blockers.push('Číslo nabídky nebo ověřená cena chybí.');
    if(!project.valid_until||Date.parse(project.valid_until)<Date.now()||Number.isNaN(Date.parse(project.valid_until)))blockers.push('Není potvrzena aktuální platnost nabídky.');
    if(!['draft','draft_ready_for_review','pending_approval'].includes(project.status))blockers.push('Nabídka není v režimu konceptu k odeslání.');
    const inquiry=project.inquiry_type==='poptavka'&&project.inquiry_id?await base44.asServiceRole.entities.Poptavka.get(project.inquiry_id).catch(()=>null):null;
    const runs=arr(await base44.asServiceRole.entities.OfferAgentRun.filter({project_order_id:id}).catch(()=>[]));
    if(inquiry?.offer_status!=='schvaleno'&&!runs.some(r=>r.run_status==='approved'&&r.qa_passed===true&&r.approved_by))blockers.push('Chybí schválení nabídky v administraci.');
    const existing=arr(await base44.asServiceRole.entities.OfferDeliveryReview.filter({project_order_id:id}).catch(()=>[])).find(x=>x.status==='gmail_draft'&&x.gmail_draft_id);
    if(existing)blockers.push('Pro tento projekt již existuje Gmail koncept.');
    let hubId=null;
    try{
      const c=await base44.asServiceRole.connectors.getConnection('hubspot');
      const portal=await json('https://api.hubapi.com/integrations/v1/me',c.accessToken);
      if(Number(portal.portalId||portal.hubId)!==HUB)blockers.push('Nesprávný HubSpot portál.');
      else if(emailOk(to)){
        const found=await json('https://api.hubapi.com/crm/v3/objects/contacts/search',c.accessToken,{filterGroups:[{filters:[{propertyName:'email',operator:'EQ',value:to}]}],properties:['email'],limit:2});
        if(found.results?.length!==1)blockers.push('Kontakt v HubSpotu chybí nebo není jednoznačný.');
        else hubId=found.results[0].id;
      }
    }catch{blockers.push('Nelze ověřit HubSpot OAuth.');}
    const details={ok:true,project_id:id,recipient:to,subject:email.subject,html:email.html,text:email.text,attachments:data.attachments,
      blockers,hubspot_portal_id:HUB,hubspot_contact_id:hubId,existing_draft_id:existing?.gmail_draft_id||null,
      can_create_draft:blockers.length===0,required_checks:checks,quote_pdf_url:project.quote_pdf_url};
    if(input.action!=='create_draft')return Response.json(details,{headers:H});
    if(blockers.length)return Response.json({ok:false,error:'blocked',blockers},{status:409,headers:H});
    if(input.confirm_create!==true||input.expected_recipient!==to||input.expected_pdf_url!==project.quote_pdf_url||
      !checks.every(c=>Array.isArray(input.confirmed_checks)&&input.confirmed_checks.includes(c)))return Response.json({ok:false,error:'approval_required'},{status:403,headers:H});
    const c=await base44.asServiceRole.connectors.getConnection('gmail');
    assertBusinessAccount(await getVerifiedGoogleAccount(c?.accessToken,'gmail'),'gmail');
    const key=safe(project.quote_number).replace(/[^a-zA-Z0-9_-]/g,'_');
    const attachments=[await pdf(base44,project.quote_pdf_url,'MLZIDLA_'+key+'_NABIDKA.pdf')];
    if(project.presentation_pdf_url)attachments.push(await pdf(base44,project.presentation_pdf_url,'MLZIDLA_'+key+'_PREZENTACE.pdf'));
    const mime=buildMimeMessage({to,fromEmail:SENDER,subject:safe(email.subject),text:email.text,html:email.html,attachments});
    const created=await json('https://gmail.googleapis.com/gmail/v1/users/me/drafts',c.accessToken,{message:{raw:mimeToBase64Url(mime)}});
    if(!created.id)throw new Error('draft_unconfirmed');
    let auditSaved=false;
    try{await base44.asServiceRole.entities.OfferDeliveryReview.create({project_order_id:id,inquiry_id:project.inquiry_id||'',
      status:'gmail_draft',recipient:to,subject:safe(email.subject),expected_pdf_url:project.quote_pdf_url,
      gmail_draft_id:created.id,gmail_message_id:created.message?.id||'',hubspot_portal_id:String(HUB),hubspot_contact_id:hubId||'',
      approved_by:user.email||'admin',approved_at:new Date().toISOString(),created_via:'admin_review',approval_checklist:checks});
      auditSaved=true;}catch{}
    return Response.json({ok:true,draft_created:true,gmail_draft_id:created.id,recipient:to,attachments:attachments.map(x=>x.filename),audit_saved},{headers:H});
  }catch(e){const m=String(e?.message||e);return Response.json({ok:false,error:/^(pdf_|Nesprávný účet|Není ověřena identita|Chybí autorizace)/.test(m)?m.slice(0,150):'delivery_unavailable'},{status:503,headers:H});}
}