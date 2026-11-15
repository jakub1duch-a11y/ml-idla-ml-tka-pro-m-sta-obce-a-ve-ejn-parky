import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';
import { MLZ_BRAND, MLZ_CANVA_WORKING_TEMPLATES, MLZ_DEFAULT_CANVA_OFFER_TEMPLATE, MLZ_WORKFLOW_BINDINGS } from '@/lib/mlz-brand-offer-templates';
import { checkOfferTemplateReadiness, OFFER_TEMPLATE_KINDS } from '@/lib/offer-template-system';
import ProductSheetTemplate from '@/components/offers/ProductSheetTemplate';

/** Preview and links only. Canva Autofill and PDFs require their own verified backend preflight. */
export default function OfferTemplateRegistryPanel({ prepared, selected, selectedProduct }) {
  const [kind, setKind] = useState(OFFER_TEMPLATE_KINDS.PROJECT_OFFER);
  const [showPreview, setShowPreview] = useState(false);
  const name = selectedProduct?.name || selectedProduct?.nazev || '';
  const verification = checkOfferTemplateReadiness({
    kind,
    productName: name,
    verifiedImageUrl: selectedProduct?.image_url || '',
    geometryRevision: selectedProduct?.visual_master_verified ? (selectedProduct?.visual_master_revision || 'MASTER approved') : '',
    clientName: selected?.firma || selected?.company || selected?.name || '',
    priceExVat: null,
    priceSource: '',
    priceRevision: '',
    priceConfirmed: false,
    vatRate: null,
  });
  const template = MLZ_CANVA_WORKING_TEMPLATES[kind];
  return <section className="mb-5 rounded-2xl border border-[#b9dae1] bg-white p-4 text-slate-900 sm:p-5" aria-label="Šablony nabídek a produktových listů">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <img src={MLZ_BRAND.logoMaster} alt="MLŽIDLA – oficiální logo" className="h-auto w-32 shrink-0 object-contain sm:w-44"/>
        <div><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#007789]">Canva · produktové a projektové podklady</p>
          <h3 className="text-base font-bold text-[#082f42]">Šablony pro nabídky MLŽIDLA</h3></div>
      </div>
      <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-800">Pracovní verze · ruční schválení</span>
    </div>
    <div className="mt-4 rounded-xl border border-[#A9D9E6] bg-[#EFF9FC] p-3 sm:p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#08799D]">Výchozí schválená Canva brand šablona</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-[#082F42]">{MLZ_DEFAULT_CANVA_OFFER_TEMPLATE.title}</p>
          <p className="mt-1 text-xs leading-5 text-[#486B7D]">Pro produktové listy s cenou, projektové nabídky a vizualizace. U každé poptávky vytvořit samostatnou kopii.</p>
        </div>
        <a href={MLZ_DEFAULT_CANVA_OFFER_TEMPLATE.url} target="_blank" rel="noopener noreferrer"
           className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#07576A] px-4 py-2 text-xs font-bold text-white hover:bg-[#06465A]">
          Otevřít výchozí šablonu <ExternalLink size={14} aria-hidden="true"/>
        </a>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-[#8A5500]">Šablona má 1 stránku pro AURA 700 a obsahuje pevně zapsané orientační/starší ceny i technické údaje. Pro jiný produkt všechny údaje a obrázky nahradit a ověřit. Bez kompletní revize PDF nelze připravit přílohu Gmail konceptu. Autofill dataset není dostupný.</p>
    </div>
    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      {Object.entries(MLZ_CANVA_WORKING_TEMPLATES).map(([key,item])=><button key={key} type="button" onClick={()=>setKind(key)}
        className={`rounded-xl border px-3 py-3 text-left text-xs font-semibold transition ${kind === key ? 'border-[#007789] bg-[#e9f7fa] text-[#07465a]' : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-200'}`}>
        <FileText size={15} className="mb-2"/>{item.title}<span className="mt-1 block text-[10px] font-normal text-slate-500">{item.pages} str. · pracovní kopie</span>
      </button>)}
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <a href={template.url} target="_blank" rel="noopener noreferrer"
         className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#07576a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#063f4e]">
        Otevřít alternativní pracovní návrh v Canvě <ExternalLink size={14}/>
      </a>
      <button type="button" onClick={() => setShowPreview(!showPreview)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#97cad5] px-4 py-2 text-xs font-semibold text-[#07576a]">{showPreview ? 'Skrýt náhled A4' : 'Zobrazit nový návrh A4'}</button>
      <span className="text-[11px] text-slate-500">HubSpot portál {MLZ_WORKFLOW_BINDINGS.expectedHubspotPortalId} · firemní účet {MLZ_WORKFLOW_BINDINGS.expectedWorkspaceEmail}</span>
    </div>
    {showPreview && <div className="mt-5 rounded-2xl bg-slate-100 p-3 sm:p-5"><ProductSheetTemplate kind={kind} product={selectedProduct || {}} clientName={selected?.firma || selected?.company || selected?.name || ''} siteName={selected?.mesto || selected?.city || ''} projectSummary={selected?.zprava || selected?.message || ''} catalogImageUrl={selectedProduct?.image_url || ''} siteImageUrl={prepared?.visualizationUrls?.[0] || ''} visualizationApproved={false} geometryRevision={selectedProduct?.visual_master_verified ? selectedProduct?.visual_master_revision || 'MASTER approved' : ''} /></div>}
    {verification.blockers.length ? <div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
      <AlertTriangle size={17} className="mt-0.5 shrink-0"/><div><strong>Podklady pro finální export nejsou kompletní.</strong><p>Aktuální cenu, revizi, geometrii, schválení loga na všech stranách a Canva Autofill je nutné ověřit.</p></div>
    </div> : <p className="mt-3 flex items-center gap-2 text-xs text-emerald-700"><ShieldCheck size={15}/> Základní produktová data splnila kontrolu. Finální export vyžaduje další schválení.</p>}
  </section>;
}
