import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader, AlertCircle, FileText, CheckCircle, Clock, Download, Share2, MessageSquare, X, Hash, Mail, ShieldCheck, Image, ArrowRight, ExternalLink, Plus, Paperclip, ReceiptText, Shapes, ShoppingBag, UploadCloud, KeyRound, Eye, EyeOff, LayoutDashboard, BriefcaseBusiness, Users, Inbox } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { useAuth } from '@/lib/AuthContext';

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

const getFunctionErrorCode = (error) =>
  error?.response?.data?.error || error?.data?.error || error?.error || '';

export default function CustomerPortal() {
  const { user: appUser } = useAuth();
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [accessMode, setAccessMode] = useState('quote');
  const [authMethod, setAuthMethod] = useState(() => new URLSearchParams(window.location.search).get('quote') ? 'otp' : 'password');
  const [quoteNumber, setQuoteNumber] = useState(() => new URLSearchParams(window.location.search).get('quote') || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordRequested, setResetPasswordRequested] = useState(false);
  const [adminOverview, setAdminOverview] = useState(null);
  const [adminOverviewLoading, setAdminOverviewLoading] = useState(false);
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
  const [messageBusy, setMessageBusy] = useState(null);
  const [messageForms, setMessageForms] = useState({});
  const [messageSaved, setMessageSaved] = useState({});
  const [extraChargeBusy, setExtraChargeBusy] = useState(null);
  const [extraChargeNotes, setExtraChargeNotes] = useState({});
  const [newInquiryType, setNewInquiryType] = useState('other_product');
  const [newInquiryForm, setNewInquiryForm] = useState({ product: '', shape: '', description: '' });
  const [newInquiryFiles, setNewInquiryFiles] = useState([]);
  const [newInquiryBusy, setNewInquiryBusy] = useState(false);
  const [newInquirySent, setNewInquirySent] = useState(null);
  const [requestedQuote] = useState(() => new URLSearchParams(window.location.search).get('quote') || '');
  const [requestedAction] = useState(() => new URLSearchParams(window.location.search).get('action') || '');
  const isAdmin = appUser?.role === 'admin';
  const passwordChecks = {
    length: newPassword.length >= 10,
    letter: /[A-Za-zÀ-ž]/.test(newPassword),
    number: /\d/.test(newPassword),
    matches: Boolean(confirmPassword) && newPassword === confirmPassword,
  };
  const promoCountdown = (() => {
    const now = new Date();
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Prague',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now).filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value)]));
    const year = parts.year;
    const month = parts.month;
    const day = parts.day;
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return {
      daysLeft: Math.max(0, lastDay - day),
      endLabel: `${lastDay}. ${month}. ${year}`,
    };
  })();
  const promoDaysLeft = promoCountdown.daysLeft;

  useEffect(() => {
    setSEO({ title: 'Můj projekt', description: 'Přístup k vašim poptávkám a projektům HolmTec.', robots: 'noindex, nofollow' });
  }, []);

  useEffect(() => {
    if (!isAdmin || step !== 'login') return;
    let active = true;
    setAdminOverviewLoading(true);
    Promise.all([
      base44.entities.ProjectOrder.list('-created_date', 500),
      base44.entities.Poptavka.list('-created_date', 500),
      base44.entities.ContactInquiry.list('-created_date', 500),
    ]).then(([orders = [], poptavky = [], contacts = []]) => {
      if (!active) return;
      setAdminOverview({
        projects: orders.length,
        inquiries: poptavky.length + contacts.length,
        activeOffers: orders.filter((item) => ['sent', 'viewed', 'extension_requested'].includes(item.status)).length,
        approvals: orders.filter((item) => ['approved', 'in_production', 'ready', 'delivered'].includes(item.status)).length,
      });
    }).catch(() => {
      if (active) setAdminOverview(null);
    }).finally(() => {
      if (active) setAdminOverviewLoading(false);
    });
    return () => { active = false; };
  }, [isAdmin, step]);

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
      const code = getFunctionErrorCode(e);
      setError(code === 'rate_limited'
        ? 'O nový kód jste požádali příliš brzy. Počkejte chvíli a zkuste to znovu.'
        : 'Kód se nepodařilo odeslat. Zkontrolujte údaj a zkuste to znovu.');
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
      const { inquiries, projects, session_token, email: verifiedEmail, password_setup_required: passwordSetupRequired } = res.data;
      setEmail(verifiedEmail || email);
      setInquiries(inquiries || []);
      const projectList = projects || [];
      const focusQuote = (requestedQuote || quoteNumber || '').trim().toUpperCase();
      setProjects(focusQuote ? [...projectList].sort((a, b) => (b.quote_number === focusQuote ? 1 : 0) - (a.quote_number === focusQuote ? 1 : 0)) : projectList);
      setSessionToken(session_token);
      // Nové heslo vyžadujeme jen při prvním přístupu nebo výslovné obnově.
      // Odkaz s číslem nabídky tak stávající klienty nezdržuje povinným resetem.
      setStep(passwordSetupRequired || resetPasswordRequested ? 'passwordSetup' : 'dashboard');
    } catch (e) {
      const code = getFunctionErrorCode(e);
      setError(code === 'invalid_or_expired'
        ? 'Kód je nesprávný nebo vypršel. Nechte si poslat nový kód.'
        : 'Ověření se nepodařilo dokončit. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('loginPortalPassword', {
        email: email.trim().toLowerCase(),
        password,
      });
      const { inquiries, projects, session_token, email: verifiedEmail } = res.data;
      setEmail(verifiedEmail || email);
      setInquiries(inquiries || []);
      const projectList = projects || [];
      const focusQuote = (requestedQuote || quoteNumber || '').trim().toUpperCase();
      setProjects(focusQuote ? [...projectList].sort((a, b) => (b.quote_number === focusQuote ? 1 : 0) - (a.quote_number === focusQuote ? 1 : 0)) : projectList);
      setSessionToken(session_token);
      setPassword('');
      setStep('dashboard');
    } catch (e) {
      const code = getFunctionErrorCode(e);
      setError(code === 'temporarily_locked' ? 'Příliš mnoho neúspěšných pokusů. Přístup je na 15 minut dočasně uzamčen.' : 'Nesprávný e-mail nebo heslo. Pro první přihlášení nebo obnovu použijte jednorázový kód.');
    } finally {
      setLoading(false);
    }
  };

  const setupPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 10) { setError('Heslo musí mít alespoň 10 znaků.'); return; }
    if (!passwordChecks.letter || !passwordChecks.number) { setError('Heslo musí obsahovat alespoň jedno písmeno a jednu číslici.'); return; }
    if (newPassword !== confirmPassword) { setError('Zadaná hesla se neshodují.'); return; }
    if (!sessionToken) {
      setError('Ověřená relace chybí. Nechte si poslat nový jednorázový kód.');
      setStep('login');
      setOtpSent(false);
      return;
    }
    setLoading(true);
    try {
      const res = await base44.functions.invoke('setPortalPassword', { session_token: sessionToken, password: newPassword });
      if (res.data?.session_token) setSessionToken(res.data.session_token);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setResetPasswordRequested(false);
      setStep('dashboard');
    } catch (e) {
      const code = getFunctionErrorCode(e);
      setError(code === 'session_expired'
        ? 'Ověření vypršelo. Přihlaste se znovu jednorázovým kódem.'
        : code === 'password_policy'
          ? 'Heslo musí mít alespoň 10 znaků a obsahovat písmeno i číslici.'
          : code === 'missing_session' || code === 'session_invalid'
            ? 'Ověřená relace není platná. Nechte si poslat nový kód.'
            : 'Heslo se nepodařilo uložit. Nechte si poslat nový kód a zkuste nastavení znovu.');
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

  const sendOfferMessage = async (project) => {
    const form = messageForms[project.id] || {};
    const text = String(form.message || '').trim();
    if (!text) return;
    setMessageBusy(project.id);
    setError('');
    try {
      const res = await base44.functions.invoke('sendOfferMessage', {
        project_id: project.id,
        session_token: sessionToken,
        category: form.category || 'question',
        message: text,
      });
      const messages = res.data?.messages || [];
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, offer_messages: messages } : p));
      setMessageForms(prev => ({ ...prev, [project.id]: { category: form.category || 'question', message: '' } }));
      setMessageSaved(prev => ({ ...prev, [project.id]: true }));
    } catch (_e) {
      setError('Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.');
    } finally {
      setMessageBusy(null);
    }
  };

  const respondExtraCharge = async (project, charge, action) => {
    setExtraChargeBusy(charge.id);
    setError('');
    try {
      const res = await base44.functions.invoke('respondExtraCharge', {
        charge_id: charge.id,
        project_id: project.id,
        session_token: sessionToken,
        action,
        note: extraChargeNotes[charge.id] || '',
      });
      const charges = res.data?.charges || [];
      setProjects((current) => current.map((item) => item.id === project.id ? { ...item, extra_charges: charges } : item));
    } catch (_error) {
      setError('Reakci na příplatkovou položku se nepodařilo uložit. Zkuste to prosím znovu.');
    } finally {
      setExtraChargeBusy(null);
    }
  };

  const submitNewInquiry = async (event) => {
    event.preventDefault();
    const description = String(newInquiryForm.description || '').trim();
    const product = String(newInquiryForm.product || '').trim();
    const shape = String(newInquiryForm.shape || '').trim();
    if (!description || (newInquiryType === 'other_product' && !product) || (newInquiryType === 'custom_design' && !shape)) return;
    setNewInquiryBusy(true);
    setError('');
    setNewInquirySent(null);
    try {
      const uploaded = await Promise.all(newInquiryFiles.map(async (file) => {
        const result = await base44.integrations.Core.UploadFile({ file });
        return { name: file.name, url: result.file_url };
      }));
      const clientName = focusedProject?.client_name || inquiries[0]?.jmeno || inquiries[0]?.name || email;
      const clientPhone = focusedProject?.client_phone || inquiries[0]?.telefon || inquiries[0]?.phone || '';
      const clientCompany = focusedProject?.client_company || inquiries[0]?.firma || inquiries[0]?.company || '';
      const inquiryProduct = newInquiryType === 'custom_design' ? `Vlastní návrh — ${shape}` : product;
      const details = [
        newInquiryType === 'custom_design' ? 'Typ požadavku: Vlastní návrh / atypické řešení' : 'Typ požadavku: Poptávka jiného produktu',
        product ? `Produkt / směr: ${product}` : '',
        shape ? `Požadovaný tvar / představa: ${shape}` : '',
        '',
        description,
        uploaded.length ? `\nPřiložené soubory: ${uploaded.map((item) => item.name).join(', ')}` : '',
      ].filter(Boolean).join('\n');
      const created = await base44.entities.Poptavka.create({
        jmeno: clientName,
        email,
        telefon: clientPhone,
        firma: clientCompany,
        produkt: inquiryProduct,
        service_type: 'customer_portal',
        request_type: newInquiryType,
        custom_shape: shape,
        attachment_urls: uploaded.map((item) => item.url),
        attachment_names: uploaded.map((item) => item.name),
        source_project_order_id: focusedProject?.id || '',
        zprava: details,
        status: 'nova',
      });
      setInquiries((current) => [created, ...current]);
      setNewInquiryForm({ product: '', shape: '', description: '' });
      setNewInquiryFiles([]);
      setNewInquirySent(created.id);
    } catch (_error) {
      setError('Novou poptávku se nepodařilo odeslat. Zkontrolujte přílohy a zkuste to prosím znovu.');
    } finally {
      setNewInquiryBusy(false);
    }
  };

  const generateShareUrl = (token) => {
    const url = `${window.location.origin}/project/${token}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
  };

  if (step === 'passwordSetup') {
    return (
      <div className="min-h-screen bg-[#eef3f4] pt-24 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0d2d38] text-[#61d5e5]"><KeyRound size={24}/></div>
            <p className="text-xs font-mono text-cyan-700 tracking-widest uppercase mb-2">Ověřený přístup</p>
            <h1 className="text-3xl font-light text-slate-900">Nastavte nové heslo</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">E-mail jsme ověřili jednorázovým kódem. Nyní nastavte nové heslo pro další přihlášení do Můj projekt.</p>
          </div>
          <form onSubmit={setupPassword} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(13,45,56,0.08)] sm:p-8 space-y-4">
            {error && <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4"><AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500"/><p className="text-sm text-red-600">{error}</p></div>}
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-xs text-cyan-900"><strong>Ověřený účet:</strong> {email}</div>
            <label className="block text-xs font-semibold text-slate-600">Nové heslo *
              <div className="relative mt-1.5"><input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={10} maxLength={128} required autoComplete="new-password" placeholder="Minimálně 10 znaků" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none focus:border-cyan-400"/><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div>
            </label>
            <label className="block text-xs font-semibold text-slate-600">Heslo znovu *<input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={10} maxLength={128} required autoComplete="new-password" placeholder="Zopakujte heslo" aria-invalid={Boolean(confirmPassword) && !passwordChecks.matches} className={`mt-1.5 w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ${confirmPassword && !passwordChecks.matches ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-cyan-400'}`}/></label>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {[['length', 'Alespoň 10 znaků'], ['letter', 'Písmeno'], ['number', 'Číslice'], ['matches', 'Hesla se shodují']].map(([key, label]) => <span key={key} className={`flex items-center gap-1.5 ${passwordChecks[key] ? 'text-emerald-700' : 'text-slate-400'}`}><CheckCircle size={12}/>{label}</span>)}
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-[11px] leading-5 text-slate-500"><ShieldCheck size={13} className="mr-1 inline text-cyan-700"/> Heslo se neodesílá e-mailem a v databázi se neukládá v čitelné podobě. Jednorázový kód zůstává dostupný pro obnovu přístupu.</div>
            <button type="submit" disabled={loading || !passwordChecks.length || !passwordChecks.letter || !passwordChecks.number || !passwordChecks.matches} className="btn-metallic-mist w-full py-3 justify-center text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50">{loading ? <><Loader size={16} className="animate-spin"/> Ukládám heslo…</> : <><KeyRound size={16}/> Nastavit heslo a otevřít projekt</>}</button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f7fafb_0%,#ffffff_48%,#eef5f6_100%)] px-4 pb-16 pt-28">
        <div className="mx-auto w-full max-w-5xl">
          {isAdmin && <section className="mb-8 overflow-hidden rounded-[28px] border border-[#1f5360] bg-[#0d2d38] text-white shadow-[0_24px_70px_rgba(13,45,56,0.18)]">
            <div className="flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#61d5e5]"><LayoutDashboard size={22}/></div><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8fe4ef]">Administrátorský přístup rozpoznán</p><h2 className="mt-2 text-2xl font-light">Řízení klientských projektů</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Spravujte poptávky, nabídky, dokumenty a komunikaci v interním Sales Hubu. Níže můžete zároveň bezpečně otestovat klientský přístup.</p></div></div>
              <div className="flex shrink-0 flex-wrap gap-2"><Link to="/obchodni-nabidky" className="inline-flex items-center gap-2 rounded-full bg-[#61d5e5] px-5 py-3 text-xs font-bold text-[#0d2d38]"><BriefcaseBusiness size={15}/> Otevřít Sales Hub</Link><Link to="/admin" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold text-white"><LayoutDashboard size={15}/> Administrace</Link></div>
            </div>
            <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
              {adminOverviewLoading ? <div className="col-span-full flex items-center gap-2 px-6 py-5 text-xs text-white/50"><Loader size={14} className="animate-spin"/> Načítám přehled…</div> : [
                ['Poptávky', adminOverview?.inquiries ?? '—', Inbox],
                ['Projekty', adminOverview?.projects ?? '—', Users],
                ['Aktivní nabídky', adminOverview?.activeOffers ?? '—', FileText],
                ['Objednáno', adminOverview?.approvals ?? '—', CheckCircle],
              ].map(([label, value, Icon], index) => <div key={label} className={`px-5 py-4 ${index ? 'border-l border-white/10' : ''}`}><Icon size={14} className="text-[#61d5e5]"/><p className="mt-3 text-2xl font-semibold">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">{label}</p></div>)}
            </div>
          </section>}

          <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d2d38] text-[#61d5e5]"><ShieldCheck size={22}/></div>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Klientský portál MLŽIDLA®</p>
            <h1 className="text-3xl font-light text-slate-900">Můj projekt</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{otpSent ? 'Zadejte 6místný kód, který jsme poslali na e-mail přiřazený k projektu.' : 'Otevřete cenovou nabídku, vizualizace, dokumenty a další kroky projektu.'}</p>
          </div>

          {!otpSent && <div className="mb-4 grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100 p-1">
            <button type="button" onClick={() => { setAuthMethod('password'); setError(''); }} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${authMethod === 'password' ? 'bg-white text-[#0d2d38] shadow-sm' : 'text-slate-500'}`}><KeyRound size={14}/> E-mail + heslo</button>
            <button type="button" onClick={() => { setAuthMethod('otp'); setError(''); }} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${authMethod === 'otp' ? 'bg-white text-[#0d2d38] shadow-sm' : 'text-slate-500'}`}><ShieldCheck size={14}/> První přihlášení / obnova</button>
          </div>}

          {!otpSent && authMethod === 'otp' && <div className="mb-4 grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button type="button" onClick={() => { setAccessMode('quote'); setError(''); }} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${accessMode === 'quote' ? 'bg-white text-[#0d2d38] shadow-sm' : 'text-slate-500'}`}><Hash size={14}/> Číslo nabídky</button>
            <button type="button" onClick={() => { setAccessMode('email'); setError(''); }} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${accessMode === 'email' ? 'bg-white text-[#0d2d38] shadow-sm' : 'text-slate-500'}`}><Mail size={14}/> E-mail</button>
          </div>}

          <form onSubmit={authMethod === 'password' && !otpSent ? loginWithPassword : otpSent ? verifyOtp : requestOtp} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm sm:p-8 space-y-4">
            {error && (
              <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!otpSent ? (
              authMethod === 'password' ? <>
                <div><label className="text-xs font-mono text-slate-400 tracking-widest uppercase block mb-2">E-mail *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="vas@email.cz" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0e7584] focus:outline-none"/></div>
                <div><label className="text-xs font-mono text-slate-400 tracking-widest uppercase block mb-2">Heslo *</label><div className="relative"><input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="Vaše heslo" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0e7584] focus:outline-none"/><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></div>
                <div className="flex items-start justify-between gap-3 text-[11px] leading-5 text-slate-400"><span>Při prvním přihlášení použijte jednorázový kód.</span><button type="button" onClick={() => { setResetPasswordRequested(true); setAuthMethod('otp'); setAccessMode('email'); setError(''); }} className="shrink-0 font-semibold text-cyan-700 hover:text-cyan-900">Zapomenuté heslo?</button></div>
              </> : accessMode === 'quote' ? <div>
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
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-describedby="otp-help"
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none text-center text-2xl tracking-[0.5em] font-mono"
                />
                <p id="otp-help" className="mt-2 text-center text-[11px] text-slate-400">Kód má 6 číslic a platí 10 minut.</p>
                <div className="mt-3 flex items-center justify-center gap-4">
                  <button type="button" disabled={loading} onClick={requestOtp} className="text-xs text-cyan-700 hover:text-cyan-900 disabled:opacity-50 transition-colors">
                    Poslat kód znovu
                  </button>
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setError(''); }} className="text-xs text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1">
                    <X size={12} /> {accessMode === 'quote' ? 'Zadat jiné číslo nabídky' : 'Změnit e-mail'}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-metallic-mist w-full py-3 justify-center text-sm font-bold disabled:opacity-50"
            >
              {loading ? <><Loader size={16} className="animate-spin" /> {authMethod === 'password' && !otpSent ? 'Přihlašuji…' : otpSent ? 'Ověřuji…' : 'Odesílám kód…'}</> : authMethod === 'password' && !otpSent ? 'Přihlásit do Můj projekt' : otpSent ? 'Ověřit a pokračovat' : accessMode === 'quote' ? 'Pokračovat k projektu' : 'Poslat ověřovací kód'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400"><ShieldCheck size={13}/> Přístup je chráněný ověřovacím kódem a bezpečně uloženým heslem.</div>
          <p className="text-xs text-slate-400 text-center mt-3">Problém s přihlášením? <a href="mailto:obchod1@holmtec.cz" className="text-slate-900 hover:underline">Napište nám</a></p>
          </div>
        </div>
      </div>
    );
  }

  const focusQuote = (requestedQuote || quoteNumber || '').trim().toUpperCase();
  const focusedProject = projects.find((project) => project.quote_number === focusQuote) || projects[0] || null;
  const focusedStatus = focusedProject ? (STATUS_MAP[focusedProject.status] || STATUS_MAP.draft) : STATUS_MAP.draft;
  const workspaceDocuments = projects.reduce((sum, project) => sum + Number(project.documents?.length || 0), 0);
  const workspaceMessages = projects.reduce((sum, project) => sum + Number(project.offer_messages?.length || 0), 0);
  const pendingExtras = projects.reduce((sum, project) => sum + Number((project.extra_charges || []).filter((charge) => charge.status === 'pending_customer_approval').length), 0);

  return (
    <div className="min-h-screen bg-[#eef3f4] pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Professional workspace shell */}
        <header className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(13,45,56,0.08)]">
          <div className="flex flex-col gap-5 border-b border-slate-100 px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d2d38] text-[#61d5e5]"><ShieldCheck size={22}/></div>
              <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-700">MLŽIDLA® Client Workspace</p><div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1"><h1 className="text-2xl font-light text-slate-950">Můj projekt</h1><span className="text-xs text-slate-400">{email}</span></div></div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a href="mailto:meduna@holmtec.cz" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-cyan-300">Kontakt na technika</a>
              {isAdmin && <Link to="/obchodni-nabidky" className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-900">Sales Hub</Link>}
              <button onClick={() => { setStep('login'); setEmail(''); setOtp(''); setOtpSent(false); setInquiries([]); setProjects([]); setSessionToken(null); setResetPasswordRequested(false); }} className="rounded-full bg-[#0d2d38] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#123c49]">Odhlásit se</button>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
            <div className="p-4 sm:p-5"><p className="text-[10px] uppercase tracking-[.13em] text-slate-400">Projekty / nabídky</p><p className="mt-1 text-2xl font-semibold text-slate-950">{projects.length}</p></div>
            <div className="p-4 sm:p-5"><p className="text-[10px] uppercase tracking-[.13em] text-slate-400">Poptávky</p><p className="mt-1 text-2xl font-semibold text-slate-950">{inquiries.length}</p></div>
            <div className="p-4 sm:p-5"><p className="text-[10px] uppercase tracking-[.13em] text-slate-400">Dokumenty</p><p className="mt-1 text-2xl font-semibold text-slate-950">{workspaceDocuments}</p></div>
            <div className="p-4 sm:p-5"><p className="text-[10px] uppercase tracking-[.13em] text-slate-400">Ke schválení</p><p className="mt-1 text-2xl font-semibold text-slate-950">{pendingExtras}</p></div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 bg-slate-50/80 p-2 sm:px-4">
            {[['#overview','Přehled'],['#inquiries','Poptávky'],['#offers','Nabídky'],['#communication','Komunikace'],['#new-inquiry','Nová poptávka']].map(([href,label]) => <a key={href} href={href} className="whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-[#0d2d38] hover:shadow-sm">{label}</a>)}
          </nav>
        </header>

        {workspaceMessages > 0 && <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-xs text-cyan-900"><span><strong>{workspaceMessages}</strong> zpráv uložených v komunikaci k vašim nabídkám.</span><a href="#communication" className="font-semibold underline underline-offset-2">Otevřít komunikaci</a></div>}

        {focusedProject && <section id="overview" className="mb-7 scroll-mt-28 overflow-hidden rounded-[28px] bg-[#0d2d38] text-white shadow-xl shadow-slate-900/5">
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
          <section id="inquiries" className="mb-8 scroll-mt-28">
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

        {workspaceMessages > 0 && <section id="communication" className="mb-8 scroll-mt-28 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-700">Komunikace projektu</p><h2 className="mt-1 text-xl font-semibold text-slate-950">Zprávy k nabídkám na jednom místě</h2><p className="mt-1 text-xs leading-5 text-slate-500">Dotazy, technická upřesnění a reakce jsou vždy navázané na konkrétní nabídku, takže je nemusíte hledat v e-mailu.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{workspaceMessages} zpráv</span></div>
          <div className="mt-4 space-y-2">{projects.flatMap((project) => (project.offer_messages || []).map((message) => ({ ...message, project_name: project.project_name, quote_number: project.quote_number }))).slice(-6).reverse().map((message) => <div key={message.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{message.sender_type === 'customer' ? 'Vy' : 'MLŽIDLA®'} · {message.quote_number || message.project_name}</div><span className="text-[10px] text-slate-400">{message.created_date ? new Date(message.created_date).toLocaleString('cs-CZ') : ''}</span></div><p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-700">{message.message}</p></div>)}</div>
        </section>}

        {/* Projects list */}
        <div id="offers" className="scroll-mt-28 space-y-4">
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
                  {(project.extra_charges || []).length > 0 && <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                    <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><ReceiptText size={17}/></div><div><p className="font-mono text-[10px] uppercase tracking-[.14em] text-amber-700">Příplatkové účtování projektu</p><h3 className="mt-1 text-base font-semibold text-slate-950">Dodatečné práce a položky mimo původní nabídku</h3><p className="mt-1 text-xs leading-5 text-slate-600">Každou novou položku vidíte samostatně s důvodem, cenou a stavem. Položky vyžadující váš souhlas můžete potvrdit nebo odmítnout přímo zde.</p></div></div>
                    <div className="mt-4 space-y-3">{project.extra_charges.map((charge) => <div key={charge.id} className="rounded-xl border border-amber-100 bg-white p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-slate-900">{charge.title}</p><span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${charge.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : charge.status === 'declined' ? 'bg-rose-100 text-rose-700' : charge.status === 'billed' ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-800'}`}>{charge.status === 'approved' ? 'Schváleno' : charge.status === 'declined' ? 'Odmítnuto' : charge.status === 'billed' ? 'Vyúčtováno' : 'Ke schválení'}</span></div>{charge.description && <p className="mt-2 text-xs leading-5 text-slate-600">{charge.description}</p>}<p className="mt-2 text-[10px] text-slate-400">{Number(charge.quantity || 1).toLocaleString('cs-CZ')} {charge.unit || 'ks'} × {Number(charge.unit_price_ex_vat || charge.total_price_ex_vat || 0).toLocaleString('cs-CZ')} Kč bez DPH</p></div><div className="text-left sm:text-right"><p className="text-[10px] uppercase tracking-wide text-slate-400">Příplatek</p><p className="mt-1 text-lg font-bold text-amber-800">{Number(charge.total_price_ex_vat || 0).toLocaleString('cs-CZ')} Kč</p><p className="text-[10px] text-slate-400">bez DPH</p></div></div>
                      {charge.status === 'pending_customer_approval' && <div className="mt-4 border-t border-slate-100 pt-4"><textarea value={extraChargeNotes[charge.id] || ''} onChange={(e) => setExtraChargeNotes((current) => ({ ...current, [charge.id]: e.target.value }))} rows={2} placeholder="Volitelná poznámka k vašemu rozhodnutí…" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-300"/><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => respondExtraCharge(project, charge, 'approve')} disabled={extraChargeBusy === charge.id} className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Schválit příplatek</button><button onClick={() => respondExtraCharge(project, charge, 'decline')} disabled={extraChargeBusy === charge.id} className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 disabled:opacity-50">Nesouhlasím / potřebuji upřesnit</button></div></div>}
                    </div>)}</div>
                  </div>}
                  {orderConfirmed[project.id] && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-600"/><div><p className="text-sm font-semibold text-emerald-900">Objednávka byla úspěšně potvrzena.</p><p className="mt-1 text-xs leading-5 text-emerald-800">Potvrzení objednávky jsme připravili k projektu a odesíláme jej také na váš e-mail. Náš tým naváže technickým upřesněním a potvrzením dalšího harmonogramu.</p>{project.order_confirmation_pdf_url && <a href={project.order_confirmation_pdf_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"><Download size={13}/> Potvrzení objednávky PDF</a>}</div></div></div>}
                  {!isApproved && <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 shadow-sm">
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Akce do {promoCountdown.endLabel}</span><span className="text-[11px] font-semibold text-emerald-700">Zbývá {promoDaysLeft} {promoDaysLeft === 1 ? 'den' : promoDaysLeft >= 2 && promoDaysLeft <= 4 ? 'dny' : 'dní'}</span></div>
                        <h3 className="mt-3 text-lg font-semibold text-slate-900">Doprava na místo, představení a vyzkoušení zdarma</h3>
                        <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">Při závazném objednání této nabídky do konce aktuálního měsíce získáte dopravu na místo a osobní představení řešení s možností vyzkoušení bez příplatku. Konkrétní rozsah návštěvy a přesný termín s vámi potvrdíme po přijetí objednávky.</p>
                      </div>
                      <div className="shrink-0 rounded-2xl border border-white bg-white/90 px-5 py-4 text-center shadow-sm"><div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Zbývá</div><div className="mt-1 text-3xl font-semibold text-slate-900">{promoDaysLeft}</div><div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{promoDaysLeft === 1 ? 'den' : promoDaysLeft >= 2 && promoDaysLeft <= 4 ? 'dny' : 'dní'}</div></div>
                    </div>
                  </div>}

                  <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-700">Orientační termín dodání</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">2–3 týdny od potvrzení objednávky</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">Jde o orientační výrobní a dodací lhůtu. Přesný termín dodání nebo realizace vám potvrdíme po přijetí objednávky a technickém upřesnění projektu.</p>
                  </div>

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

                  {['sent','viewed','extension_requested','expired','approved','in_production'].includes(project.status) && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div><p className="text-xs font-mono uppercase tracking-widest text-slate-400">Reagovat na nabídku</p><h3 className="mt-1 text-base font-semibold text-slate-900">Máte dotaz nebo chcete řešení upravit?</h3><p className="mt-1 text-xs leading-5 text-slate-500">Napište nám přímo k této nabídce. Můžete se zeptat na technické řešení, cenu, instalaci, termín nebo požádat o změnu rozsahu projektu.</p></div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {[
                          ['question','Mám dotaz'],
                          ['solution_change','Chci upravit řešení'],
                          ['technical','Technický dotaz'],
                          ['delivery','Termín / dodání']
                        ].map(([value,label]) => <button key={value} type="button" onClick={() => setMessageForms(prev => ({ ...prev, [project.id]: { ...(prev[project.id] || {}), category: value } }))} className={`rounded-full border px-3 py-2 text-[11px] font-semibold transition ${(messageForms[project.id]?.category || 'question') === value ? 'border-[#0b4860] bg-[#0b4860] text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'}`}>{label}</button>)}
                      </div>
                      <textarea value={(messageForms[project.id] || {}).message || ''}
                        onChange={(e) => setMessageForms((prev) => ({ ...prev, [project.id]: { ...(prev[project.id] || {}), message: e.target.value } }))}
                        placeholder="Napište dotaz nebo upřesnění k této nabídce…" rows={4}
                        className="mt-3 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400" />
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button onClick={() => sendOfferMessage(project)} disabled={messageBusy === project.id || !String((messageForms[project.id] || {}).message || '').trim()}
                          className="rounded-full bg-[#0b4860] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-40">
                          {messageBusy === project.id ? 'Odesílám…' : 'Odeslat zprávu k nabídce'}
                        </button>
                        {messageSaved[project.id] && <span className="text-xs font-medium text-emerald-700">Zpráva byla odeslána našemu týmu.</span>}
                      </div>

                      {(project.offer_messages || []).length > 0 && <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Komunikace k nabídce</p><div className="mt-3 space-y-2">{project.offer_messages.map((item) => <div key={item.id} className={`rounded-xl p-3 ${item.sender_type === 'customer' ? 'ml-6 bg-cyan-50 text-slate-700' : 'mr-6 bg-slate-100 text-slate-700'}`}><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{item.sender_type === 'customer' ? 'Vy' : 'MLŽIDLA®'}</span><span className="text-[10px] text-slate-400">{item.created_date ? new Date(item.created_date).toLocaleString('cs-CZ') : ''}</span></div><p className="mt-1 whitespace-pre-line text-xs leading-5">{item.message}</p></div>)}</div></div>}
                    </div>
                  )}

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
                        <span>Souhlasím s cenovou nabídkou, její specifikací a <Link to="/obchodni-podminky" className="font-semibold underline">obchodními podmínkami</Link>. Kliknutím na „Závazně objednat nabídku“ objednávám uvedené řešení. Orientační termín dodání je 2–3 týdny; přesný termín potvrdíme po přijetí objednávky a technickém upřesnění.</span>
                      </label>
                      <button onClick={() => approveQuote(project)} disabled={approving === project.id || !acceptedTerms[project.id]}
                        className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-xs font-semibold rounded-full hover:bg-green-700 disabled:opacity-40 transition-all">
                        {approving === project.id ? <Loader size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        {approving === project.id ? 'Potvrzuji objednávku…' : 'Závazně objednat nabídku'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <section id="new-inquiry" className="mt-8 scroll-mt-28 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(13,45,56,0.06)]">
          <div className="border-b border-slate-100 bg-[#0d2d38] px-6 py-7 text-white sm:px-8"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#61d5e5]">Nový požadavek</p><div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="text-2xl font-light sm:text-3xl">Jiný produkt nebo vlastní návrh</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">Nahrajte skicu, fotografii, výkres nebo jiný podklad a popište svou představu. Náš tým vyhodnotí vyrobitelnost, vhodný výrobní postup a možné varianty řešení. Poté se vám ozveme s doporučením a cenovou nabídkou.</p></div><div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70"><strong className="block text-white">Technické posouzení</strong>ohýbání · svařování · kotvení · hydraulika · výroba</div></div></div>
          <form onSubmit={submitNewInquiry} className="p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setNewInquiryType('other_product')} className={`rounded-2xl border p-5 text-left transition ${newInquiryType === 'other_product' ? 'border-cyan-400 bg-cyan-50 ring-4 ring-cyan-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}><ShoppingBag size={20} className={newInquiryType === 'other_product' ? 'text-cyan-700' : 'text-slate-400'}/><p className="mt-3 text-sm font-semibold text-slate-950">Poptávka jiného produktu</p><p className="mt-1 text-xs leading-5 text-slate-500">Máte zájem o jiný produkt, variantu, počet kusů nebo řešení, které není v aktuální nabídce.</p></button>
              <button type="button" onClick={() => setNewInquiryType('custom_design')} className={`rounded-2xl border p-5 text-left transition ${newInquiryType === 'custom_design' ? 'border-cyan-400 bg-cyan-50 ring-4 ring-cyan-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}><Shapes size={20} className={newInquiryType === 'custom_design' ? 'text-cyan-700' : 'text-slate-400'}/><p className="mt-3 text-sm font-semibold text-slate-950">Vlastní návrh / požadovaný tvar</p><p className="mt-1 text-xs leading-5 text-slate-500">Pošlete nám vlastní tvar, skicu nebo představu. Posoudíme vyrobitelnost a navrhneme jednu či více reálných výrobních variant.</p></button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                {newInquiryType === 'other_product' ? <label className="block text-xs font-semibold text-slate-600">Produkt / varianta, o kterou máte zájem *<input value={newInquiryForm.product} onChange={(e) => setNewInquiryForm((current) => ({ ...current, product: e.target.value }))} required placeholder="např. AURA Duo, BENDY Alej, zakázková brána…" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400"/></label> : <label className="block text-xs font-semibold text-slate-600">Požadovaný tvar / stručná představa *<input value={newInquiryForm.shape} onChange={(e) => setNewInquiryForm((current) => ({ ...current, shape: e.target.value }))} required placeholder="např. organický oblouk, znak města, vlastní linie…" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400"/></label>}
                <label className="block text-xs font-semibold text-slate-600">Popis požadavku *<textarea value={newInquiryForm.description} onChange={(e) => setNewInquiryForm((current) => ({ ...current, description: e.target.value }))} required rows={7} placeholder="Popište umístění, přibližné rozměry, počet kusů, požadovaný vzhled, termín nebo jakoukoli představu, kterou máme při návrhu zohlednit." className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none focus:border-cyan-400"/></label>
              </div>
              <div>
                <label className="flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-cyan-300 hover:bg-cyan-50/40"><UploadCloud size={28} className="text-cyan-700"/><p className="mt-3 text-sm font-semibold text-slate-900">Přidat soubory a podklady</p><p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">Fotografie prostoru, skica, PDF, technický výkres, inspirace nebo vlastní dokumentace projektu.</p><span className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">Vybrat soubory</span><input type="file" multiple className="hidden" onChange={(e) => setNewInquiryFiles(Array.from(e.target.files || []))}/></label>
                {newInquiryFiles.length > 0 && <div className="mt-3 space-y-2">{newInquiryFiles.map((file) => <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"><span className="flex min-w-0 items-center gap-2"><Paperclip size={12} className="shrink-0"/><span className="truncate">{file.name}</span></span><span className="shrink-0 text-[10px] text-slate-400">{Math.max(1, Math.round(file.size / 1024))} kB</span></div>)}</div>}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-2xl text-xs leading-5 text-slate-500">Po odeslání se nový požadavek uloží k vašemu e-mailu a objeví se v tomto portálu. Vyhodnotíme výrobní proveditelnost, možné konstrukční varianty a následně připravíme cenové řešení.</div><button type="submit" disabled={newInquiryBusy} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0d2d38] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#123c49] disabled:opacity-50">{newInquiryBusy ? <><Loader size={15} className="animate-spin"/> Odesílám požadavek…</> : <><Plus size={15}/> Odeslat k posouzení</>}</button></div>
            {newInquirySent && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><strong>Požadavek byl přijat.</strong> Evidujeme jej pod ID <span className="font-mono text-xs">{newInquirySent}</span>. Po technickém posouzení se vám ozveme s doporučeným řešením a možnostmi výroby.</div>}
          </form>
        </section>
      </div>
    </div>
  );
}
