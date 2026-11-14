import React from 'react';
import { ExternalLink, FileText, Mail, Palette, ShieldCheck, Users, ClipboardCheck, BookOpen, MessageSquareText } from 'lucide-react';
import AdminBusinessSyncPanel from '@/components/admin/AdminBusinessSyncPanel';
import OfferWorkflowInbox from '@/components/admin/OfferWorkflowInbox';
import HubspotCatalogSync from '@/components/admin/HubspotCatalogSync';
import AdminNewsletterCampaigns from '@/components/admin/AdminNewsletterCampaigns';
import OutreachContactQueue from '@/components/admin/OutreachContactQueue';

const shortcuts = [
  { label: 'Odeslané nabídky', href: '/admin?tab=offers', Icon: FileText },
  { label: 'Poptávky', href: '/admin?tab=poptavky', Icon: Mail },
  { label: 'AI nabídky · přehled', href: '/admin?tab=offers', Icon: FileText },
  { label: 'HubSpot CRM · obchodní případy', href: 'https://app-eu1.hubspot.com/contacts/149778217/objects/0-3', Icon: Users, external: true },
  { label: 'Lokální evidence Base44', href: '/admin?tab=crm', Icon: Users },
  { label: 'Gmail koncepty', href: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#drafts', Icon: Mail, external: true },
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
            <p className="mt-1 text-sm text-slate-600">Base44 eviduje kontakty a poptávky. HubSpot a ChatGPT Sites vyžadují ověřené propojení, než se data začnou synchronizovat.</p>
          </div>
          <a href="/obchodni-nabidky" className="inline-flex items-center gap-2 rounded-xl bg-[#102b3a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#19475b]"><ExternalLink size={16}/> Otevřít na celou stránku</a>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {shortcuts.map(({label,href,Icon,external}) => <a key={label} href={href} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#102b3a] hover:border-[#008ea5]"><Icon size={15}/>{label}</a>)}
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={14}/> Pozor: HubSpot agent je v portálu 149778217, ChatGPT konektor v portálu 149032244. Kontakty se nesmí importovat, dokud není cíl ověřen. Nabídky a Gmail koncepty musí projít kontrolou; Canva → Gmail není potvrzena jako automatická integrace.</p>
      </header>
      <div className="space-y-5 p-3 lg:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: 'AI nabídky a platnost', description: 'Otevřít evidované nabídky, stav odeslání a dobu do expirace.', href: '/admin?tab=offers', Icon: FileText },
            { title: 'Koncepty Gmail', description: 'Kontrola adresáta, předmětu, textu a PDF příloh před ručním odesláním.', href: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#drafts', Icon: ClipboardCheck },
            { title: 'Kontakty a komunikace', description: 'Historie oslovení, odpovědí, webových poptávek a následných kroků.', href: '/admin?tab=crm', Icon: MessageSquareText },
          ].map(({title,description,href,Icon}) => <a key={title} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#008ea5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008ea5]"><Icon className="mb-3 text-[#008ea5]" size={23}/><h2 className="font-semibold text-[#102b3a]">{title}</h2><p className="mt-2 text-sm text-slate-600">{description}</p></a>)}
        </div>
        <details className="rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-semibold text-[#102b3a]"><BookOpen className="mr-2 inline text-[#008ea5]" size={18}/> Manuál obchodního workflow</summary><div className="mt-4 space-y-2 text-sm text-slate-700"><p><strong>1. HubSpot CRM:</strong> Ověřit cílový portál (149778217 versus 149032244), firmu a e-mail, duplicity a poslední komunikaci; import bez shody zastavit. Google Sheets je doplňková obchodní evidence.</p><p><strong>2. Oslovení:</strong> Všeobecná nabídka s QR, obrázkem v těle, PDF a podpisem. Bez individuální ceny.</p><p><strong>3. Poptávka:</strong> Spárovat formulář nebo Gmail s kontaktem a zjistit produkt, místo a přílohy.</p><p><strong>4. Výběr agenta:</strong> Pro konkrétní případ samostatně zvolit Base44 preflight nebo předání do ChatGPT. Gemini zůstává vypnutý.</p><p><strong>5. Nabídka:</strong> Ověřit cenu v kalkulaci, připravit Canva PDF a vhodné řešení SUPLA.</p><p><strong>5. Koncept:</strong> Zkontrolovat adresáta, text, přílohy, duplicity a vazbu na obchodní případ.</p><p><strong>6. Odeslání:</strong> Až po schválení. Stav odeslání ověřit podle skutečné zprávy v Gmailu.</p><p><strong>7. Následná komunikace:</strong> Evidovat odpověď, další krok a platnost nabídky. Neověřený stav neoznačovat jako potvrzený.</p></div></details>
        <OutreachContactQueue />
        <OfferWorkflowInbox />
        <AdminBusinessSyncPanel />
        <HubspotCatalogSync />
        <AdminNewsletterCampaigns />
        <iframe title="MLŽIDLA Sales Hub – obchodní případy a nabídky" src="/obchodni-nabidky" className="h-[calc(100vh-250px)] min-h-[750px] w-full rounded-2xl border border-slate-200 bg-white shadow-sm" />
      </div>
    </section>
  );
}