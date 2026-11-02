import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, ClipboardList, FilePlus2, FileText, Loader2,
  Package, RefreshCw, Search, ShieldCheck, UserRound, X,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DRAFT_STATUSES = ['draft', 'draft_ready_for_review', 'pending_approval'];
const ACTIVE_STATUSES = ['sent', 'viewed', 'extension_requested', 'approved', 'in_production', 'ready'];
const STATUS_LABELS = {
  draft: 'Koncept', draft_ready_for_review: 'K ověření',
  pending_approval: 'Čeká na schválení', sent: 'Odesláno',
  viewed: 'Otevřeno', extension_requested: 'Prodloužení',
  approved: 'Objednáno', in_production: 'Ve výrobě', ready: 'Připraveno',
  delivered: 'Doručeno', expired: 'Vypršelo', rejected: 'Odmítnuto',
};
const formatPrice = (number) => new Intl.NumberFormat('cs-CZ', {
  style: 'currency', currency: 'CZK', maximumFractionDigits: 0,
}).format(Number(number || 0));
const dateLabel = (date) => date ? new Date(date).toLocaleDateString('cs-CZ') : '—';
const defaultForm = {
  source: '', project_name: '', client_name: '', client_email: '',
  client_phone: '', client_company: '', product_id: '', quantity: 1,
  description: '', smart_control_included: false,
};
const FIELD = 'w-full min-h-11 rounded-xl border border-white/15 bg-[#101f2a] px-3.5 py-3 text-sm text-white placeholder:text-white/35 focus:border-cyan-300 focus:outline-none';
const LABEL = 'mb-1.5 block text-xs font-semibold text-white/65';
const BUTTON = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors';

function flattenRecords(result) {
  if (Array.isArray(result)) return result;
  return Array.isArray(result?.items) ? result.items : [];
}
function sourceToForm(source) {
  if (!source) return {};
  return {
    client_name: source.jmeno || source.name || '',
    client_email: source.email || '',
    client_phone: source.telefon || source.phone || '',
    client_company: source.firma || source.company || '',
    project_name: source.firma || source.company || source.jmeno || source.name || '',
    description: source.zprava || source.message || '',
  };
}

function Metric({ icon: Icon, label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
    <div className="flex items-center gap-2 text-xs text-white/55"><Icon size={15} className="text-cyan" />{label}</div>
    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
  </div>;
}

export default function AdminMobileSalesHub() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('drafts');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [orderResult, productResult, profileResult, inquiryResult, contactResult] = await Promise.allSettled([
        base44.entities.ProjectOrder.list('-created_date', 300),
        base44.entities.Product.list(),
        base44.entities.ProductOfferProfile.list(),
        base44.entities.Poptavka.list('-created_date', 120),
        base44.entities.ContactInquiry.list('-created_date', 120),
      ]);
      const critical = [orderResult, productResult];
      if (critical.some((result) => result.status === 'rejected')) {
        throw new Error('Nepodařilo se načíst nabídky nebo katalog. Zkontrolujte přihlášení.');
      }
      setOrders(flattenRecords(orderResult.value));
      setProducts(flattenRecords(productResult.value).filter((item) =>
        item.category_id !== 'ARCHIV_NEZOBRAZOVAT'
      ));
      setProfiles(profileResult.status === 'fulfilled' ? flattenRecords(profileResult.value) : []);
      const inquiriesData = inquiryResult.status === 'fulfilled'
        ? flattenRecords(inquiryResult.value).map((item) => ({...item, sourceType:'poptavka'})) : [];
      const contactsData = contactResult.status === 'fulfilled'
        ? flattenRecords(contactResult.value).map((item) => ({...item, sourceType:'contact'})) : [];
      setInquiries([...inquiriesData, ...contactsData].sort((a,b) =>
        String(b.created_date || '').localeCompare(String(a.created_date || ''))));
      if ([profileResult,inquiryResult,contactResult].some((result) => result.status === 'rejected')) {
        setError('Část údajů není dostupná. Nabídky a produkty lze používat, další údaje obnovte později.');
      }
    } catch (requestError) {
      setError(requestError?.message || 'Data se nepodařilo načíst.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const selectedProduct = useMemo(() => products.find((item) => item.id === form.product_id), [products, form.product_id]);
  const selectedProfile = useMemo(() => profiles.find((profile) =>
    profile.product_id === selectedProduct?.id || profile.product_slug === selectedProduct?.slug
  ), [profiles, selectedProduct]);
  const verifiedUnitPrice = selectedProfile?.pricing_status === 'ready' && selectedProfile?.offer_ready
    && Number(selectedProfile?.unit_price_ex_vat) > 1
    ? Number(selectedProfile.unit_price_ex_vat) : null;

  const counts = useMemo(() => ({
    newInquiries: inquiries.filter((item) => ['nova', 'nova_poptavka', ''].includes(item.status || '')).length,
    drafts: orders.filter((item) => DRAFT_STATUSES.includes(item.status)).length,
    active: orders.filter((item) => ACTIVE_STATUSES.includes(item.status)).length,
  }), [inquiries, orders]);

  const visible = useMemo(() => orders.filter((item) => {
    const matchesStatus = filter === 'all' || (filter === 'drafts'
      ? DRAFT_STATUSES.includes(item.status)
      : ACTIVE_STATUSES.includes(item.status));
    const haystack = [item.client_name, item.client_company, item.project_name,
      item.product_name, item.quote_number, item.client_email].join(' ').toLocaleLowerCase('cs-CZ');
    return matchesStatus && haystack.includes(search.toLocaleLowerCase('cs-CZ').trim());
  }), [orders, search, filter]);

  const startFromInquiry = (item) => {
    setNotice('');
    setEditing(null);
    setForm({ ...defaultForm, source: item ? item.sourceType + ':' + item.id : '',
      ...sourceToForm(item) });
    setCreating(true);
  };

  const createDraft = async (event) => {
    event.preventDefault();
    if (busy) return;
    const name = form.client_name.trim();
    const email = form.client_email.trim();
    const project = form.project_name.trim();
    if (!name || !email || !project) {
      setError('Vyplňte název projektu, jméno zákazníka a jeho e-mail.');
      return;
    }
    const linkedInquiry = inquiries.find((item) => item.sourceType + ':' + item.id === form.source);
    const amount = verifiedUnitPrice == null ? undefined :
      Math.round(verifiedUnitPrice * Math.max(1, Number(form.quantity || 1)));
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const draft = {
        project_name: project, client_name: name, client_email: email,
        client_phone: form.client_phone.trim(), client_company: form.client_company.trim(),
        description: form.description.trim().slice(0, 2000),
        product_id: selectedProduct?.id || '', product_slug: selectedProduct?.slug || '',
        product_name: selectedProduct?.name || '', status: 'draft',
        smart_control_included: form.smart_control_included,
        presentation_variant: 'custom',
      };
      if (linkedInquiry) {
        draft.inquiry_id = linkedInquiry.id;
        draft.inquiry_type = linkedInquiry.sourceType;
      }
      if (amount != null) draft.total_price = amount;
      const created = await base44.entities.ProjectOrder.create(draft);
      setCreating(false);
      setForm(defaultForm);
      setFilter('drafts');
      setNotice('Koncept nabídky je uložený pro celý administrátorský tým. Nebyl odeslán zákazníkovi.');
      await loadData();
    } catch (requestError) {
      setError(requestError?.message || 'Koncept se nepodařilo uložit.');
    } finally { setBusy(false); }
  };

  const openEditor = (order) => {
    setCreating(false);
    setEditing(order);
    setEditForm({
      project_name: order.project_name || '', client_name: order.client_name || '',
      client_email: order.client_email || '', client_phone: order.client_phone || '',
      client_company: order.client_company || '', description: order.description || '',
      smart_control_included: Boolean(order.smart_control_included),
    });
    setError('');
    setNotice('');
  };

  const saveEdit = async (event, markForReview = false) => {
    event.preventDefault();
    if (!editing || busy || !DRAFT_STATUSES.includes(editing.status)) return;
    if (!editForm.project_name.trim() || !editForm.client_name.trim() || !editForm.client_email.trim()) {
      setError('Název projektu, jméno a e-mail jsou povinné.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const patch = {
        project_name: editForm.project_name.trim(),
        client_name: editForm.client_name.trim(),
        client_email: editForm.client_email.trim(),
        client_phone: editForm.client_phone.trim(),
        client_company: editForm.client_company.trim(),
        description: editForm.description.trim().slice(0, 2000),
        smart_control_included: Boolean(editForm.smart_control_included),
        ...(markForReview ? { status: 'draft_ready_for_review' } : {}),
      };
      await base44.entities.ProjectOrder.update(editing.id, patch);
      setEditing(null);
      setNotice(markForReview
        ? 'Nabídka je označená k ověření. Zákazníkovi se nic neposlalo.'
        : 'Úpravy konceptu jsou uložené pro celý tým.');
      await loadData();
    } catch (requestError) {
      setError(requestError?.message || 'Uložení úprav se nezdařilo.');
    } finally { setBusy(false); }
  };

  return <div className="mx-auto max-w-6xl space-y-5 p-4 pb-24 text-white sm:p-6 lg:p-8">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-cyan">MLŽIDLA / týmová aplikace</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Obchodní centrum MLŽIDLA</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
          Poptávky a pracovní nabídky všech administrátorů na jednom místě.
          Koncepty se automaticky neodesílají.
        </p>
      </div>
      <button type="button" onClick={loadData} disabled={loading} className={BUTTON + ' border border-white/15 text-white/80'}>
        <RefreshCw size={17} className={loading ? 'animate-spin' : ''} /> Obnovit
      </button>
    </header>

    {error && <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div>}
    {notice && <div role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{notice}</div>}
    <div className="grid grid-cols-3 gap-2.5">
      <Metric icon={ClipboardList} label="Nové poptávky" value={counts.newInquiries} />
      <Metric icon={FileText} label="Koncepty" value={counts.drafts} />
      <Metric icon={CheckCircle2} label="Aktivní nabídky" value={counts.active} />
    </div>

    <div className="grid gap-2 sm:grid-cols-3">
      <button type="button" onClick={() => startFromInquiry(null)}
        className={BUTTON + ' bg-cyan text-[#09202c] hover:bg-cyan/90'}>
        <FilePlus2 size={17} /> Vytvořit nabídku
      </button>
      <button type="button" onClick={() => navigate('/admin?tab=poptavky')}
        className={BUTTON + ' border border-white/15 bg-white/[0.04] text-white'}>
        <ClipboardList size={17} /> Správa poptávek
      </button>
      <button type="button" onClick={() => navigate('/obchodni-nabidky')}
        className={BUTTON + ' border border-white/15 bg-white/[0.04] text-white'}>
        <Package size={17} /> Kompletní Sales Hub <ArrowRight size={15} />
      </button>
    </div>

    {creating && <section className="rounded-2xl border border-cyan/35 bg-[#142b37] p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Nový koncept nabídky</h2>
        <button aria-label="Zavřít formulář" onClick={() => setCreating(false)} className="rounded-lg p-2 text-white/70 hover:bg-white/10"><X size={19} /></button>
      </div>
      <form onSubmit={createDraft} className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className={LABEL}>Navázat na existující poptávku</span>
          <select className={FIELD} value={form.source} onChange={(e) => {
            const selected = inquiries.find((item) => item.sourceType + ':' + item.id === e.target.value);
            setForm((old) => ({ ...old, source:e.target.value, ...(selected ? sourceToForm(selected) : {}) }));
          }}>
            <option value="">Bez poptávky – nový zákazník</option>
            {inquiries.map((item) => <option key={item.sourceType + ':' + item.id} value={item.sourceType + ':' + item.id}>
              {(item.jmeno || item.name || 'Bez názvu') + ' – ' + (item.firma || item.produkt || item.email || '')}
            </option>)}
          </select>
        </label>
        {[
          ['project_name','Název projektu *'], ['client_name','Zákazník *'],
          ['client_email','E-mail *'], ['client_phone','Telefon'],
          ['client_company','Firma / instituce'],
        ].map(([key,label]) => <label key={key}><span className={LABEL}>{label}</span>
          <input className={FIELD} type={key === 'client_email' ? 'email' : 'text'}
            required={['project_name','client_name','client_email'].includes(key)}
            value={form[key]} onChange={(e) => setForm((old) => ({...old,[key]:e.target.value}))}/>
        </label>)}
        <label><span className={LABEL}>Produkt</span><select className={FIELD} value={form.product_id}
          onChange={(e) => setForm((old) => ({...old,product_id:e.target.value}))}>
            <option value="">Na míru / zatím neurčeno</option>
            {products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label><span className={LABEL}>Počet kusů</span>
          <input className={FIELD} type="number" min="1" max="999" step="1"
            value={form.quantity} onChange={(e) => setForm((old) => ({...old,quantity:e.target.value}))}/>
        </label>
        <label className="sm:col-span-2"><span className={LABEL}>Poznámka k zadání</span>
          <textarea className={FIELD} rows="3" maxLength={2000} value={form.description}
            onChange={(e) => setForm((old) => ({...old,description:e.target.value}))}/>
        </label>
        <label className="sm:col-span-2 flex items-center gap-3 text-sm text-white/85">
          <input type="checkbox" checked={form.smart_control_included}
            onChange={(e) => setForm((old) => ({...old,smart_control_included:e.target.checked}))}
            className="h-5 w-5 accent-cyan-400" /> Zahrnout řešení SUPLA do návrhu (cenu ověřit samostatně)
        </label>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          {selectedProduct?.image_url && <img src={selectedProduct.image_url} alt={selectedProduct.name}
            className="h-20 w-24 rounded-lg bg-white object-contain" />}
          <div className="text-sm">
            <p className="text-white/65">{selectedProduct?.name || 'Zakázkový projekt'}</p>
            <p className="mt-1 font-semibold text-white">
              {verifiedUnitPrice == null ? 'Cena zatím neověřena – bez automatické kalkulace' :
                formatPrice(verifiedUnitPrice * Math.max(1, Number(form.quantity || 1))) + ' bez DPH'}
            </p>
            <p className="mt-1 text-xs text-white/45">Cena SUPLA, montáže a dopravy není v kalkulaci zahrnuta.</p>
          </div>
        </div>
        <div className="sm:col-span-2">
          <button disabled={busy} type="submit" className={BUTTON + ' w-full bg-cyan text-[#09202c] sm:w-auto'}>
            {busy ? <Loader2 size={17} className="animate-spin"/> : <FilePlus2 size={17}/>} Uložit koncept do společné evidence
          </button>
        </div>
      </form>
    </section>}

    {editing && <section className="rounded-2xl border border-cyan/30 bg-[#142b37] p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upravit pracovní nabídku</h2>
        <button aria-label="Zavřít úpravy" onClick={() => setEditing(null)} className="p-2 text-white/70"><X size={19}/></button>
      </div>
      <form onSubmit={(event) => saveEdit(event)} className="grid gap-3 sm:grid-cols-2">
        {[
          ['project_name','Název projektu'], ['client_name','Zákazník'], ['client_email','E-mail'],
          ['client_phone','Telefon'], ['client_company','Firma'],
        ].map(([key,label]) => <label key={key}><span className={LABEL}>{label}</span>
          <input className={FIELD} value={editForm[key] || ''} required={['project_name','client_name','client_email'].includes(key)}
            type={key === 'client_email' ? 'email' : 'text'}
            onChange={(e) => setEditForm((old) => ({...old,[key]:e.target.value}))}/>
        </label>)}
        <label className="sm:col-span-2"><span className={LABEL}>Poznámka</span>
          <textarea className={FIELD} rows="3" value={editForm.description || ''}
            onChange={(e) => setEditForm((old) => ({...old,description:e.target.value}))}/>
        </label>
        <label className="sm:col-span-2 flex items-center gap-3 text-sm text-white/80">
          <input type="checkbox" checked={editForm.smart_control_included}
            onChange={(e) => setEditForm((old) => ({...old,smart_control_included:e.target.checked}))}
            className="h-5 w-5 accent-cyan-400"/> SUPLA v návrhu
        </label>
        <div className="sm:col-span-2 flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className={BUTTON + ' bg-cyan text-[#09202c]'}>
            {busy ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle2 size={16}/>} Uložit změny
          </button>
          <button type="button" disabled={busy} onClick={(event) => saveEdit(event, true)}
            className={BUTTON + ' border border-amber-400/30 text-amber-100'}>
            Předat k ověření
          </button>
        </div>
      </form>
    </section>}

    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-lg font-semibold">Společné nabídky</h2>
        <span className="text-xs text-white/45">{visible.length} záznamů</span>
      </div>
      <label className="relative block">
        <Search size={17} className="absolute left-3 top-3.5 text-white/45"/>
        <input type="search" className={FIELD + ' pl-10'} value={search}
          onChange={(e) => setSearch(e.target.value)} placeholder="Hledat klienta, produkt, číslo nabídky…" />
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          ['drafts','Rozpracované'], ['active','Aktivní'], ['all','Všechny'],
        ].map(([key,label]) => <button key={key} onClick={() => setFilter(key)}
          className={BUTTON + (filter === key ? ' bg-cyan text-[#09202c]' : ' border border-white/15 text-white/70')}>
          {label}</button>)}
      </div>
      {loading && <p className="flex items-center gap-2 text-sm text-white/60"><Loader2 size={16} className="animate-spin"/> Načítání dat…</p>}
      {!loading && visible.length === 0 && <div className="rounded-xl border border-white/10 p-6 text-center text-sm text-white/55">
        V tomto pohledu nejsou žádné nabídky.
      </div>}
      <div className="grid gap-3 lg:grid-cols-2">
        {visible.map((order) => <article key={order.id}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-cyan">{order.quote_number || 'Koncept bez čísla'}</p>
              <h3 className="mt-1 text-lg font-semibold">{order.project_name || order.client_name}</h3>
              <p className="mt-1 flex items-center gap-2 text-sm text-white/60"><UserRound size={15}/> {order.client_name}</p>
            </div>
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
              {STATUS_LABELS[order.status] || order.status || 'Neznámý stav'}
            </span>
          </div>
          <p className="mt-3 text-sm text-white/65">{order.product_name || 'Individuální řešení'}</p>
          <p className="mt-1 text-xs text-white/40">Založeno: {dateLabel(order.created_date)} · {order.total_price > 1 ? formatPrice(order.total_price) + ' orientačně' : 'cena k ověření'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {DRAFT_STATUSES.includes(order.status) &&
              <button className={BUTTON + ' border border-cyan/30 text-cyan'} onClick={() => openEditor(order)}>
                <FileText size={16}/> Upravit koncept
              </button>}
            <button className={BUTTON + ' border border-white/15 text-white/75'} onClick={() => navigate('/obchodni-nabidky')}>
              Úplná nabídka <ArrowRight size={15}/>
            </button>
          </div>
        </article>)}
      </div>
    </section>
    <section className="rounded-xl border border-white/10 p-4 text-xs leading-5 text-white/50">
      <p className="flex items-center gap-2 text-white/75"><ShieldCheck size={17}/> Pouze pro přihlášené administrátory</p>
      <p className="mt-2">Interní data chrání oprávnění Base44. Zde lze připravit a předat koncept;
        grafické PDF, cenové ověření a finální schválení probíhají ve stávajícím Sales Hubu.
        Bez schválení se nic neposílá.</p>
    </section>
  </div>;
}
