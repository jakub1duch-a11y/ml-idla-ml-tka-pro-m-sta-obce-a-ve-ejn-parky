import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Clock, AlertCircle, Share2, Download, Loader, FileText, Calendar, MapPin } from 'lucide-react';

const STATUS_MAP = {
  draft: { label: 'Koncept nabídky', color: 'from-slate-500/20 to-slate-500/5', icon: '📝', desc: 'Nabídka se připravuje' },
  sent: { label: 'Odeslána', color: 'from-blue-500/20 to-blue-500/5', icon: '📤', desc: 'Nabídka čeká na vaši odpověď' },
  approved: { label: 'Odsouhlasena', color: 'from-green-500/20 to-green-500/5', icon: '✓', desc: 'Díky! Zahájili jsme výrobu' },
  in_production: { label: 'Ve výrobě', color: 'from-orange-500/20 to-orange-500/5', icon: '⚙️', desc: 'Váš projekt se vyrábí' },
  ready: { label: 'Hotovo', color: 'from-cyan/20 to-cyan/5', icon: '📦', desc: 'Projekt je připraven k předání' },
  delivered: { label: 'Doručeno', color: 'from-emerald-500/20 to-emerald-500/5', icon: '✓✓', desc: 'Realizace je hotová' },
};

const DELIVERY_METHODS = {
  pickup: 'Vyzvednutí',
  delivery: 'Doručení',
  installation: 'Instalace na místě',
};

export default function ProjectStatus() {
  const { token } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    base44.entities.ProjectOrder.filter({ shared_token: token })
      .then(results => {
        if (results.length === 0) {
          setError('Projekt nenalezen');
        } else {
          setProject(results[0]);
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-ink pt-28 flex items-center justify-center">
        <div className="max-w-md text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl text-white font-light mb-2">Projekt nenalezen</h1>
          <p className="text-white/50">{error || 'Neznámá chyba'}</p>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[project.status] || STATUS_MAP.draft;
  const shareUrl = `${window.location.origin}/project/${token}`;

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ink pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Stav vašeho projektu</p>
          <h1 className="text-3xl lg:text-4xl font-light text-white mb-2">{project.project_name}</h1>
          <p className="text-white/50">{project.client_name}</p>
        </div>

        {/* Status card */}
        <div className={`bg-gradient-to-br ${statusInfo.color} border border-white/10 rounded-2xl p-8 mb-8 text-center`}>
          <div className="text-5xl mb-4">{statusInfo.icon}</div>
          <h2 className="text-2xl text-white font-light mb-2">{statusInfo.label}</h2>
          <p className="text-white/60">{statusInfo.desc}</p>
        </div>

        {/* Timeline */}
        <div className="space-y-4 mb-8">
          {/* Approval status */}
          <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${project.status === 'approved' || ['approved', 'in_production', 'ready', 'delivered'].includes(project.status) ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}>
                {['approved', 'in_production', 'ready', 'delivered'].includes(project.status) ? <CheckCircle size={20} /> : <Clock size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Odsouhlasení nabídky</p>
                <p className="text-sm text-white/50 mt-1">
                  {['approved', 'in_production', 'ready', 'delivered'].includes(project.status)
                    ? `Odsouhlaseno ${project.approved_at ? new Date(project.approved_at).toLocaleDateString('cs-CZ') : 'nedávno'}`
                    : 'Čekáme na vaši odpověď'}
                </p>
              </div>
            </div>
          </div>

          {/* Production timeline */}
          {['approved', 'in_production', 'ready', 'delivered'].includes(project.status) && (
            <>
              <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${['in_production', 'ready', 'delivered'].includes(project.status) ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-white/30'}`}>
                    {['in_production', 'ready', 'delivered'].includes(project.status) ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium flex items-center gap-2">
                      <Calendar size={16} /> Zahájení výroby
                    </p>
                    <p className="text-sm text-white/50 mt-1">
                      {project.production_start_date 
                        ? new Date(project.production_start_date).toLocaleDateString('cs-CZ')
                        : 'Plánováno v brzké době'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${['ready', 'delivered'].includes(project.status) ? 'bg-cyan/20 text-cyan' : 'bg-white/5 text-white/30'}`}>
                    {['ready', 'delivered'].includes(project.status) ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium flex items-center gap-2">
                      <Calendar size={16} /> Plánovaný termín hotovosti
                    </p>
                    <p className="text-sm text-white/50 mt-1">
                      {project.completion_date 
                        ? new Date(project.completion_date).toLocaleDateString('cs-CZ')
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${project.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                    {project.status === 'delivered' ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium flex items-center gap-2">
                      <MapPin size={16} /> {DELIVERY_METHODS[project.delivery_method] || 'Předání'}
                    </p>
                    <p className="text-sm text-white/50 mt-1">
                      {project.delivery_location || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        {(project.production_notes || project.special_requirements) && (
          <div className="bg-card_bg border border-white/10 rounded-2xl p-6 mb-8">
            {project.production_notes && (
              <div className="mb-4">
                <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Poznámky k výrobě</p>
                <p className="text-white/70 text-sm leading-relaxed">{project.production_notes}</p>
              </div>
            )}
            {project.special_requirements && (
              <div>
                <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Speciální požadavky</p>
                <p className="text-white/70 text-sm leading-relaxed">{project.special_requirements}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {project.quote_pdf_url && (
            <a href={project.quote_pdf_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-all">
              <FileText size={16} /> Stáhnout nabídku PDF
            </a>
          )}
          <button onClick={copyShareUrl}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
            <Share2 size={16} /> {copied ? 'Zkopírováno!' : 'Sdílet projekt'}
          </button>
          <a href="mailto:obchod1@holmtec.cz?subject=Dotaz k projektu: {project.project_name}"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white/60 text-sm rounded-full hover:bg-white/10 transition-all">
            Napsat zprávu →
          </a>
        </div>
      </div>
    </div>
  );
}