import React, { useState } from 'react';
import { Loader, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AiSuggestionsTab({ onPlanCreated }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingIndex, setCreatingIndex] = useState(null);

  const generate = async () => {
    setLoading(true);
    try {
      const [products, inquiries, posts] = await Promise.all([
        base44.entities.Product.list(),
        base44.entities.ContactInquiry.list('-created_date', 30),
        base44.entities.MarketingPost.list('-created_date', 10),
      ]);
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Jsi marketingový stratég pro mlzidla.cz — výrobce nerezových mlžítek a chladicích systémů pro veřejný prostor.
Počet produktů v katalogu: ${products.length}.
Poptávky za posledních 30 dní: ${inquiries.length}.
Naplánované/publikované marketingové příspěvky: ${posts.length}.
Na základě těchto dat navrhni 5 konkrétních, akčních marketingových doporučení (kampaně, obsah, kanály, sezónnost) pro zvýšení počtu poptávek. Buď konkrétní a stručný, v češtině.`,
        response_json_schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  priority: { type: 'string', enum: ['vysoká', 'střední', 'nízká'] },
                },
              },
            },
          },
        },
      });
      setSuggestions(res.suggestions || []);
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = { vysoká: 'text-red-400 border-red-400/30 bg-red-400/10', střední: 'text-amber-400 border-amber-400/30 bg-amber-400/10', nízká: 'text-white/50 border-white/15 bg-white/5' };

  const planPost = async (s, i) => {
    setCreatingIndex(i);
    try {
      await base44.entities.MarketingPost.create({
        title: s.title,
        platform: 'blog',
        caption: s.description,
        status: 'draft',
        ai_generated: true,
      });
      onPlanCreated?.();
    } finally {
      setCreatingIndex(null);
    }
  };

  return (
    <div>
      <button onClick={generate} disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan text-ink text-sm font-medium hover:bg-cyan/90 transition-all disabled:opacity-50 mb-6">
        {loading ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {loading ? 'Generuji...' : 'Vygenerovat AI doporučení'}
      </button>

      {suggestions.length === 0 && !loading && (
        <p className="text-white/25 text-sm">Klikněte na tlačítko výše — AI navrhne konkrétní marketingové akce podle aktuálních dat webu.</p>
      )}

      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/8">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <p className="text-white text-sm font-medium">{s.title}</p>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${priorityColor[s.priority] || priorityColor['nízká']}`}>{s.priority}</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-3">{s.description}</p>
            <button onClick={() => planPost(s, i)} disabled={creatingIndex === i}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan hover:text-cyan/70 transition-colors disabled:opacity-50">
              {creatingIndex === i ? <Loader size={11} className="animate-spin" /> : null}
              {creatingIndex === i ? 'Vytvářím...' : '+ Naplánovat příspěvek z návrhu'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}