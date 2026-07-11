import React, { useState, useEffect } from 'react';
import { Plus, Loader, Pencil, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import BlogPostForm from '@/components/admin/BlogPostForm';

const EMPTY_FORM = { title: '', slug: '', category: '', audience: 'oboji', perex: '', content: '', image_url: '', tags: '', published: false, cta_label: '', cta_link: '' };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, 'new' or post.id
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const loadPosts = () => {
    setLoading(true);
    base44.entities.BlogPost.list('-created_date').then(setPosts).finally(() => setLoading(false));
  };

  useEffect(() => { loadPosts(); }, []);

  const startNew = () => { setForm(EMPTY_FORM); setEditing('new'); };
  const startEdit = (post) => {
    setForm({
      title: post.title || '', slug: post.slug || '', category: post.category || '',
      audience: post.audience || 'oboji',
      perex: post.perex || '', content: post.content || '', image_url: post.image_url || '',
      tags: (post.tags || []).join(', '), published: !!post.published,
      cta_label: post.cta_label || '', cta_link: post.cta_link || '',
    });
    setEditing(post.id);
  };

  const handleDuplicate = async (post) => {
    await base44.entities.BlogPost.create({
      title: `${post.title} (kopie)`,
      slug: `${post.slug || ''}-kopie-${Date.now()}`,
      category: post.category, audience: post.audience || 'oboji',
      perex: post.perex, content: post.content, image_url: post.image_url,
      tags: post.tags || [], published: false,
      cta_label: post.cta_label, cta_link: post.cta_link,
    });
    loadPosts();
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      published_date: form.published ? new Date().toISOString().slice(0, 10) : undefined,
    };
    if (editing === 'new') await base44.entities.BlogPost.create(payload);
    else await base44.entities.BlogPost.update(editing, payload);
    setSaving(false);
    setEditing(null);
    loadPosts();
  };

  const togglePublished = async (post) => {
    await base44.entities.BlogPost.update(post.id, { published: !post.published });
    loadPosts();
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Smazat článek "${post.title}"?`)) return;
    await base44.entities.BlogPost.delete(post.id);
    loadPosts();
  };

  if (editing) {
    return (
      <div className="p-8 max-w-3xl">
        <h2 className="text-white text-xl font-light mb-6">{editing === 'new' ? 'Nový článek' : 'Upravit článek'}</h2>
        <BlogPostForm form={form} setForm={setForm} onSave={handleSave} onCancel={() => setEditing(null)}
          saving={saving} uploadingCover={uploadingCover} setUploadingCover={setUploadingCover} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-light">Blog</h2>
        <button onClick={startNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
          <Plus size={15} /> Nový článek
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader size={24} className="animate-spin text-white/30" /></div>
      ) : posts.length === 0 ? (
        <p className="text-white/40 text-sm">Zatím žádné články.</p>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl bg-card_bg border border-white/10">
              {post.image_url && <img src={post.image_url} alt={post.title} className="w-16 h-12 object-cover rounded-lg shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{post.title}</p>
                <p className="text-white/40 text-xs">{post.category} · {post.published ? 'Publikováno' : 'Koncept'}</p>
              </div>
              <button onClick={() => togglePublished(post)} title={post.published ? 'Skrýt' : 'Publikovat'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:bg-white/10 transition-all">
                {post.published ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button onClick={() => startEdit(post)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:bg-white/10 transition-all">
                <Pencil size={15} />
              </button>
              <button onClick={() => handleDuplicate(post)} title="Duplikovat" className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:bg-white/10 transition-all">
                <Copy size={15} />
              </button>
              <button onClick={() => handleDelete(post)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}