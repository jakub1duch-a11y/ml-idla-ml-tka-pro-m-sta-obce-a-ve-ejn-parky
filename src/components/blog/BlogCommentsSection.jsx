import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogCommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [website, setWebsite] = useState('');

  const loadComments = () => {
    base44.entities.BlogComment.filter({ blog_post_id: postId }, '-created_date')
      .then((items) => setComments(items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (postId) loadComments(); }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (website) return;
    setSending(true);
    setError('');
    try {
      await base44.entities.BlogComment.create({
        blog_post_id: postId,
        name: form.name.trim().slice(0, 80),
        email: form.email.trim().slice(0, 150),
        comment: form.comment.trim().slice(0, 1000),
      });
      setForm({ name: '', email: '', comment: '' });
      setSubmitted(true);
      loadComments();
    } catch {
      setError('Komentář se nepodařilo odeslat. Zkuste to prosím znovu.');
    } finally { setSending(false); }
  };

  return (
    <section id="blog-comments" className="scroll-mt-28 border-t border-[#D6E6EC] py-12" aria-label="Diskuze k článku">
      <h3 className="font-heading font-light text-2xl text-slate-900 tracking-tight mb-8 flex items-center gap-2.5">
        <MessageCircle size={20} className="text-slate-400" /> Komentáře {comments.length > 0 && <span className="text-slate-300">({comments.length})</span>}
      </h3>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3 rounded-2xl border border-[#CEE3EC] bg-[#F4FAFC] p-4 sm:p-6">
        <div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor="blog-comment-website">Web</label><input id="blog-comment-website" type="text" value={website} onChange={e=>setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"/></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" required maxLength={80} placeholder="Jméno *" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none" />
          <input type="email" maxLength={150} placeholder="E-mail (nezveřejní se)" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none" />
        </div>
        <textarea required maxLength={1000} rows={3} placeholder="Váš komentář... *" value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none resize-none" />
        <p className="text-xs text-[#5F7684]">Komentář bude veřejný, e-mail nezobrazujeme. Pište prosím věcně a bez osobních údajů.</p>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {submitted && <p role="status" className="text-sm font-semibold text-[#0C6687]">Děkujeme, komentář byl odeslán.</p>}
        <button type="submit" disabled={sending}
          className="btn-metallic-mist px-6 py-3 text-sm font-bold disabled:opacity-50">
          {sending ? 'Odesílám...' : 'Přidat komentář'}
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-8"><Loader size={20} className="animate-spin text-slate-300" /></div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-400 font-light">Buďte první, kdo okomentuje tento článek.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-900">{c.name}</p>
                <p className="text-xs font-mono text-slate-300">{formatDate(c.created_date)}</p>
              </div>
              <p className="text-sm text-slate-500 font-light leading-relaxed">{c.comment}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}