import React from 'react';
import { ExternalLink, FileText, Mail, Palette, ShieldCheck, Users, Sparkles } from 'lucide-react';
import AdminBusinessSyncPanel from '@/components/admin/AdminBusinessSyncPanel';
import AdminNewsletterCampaigns from '@/components/admin/AdminNewsletterCampaigns';

const shortcuts = [
  { label: 'Odeslané nabídky', href: '/admin?tab=offers', Icon: FileText },
  { label: 'Poptávky', href: '/admin?tab=poptavky', Icon: Mail },
  { label: 'Kontakty a AI oslovení', href: '/admin?tab=prospects', Icon: Users },
  { label: 'Schvalování AI nabídek', href: '/admin?tab=approvals', Icon: Sparkles },
  { label: 'Canva · katalog', href: 'https://www.canva.com/design/DAHa1B5S2eg/BjtW1avef1aLLSQWNpueRg/edit', Icon: Palette, external: true },
];
export default function AdminSalesHub() {
  return (
    <section className="min-h-screen bg-[#f5f8fa]">
      <header className="border-b border-slate-200 bg-white px-5 py-5 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#008ea5]">MLŽIDLA.cz / CRM</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#102b3a]">Obchodní centrum</h1>
            <p className="mt-1 text-sm text-slate-600">Poptávky, cenové nabídky a obchodní případy přímo v administraci.</p>
          </div>
          <a href="/obchodni-nabidky" className="inline-flex items-center gap-2 rounded-xl bg-[#102b3a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#19475b]"><ExternalLink size={16}/> Otevřít na celou stránku</a>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {shortcuts.map(({label,href,Icon,external}) => <a key={label} href={href} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#102b3a] hover:border-[#008ea5]"><Icon size={15}/>{label}</a>)}
        </div>
        <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700"><strong>Obchodní workflow:</strong> nové kontakty lze evidovat v Kontaktech a AI oslovení; návrhy zpráv vytváří stávající Base44 funkce generateProspectMessage. Vyhledávání nových kontaktů pomocí ChatGPT/Gemini vyžaduje samostatné autorizované napojení a kontrolu zdrojů, duplicit a souhlasu s oslovením.</div>
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={14}/> Koncepty a nabídky vyžadují kontrolu před odesláním. Integrace Canva → Gmail není tímto rozhraním automaticky potvrzena.</p>
      </header>
      <div className="space-y-5 p-3 lg:p-6">
        <AdminBusinessSyncPanel />
        <AdminNewsletterCampaigns />
        <iframe title="MLŽIDLA Sales Hub – obchodní případy a nabídky" src="/obchodni-nabidky" className="h-[calc(100vh-250px)] min-h-[750px] w-full rounded-2xl border border-slate-200 bg-white shadow-sm" />
      </div>
    </section>
  );
}
