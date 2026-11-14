import { createClientFromRequest } from 'npm:@base44/sdk@0.8.61';
import { assertBusinessAccount, getVerifiedGoogleAccount } from '../../shared/businessWorkflowGuard.mjs';

// MLŽIDLA.cz first-outreach workflow. Drafts ONLY: no Gmail send endpoint.
const SHEET_ID = '1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE';
const HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const clean = (v: unknown, max = 600) => String(v ?? '').trim().slice(0, max);
const emailKey = (v: unknown) => clean(v, 254).toLowerCase();
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const htmlEscape = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const A1 = (name: string, range: string) => `'${name.replace(/'/g, "''")}'!${range}`;

async function apiJSON(url: string, token: string, method = 'GET', body?: unknown) {
  const response = await fetch(url, {method, headers: { Authorization: `Bearer ${token}`, ...(body ? {'Content-Type':'application/json'} : {}) }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(16000)});
  if (!response.ok) throw new Error(`remote_http_${response.status}`);
  return response.json();
}
async function values(token: string, name: string, range: string) {
  const path = encodeURIComponent(A1(name, range));
  const out = await apiJSON(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${path}`, token);
  return Array.isArray(out?.values) ? out.values : [];
}
function driveId(url: string) {
  const text = clean(url, 1000);
  if (!/^https:\/\/drive\.google\.com\//i.test(text)) return null;
  return text.match(/\/file\/d\/([a-zA-Z0-9_-]{12,})/)?.[1] || text.match(/[?&]id=([a-zA-Z0-9_-]{12,})/)?.[1] || null;
}
async function asset(token: string, rawUrl: string, kind: 'pdf'|'image') {
  const id = driveId(rawUrl);
  if (!id) return {ok:false, reason:'Příloha nemá platný odkaz na soubor Drive.'};
  try {
    const meta = await apiJSON(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?fields=id,name,mimeType,size,trashed`, token);
    if (meta.trashed || Number(meta.size || 0) > 8000000 || Number(meta.size || 0) <= 0) return {ok:false,reason:'Příloha je nedostupná nebo překračuje bezpečný limit 8 MB.'};
    const allowed = kind === 'pdf' ? meta.mimeType === 'application/pdf' : ['image/jpeg','image/png'].includes(meta.mimeType);
    if (!allowed) return {ok:false,reason:kind === 'pdf'?'Přílohou musí být PDF.':'Obrázek do e-mailu musí být JPG/PNG (nikoli WebP).'};
    return {ok:true,id, name:clean(meta.name,180), mime:meta.mimeType, size:Number(meta.size)};
  } catch {return {ok:false,reason:'Přílohu nelze ověřit v autorizovaném firemním Disku.'};}
}
function b64(bytes: Uint8Array) {
  let text = '';
  for (let i=0;i<bytes.length;i+=8192) text += String.fromCharCode(...bytes.subarray(i,i+8192));
  return btoa(text);
}
const b64text=(s: string)=>b64(new TextEncoder().encode(s));
const b64url=(s: string)=>b64text(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const lines=(value: string)=>value.match(/.{1,76}/g)?.join('\r\n') || '';
async function download(token: string, id: string) {
  const resp=await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media`,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(24000)});
  if(!resp.ok) throw new Error('drive_download_unavailable');
  const content=new Uint8Array(await resp.arrayBuffer());
  if(content.length>8000000 || !content.length) throw new Error('attachment_size_invalid');
  return content;
}
function mailMime(to: string, subject: string, body: string, preview: any, photo: Uint8Array, pdf: any, pdfBytes: Uint8Array) {
  const mixed='MLZ_MIXED_2026_'+crypto.randomUUID().replace(/-/g,'');
  const related='MLZ_RELATED_'+crypto.randomUUID().replace(/-/g,'');
  const alt='MLZ_ALT_'+crypto.randomUUID().replace(/-/g,'');
  const html=`<!doctype html><html lang="cs"><body style="font-family:Arial,Helvetica,sans-serif;color:#12293b;max-width:640px;margin:auto"><div style="font-size:22px;font-weight:700;margin:18px 0;color:#102b3a">MLŽIDLA.cz</div><div style="white-space:pre-line;line-height:1.65;font-size:15px">${htmlEscape(body)}</div><div style="margin-top:24px"><img alt="Schválený náhled MLŽIDLA.cz" src="cid:mlzidla-preview" style="max-width:100%;height:auto" /></div><p style="font-size:12px;color:#475569">Česká výroba HolmTec · <a href="https://mlzidla.cz">mlzidla.cz</a></p></body></html>`;
  const join=(...segments: string[])=>segments.join('\r\n');
  const bodyMime=join(
    'MIME-Version: 1.0',`To: ${to}`,`Subject: =?UTF-8?B?${b64text(subject)}?=`,
    `Content-Type: multipart/mixed; boundary="${mixed}"`,'',
    `--${mixed}`,`Content-Type: multipart/related; boundary="${related}"`,'',
    `--${related}`,`Content-Type: multipart/alternative; boundary="${alt}"`,'',
    `--${alt}`,'Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: base64','',lines(b64text(body)),'',
    `--${alt}`,'Content-Type: text/html; charset=UTF-8','Content-Transfer-Encoding: base64','',lines(b64text(html)),'',
    `--${alt}--`,'',`--${related}`,
    `Content-Type: ${preview.mime}; name="preview.jpg"`,'Content-Disposition: inline; filename="preview.jpg"','Content-ID: <mlzidla-preview>','Content-Transfer-Encoding: base64','',lines(b64(photo)),'',
    `--${related}--`,'',`--${mixed}`,'Content-Type: application/pdf; name="mlzidla-nabidka.pdf"','Content-Disposition: attachment; filename="mlzidla-nabidka.pdf"','Content-Transfer-Encoding: base64','',lines(b64(pdfBytes)),'',`--${mixed}--`,'');
  return b64url(bodyMime);
}
export default async function(req: Request) {
  const base44=createClientFromRequest(req);
  const user=await base44.auth.me().catch(()=>null);
  if (!user) return Response.json({ok:false,error:'unauthorized'},{status:401,headers:HEADERS});
  if (user.role!=='admin') return Response.json({ok:false,error:'forbidden'},{status:403,headers:HEADERS});
  if (req.method!=='POST') return Response.json({ok:false,error:'method_not_allowed'},{status:405,headers:HEADERS});
  const input=await req.json().catch(()=>({}));
  const action=input?.action==='draft'?'draft':'preview';
  const id=clean(input?.contact_id,80);
  if(!id) return Response.json({ok:false,error:'contact_required'},{status:400,headers:HEADERS});
  try {
    const contact=await base44.asServiceRole.entities.CrmContact.get(id);
    const email=emailKey(contact?.email);
    if(!contact || !isEmail(email) || contact.sheet_name!=='KONTAKTY – VŠE' || !Number.isInteger(Number(contact.sheet_row)) || Number(contact.sheet_row)<2) {
      return Response.json({ok:false,error:'unsupported_contact_source'},{status:409,headers:HEADERS});
    }
    const sheetsConnection=await base44.asServiceRole.connectors.getConnection('googlesheets');
    const gmailConnection=await base44.asServiceRole.connectors.getConnection('gmail');
    const [sheetsAccount,gmailAccount]=await Promise.all([getVerifiedGoogleAccount(sheetsConnection?.accessToken,'googlesheets'),getVerifiedGoogleAccount(gmailConnection?.accessToken,'gmail')]);
    assertBusinessAccount(sheetsAccount,'googlesheets');assertBusinessAccount(gmailAccount,'gmail');
    const [result,suppressed,other]=await Promise.all([
      values(sheetsConnection.accessToken,'KONTAKTY – VŠE',`A${contact.sheet_row}:N${contact.sheet_row}`),
      values(sheetsConnection.accessToken,'NEOSLOVOVAT – Ecomail','A2:A1000'),
      values(sheetsConnection.accessToken,'KONTAKTY – VŠE','A2:I2000'),
    ]);
    const row=result[0]||[];
    const rawStatus=clean(row[8],200);const sheetEmail=emailKey(row[5]);
    const blockers: string[]=[];
    if(sheetEmail!==email)blockers.push('Zdrojový řádek se změnil nebo neodpovídá kontaktu.');
    if(!/^Neosloveno(?:\b|\s|$)/i.test(rawStatus))blockers.push('Kontakt nemá ve zdrojové tabulce potvrzený stav Neosloveno.');
    if(contact.status!=='new')blockers.push('CRM kontakt již není ve stavu Nový.');
    if(suppressed.some((r:unknown[])=>emailKey(r[0])===email))blockers.push('Kontakt je v seznamu NEOSLOVOVAT.');
    const firm=clean(row[0],200).toLocaleLowerCase('cs-CZ');
    if(other.some((r:unknown[],idx:number)=>idx+2!==Number(contact.sheet_row)&&clean(r[0],200).toLocaleLowerCase('cs-CZ')===firm&&firm&&/osloveno|odesláno|odeslano|odpově|pozastaveno/i.test(clean(r[8],160))))blockers.push('Jiný kontakt stejné organizace již byl osloven.');
    const qs=['in:sent','in:drafts','in:inbox'].map(s=>`${s} ${s==='in:inbox'?'from':'to'}:${email}`);
    const matched=await Promise.all(qs.map(q=>apiJSON(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=1&q=${encodeURIComponent(q)}`,gmailConnection.accessToken)));
    if(matched[0]?.messages?.length)blockers.push('Gmail SENT obsahuje předchozí odeslání tomuto příjemci.');
    if(matched[1]?.messages?.length)blockers.push('Gmail již obsahuje koncept pro tohoto příjemce.');
    if(matched[2]?.messages?.length)blockers.push('Gmail obsahuje příchozí zprávu – nejprve zpracovat reakci.');
    let driveToken='';let pdf={ok:false,reason:'Firemní Google Drive není ověřen.'};let image={ok:false,reason:'Firemní Google Drive není ověřen.'};
    try {
      const drive=await base44.asServiceRole.connectors.getConnection('googledrive');
      const who=await getVerifiedGoogleAccount(drive?.accessToken,'googledrive');assertBusinessAccount(who,'googledrive');
      driveToken=drive.accessToken;
      [pdf,image]=await Promise.all([asset(driveToken,clean(row[12],1000),'pdf'),asset(driveToken,clean(row[13],1000),'image')]);
    }catch {blockers.push('Firemní Drive není připojen jako meduna@holmtec.cz nebo nelze ověřit.');}
    if(!pdf.ok)blockers.push(`PDF: ${pdf.reason}`);
    if(!image.ok)blockers.push(`Obrázek: ${image.reason}`);
    const inputText=clean(row[11],12000);
    const subject=inputText.match(/^Předmět:\s*(.+)$/mi)?.[1]?.trim()||'MLŽIDLA.cz | Designová mlžítka pro veřejný prostor';
    const body=inputText.replace(/^Předmět:\s*.+?\r?\n/m,'').replace(/\[[^\]]*Pod text vložit[^\]]*\]/gi,'').trim();
    if(body.length<100)blockers.push('Ve zdrojové tabulce chybí ověřený text prvního oslovení.');
    const view={ok:true,action:'preview',contact_id:id,email,organization:clean(row[0],200),source_status:rawStatus,subject,body,attachments:{pdf:pdf.ok?{name:pdf.name,size:pdf.size}:null,image:image.ok?{name:image.name,size:image.size}:null},blockers,can_create_draft:blockers.length===0,approval_required:true};
    if(action!=='draft')return Response.json(view,{headers:HEADERS});
    if(blockers.length || input?.confirm!=='VYTVORIT_KONCEPT' || input?.legal_basis_confirmed!==true || input?.source_row_status!==rawStatus)return Response.json({...view,ok:false,error:'draft_preflight_blocked'},{status:409,headers:HEADERS});
    const [photo,pdfBytes]=await Promise.all([download(driveToken,image.id),download(driveToken,pdf.id)]);
    const raw=mailMime(email,subject,body,image,photo,pdf,pdfBytes);
    const draft=await apiJSON('https://gmail.googleapis.com/gmail/v1/users/me/drafts',gmailConnection.accessToken,'POST',{message:{raw}});
    await base44.asServiceRole.entities.CrmContact.update(id,{status:'needs_action',action_required:true,next_step:`Gmail koncept ${clean(draft.id,80)} založen. Zkontrolovat PDF/obrázek, adresáta a ručně odeslat; SENT dosud nepotvrzen.`});
    await base44.asServiceRole.entities.CrmActivity.create({contact_email:email,contact_name:clean(contact.name,150),contact_company:clean(contact.organization,200),type:'email',subject:`Koncept: ${subject}`,description:`Gmail draft ID: ${clean(draft.id,80)}. Založeno pro ruční kontrolu a odeslání, neodesláno.`,status:'planned'});
    return Response.json({ok:true,action:'draft',created:true,draft_id:clean(draft.id,80),gmail_url:'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#drafts',sent:false},{headers:HEADERS});
  }catch(error){
    const message=String(error instanceof Error?error.message:error);
    const safe=/^(remote_http_\d{3}|draft_preflight_blocked|drive_download_unavailable|attachment_size_invalid)$/.test(message)?message:'outreach_preflight_unavailable';
    return Response.json({ok:false,error:safe},{status:503,headers:HEADERS});
  }
}
