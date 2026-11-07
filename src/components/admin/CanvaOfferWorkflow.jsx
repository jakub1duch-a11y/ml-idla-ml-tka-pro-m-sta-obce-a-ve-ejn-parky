import React, {useEffect,useMemo,useState} from 'react';
import {UploadCloud,FileText,Image as ImageIcon,CheckCircle2,AlertTriangle,ExternalLink,Mail,Loader2} from 'lucide-react';
import {base44} from '@/api/base44Client';

const TEMPLATE='https://www.canva.com/design?create=true&template=EAHZVIjydfU';
const SUPLA='https://www.canva.com/d/7kyHgos8ffmyKgX';
const PRODUCT_DESIGNS=[
 ['MRAK',/mrak/i,'https://www.canva.com/d/mODH-WpmRDPkbsx'],
 ['LINEA CE GATE',/linea.*(ce.*gate|gate)/i,'https://www.canva.com/d/GzNifrXYM7AXUCN'],
 ['LINEA CE 70',/linea.*ce/i,'https://www.canva.com/d/0NiClhAgRijVWDL'],
 ['LINEA TR60',/linea/i,'https://www.canva.com/d/AKDkRcF3s0ZatrT'],
 ['VOLAVKA GRACILIS',/volavka.*gracilis/i,'https://www.canva.com/d/tCQudENG1rF4CdS'],
 ['VOLAVKA GIGANTEA',/volavka/i,'https://www.canva.com/d/CMSxlP9Iqj87umY'],
 ['BENDY_60',/bendy/i,'https://www.canva.com/d/t5xJNIgEgEUrs0x'],
 ['AURA 700',/aura/i,'https://www.canva.com/d/xV4WrFEIzJU8NqU']
];
const REQUIRED=[
 {key:'offer',title:'Obrazová nabídka z Canvy',desc:'PDF s produktem a cenovým přehledem.',accept:'application/pdf,.pdf',label:'CANVA OBRAZOVA NABIDKA',icon:FileText,valid:x=>/canva/i.test(x?.title||'')&&/obrazova nabidka/i.test(x?.title||'')},
 {key:'preview',title:'Náhled z Canvy',desc:'WebP, JPG nebo PNG vložený do zprávy.',accept:'image/png,image/jpeg,image/webp',label:'CANVA NAHLED',icon:ImageIcon,valid:x=>/canva/i.test(x?.title||'')&&/nahled/i.test(x?.title||'')},
 {key:'supla',title:'Samostatný produktový list SUPLA',desc:'Povinná příloha, i když SUPLA zůstává volitelná.',accept:'application/pdf,.pdf',label:'CANVA SUPLA PRODUKTOVY LIST',icon:FileText,valid:x=>/canva/i.test(x?.title||'')&&/supla/i.test(x?.title||'')}
];
const rows=r=>Array.isArray(r)?r:Array.isArray(r?.items)?r.items:[];

export default function CanvaOfferWorkflow({item,order}) {
 const [assets,setAssets]=useState([]),[loading,setLoading]=useState(false),[busy,setBusy]=useState(''),[message,setMessage]=useState(''),[draftId,setDraftId]=useState('');
 const refresh=async()=>{if(!item?.id)return;setLoading(true);try{setAssets(rows(await base44.entities.OfferAsset.filter({inquiry_id:item.id})));}catch(e){setMessage('Přílohy nelze načíst: '+(e?.message||'chyba'));}finally{setLoading(false);}};
 useEffect(()=>{setMessage('');setDraftId('');void refresh();},[item?.id]);
 const checks=useMemo(()=>REQUIRED.map(x=>({...x,asset:assets.find(y=>x.valid(y)&&y.selected_for_offer)})),[assets]);
 const ready=checks.every(x=>Boolean(x.asset)),product=order?.product_name||item?.product||'';
 const matchedDesign=PRODUCT_DESIGNS.find(x=>x[1].test(product));
 const ref=order?.quote_number||('P-'+String(item?.id||'').slice(0,8).toUpperCase());
 const upload=async(type,file)=>{
  if(!file||!item)return;
  const pdf=file.type==='application/pdf'||/\.pdf$/i.test(file.name),img=/^image\/(png|jpeg|webp)$/.test(file.type);
  if((type.key==='preview'&&!img)||(type.key!=='preview'&&!pdf)){setMessage('Nevhodný formát: '+file.name);return;}
  if(file.size>19000000){setMessage('Soubor přesahuje 19 MB.');return;}
  setBusy(type.key);setMessage('');
  try{
   const uploaded=await base44.integrations.Core.UploadFile({file}),url=uploaded?.file_url||uploaded?.url;
   if(!url)throw Error('Nahrání souboru nevrátilo URL.');
   const previous=assets.find(a=>type.valid(a)&&a.selected_for_offer);
   const obj={inquiry_id:item.id,inquiry_type:item.entity==='ContactInquiry'?'contact':'poptavka',
    project_order_id:order?.id||'',file_url:url,file_name:type.label.replace(/\s+/g,'_')+'-'+ref+(type.key==='preview'?'.'+(file.name.split('.').pop()||'webp'):'.pdf'),
    file_type:type.key==='preview'?(file.type||'image/webp'):'application/pdf',asset_type:'other',title:type.label,
    description:'Canva export: '+file.name+'. Před použitím zkontrolovat cenu z Kalkulace 2026.',
    selected_for_offer:true,generated_by_ai:false};
   if(previous?.id)await base44.entities.OfferAsset.update(previous.id,obj);else await base44.entities.OfferAsset.create(obj);
   setMessage('Soubor byl uložen do nabídky: '+type.title);await refresh();
  }catch(e){setMessage('Nahrání selhalo: '+(e?.message||'chyba'));}finally{setBusy('');}
 };
 const createDraft=async()=>{
  if(!ready||!order||!item?.email||busy)return;
  setBusy('draft');setMessage('');setDraftId('');
  try{
   const response=await base44.functions.invoke('sendInquiryReply',{
    inquiry_type:item.entity==='ContactInquiry'?'contact':'poptavka',inquiry_id:item.id,sender_email:'meduna@holmtec.cz',email_type:'offer',
    quote_number:ref,quote_pdf_url:order.quote_pdf_url||checks[0]?.asset?.file_url||'',
    valid_until:order.valid_until||'',subject:'Návrh řešení a cenová nabídka '+ref+' | MLŽIDLA.cz',
    message:['Dobrý den,','navazujeme na Vaši poptávku. Přikládáme připravenou obrázkovou nabídku pro '+(product||'Váš projekt')+'.',
    'Přílohy obsahují PDF nabídku, obrázkový náhled a samostatný produktový list automatizace SUPLA. SUPLA je volitelná technologická nadstavba s vlastní cenou.','Rádi doplníme detaily a upřesníme technické řešení.'].join('\n\n'),
    project_summary:(item.message||'').slice(0,900)
   });
   const result=response?.data||response;
   if(!result?.ok||!result?.draft_id)throw Error(result?.error||result?.message||'Gmail nepotvrdil vytvoření konceptu.');
   setDraftId(result.draft_id);
   setMessage('Gmail koncept byl vytvořen v připojené schránce. Zkontrolujte obsah a přílohy.');
  }catch(e){
   const detail=e?.response?.data||e?.data||{};
   setMessage('Koncept se nepodařilo vytvořit: '+(detail?.message||e?.message||'chyba')+(Array.isArray(detail?.missing)?'; chybí: '+detail.missing.join(', '):''));
  }finally{setBusy('');}
 };
 if(!item)return null;
 return <section className="rounded-2xl border border-cyan-300/30 bg-cyan-400/5 p-5">
  <h3 className="text-sm font-semibold text-white">Canva → produktové listy → Gmail koncept</h3>
  <p className="mt-2 text-xs leading-5 text-white/60">Základem je šablona Mlžidla 2026. SUPLA list je povinný, ale řízení v ceně není automaticky. Cenu ověřit v Kalkulaci 2026.</p>
  <div className="mt-3 grid gap-2">
   <a href={TEMPLATE} target="_blank" rel="noreferrer" className="text-sm text-cyan-200 hover:underline"><ExternalLink size={13} className="mr-1 inline"/>Vytvořit nabídku z Canva šablony</a>
   {matchedDesign&&<a href={matchedDesign[2]} target="_blank" rel="noreferrer" className="text-sm text-cyan-200 hover:underline"><ExternalLink size={13} className="mr-1 inline"/>Produktový list: {matchedDesign[0]}</a>}
   <a href={SUPLA} target="_blank" rel="noreferrer" className="text-sm text-cyan-200 hover:underline"><ExternalLink size={13} className="mr-1 inline"/>Samostatný list SUPLA v Canvě</a>
  </div>
  <p className="mt-3 text-xs text-white/45">Po úpravě v Canvě vyexportujte PDF a obrázek. Tyto soubory vložte níže. Bez tří povinných příloh nelze dokončit koncept.</p>
  <div className="mt-4 space-y-3">{checks.map(x=>{
   return <div key={x.key} className="rounded-xl border border-white/10 bg-black/10 p-3">
    <div className="flex gap-2">{x.asset?<CheckCircle2 size={16} className="shrink-0 text-emerald-300"/>:<AlertTriangle size={16} className="shrink-0 text-amber-300"/>}
     <div><p className="text-xs font-semibold text-white">{x.title}</p><p className="mt-1 text-xs text-white/50">{x.desc}</p></div>
    </div>
    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-cyan-200 hover:bg-white/10">
      {busy===x.key?<Loader2 size={14} className="animate-spin"/>:<UploadCloud size={14}/>}
      {x.asset?'Nahradit soubor':'Nahrát soubor'}
      <input type="file" accept={x.accept} disabled={Boolean(busy)} className="hidden" onChange={e=>{void upload(x,e.target.files?.[0]);e.target.value='';}}/>
    </label>
   </div>;
  })}</div>
  <button onClick={createDraft} disabled={!ready||!order||!item.email||Boolean(busy)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 p-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-35">
    {busy==='draft'?<Loader2 size={15} className="animate-spin"/>:<Mail size={15}/>}Vytvořit Gmail koncept s přílohami
  </button>
  {!order&&<p className="mt-2 text-xs text-amber-200">Nejdříve klikněte „Připravit nabídku“ pro založení projektu.</p>}
  {loading&&<p className="mt-2 text-xs text-white/50">Načítání uložených příloh…</p>}
  {message&&<p role="status" className="mt-3 rounded-lg border border-white/10 bg-black/10 p-2 text-xs text-white/75">{message}</p>}
  {draftId&&<a href={'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#drafts'} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-cyan-200 hover:underline">Otevřít koncepty v Gmailu</a>}
 </section>;
}
