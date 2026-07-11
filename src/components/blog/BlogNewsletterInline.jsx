import React, { useState } from 'react';
import { Sparkles, Instagram, Search, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function BlogNewsletterInline() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.entities.NewsletterLead.create({ email, source: 'blog_article_inline' });
    setSending(false);
    setDone(true);
  };

  return (
    <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Newsletter */}
      <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-[11px] font-mono tracking-widest uppercase rounded-full mb-3">
          <Sparkles size={12} /> Akční nabídky
        </span>
        <h4 className="font-heading font-light text-lg text-slate-900 mb-2">Neunikne vám žádná novinka.</h4>
        <p className="text-sm text-slate-500 font-light mb-4">Přihlaste se k odběru a dostávejte novinky, slevy a inspiraci přímo do e-mailu.</p>
        {done ? (
          <p className="text-sm text-slate-900 font-medium">Děkujeme za přihlášení!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input type="email" required placeholder="Váš e-mail" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none" />
            <button type="submit" disabled={sending} className="btn-metallic-mist px-5 py-2.5 text-sm font-bold justify-center disabled:opacity-50">
              {sending ? <Loader size={14} className="animate-spin" /> : 'Přihlásit'}
            </button>
          </form>
        )}
      </div>

      {/* Follow us */}
      <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-mono tracking-widest uppercase rounded-full mb-3">
            Sledujte nás
          </span>
          <h4 className="font-heading font-light text-lg text-slate-900 mb-2">Buďte s námi v obraze.</h4>
          <p className="text-sm text-slate-500 font-light mb-4">Realizace, zákulisí výroby a novinky sledujte na Instagramu a Google.</p>
        </div>
        <div className="flex gap-3">
          <a href="https://www.instagram.com/mlzidla.cz" target="_blank" rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 hover:border-slate-300 transition-all">
            <Instagram size={15} /> Instagram
          </a>
          <a href="https://www.google.com/search?q=mlzidla.cz" target="_blank" rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 hover:border-slate-300 transition-all">
            <Search size={15} /> Sledovat na Google
          </a>
        </div>
      </div>
    </div>
  );
}