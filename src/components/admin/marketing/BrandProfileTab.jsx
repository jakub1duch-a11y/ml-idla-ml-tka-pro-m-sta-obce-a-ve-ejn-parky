import React, { useState, useEffect } from 'react';
import { Loader, Save, Leaf, Type, Palette } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const inputCls = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all";
const defaults = {
  tone_of_voice: 'Prémiový architektonický styl; klidný, chytrý, věcný a lidský. Bez prázdných superlativů.',
  target_audience: 'Města, obce, architekti, správci parků, hřišť, promenád, areálů a veřejných prostor.',
  key_messages: 'Chytré mlžení. Bez čerpadla. Bez kompromisů, ochlazení prostoru, česká výroba, návrh na míru, instalace a servis',
  primary_colors: '#0D2D38, #0E5B67, #61D5E5, #6F8F72, #FFFFFF',
  hashtags: '#mlzidla, #ochlazenimesta, #mestskaarchitektura, #verejnyprostor, #chytreMesto',
};

export default function BrandProfileTab() {
  const [profile, setProfile] = useState(defaults);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.BrandProfile.list().then((list) => {
      if (list[0]) {
        const p = list[0];
        setId(p.id);
        setProfile({
          tone_of_voice: p.tone_of_voice || defaults.tone_of_voice,
          target_audience: p.target_audience || defaults.target_audience,
          key_messages: (p.key_messages || []).join(', ') || defaults.key_messages,
          primary_colors: (p.primary_colors || []).join(', ') || defaults.primary_colors,
          hashtags: (p.hashtags || []).join(', ') || defaults.hashtags,
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
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-2xl border border-cyan/15 bg-gradient-to-br from-[#0D2D38] via-[#0E5B67] to-[#6F8F72] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Vizuální systém MLŽIDLA.cz</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Technologie, úleva a živý prostor</h3>
        <p className="mt-2 text-sm leading-6 text-white/70">Tmavá ocel a aqua komunikují důvěru, technickou přesnost a mlhu. Tlumená zelená evokuje stromy, stín, úlevu a lepší klima ve veřejném prostoru — bez neověřených ekologických tvrzení.</p>
        <div className="mt-4 grid grid-cols-3 gap-2">{[['#0D2D38','Deep Steel','důvěra'],['#0E5B67','Ocean Teal','technologie'],['#6F8F72','Living Green','stín a úleva']].map(([color,label,meaning]) => <div key={color} className="rounded-xl border border-white/10 bg-black/15 p-3"><div className="h-8 rounded-lg" style={{ backgroundColor: color }} /><p className="mt-2 text-[11px] font-semibold text-white">{label}</p><p className="text-[10px] text-white/50">{color} · {meaning}</p></div>)}</div>
        <div className="mt-4 grid gap-2 text-xs text-white/60 sm:grid-cols-3"><span className="inline-flex items-center gap-2"><Palette size={14} className="text-cyan" /> Paleta s kontrastem</span><span className="inline-flex items-center gap-2"><Type size={14} className="text-cyan" /> Nadpisy: font-heading</span><span className="inline-flex items-center gap-2"><Leaf size={14} className="text-cyan" /> Zelená = živý prostor</span></div>
      </div>
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