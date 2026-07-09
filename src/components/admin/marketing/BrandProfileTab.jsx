import React, { useState, useEffect } from 'react';
import { Loader, Save } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const inputCls = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all";

export default function BrandProfileTab() {
  const [profile, setProfile] = useState({ tone_of_voice: '', target_audience: '', key_messages: '', primary_colors: '', hashtags: '' });
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.BrandProfile.list().then((list) => {
      if (list[0]) {
        const p = list[0];
        setId(p.id);
        setProfile({
          tone_of_voice: p.tone_of_voice || '',
          target_audience: p.target_audience || '',
          key_messages: (p.key_messages || []).join(', '),
          primary_colors: (p.primary_colors || []).join(', '),
          hashtags: (p.hashtags || []).join(', '),
        });
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = {
      tone_of_voice: profile.tone_of_voice,
      target_audience: profile.target_audience,
      key_messages: profile.key_messages.split(',').map((s) => s.trim()).filter(Boolean),
      primary_colors: profile.primary_colors.split(',').map((s) => s.trim()).filter(Boolean),
      hashtags: profile.hashtags.split(',').map((s) => s.trim()).filter(Boolean),
    };
    if (id) await base44.entities.BrandProfile.update(id, payload);
    else {
      const created = await base44.entities.BrandProfile.create(payload);
      setId(created.id);
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Tón komunikace</label>
        <textarea rows={2} value={profile.tone_of_voice} onChange={(e) => setProfile({ ...profile, tone_of_voice: e.target.value })}
          placeholder="Např. profesionální, ale přátelský, technicky přesný..." className={inputCls} />
      </div>
      <div>
        <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Cílová skupina</label>
        <textarea rows={2} value={profile.target_audience} onChange={(e) => setProfile({ ...profile, target_audience: e.target.value })}
          placeholder="Např. města a obce, architekti, provozovatelé koupališť..." className={inputCls} />
      </div>
      <div>
        <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Klíčová sdělení (oddělte čárkou)</label>
        <input value={profile.key_messages} onChange={(e) => setProfile({ ...profile, key_messages: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Hlavní barvy (hex, oddělte čárkou)</label>
        <input value={profile.primary_colors} onChange={(e) => setProfile({ ...profile, primary_colors: e.target.value })} className={inputCls} placeholder="#0D1117, #22d3ee" />
      </div>
      <div>
        <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Doporučené hashtagy (oddělte čárkou)</label>
        <input value={profile.hashtags} onChange={(e) => setProfile({ ...profile, hashtags: e.target.value })} className={inputCls} placeholder="#mlzidla, #chlazenimestat" />
      </div>
      <button onClick={save} disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan text-ink text-sm font-medium hover:bg-cyan/90 transition-all disabled:opacity-50">
        {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />} Uložit brand styl
      </button>
    </div>
  );
}