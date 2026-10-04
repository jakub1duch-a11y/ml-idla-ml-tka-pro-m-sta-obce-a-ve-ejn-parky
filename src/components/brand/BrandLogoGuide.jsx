import React from 'react';
import Logo from '@/components/layout/Logo';

// Schválené digitální varianty nového logotypu MLŽIDLA®.
export default function BrandLogoGuide() {
  return (
    <div className="mt-16">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[.16em] text-secondary">Logo</p>
        <h3 className="mt-3 text-3xl">Kapka, tekuté Ž a jasný podpis značky.</h3>
        <p className="mt-3 text-muted-foreground">
          V hlavičce používáme jednoduchý wordmark. V patičce, prezentacích a vybraných detailech může být rozšířen o „Jemná atraktivní mlha“, „Pro lepší klima“ a rukopisný podpis „Architektura, která dýchá.“
        </p>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <article className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex min-h-64 items-center justify-center bg-brandwhite p-10">
            <Logo size="lg" tone="light" />
          </div>
          <div className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[.15em] text-secondary">01 · Primární světlá varianta</p>
            <h4 className="mt-2 text-xl">Wordmark pro světlé plochy</h4>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Web, nabídky, tisk a značení. Tmavý text + modré tekuté Ž.</p>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-[#071A2F] via-[#0B2A4A] to-[#0878E8] p-10">
            <Logo size="lg" />
          </div>
          <div className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[.15em] text-secondary">02 · Inverzní digitální varianta</p>
            <h4 className="mt-2 text-xl">Wordmark pro tmavé plochy</h4>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Hlavička webu, video, fotografie a tmavé prezentační plochy.</p>
          </div>
        </article>
      </div>

      <article className="mt-4 overflow-hidden rounded-2xl border border-border bg-[#071A2F] p-8 sm:p-10">
        <Logo size="lg" variant="full" />
      </article>

      <div className="mt-4 grid gap-4 rounded-2xl border border-border bg-muted p-6 sm:grid-cols-3">
        <div><p className="font-semibold">Ochranná zóna</p><p className="mt-2 text-sm text-muted-foreground">Alespoň výška kapky ze všech stran.</p></div>
        <div><p className="font-semibold">Malé velikosti</p><p className="mt-2 text-sm text-muted-foreground">Pod 120 px používat pouze jednoduchý wordmark nebo samotný symbol Ž.</p></div>
        <div><p className="font-semibold">Pohyb</p><p className="mt-2 text-sm text-muted-foreground">Pouze jemný pohyb kapky a světelný nádech. Bez blikání a agresivních efektů.</p></div>
      </div>
    </div>
  );
}
