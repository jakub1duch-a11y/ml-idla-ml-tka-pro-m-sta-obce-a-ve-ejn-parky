import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader, AlertCircle, FileText, CheckCircle, Clock, Download, Share2, MessageSquare, X } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const STATUS_MAP = {
  draft: { label: 'Koncept', color: 'bg-slate-100 text-slate-500', icon: '📝' },
  sent: { label: 'Odeslána', color: 'bg-blue-50 text-blue-600', icon: '📤' },
  viewed: { label: 'Zobrazena', color: 'bg-cyan-50 text-cyan-700', icon: '👁' },
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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [approving, setApproving] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState({});
  const [shareUrl, setShareUrl] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    setSEO({ title: 'Můj projekt', description: 'Přístup k vašim poptávkám a projektům HolmTec.', robots: 'noindex, nofollow' });
  }, []);

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await base44.functions.invoke('requestPortalOtp', { email });
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
      const res = await base44.functions.invoke('verifyPortalOtp', { email, otp });
      const { inquiries, projects, session_token } = res.data;
      setInquiries(inquiries || []);
      setProjects(projects || []);
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
    } catch (e) {
      setError(e?.response?.data?.error === 'offer_expired' ? 'Platnost této nabídky již skončila. Požádejte nás o její aktualizaci.' : 'Nabídku se nepodařilo odsouhlasit. Zkuste to znovu.');
    } finally {
      setApproving(null);
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
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Ověření přístupu</p>
            <h1 className="text-3xl font-light text-slate-900">Můj projekt</h1>
            <p className="text-slate-500 text-sm mt-2">{otpSent ? 'Zadejte ověřovací kód z emailu' : 'Zadejte email pro přístup k vašim poptávkám a projektům'}</p>
          </div>

          <form onSubmit={otpSent ? verifyOtp : requestOtp} className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-4">
            {error && (
              <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!otpSent ? (
              <div>
                <label className="text-xs font-mono text-slate-400 tracking-widest uppercase block mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vas@email.cz"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none"
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
                <button type="button" onClick={() => { setOtpSent(false); setError(''); }} className="mt-3 text-xs text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1 mx-auto">
                  <X size={12} /> Změnit email
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-metallic-mist w-full py-3 justify-center text-sm font-bold disabled:opacity-50"
            >
              {loading ? <><Loader size={16} className="animate-spin" /> {otpSent ? 'Ověřuji...' : 'Odesílám kód...'}</> : otpSent ? 'Ověřit' : 'Poslat kód'}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4">
            Problém s přihlášením? <a href="mailto:obchod1@holmtec.cz" className="text-slate-900 hover:underline">Napište nám</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-1">Váš účet</p>
            <h1 className="text-2xl lg:text-3xl font-light text-slate-900">{email}</h1>
          </div>
          <button onClick={() => { setStep('login'); setEmail(''); setInquiries([]); setProjects([]); setSessionToken(null); }}
            className="px-4 py-2 bg-slate-50 text-slate-600 text-sm rounded-full hover:bg-slate-100 border border-slate-200 transition-all">
            Odhlásit se
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button className="px-4 py-3 text-slate-900 font-medium border-b-2 border-slate-900">
            Moje projekty ({projects.length})
          </button>
        </div>

        {/* Projects list */}
        <div className="space-y-4">
          {projects.length === 0 && (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-500">Zatím žádné projekty</p>
            </div>
          )}

          {projects.map(project => {
            const statusInfo = STATUS_MAP[project.status] || STATUS_MAP.draft;
            const isApproved = ['approved', 'in_production', 'ready', 'delivered'].includes(project.status);

            return (
              <div key={project.id} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-all">
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
                <div className="p-6 space-y-4">
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

                  {(project.status === 'sent' || project.status === 'viewed') && (
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