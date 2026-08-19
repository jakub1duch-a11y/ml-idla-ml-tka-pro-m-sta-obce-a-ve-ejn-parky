import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader, AlertCircle, FileText, CheckCircle, Clock, Download, Share2, MessageSquare, X, Hash, Mail, ShieldCheck, Image, ArrowRight, ExternalLink } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const STATUS_MAP = {
  draft: { label: 'Koncept', color: 'bg-slate-100 text-slate-500', icon: '📝' },
  sent: { label: 'Odeslána', color: 'bg-blue-50 text-blue-600', icon: '📤' },
  viewed: { label: 'Zobrazena', color: 'bg-cyan-50 text-cyan-700', icon: '👁' },
  extension_requested: { label: 'Žádost o prodloužení', color: 'bg-amber-50 text-amber-700', icon: '↻' },
  approved: { label: 'Odsouhlasena', color: 'bg-green-50 text-green-600', icon: '✓' },
  expired: { label: 'Platnost skončila', color: 'bg-amber-50 text-amber-700', icon: '⌛' },
  rejected: { label: 'Odmítnuta', color: 'bg-red-50 text-red-600', icon: '×' },
  in_production: { label: 'Ve výrobě', color: 'bg-orange-50 text-orange-600', icon: '⚙️' },
  ready: { label: 'Hotovo', color: 'bg-slate-100 text-slate-700', icon: '📦' },
  delivered: { label: 'Doručeno', color: 'bg-emerald-50 text-emerald-600', icon: '✓✓' },
};

export default function CustomerPortal() {
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [accessMode, setAccessMode] = useState('quote');
  const [quoteNumber, setQuoteNumber] = useState(() => new URLSearchParams(window.location.search).get('quote') || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [approving, setApproving] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState({});
  const [shareUrl, setShareUrl] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [intentBusy, setIntentBusy] = useState(null);
  const [intentForms, setIntentForms] = useState({});
  const [intentSaved, setIntentSaved] = useState({});
  const [requestedQuote] = useState(() => new URLSearchParams(window.location.search).get('quote') || '');
  const [requestedAction] = useState(() => new URLSearchParams(window.location.search).get('action') || '');

  useEffect(() => {
    setSEO({ title: 'Můj projekt', description: 'Přístup k vašim poptávkám a projektům HolmTec.', robots: 'noindex, nofollow' });
  }, []);

  useEffect(() => {
    const focusQuote = (requestedQuote || quoteNumber || '').trim().toUpperCase();
    if (step !== 'dashboard' || !focusQuote) return;
    const target = projects.find((project) => project.quote_number === focusQuote);
    if (!target) return;
    window.setTimeout(() => document.getElementById(`offer-${target.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }, [step, projects, requestedQuote, quoteNumber]);

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = accessMode === 'quote'
        ? { quote_number: quoteNumber.trim().toUpperCase() }
        : { email: email.trim().toLowerCase() };
      await base44.functions.invoke('requestPortalOtp', payload);
      setOtpSent(true);
    } catch (e) {
      setError('Chyba při odesílání kódu. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = accessMode === 'quote'
        ? { quote_number: quoteNumber.trim().toUpperCase(), otp }
        : { email: email.trim().toLowerCase(), otp };
      const res = await base44.functions.invoke('verifyPortalOtp', payload);
      const { inquiries, projects, session_token, email: verifiedEmail } = res.data;
      setEmail(verifiedEmail || email);
      setInquiries(inquiries || []);
      const projectList = projects || [];
      const focusQuote = (requestedQuote || quoteNumber || '').trim().toUpperCase();
      setProjects(focusQuote ? [...projectList].sort((a, b) => (b.quote_number === focusQuote ? 1 : 0) - (a.quote_number === focusQuote ? 1 : 0)) : projectList);
      setSessionToken(session_token);
      setStep('dashboard');
    } catch (e) {
      setError('Nesprávný nebo vypršelý ověřovací kód.');
    } finally {
      setLoading(false);
    }
  };

  const approveQuote = async (project) => {
    if (!acceptedTerms[project.id]) return;
    setApproving(project.id);
    setError('');
    try {
      const res = await base44.functions.invoke('approveProjectOrder', {
        project_id: project.id,
        session_token: sessionToken,
        accept_terms: true,
        acceptance_name: project.client_name,
        acceptance_user_agent: navigator.userAgent,
      });
      const updated = res.data.project;
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, ...updated } : p));
      setOrderConfirmed(prev => ({ ...prev, [project.id]: true }));
    } catch (e) {
      setError(e?.response?.data?.error === 'offer_expired' ? 'Platnost této nabídky již skončila. Požádejte nás o její aktualizaci.' : 'Nabídku se nepodařilo odsouhlasit. Zkuste to znovu.');
    } finally {
      setApproving(null);
    }
  };

  const submitOfferIntent = async (project, action) => {
    const form = intentForms[project.id] || {};
    setIntentBusy(`${project.id}:${action}`);
    setError('');
    try {
      const res = await base44.functions.invoke('updateOfferIntent', {
        project_id: project.id,
        session_token: sessionToken,
        action,
        estimated_order_date: form.estimated_order_date || '',
        estimated_order_window: form.estimated_order_window || '',
        message: form.message || '',
      });
      const updated = res.data.project;
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, ...updated } : p));
      setIntentSaved(prev => ({ ...prev, [project.id]: action }));
    } catch (e) {
      setError('Požadavek se nepodařilo uložit. Zkuste to prosím znovu.');
    } finally {
      setIntentBusy(null);
    }
  };

  const generateShareUrl = (token) => {
    const url = `${window.location.origin}/project/${token}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d2d38] text-[#61d5e5]"><ShieldCheck size={22}/></div>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Klientský portál MLŽIDLA®</p>
            <h1 className="text-3xl font-light text-slate-900">Můj projekt</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{otpSent ? 'Zadejte 6místný kód, který jsme poslali na e-mail přiřazený k projektu.' : 'Otevřete cenovou nabídku, vizualizace, dokumenty a další kroky projektu.'}</p>
          </div>

          {!otpSent && <div className="mb-4 grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100 p-1">
            <button type="button" onClick={() => { setAccessMode('quote'); setError(''); }} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${accessMode === 'quote' ? 'bg-white text-[#0d2d38] shadow-sm' : 'text-slate-500'}`}><Hash size={14}/> Číslo nabídky</button>
            <button type="button" onClick={() => { setAccessMode('email'); setError(''); }} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${accessMode === 'email' ? 'bg-white text-[#0d2d38] shadow-sm' : 'text-slate-500'}`}><Mail size={14}/> E-mail</button>
          </div>}

          <form onSubmit={otpSent ? verifyOtp : requestOtp} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm sm:p-8 space-y-4">
            {error && (
              <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!otpSent ? (
              accessMode === 'quote' ? <div>
                <label className="text-xs font-mono text-slate-400 tracking-widest uppercase block mb-2">Číslo cenové nabídky *</label>
                <div className="relative">
                  <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input
                    type="text"
                    required
                    value={quoteNumber}
                    onChange={e => setQuoteNumber(e.target.value.toUpperCase())}
                    placeholder="např. MLZ-2026-123456"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 font-mono text-sm uppercase tracking-wide text-slate-900 placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#0e7584] focus:outline-none"
                  />
                </div>
                <p className="mt-2 text-[11px] leading-5 text-slate-400">Číslo najdete v předmětu e-mailu a na PDF cenové nabídce. Ověřovací kód pošleme na e-mail evidovaný u této nabídky.</p>
              </div> : <div>
                <label className="text-xs font-mono text-slate-400 tracking-widest uppercase block mb-2">E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vas@email.cz"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-[#0e7584] focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-mono text-slate-400 tracking-widest uppercase block mb-2">Ověřovací kód *</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none text-center text-2xl tracking-[0.5em] font-mono"
                />
                <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setError(''); }} className="mt-3 text-xs text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1 mx-auto">
                  <X size={12} /> {accessMode === 'quote' ? 'Zadat jiné číslo nabídky' : 'Změnit e-mail'}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-metallic-mist w-full py-3 justify-center text-sm font-bold disabled:opacity-50"
            >
              {loading ? <><Loader size={16} className="animate-spin" /> {otpSent ? 'Ověřuji...' : 'Odesílám kód...'}</> : otpSent ? 'Otevřít můj projekt' : accessMode === 'quote' ? 'Pokračovat k projektu' : 'Poslat ověřovací kód'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400"><ShieldCheck size={13}/> Přístup je chráněný jednorázovým kódem s platností 10 minut.</div>
          <p className="text-xs text-slate-400 text-center mt-3">Problém s přihlášením? <a href="mailto:obchod1@holmtec.cz" className="text-slate-900 hover:underline">Napište nám</a></p>
        </div>
      </div>
    );
  }

  const focusQuote = (requestedQuote || quoteNumber || '').trim().toUpperCase();
  const focusedProject = projects.find((project) => project.quote_number === focusQuote) || projects[0] || null;
  const focusedStatus = focusedProject ? (STATUS_MAP[focusedProject.status] || STATUS_MAP.draft) : STATUS_MAP.draft;

  return (
    <div className="min-h-screen bg-[#f4f7f7] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-slate-400 tracking-[.16em] uppercase">Klientský portál</p>
            <div className="mt-1 flex items-center gap-2"><h1 className="text-2xl font-light text-slate-900">Můj projekt</h1><span className="hidden text-xs text-slate-400 sm:inline">· {email}</span></div>
          </div>
          <button onClick={() => { setStep('login'); setEmail(''); setOtp(''); setOtpSent(false); setInquiries([]); setProjects([]); setSessionToken(null); }}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
            Odhlásit se
          </button>
        </div>

        {focusedProject && <section className="mb-7 overflow-hidden rounded-[28px] bg-[#0d2d38] text-white shadow-xl shadow-slate-900/5">
          <div className="grid lg:grid-cols-[1.05fr_.95fr]">
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#8fe4ef]">{focusedStatus.icon} {focusedStatus.label}</span>{focusedProject.quote_number && <span className="font-mono text-[11px] text-white/45">{focusedProject.quote_number}</span>}</div>
                <h2 className="mt-5 max-w-2xl text-3xl font-light leading-tight sm:text-4xl">{focusedProject.project_name}</h2>
                {focusedProject.description && <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">{focusedProject.description}</p>}
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><p className="text-[10px] uppercase tracking-wider text-white/40">Cena nabídky</p><p className="mt-1 text-lg font-semibold">{focusedProject.total_price ? `${focusedProject.total_price.toLocaleString('cs-CZ')} Kč` : 'K doplnění'}</p><p className="text-[10px] text-white/35">bez DPH</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><p className="text-[10px] uppercase tracking-wider text-white/40">Platnost</p><p className="mt-1 text-sm font-semibold">{focusedProject.valid_until ? new Date(focusedProject.valid_until).toLocaleDateString('cs-CZ') : 'Dle nabídky'}</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><p className="text-[10px] uppercase tracking-wider text-white/40">Vizualizace</p><p className="mt-1 text-sm font-semibold">{focusedProject.visualizations?.length || 0} návrhů</p></div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <button type="button" onClick={() => document.getElementById(`offer-${focusedProject.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex items-center gap-2 rounded-full bg-[#61d5e5] px-5 py-3 text-xs font-bold text-[#0d2d38]">Otevřít nabídku <ArrowRight size={14}/></button>
                {focusedProject.quote_pdf_url && <a href={focusedProject.quote_pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs font-semibold text-white">PDF nabídka <ExternalLink size={13}/></a>}
              </div>
            </div>
            <div className="min-h-[260px] bg-[#10242b] lg:min-h-full">
              {focusedProject.primary_visualization_url ? <img src={focusedProject.primary_visualization_url} alt={`Vizualizace ${focusedProject.project_name}`} className="h-full min-h-[260px] w-full object-cover"/> : <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 text-white/35"><Image size={34}/><span className="text-xs">Vizualizace se připravuje</span></div>}
            </div>
          </div>
        </section>}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button className="px-4 py-3 text-slate-900 font-medium border-b-2 border-slate-900">
            Můj projekt ({projects.length + inquiries.length})
          </button>
        </div>

        {inquiries.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><p className="text-xs font-mono uppercase tracking-widest text-slate-400">Přijaté poptávky</p><h2 className="mt-1 text-xl font-medium text-slate-900">Vaše zadání</h2></div>
              {projects.length === 0 && <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">Čeká na zpracování nabídky</span>}
            </div>
            <div className="space-y-3">
              {inquiries.map((inquiry) => {
                const inquiryTitle = inquiry.produkt || inquiry.product_id || inquiry.project_scope || 'Poptávka MLŽIDLA®';
                const inquiryMessage = inquiry.zprava || inquiry.message || inquiry.description || '';
                const inquiryStatus = inquiry.status || 'nova';
                const statusLabel = ['nova','new'].includes(inquiryStatus) ? 'Přijata' : ['v_reseni','contacted','in_progress'].includes(inquiryStatus) ? 'V řešení' : 'Uzavřena';
                return <article key={inquiry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3"><div><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-mono text-slate-500 ring-1 ring-slate-200">{statusLabel}</span><h3 className="mt-3 text-lg font-semibold text-slate-900">{inquiryTitle}</h3></div><span className="font-mono text-[10px] text-slate-400">ID: {inquiry.id}</span></div>
                  {inquiryMessage && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{inquiryMessage}</p>}
                  <p className="mt-4 text-xs text-slate-400">Přijato {inquiry.created_date ? new Date(inquiry.created_date).toLocaleDateString('cs-CZ') : '—'}</p>
                </article>;
              })}
            </div>
          </section>
        )}

        {/* Projects list */}
        <div className="space-y-4">
          {projects.length === 0 && inquiries.length === 0 && (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-500">K tomuto e-mailu zatím neevidujeme žádnou poptávku ani nabídku.</p>
            </div>
          )}

          {projects.map(project => {
            const statusInfo = STATUS_MAP[project.status] || STATUS_MAP.draft;
            const isApproved = ['approved', 'in_production', 'ready', 'delivered'].includes(project.status);
            const isRequested = Boolean(focusQuote && project.quote_number === focusQuote);

            return (
              <div id={`offer-${project.id}`} key={project.id} className={`bg-slate-50 border rounded-2xl overflow-hidden transition-all ${isRequested ? 'border-cyan-400 ring-4 ring-cyan-100' : 'border-slate-200 hover:border-slate-300'}`}>
                {isRequested && <div className="border-b border-cyan-200 bg-cyan-50 px-6 py-3 text-xs font-semibold text-cyan-900">{requestedAction === 'order' ? 'Otevřeli jste nabídku k elektronickému objednání. Zkontrolujte nabídku a níže potvrďte souhlas s podmínkami.' : requestedAction === 'extend' ? 'Otevřeli jste žádost o prodloužení platnosti této nabídky.' : requestedAction === 'timing' ? 'Otevřeli jste formulář pro doplnění plánovaného termínu.' : 'Otevřená cenová nabídka.'}</div>}
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        <span className="text-slate-900 font-medium text-lg">{project.project_name}</span>
                      </div>
                      {project.quote_number && <p className="text-xs text-slate-400 font-mono">Číslo nabídky: {project.quote_number}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {project.total_price && <p className="text-lg text-slate-900 font-bold">{project.total_price.toLocaleString('cs-CZ')} Kč</p>}
                      <p className="text-xs text-slate-400">bez DPH</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {project.visualizations?.length > 0 && <div>
                    <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Image size={15} className="text-[#0e7584]"/><p className="text-xs font-semibold text-slate-800">Vizualizace projektu</p></div><span className="text-[10px] text-slate-400">{project.visualizations.length} návrhů</span></div>
                    <div className={`grid gap-3 ${project.visualizations.length > 1 ? 'sm:grid-cols-2' : ''}`}>{project.visualizations.slice(0, 4).map((visual, index) => <a key={visual.id || visual.file_url} href={visual.file_url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white"><img src={visual.file_url} alt={visual.title || `Vizualizace ${index + 1}`} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]"/><div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/70 to-transparent px-4 pb-3 pt-10 text-white"><span className="truncate text-[11px] font-semibold">{visual.title || `Vizualizace ${index + 1}`}</span><ExternalLink size={12}/></div></a>)}</div>
                  </div>}

                  {project.description && <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Shrnutí projektu</p><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{project.description}</p></div>}

                  {/* Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.production_start_date && (
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isApproved ? 'bg-orange-50 text-orange-600' : 'bg-white text-slate-300 border border-slate-200'}`}>
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Zahájení výroby</p>
                          <p className="text-slate-900 font-medium">{new Date(project.production_start_date).toLocaleDateString('cs-CZ')}</p>
                        </div>
                      </div>
                    )}
                    {project.completion_date && (
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${['ready', 'delivered'].includes(project.status) ? 'bg-slate-100 text-slate-700' : 'bg-white text-slate-300 border border-slate-200'}`}>
                          <CheckCircle size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Termín hotovosti</p>
                          <p className="text-slate-900 font-medium">{new Date(project.completion_date).toLocaleDateString('cs-CZ')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {(project.production_notes || project.special_requirements) && (
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                      {project.production_notes && (
                        <div>
                          <p className="text-xs text-slate-500 tracking-widest uppercase mb-1">Pozn. k výrobě</p>
                          <p className="text-sm text-slate-600">{project.production_notes}</p>
                        </div>
                      )}
                      {project.special_requirements && (
                        <div>
                          <p className="text-xs text-slate-500 tracking-widest uppercase mb-1">Vaše požadavky</p>
                          <p className="text-sm text-slate-600">{project.special_requirements}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {project.documents?.filter((asset) => !['quote_pdf', 'presentation', 'presentation_pdf'].includes(asset.asset_type)).length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-2"><FileText size={14} className="text-[#0e7584]"/><p className="text-xs font-semibold text-slate-800">Další projektové podklady</p></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{project.documents.filter((asset) => !['quote_pdf', 'presentation', 'presentation_pdf'].includes(asset.asset_type)).map((asset) => <a key={asset.id || asset.file_url} href={asset.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700 hover:border-slate-300"><span className="truncate">{asset.title || asset.file_name}</span><ExternalLink size={12} className="shrink-0 text-slate-400"/></a>)}</div></div>}

                  {/* Delivery info */}
                  {project.delivery_location && (
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1">Místo předání</p>
                      <p className="text-slate-900">{project.delivery_location}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-slate-200 space-y-3">
                  {orderConfirmed[project.id] && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-600"/><div><p className="text-sm font-semibold text-emerald-900">Objednávka byla úspěšně potvrzena.</p><p className="mt-1 text-xs leading-5 text-emerald-800">Potvrzení objednávky jsme připravili k projektu a odesíláme jej také na váš e-mail. Náš tým naváže technickým upřesněním a potvrzením dalšího harmonogramu.</p>{project.order_confirmation_pdf_url && <a href={project.order_confirmation_pdf_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"><Download size={13}/> Potvrzení objednávky PDF</a>}</div></div></div>}
                  {project.valid_until && (
                    <p className="text-[11px] text-slate-500">
                      Cenová nabídka je platná do <strong className="text-slate-700">{new Date(project.valid_until).toLocaleDateString('cs-CZ')}</strong>.
                    </p>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    {project.quote_pdf_url && (
                      <a href={project.quote_pdf_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-xs rounded-full hover:bg-slate-100 border border-slate-200 transition-all">
                        <Download size={14} /> PDF nabídka
                      </a>
                    )}
                    {(project.presentation_pdf_url || project.presentation_url) && (
                      <a href={project.presentation_pdf_url || project.presentation_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-[#0b4860] text-xs rounded-full hover:bg-slate-100 border border-[#0b4860]/20 transition-all">
                        <FileText size={14} /> Prezentace projektu
                      </a>
                    )}

                    {project.shared_token && (
                      <button onClick={() => generateShareUrl(project.shared_token)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-xs rounded-full hover:bg-slate-100 border border-slate-200 transition-all">
                        <Share2 size={14} /> {shareUrl ? 'Zkopírováno' : 'Sdílet'}
                      </button>
                    )}

                    <a href={`mailto:meduna@holmtec.cz?subject=Dotaz k nabídce: ${project.quote_number || project.project_name}`}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-xs rounded-full hover:bg-slate-200 transition-all">
                      <MessageSquare size={14} /> Odpovědět / dotaz
                    </a>
                  </div>

                  {['sent','viewed','extension_requested','expired'].includes(project.status) && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Další krok k nabídce</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <label className="text-xs text-slate-500">Přibližný termín objednání
                          <input type="date" value={(intentForms[project.id] || {}).estimated_order_date || ''}
                            onChange={(e) => setIntentForms((prev) => ({ ...prev, [project.id]: { ...(prev[project.id] || {}), estimated_order_date: e.target.value } }))}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900" />
                        </label>
                        <label className="text-xs text-slate-500">Nebo orientační období
                          <input value={(intentForms[project.id] || {}).estimated_order_window || ''}
                            onChange={(e) => setIntentForms((prev) => ({ ...prev, [project.id]: { ...(prev[project.id] || {}), estimated_order_window: e.target.value } }))}
                            placeholder="např. září 2026 / po schválení rozpočtu"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900" />
                        </label>
                      </div>
                      <textarea value={(intentForms[project.id] || {}).message || ''}
                        onChange={(e) => setIntentForms((prev) => ({ ...prev, [project.id]: { ...(prev[project.id] || {}), message: e.target.value } }))}
                        placeholder="Poznámka k termínu, schvalování nebo žádosti o prodloužení platnosti…" rows={3}
                        className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900" />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => submitOfferIntent(project, 'timing')} disabled={intentBusy === `${project.id}:timing`}
                          className="rounded-full bg-[#0b4860] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
                          {intentBusy === `${project.id}:timing` ? 'Ukládám…' : 'Odeslat plánovaný termín'}
                        </button>
                        <button onClick={() => submitOfferIntent(project, 'extension')} disabled={intentBusy === `${project.id}:extension`}
                          className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 disabled:opacity-50">
                          {intentBusy === `${project.id}:extension` ? 'Odesílám…' : 'Požádat o prodloužení platnosti'}
                        </button>
                      </div>
                      {intentSaved[project.id] && <p className="mt-3 text-xs text-emerald-700">Požadavek byl uložen a předán k nabídce.</p>}
                    </div>
                  )}

                  {(project.status === 'sent' || project.status === 'viewed' || project.status === 'extension_requested') && (
                    <div className="rounded-xl border border-green-200 bg-green-50/60 p-4">
                      <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-700">
                        <input
                          type="checkbox"
                          checked={Boolean(acceptedTerms[project.id])}
                          onChange={(e) => setAcceptedTerms((prev) => ({ ...prev, [project.id]: e.target.checked }))}
                          className="mt-0.5 h-4 w-4"
                        />
                        <span>Souhlasím s cenovou nabídkou, její specifikací a <Link to="/obchodni-podminky" className="font-semibold underline">obchodními podmínkami</Link>. Odesláním souhlasu závazně objednávám uvedené řešení.</span>
                      </label>
                      <button onClick={() => approveQuote(project)} disabled={approving === project.id || !acceptedTerms[project.id]}
                        className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-xs font-semibold rounded-full hover:bg-green-700 disabled:opacity-40 transition-all">
                        {approving === project.id ? <Loader size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        {approving === project.id ? 'Potvrzuji objednávku…' : 'Souhlasím a objednávám'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}