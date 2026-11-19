import { createClientFromRequest } from 'npm:@base44/sdk@0.8.61';

// Interní kontrola vstupu obchodního workflow.
// NIKDY neposílá e-mail, nevolá LLM, nepřipravuje cenu a nepublikuje.
const HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const norm = (v) => String(v ?? '').normalize('NFKC').trim().toLowerCase();
const clean = (v, n=200) => String(v ?? '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,n);
const recent = (items) => (Array.isArray(items) ? items : []).sort((a,b) =>
  String(b.created_date || b.received_at || '').localeCompare(String(a.created_date || a.received_at || '')));
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function matchedProduct(products, term) {
  const q = norm(term);
  if (!q) return null;
  const matches = products.filter(p => [p.id,p.slug,p.name].some(v => norm(v) === q));
  return matches.length === 1 ? matches[0] : null;
}
function plan(kind, record, products, runMap) {
  const key = kind === 'gmail' ? `gmail:${record.gmail_thread_id}` : `${kind}:${record.id}`;
  const product = kind === 'gmail' ? null : matchedProduct(products, kind === 'poptavka' ? record.produkt : record.product_id);
  const email = norm(kind === 'poptavka' ? record.email : kind === 'contact' ? record.email : record.contact_email || record.from_email);
  const approvalRun = runMap.get(record.id) || null;
  const blocks = [];
  if (!validEmail(email)) blocks.push('Neověřený e-mail klienta');
  if (kind !== 'gmail') {
    if (!product) blocks.push('Produkt nebo varianta není jednoznačně určená');
    else if (product.visual_master_verified !== true) blocks.push('Chybí schválená MASTER geometrie');
    if (!(Array.isArray(record.attachment_urls) && record.attachment_urls.length))
      blocks.push('Bez klientské fotografie prostoru: použít pouze schválené katalogové podklady');
  }
  blocks.push('Živě ověřit veřejnou cenu z Kalkulace mlžítka 2026, sloupec H');
  blocks.push('Ověřit Canva PDF, přílohy a volitelný samostatný list SUPLA');
  blocks.push('Gmail koncept vytvořit až s ověřeným firemním účtem meduna@holmtec.cz');
  return {
    id: key, kind, source_id: record.id || '', inquiry_type: kind === 'contact' ? 'contact' : 'poptavka',
    customer: clean(kind === 'poptavka' ? record.jmeno : kind === 'contact' ? record.name : record.contact_name || record.from_email),
    email, product_name: product?.name || clean(kind === 'poptavka' ? record.produkt : kind === 'contact' ? record.product_id : ''),
    product_slug: product?.slug || '', subject: clean(kind === 'gmail' ? record.subject : kind === 'poptavka' ? record.zprava : record.message, 110),
    received_at: record.created_date || record.received_at || '',
    gmail_url: kind === 'gmail' ? clean(record.gmail_url,900) : '',
    offer_run_status: approvalRun?.run_status || '',
    is_ready_for_visualization: Boolean(product?.visual_master_verified),
    can_send: false, // Always a manual action after human approval.
    can_generate_priced_offer: false, // Must use verified live 2026 calculation, never product.price_from.
    blockers: blocks,
    next_step: kind === 'gmail'
      ? 'Spárovat se zákazníkem a posledním případem, připravit odpověď jako koncept.'
      : 'Ověřit konkrétní variantu, cenu a produktový MASTER. Potom vytvořit obrazovou nabídku.',
  };
}

export default async function(req) {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(()=>null);
  if (!user) return Response.json({ok:false,error:'unauthorized'},{status:401,headers:HEADERS});
  if(user.role!=='admin') return Response.json({ok:false,error:'forbidden'},{status:403,headers:HEADERS});
  if(req.method!=='POST') return Response.json({ok:false,error:'method_not_allowed'},{status:405,headers:HEADERS});
  try {
    const sr=base44.asServiceRole.entities;
    const [poptavky,contacts,messages,products,runs]=await Promise.all([
      sr.Poptavka.list('-created_date',100),
      sr.ContactInquiry.list('-created_date',100),
      sr.EmailMessage.list('-received_at',120),
      sr.Product.list('-updated_date',200),
      sr.OfferAgentRun.list('-created_date',150),
    ]);
    const runMap=new Map();
    for(const run of recent(runs)) if(run.inquiry_id && !runMap.has(run.inquiry_id)) runMap.set(run.inquiry_id,run);
    const validProducts=(products||[]).filter(p=>p.slug && !String(p.slug).startsWith('archived-'));
    const web=recent(poptavky).filter(p=>['nova','nova_poptavka','new',''].includes(norm(p.offer_status || p.status))).slice(0,35)
      .map(p=>plan('poptavka',p,validProducts,runMap));
    const contact=recent(contacts).filter(p=>['new','nova',''].includes(norm(p.status))).slice(0,25)
      .map(p=>plan('contact',p,validProducts,runMap));
    const seenThreads=new Set();
    const gmail=recent(messages).filter(m=>m.direction==='inbound' && m.action_required===true)
      .filter(m=>{const id=m.gmail_thread_id||m.gmail_message_id;if(!id||seenThreads.has(id))return false;seenThreads.add(id);return true;})
      .slice(0,35).map(m=>plan('gmail',m,validProducts,runMap));
    const cases=[...web,...contact,...gmail].sort((x,y)=>String(y.received_at).localeCompare(String(x.received_at))).slice(0,50);
    return Response.json({
      ok:true, read_only:true, never_auto_send:true,
      checked_at:new Date().toISOString(), cases,
      counts:{web:web.length,contact:contact.length,gmail:gmail.length,shown:cases.length},
      workflow_state:'review_first',
      guidelines:{
        price:'Kalkulace mlžítka 2026: výhradně ověřená veřejná cena konkrétní varianty ze sloupce H',
        media:'MASTER ověřený pro produkt/variantu; bez schválení nezveřejňovat vizualizaci',
        offer:'Canva Mlžidla TP + samostatný SUPLA list, podle typu produktu a klienta',
        email:'Gmail meduna@holmtec.cz, pouze koncept a kompletní PDF přílohy',
        signature:'MLŽIDLA.cz – Pro příjemnější místa k životu.',
      },
    },{headers:HEADERS});
  } catch(err){
    return Response.json({ok:false,error:'workflow_read_only_preflight_failed'},{status:503,headers:HEADERS});
  }
}
