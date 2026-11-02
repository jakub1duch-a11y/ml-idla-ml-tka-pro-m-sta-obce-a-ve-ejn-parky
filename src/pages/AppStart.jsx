import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, ClipboardList, Compass, LockKeyhole,
  MapPin, ShieldCheck, Smartphone, Sparkles,
} from 'lucide-react';
import Logo from '@/components/layout/Logo';
import InstallAppButton from '@/components/admin/team/InstallAppButton';
import { useAuth } from '@/lib/AuthContext';
import { setSEO } from '@/lib/seo';

const linkStyle = 'group flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.06] p-4 text-left transition-colors hover:border-cyan-300/50 hover:bg-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300';

function AppLink({ to, icon: Icon, title, detail, primary = false }) {
  return <Link to={to} className={primary ? linkStyle + ' border-cyan-300/40 bg-cyan-300/10' : linkStyle}>
    <span className="flex min-w-0 items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10">
        <Icon size={21} className="text-cyan-200" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <strong className="block text-base font-semibold text-white">{title}</strong>
        <span className="mt-1 block text-sm leading-5 text-white/70">{detail}</span>
      </span>
    </span>
    <ArrowRight size={19} className="shrink-0 text-cyan-200 transition-transform group-hover:translate-x-1" aria-hidden="true" />
  </Link>;
}

export default function AppStart() {
  const { user, isLoadingAuth } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setSEO({
      title: 'Aplikace MLŽIDLA.cz | Katalog a obchodní centrum',
      description: 'Mlžítka, realizace, poptávky a zabezpečené obchodní centrum.',
      canonicalPath: '/aplikace',
      robots: 'noindex, nofollow',
    });
  }, []);

  return <div className="min-h-screen bg-[#071b2c] text-white">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(30,136,167,.22),transparent_48%)]" />
    <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <Link to="/" aria-label="MLŽIDLA.cz – úvodní stránka" className="inline-flex">
          <Logo size="md" tone="dark" variant="full" />
        </Link>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/75">
          <Smartphone size={14} aria-hidden="true" /> Aplikace pro zákazníky i tým
        </span>
      </header>

      <main className="mt-8 grid items-start gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.19em] text-cyan-200">
            <Sparkles size={16} aria-hidden="true" /> Architektura vodní mlhy
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Mlžítka pro místa, kde chcete být.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
            Vyberte si mlžítko, inspirujte se realizacemi nebo nám pošlete zadání svého prostoru.
            Vše na jednom místě, také z telefonu.
          </p>

          <div className="mt-7 grid gap-3">
            <AppLink to="/katalog-mlzitek" icon={BookOpen} title="Prohlédnout mlžítka"
              detail="Skutečné výrobky, fotografie a technické informace." primary />
            <AppLink to="/poradce" icon={Compass} title="Pomoci s výběrem"
              detail="Doporučení řešení podle prostoru a jeho využití." />
            <AppLink to="/poptavka" icon={MapPin} title="Poslat poptávku"
              detail="Popište svůj prostor a přiložte fotografie." />
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-white/60">
            <ShieldCheck size={16} aria-hidden="true" /> Výběr produktu a odeslání poptávky jsou nezávazné.
          </p>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#103246]">
            <div className="relative aspect-[5/4] overflow-hidden bg-[#245066]">
              <img
                src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6c64ac700_mlnprvek-mrak-mlzidla03.png"
                alt="Reálné produktové foto nerezového mlžítka kolekce MRAK"
                loading="eager"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-lg border border-white/25 bg-[#071b2c]/85 px-3 py-2 text-xs font-semibold">
                Kolekce MRAK · MLŽIDLA.cz
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">Váš projekt</p>
              <h2 className="mt-2 text-xl font-semibold">Poptávky a dokumenty přehledně</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Pokud už s námi spolupracujete, podívejte se do svého klientského portálu.
              </p>
              <Link to="/klientska-sekce"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                Otevřít můj projekt <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <section className="rounded-3xl border border-white/15 bg-white/[0.045] p-5" aria-label="Správa pro tým">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10">
                <LockKeyhole size={21} className="text-cyan-200" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-cyan-200">Pro administrátory</p>
                <h2 className="mt-1 text-xl font-semibold">Obchodní centrum</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Společné poptávky, koncepty a nabídky. Přístup pouze s oprávněním administrátora.
                </p>
              </div>
            </div>
            <Link to={isAdmin ? '/admin?tab=mobile-sales' : '/admin-login?returnTo=%2Fadmin%3Ftab%3Dmobile-sales'}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-[#09202c] hover:bg-cyan-200">
              <ClipboardList size={18} aria-hidden="true" />
              {isLoadingAuth ? 'Otevřít přihlášení' : isAdmin ? 'Přejít do obchodního centra' : 'Přihlásit se do obchodního centra'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
          <InstallAppButton className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] p-3 text-sm font-semibold text-white hover:bg-white/10" />
        </div>
      </main>
      <footer className="mt-10 border-t border-white/10 pt-5 text-center text-xs text-white/55">
        MLŽIDLA.cz · Designová nerezová mlžítka a chytré ochlazování prostoru
      </footer>
    </div>
  </div>;
}
