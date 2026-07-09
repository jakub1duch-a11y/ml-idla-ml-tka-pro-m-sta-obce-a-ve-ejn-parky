import React, { useState, useEffect } from 'react';
import { Loader, CalendarClock, Palette, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ContentPlanForm from '@/components/admin/marketing/ContentPlanForm';
import ContentPlanList from '@/components/admin/marketing/ContentPlanList';
import BrandProfileTab from '@/components/admin/marketing/BrandProfileTab';
import AiSuggestionsTab from '@/components/admin/marketing/AiSuggestionsTab';
import InstagramConnectCard from '@/components/admin/marketing/InstagramConnectCard';

const SUBTABS = [
  { id: 'plan', label: 'Plán obsahu', icon: CalendarClock },
  { id: 'brand', label: 'Brand styl', icon: Palette },
  { id: 'ai', label: 'AI doporučení', icon: Sparkles },
];

export default function AdminMarketing() {
  const [subtab, setSubtab] = useState('plan');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = () => {
    setLoading(true);
    base44.entities.MarketingPost.list('-scheduled_date').then(setPosts).finally(() => setLoading(false));
  };

  useEffect(() => { loadPosts(); }, []);

  return (
    <div className="p-6">
      <h2 className="text-white text-lg font-medium mb-6">Marketing hub</h2>

      <div className="flex gap-2 mb-6">
        {SUBTABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setSubtab(t.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono transition-all ${subtab === t.id ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {subtab === 'plan' && (
        <div className="space-y-6">
          <InstagramConnectCard />
          <ContentPlanForm onCreated={loadPosts} />
          {loading ? (
            <div className="flex justify-center py-16"><Loader size={22} className="animate-spin text-cyan/40" /></div>
          ) : (
            <ContentPlanList posts={posts} onChange={loadPosts} />
          )}
        </div>
      )}

      {subtab === 'brand' && <BrandProfileTab />}
      {subtab === 'ai' && <AiSuggestionsTab />}
    </div>
  );
}