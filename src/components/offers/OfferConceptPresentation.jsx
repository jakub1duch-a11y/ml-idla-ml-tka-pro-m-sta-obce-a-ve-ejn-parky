import React from 'react';
import { Shield, FileText, Printer, Download } from 'lucide-react';

const STATUS_LABELS = {
  nova_poptavka: { label: 'NOVÁ POPTÁVKA', color: 'text-slate-600 bg-slate-100 border-slate-300' },
  koncept: { label: 'KONCEPT', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  k_overeni: { label: 'K OVĚŘENÍ', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  schvaleno: { label: 'SCHVÁLENO', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  odeslano: { label: 'ODESLÁNO', color: 'text-primary bg-primary/10 border-primary/30' },
};

export default function OfferConceptPresentation({ concept, product, visualizationUrl, offerStatus, clientInfo }) {
  const statusInfo = STATUS_LABELS[offerStatus] || STATUS_LABELS.nova_poptavka;
  const today = new Date().toLocaleDateString('cs-CZ');
  const validUntil = new Date(Date.now() + 30 * 86400000).toLocaleDateString('cs-CZ');

  return (
    <div className="mx-auto max-w-4xl bg-white print:shadow-none">
      {/* Safety gate banner — not printed */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 print:hidden">
        <Shield size={18} className="shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          <strong>Bezpečnostní brána:</strong> AI připravila koncept nabídky. Automatický proces nikdy neodesílá nabídku zákazníkovi.
          Stav: <span className={`ml-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
        </p>
      </div>

      {/* Action buttons — not printed */}
      <div className="mb-6 flex gap-3 print:hidden">
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted">
          <Printer size={15} /> Vytisknout
        </button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted">
          <Download size={15} /> Uložit jako PDF
        </button>
      </div>

      {/* ── Printable document ── */}
      <div className="border border-border p-8 lg:p-12 print:border-0 print:p-0">
        {/* Header */}
        <header className="flex items-start justify-between border-b-2 border-primary pb-6">
          <div>
            <p className="font-mono text-[10px] tracking-[.18em] uppercase text-accent">MLŽIDLA® / HolmTec s.r.o.</p>
            <h1 className="mt-2 font-heading text-3xl text-primary">{concept?.project_title || 'Návrh mlžného systému'}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Obchodně-technický koncept nabídky</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Datum: <strong className="text-foreground">{today}</strong></p>
            <p>Platnost do: <strong className="text-foreground">{validUntil}</strong></p>
            <p className="mt-2 text-[10px]">Nabídka č. {concept?.project_order_id?.slice(-8) || '—'}</p>
          </div>
        </header>

        {/* Client info */}
        <section className="mt-6">
          <h2 className="font-mono text-[10px] tracking-[.16em] uppercase text-accent">Klient</h2>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">Jméno</p><p className="font-semibold">{clientInfo?.jmeno || clientInfo?.name || '—'}</p></div>
            <div><p className="text-muted-foreground">Organizace</p><p className="font-semibold">{clientInfo?.firma || clientInfo?.company || '—'}</p></div>
            <div><p className="text-muted-foreground">Email</p><p className="font-semibold">{clientInfo?.email || '—'}</p></div>
            <div><p className="text-muted-foreground">Telefon</p><p className="font-semibold">{clientInfo?.telefon || clientInfo?.phone || '—'}</p></div>
          </div>
        </section>

        <Section title="Shrnutí požadavku" icon={<FileText size={14} />}>
          <p className="text-sm leading-relaxed text-foreground">{concept?.requirements_summary || '—'}</p>
        </Section>

        <Section title="Doporučené řešení">
          <p className="text-sm leading-relaxed text-foreground">{concept?.recommended_solution || '—'}</p>
        </Section>

        <Section title="Vhodný produkt / konstrukční princip">
          <p className="text-sm font-semibold text-primary">{product?.name || '—'}</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{concept?.product_recommendation || '—'}</p>
        </Section>

        <Section title="Materiál">
          <p className="text-sm leading-relaxed text-foreground">{concept?.material_note || 'Nerez AISI 316L (1.4404) — odolný vůči korozi, chlorované vodě a atmosférickým vlivům. Standard pro venkovní veřejné instalace.'}</p>
        </Section>

        <Section title="Technické řešení">
          <p className="text-sm leading-relaxed text-foreground">{concept?.technical_solution || '—'}</p>
        </Section>

        <Section title="Smart / nízkotlaké řízení">
          <p className="text-sm leading-relaxed text-foreground">{concept?.smart_control || '—'}</p>
        </Section>

        <Section title="Rozsah dodávky">
          <ul className="space-y-1">
            {(concept?.scope_of_delivery || []).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Instalace">
          <p className="text-sm leading-relaxed text-foreground">{concept?.installation_plan || '—'}</p>
        </Section>

        {concept?.schedule_plan && (
          <Section title="Naplánování">
            <p className="text-sm leading-relaxed text-foreground">{concept.schedule_plan}</p>
          </Section>
        )}

        <Section title="Servis">
          <p className="text-sm leading-relaxed text-foreground">{concept?.service_plan || '—'}</p>
        </Section>

        <Section title="Orientační kalkulace">
          <div className="overflow-hidden border border-border">
            <table className="w-full text-sm">
              <tbody>
                <CostRow label="Produkt / konstrukce" value={concept?.rough_cost?.product_range} />
                <CostRow label="Smart řízení + senzory" value={concept?.rough_cost?.smart_control_range} />
                <CostRow label="Instalace" value={concept?.rough_cost?.installation_range} />
                <CostRow label="Roční servis" value={concept?.rough_cost?.service_annual_range} />
                <tr className="border-t-2 border-primary bg-muted">
                  <td className="px-4 py-3 font-heading font-bold text-primary">Celkem (orientačně)</td>
                  <td className="px-4 py-3 text-right font-heading font-bold text-primary">{concept?.rough_cost?.total_range || 'Dle projektové konfigurace'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Ceny jsou orientační, bez DPH. Finální cena bude upřesněna po technické kontrole a schválení rozsahu projektu.</p>
        </Section>

        {visualizationUrl && (
          <Section title="Vizualizační náhled konkrétního místa">
            <div className="overflow-hidden border border-border">
              <img src={visualizationUrl} alt="Vizualizace" className="w-full" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{concept?.visualization_scene}</p>
          </Section>
        )}

        {concept?.benefits?.length > 0 && (
          <Section title="Přínosy řešení">
            <ul className="grid gap-2 sm:grid-cols-2">
              {concept.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <footer className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-semibold text-foreground">HolmTec s.r.o. — MLŽIDLA®</p>
              <p>Ing. Radek Meduna · +420 774 700 390 · meduna@holmtec.cz</p>
              <p>www.mlzidla.cz · IČO: 07980223 · DIČ: CZ07980223</p>
            </div>
            <div className="text-right">
              <p>Tento koncept připravil AI systém MLŽIDLA.</p>
              <p className="mt-1">Nabídka byla zkontrolována a schválena obchodníkem.</p>
            </div>
          </div>
          {concept?.confidence_note && (
            <p className="mt-4 border-t border-border pt-2 text-[10px] italic">{concept.confidence_note}</p>
          )}
        </footer>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <section className="mt-6">
      <h2 className="flex items-center gap-2 font-mono text-[10px] tracking-[.16em] uppercase text-accent">
        {icon} {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function CostRow({ label, value }) {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-2.5 text-foreground">{label}</td>
      <td className="px-4 py-2.5 text-right font-semibold text-foreground">{value || '—'}</td>
    </tr>
  );
}