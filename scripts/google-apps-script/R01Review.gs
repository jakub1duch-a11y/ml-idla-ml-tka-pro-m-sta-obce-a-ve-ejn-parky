/**
 * HolmTec R01 – isolated read-only diagnostic for the existing Apps Script project.
 * Do not replace existing doGet, doPost or production functions with this file.
 */
function holmtecR01ReadOnlyProbe() {
  const key = PropertiesService.getScriptProperties().getProperty('BASE44_API_KEY');
  if (!key) throw new Error('Chybí BASE44_API_KEY.');
  const base = 'https://app.base44.com/api/apps/6a3ee88c10959cd3588c4d68/entities/';
  const entities = ['ContactInquiry','Poptavka','B2BLead','WebAdvisorLead','VisualizerLead','ProjectOrder'];
  const results = entities.map(function(name) {
    try {
      const res = UrlFetchApp.fetch(base + encodeURIComponent(name) + '?limit=1', {
        method:'get', headers:{api_key:key,Authorization:'Bearer '+key,Accept:'application/json'},
        muteHttpExceptions:true, followRedirects:false
      });
      const status=res.getResponseCode();
      if(status!==200) return {entity:name,ok:false,http:status};
      const p=JSON.parse(res.getContentText());
      const rows=Array.isArray(p)?p:(p && (p.items || p.data));
      if(!Array.isArray(rows)) return {entity:name,ok:false,http:status,error:'invalid_shape'};
      return {entity:name,ok:true,http:status,sampleCount:rows.length};
    } catch (_) { return {entity:name,ok:false,error:'request_failed'}; }
  });
  const result={ok:results.every(function(x){return x.ok;}),mode:'read-only',entities:results};
  Logger.log(JSON.stringify(result));
  return result;
}

function holmtecR01NormalizeBt_(value) {
  return String(value || '').replace(/\s+/g,' ').trim().toUpperCase();
}

/** Call from both Kanban and onEdit, after verifying a unique BT row and current revision. */
function holmtecR01ValidatePhase_(bt,cn,oldPhase,newPhase,allowedPhases,orderPhases,offerPhases,sentRows) {
  const id=holmtecR01NormalizeBt_(bt);
  const quote=holmtecR01NormalizeBt_(cn);
  if(!id) return {valid:false,reason:'BEZ_BT'};
  if(!allowedPhases.includes(newPhase)) return {valid:false,reason:'UNKNOWN_PHASE'};
  if(orderPhases.includes(oldPhase) && offerPhases.includes(newPhase))
    return {valid:false,reason:'T03'};
  if(newPhase==='Nabídka odeslána' && (!quote || !sentRows.some(function(r){
    return String(r[0]||'').trim().toUpperCase()==='SENT' &&
      holmtecR01NormalizeBt_(r[19])===id && holmtecR01NormalizeBt_(r[20])===quote;
  }))) return {valid:false,reason:'T02'};
  return {valid:true,reason:'OK'};
}

/** Verified entity schema fields; BT pairing intentionally remains unresolved. */
function holmtecR01MapRecord_(entity,r) {
  if(!r || !r.id) return null;
  if(entity==='VisualizerLead' && (r.inquiry_sent!==true || r.gdpr_acknowledged!==true)) return null;
  if(entity==='WebAdvisorLead' && r.consent!==true) return null;
  const m={
    ContactInquiry:[r.name,'',r.email,r.phone,r.service_type],
    Poptavka:[r.jmeno,r.firma,r.email,r.telefon,r.contact_source],
    B2BLead:[r.contactPerson,r.companyName,r.email,r.phone,r.projectType],
    WebAdvisorLead:[r.name,'',r.email,r.phone,r.source_page],
    VisualizerLead:[r.name,r.company,r.email,r.phone,r.source],
    ProjectOrder:[r.client_name,r.client_company,r.client_email,r.client_phone,'ProjectOrder']
  }[entity];
  if(!m) return null;
  return {id:String(r.id),entity:entity,name:m[0]||'',company:m[1]||'',email:m[2]||'',phone:m[3]||'',
    source:m[4]||'',bt:null,btStatus:'K OVĚŘENÍ',kind:entity==='ProjectOrder'?'order':'inquiry'};
}
