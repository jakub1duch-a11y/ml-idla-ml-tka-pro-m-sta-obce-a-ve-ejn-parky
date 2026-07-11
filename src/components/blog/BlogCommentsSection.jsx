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

  const loadComments = () => {
    base44.entities.BlogComment.filter({ blog_post_id: postId }, '-created_date')
      .then((items) => setComments(items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (postId) loadComments(); }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.entities.BlogComment.create({ blog_post_id: postId, ...form });
    setForm({ name: '', email: '', comment: '' });
    setSending(false);
    loadComments();
  };

  return (
    <div className="py-12 border-t border-slate-200">
      <h3 className="font-heading font-light text-2xl text-slate-900 tracking-tight mb-8 flex items-center gap-2.5">
        <MessageCircle size={20} className="text-slate-400" /> Komentáře {comments.length > 0 && <span className="text-slate-300">({comments.length})</span>}
      </h3>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-8 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" required placeholder="Jméno *" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none" />
          <input type="email" placeholder="Email (nezveřejní se)" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none" />
        </div>
        <textarea required rows={3} placeholder="Váš komentář... *" value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none resize-none" />
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
    </div>
  );
}