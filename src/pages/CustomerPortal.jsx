import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Mail, Loader, AlertCircle, FileText, CheckCircle, Clock, Download, Share2, MessageSquare, X } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const STATUS_MAP = {
  draft: { label: 'Koncept', color: 'bg-slate-500/10 text-slate-400', icon: '📝' },
  sent: { label: 'Odeslána', color: 'bg-blue-500/10 text-blue-400', icon: '📤' },
  approved: { label: 'Odsouhlasena', color: 'bg-green-500/10 text-green-400', icon: '✓' },
  in_production: { label: 'Ve výrobě', color: 'bg-orange-500/10 text-orange-400', icon: '⚙️' },
  ready: { label: 'Hotovo', color: 'bg-cyan/10 text-cyan', icon: '📦' },
  delivered: { label: 'Doručeno', color: 'bg-emerald-500/10 text-emerald-400', icon: '✓✓' },
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
      if (e?.response?.status === 404) {
        setError('Žádné poptávky ani projekty nenalezeny pro tento email.');
      } else {
        setError('Chyba při odesílání kódu. Zkuste to znovu.');
      }
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

  const approveQuote = async (projectId) => {
    setApproving(projectId);
    try {
      const res = await base44.functions.invoke('approveProjectOrder', { project_id: projectId, session_token: sessionToken });
      const updated = res.data.project;
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updated } : p));
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
      <div className="min-h-screen bg-ink pt-28 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Ověření přístupu</p>
            <h1 className="text-3xl font-light text-white">Můj projekt</h1>
            <p className="text-white/50 text-sm mt-2">{otpSent ? 'Zadejte ověřovací kód z emailu' : 'Zadejte email pro přístup k vašim poptávkám a projektům'}</p>
          </div>

          <form onSubmit={otpSent ? verifyOtp : requestOtp} className="bg-card_bg border border-white/10 rounded-2xl p-8 space-y-4">
            {error && (
              <div className="flex gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {!otpSent ? (
              <div>
                <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vas@email.cz"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-2">Ověřovací kód *</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none text-center text-2xl tracking-[0.5em] font-mono"
                />
                <button type="button" onClick={() => { setOtpSent(false); setError(''); }} className="mt-3 text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1 mx-auto">
                  <X size={12} /> Změnit email
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <><Loader size={16} className="animate-spin" /> {otpSent ? 'Ověřuji...' : 'Odesílám kód...'}</> : otpSent ? 'Ověřit' : 'Poslat kód'}
            </button>
          </form>

          <p className="text-xs text-white/30 text-center mt-4">
            Problém s přihlášením? <a href="mailto:obchod1@holmtec.cz" className="text-cyan hover:text-cyan/80">Napište nám</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">Váš účet</p>
            <h1 className="text-2xl lg:text-3xl font-light text-white">{email}</h1>
          </div>
          <button onClick={() => { setStep('login'); setEmail(''); setInquiries([]); setProjects([]); setSessionToken(null); }}
            className="px-4 py-2 bg-white/5 text-white/60 text-sm rounded-full hover:bg-white/10 transition-all">
            Odhlásit se
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button className="px-4 py-3 text-white font-medium border-b-2 border-cyan">
            Moje projekty ({projects.length})
          </button>
        </div>

        {/* Projects list */}
        <div className="space-y-4">
          {projects.length === 0 && (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/50">Zatím žádné projekty</p>
            </div>
          )}

          {projects.map(project => {
            const statusInfo = STATUS_MAP[project.status] || STATUS_MAP.draft;
            const isApproved = ['approved', 'in_production', 'ready', 'delivered'].includes(project.status);

            return (
              <div key={project.id} className="bg-card_bg border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        <span className="text-white font-medium text-lg">{project.project_name}</span>
                      </div>
                      {project.quote_number && <p className="text-xs text-white/40 font-mono">Číslo nabídky: {project.quote_number}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {project.total_price && <p className="text-lg text-cyan font-bold">{project.total_price.toLocaleString('cs-CZ')} Kč</p>}
                      <p className="text-xs text-white/40">bez DPH</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.production_start_date && (
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isApproved ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-white/30'}`}>
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-white/40 mb-0.5">Zahájení výroby</p>
                          <p className="text-white font-medium">{new Date(project.production_start_date).toLocaleDateString('cs-CZ')}</p>
                        </div>
                      </div>
                    )}
                    {project.completion_date && (
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${['ready', 'delivered'].includes(project.status) ? 'bg-cyan/20 text-cyan' : 'bg-white/5 text-white/30'}`}>
                          <CheckCircle size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-white/40 mb-0.5">Termín hotovosti</p>
                          <p className="text-white font-medium">{new Date(project.completion_date).toLocaleDateString('cs-CZ')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {(project.production_notes || project.special_requirements) && (
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      {project.production_notes && (
                        <div>
                          <p className="text-xs text-cyan tracking-widest uppercase mb-1">Pozn. k výrobě</p>
                          <p className="text-sm text-white/70">{project.production_notes}</p>
                        </div>
                      )}
                      {project.special_requirements && (
                        <div>
                          <p className="text-xs text-cyan tracking-widest uppercase mb-1">Vaše požadavky</p>
                          <p className="text-sm text-white/70">{project.special_requirements}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Delivery info */}
                  {project.delivery_location && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-xs text-white/40 mb-1">Místo předání</p>
                      <p className="text-white">{project.delivery_location}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-white/10 flex gap-3 flex-wrap">
                  {project.quote_pdf_url && (
                    <a href={project.quote_pdf_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 text-xs rounded-full hover:bg-white/10 transition-all">
                      <Download size={14} /> PDF nabídka
                    </a>
                  )}

                  {project.status === 'sent' && (
                    <button onClick={() => approveQuote(project.id)} disabled={approving === project.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 text-xs rounded-full hover:bg-green-500/30 disabled:opacity-50 transition-all">
                      {approving === project.id ? <Loader size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      {approving === project.id ? 'Odsouhlašuji...' : 'Odsouhlasit nabídku'}
                    </button>
                  )}

                  {project.shared_token && (
                    <button onClick={() => generateShareUrl(project.shared_token)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 text-xs rounded-full hover:bg-white/10 transition-all">
                      <Share2 size={14} /> {shareUrl ? 'Zkopírováno' : 'Sdílet'}
                    </button>
                  )}

                  <a href="mailto:obchod1@holmtec.cz?subject=Dotaz k projektu: {project.project_name}"
                    className="flex items-center gap-2 px-4 py-2 bg-cyan/10 text-cyan text-xs rounded-full hover:bg-cyan/20 transition-all">
                    <MessageSquare size={14} /> Zpráva
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}