import { createClientFromRequest } from 'npm:@base44/sdk@0.8.61';
const PORTAL=149778217,PIPELINE='4351532258',STAGE='6441744588';
const HEADERS={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const clean=(v,n=240)=>String(v||'').trim().replace(/[\r\n]/g,' ').slice(0,n);
const emailKey=v=>clean(v,254).toLowerCase();
const isEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
async function hub(token,method,path,body) {
  const res=await fetch('https://api.hubapi.com'+path,{method,headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!res.ok)throw new Error('hubspot_http_'+res.status);
  if(res.status===204)return {};
  const text=await res.text();return text?JSON.parse(text):{};
}
async function match(token,kind,property,value) {
  const result=await hub(token,'POST','/crm/v3/objects/'+kind+'/search',{filterGroups:[{filters:[{propertyName:property,operator:'EQ',value}]}],properties:[property],limit:2});
  return Array.isArray(result.results)?result.results:[];
}
async function associate(token,fromType,fromId,toType,toId) {
  const p='/crm/v4/objects/'+fromType+'/'+encodeURIComponent(fromId)+'/associations/default/'+toType+'/'+encodeURIComponent(toId);
  await hub(token,'PUT',p);
}
export default async function(req) {
  const base44=createClientFromRequest(req),user=await base44.auth.me().catch(()=>null);
  if(!user||user.role!=='admin')return Response.json({ok:false,error:'admin_required'},{status:403,headers:HEADERS});
  if(req.method!=='POST')return Response.json({ok:false,error:'method_not_allowed'},{status:405,headers:HEADERS});
  const input=await req.json().catch(()=>({})),projectId=clean(input.project_id,100);
  if(!/^[a-zA-Z0-9_-]{8,100}$/.test(projectId))return Response.json({ok:false,error:'invalid_project'},{status:400,headers:HEADERS});
  try{
    const project=await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(()=>null);
    if(!project)return Response.json({ok:false,error:'project_not_found'},{status:404,headers:HEADERS});
    const to=emailKey(project.client_email),name=clean(project.client_name),company=clean(project.client_company,150);
    if(!isEmail(to))return Response.json({ok:false,error:'invalid_customer_email'},{status:422,headers:HEADERS});
    const sourceId=clean(project.inquiry_id||projectId,80);
    const dealname='MLŽIDLA.cz – Poptávka '+sourceId;
    const connection=await base44.asServiceRole.connectors.getConnection('hubspot');
    if(!connection?.accessToken)throw new Error('hubspot_auth_missing');
    const token=connection.accessToken,identity=await hub(token,'GET','/integrations/v1/me');
    const portal=Number(identity.portalId||identity.hubId||0);
    if(portal!==PORTAL)return Response.json({ok:false,error:'wrong_portal',expected:PORTAL,connected:portal},{status:409,headers:HEADERS});
    const [contacts,deals,companies]=await Promise.all([
      match(token,'contacts','email',to),
      match(token,'deals','dealname',dealname),
      company?match(token,'companies','name',company):Promise.resolve([])
    ]);
    if(contacts.length>1||deals.length>1||companies.length>1)return Response.json({ok:false,error:'ambiguous_match_requires_review'},{status:409,headers:HEADERS});
    const preview={
      ok:true,portal_id:PORTAL,project_id:projectId,source_id:sourceId,email:to,name,company,dealname,
      contact_id:contacts[0]?.id||null,company_id:companies[0]?.id||null,deal_id:deals[0]?.id||null,
      actions:[
        contacts.length?'Zachovat existující kontakt':'Založit nový kontakt podle e-mailu',
        company?(companies.length?'Zachovat existující firmu':'Založit firmu bez odhadované domény'):'Firma neuvedena',
        deals.length?'Zachovat existující Deal':'Založit Deal ve fázi Nová poptávka',
        'Propojit kontakt, firmu a Deal bez změny již uložených údajů'
      ],write_required:!contacts.length||!deals.length||(!!company&&!companies.length)
    };
    if(input.action!=='sync')return Response.json(preview,{headers:HEADERS});
    if(input.confirm_sync!==true||input.expected_email!==to||input.expected_project_id!==projectId||
      input.expected_portal_id!==PORTAL)return Response.json({ok:false,error:'explicit_confirmation_required'},{status:403,headers:HEADERS});
    let contactId=preview.contact_id, companyId=preview.company_id,dealId=preview.deal_id;
    if(!contactId) {
      const parts=name.split(/\s+/).filter(Boolean);
      const props={email:to,...(parts[0]?{firstname:parts[0]}:{}),...(parts.length>1?{lastname:parts.slice(1).join(' ')}:{})};
      const created=await hub(token,'POST','/crm/v3/objects/contacts',{properties:props});
      contactId=created.id;
    }
    if(company&&!companyId) {
      const created=await hub(token,'POST','/crm/v3/objects/companies',{properties:{name:company}});
      companyId=created.id;
    }
    if(!dealId) {
      const description=['Zdroj: webová poptávka MLŽIDLA.cz','Base44 ID: '+sourceId,
        'Produkt: '+clean(project.product_name),'Poptávka: '+clean(project.project_name,180)].join('\n');
      const created=await hub(token,'POST','/crm/v3/objects/deals',{properties:{
        dealname,pipeline:PIPELINE,dealstage:STAGE,description
      }});
      dealId=created.id;
    }
    let linked=true;
    try{
      await associate(token,'deals',dealId,'contacts',contactId);
      if(companyId) {
        await associate(token,'contacts',contactId,'companies',companyId);
        await associate(token,'deals',dealId,'companies',companyId);
      }
    }catch{linked=false;}
    return Response.json({ok:true,crm_synced:true,portal_id:PORTAL,contact_id:contactId,company_id:companyId||null,
      deal_id:dealId,associated:linked,association_warning:linked?null:'Vazby CRM vyžadují ověření nebo oprávnění.',source_id:sourceId,
      deal_url:'https://app-eu1.hubspot.com/contacts/'+PORTAL+'/record/0-3/'+dealId},
      {headers:HEADERS});
  }catch(e){const m=String(e?.message||e);return Response.json({ok:false,error:/^hubspot_http_\d{3}$/.test(m)?m:'crm_sync_unavailable'},{status:503,headers:HEADERS});}
}