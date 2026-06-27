import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader, MessageSquare, Star, TrendingUp, Calendar, Mail } from 'lucide-react';

export default function AdminFeedback() {
  const [formId, setFormId] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFeedback = async () => {
    if (!formId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('getTypeformResponses', { formId });
      setResponses(res.data.responses || []);
    } catch (err) {
      setError(err.message || 'Chyba při načítání feedback');
    } finally {
      setLoading(false);
    }
  };

  const avgRating = responses.length > 0
    ? (responses.reduce((s, r) => {
        const ratings = Object.values(r.answers).filter(v => typeof v === 'number');
        return s + ratings.reduce((a, b) => a + b, 0);
      }, 0) / responses.length).toFixed(1)
    : 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">ZPĚTNÁ VAZBA</p>
        <h1 className="text-2xl font-light text-white mb-6">Feedback zákazníků — Typeform</h1>

        {/* Form ID input */}
        <div className="flex gap-3 mb-6">
          <input
            value={formId}
            onChange={e => setFormId(e.target.value)}
            placeholder="Zadej ID Typeform formuláře..."
            onKeyDown={e => e.key === 'Enter' && loadFeedback()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none"
          />
          <button
            onClick={loadFeedback}
            disabled={loading || !formId.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-50 transition-all"
          >
            {loading ? <><Loader size={14} className="animate-spin" /> Načítám...</> : <>Načíst feedback</>}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}
      </div>

      {/* Stats */}
      {responses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare size={18} className="text-cyan" />
              <p className="text-xs font-mono text-white/40 uppercase">Odpovědi</p>
            </div>
            <p className="text-2xl text-white font-light">{responses.length}</p>
          </div>
          <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star size={18} className="text-yellow-400" />
              <p className="text-xs font-mono text-white/40 uppercase">Prům. rating</p>
            </div>
            <p className="text-2xl text-white font-light">{avgRating} / 5</p>
          </div>
          <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={18} className="text-emerald-400" />
              <p className="text-xs font-mono text-white/40 uppercase">Poslední 7 dní</p>
            </div>
            <p className="text-2xl text-white font-light">
              {responses.filter(r => {
                const d = new Date(r.submitted_at);
                const now = new Date();
                return (now - d) < 7 * 24 * 60 * 60 * 1000;
              }).length}
            </p>
          </div>
          <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={18} className="text-white/40" />
              <p className="text-xs font-mono text-white/40 uppercase">Poslední odpověď</p>
            </div>
            <p className="text-xs text-white font-light">
              {responses.length > 0 ? new Date(responses[0].submitted_at).toLocaleDateString('cs-CZ') : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Responses list */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : responses.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">
            {formId ? 'Zatím žádné odpovědi' : 'Zadej ID Typeform formuláře a klikni na "Načíst feedback"'}
          </div>
        ) : (
          responses.map((response, i) => (
            <div key={response.id} className="bg-card_bg border border-white/10 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">Odpověď #{responses.length - i}</p>
                  <p className="text-xs text-white/40">{new Date(response.submitted_at).toLocaleString('cs-CZ')}</p>
                </div>
                {Object.values(response.answers).some(v => typeof v === 'number') && (
                  <div className="flex items-center gap-1.5 text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium">
                      {Object.values(response.answers).find(v => typeof v === 'number') || '?'} / 5
                    </span>
                  </div>
                )}
              </div>

              {/* Answers */}
              <div className="space-y-3">
                {Object.entries(response.answers).map(([key, value]) => (
                  <div key={key} className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs font-mono text-white/30 mb-1">#{key}</p>
                    <p className="text-sm text-white/70 leading-relaxed break-words">
                      {typeof value === 'number' ? (
                        <span className="inline-flex items-center gap-1">
                          {value}
                          <span className="text-white/30">/5</span>
                        </span>
                      ) : (
                        value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Help section */}
      {!formId && (
        <div className="mt-12 p-6 rounded-2xl bg-cyan/5 border border-cyan/20">
          <h3 className="text-white font-medium mb-2">Jak získat ID formuláře?</h3>
          <ol className="text-sm text-white/60 space-y-1 list-decimal list-inside">
            <li>Jdi na <a href="https://typeform.com" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">typeform.com</a> a vytvoř nový formulář</li>
            <li>Postav otázky (např. "Jak jste spokojeni?" s ratingem 1-5)</li>
            <li>Sdílej formulář zákazníkům</li>
            <li>ID formuláře najdeš v URL: <code className="text-white/40 font-mono bg-white/5 px-2 py-1 rounded">typeform.com/to/FORM_ID</code></li>
            <li>Sem zkopíruj jen část <code className="text-white/40 font-mono">FORM_ID</code></li>
          </ol>
        </div>
      )}
    </div>
  );
}