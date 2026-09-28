import React, { useEffect, useMemo, useState } from 'react';
import { Bot, Check, Copy, ShieldCheck, RefreshCw, ExternalLink, Cpu } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const STEPS = [
  'V ChatGPT otevřete Apps a zapněte Developer mode. ChatGPT upozorňuje, že vývojářský režim umožňuje připojit neověřené aplikace — připojujte jen servery, kterým důvěřujete.',
  'Klikněte na „Create app“, pojmenujte ji (např. MLŽIDLA Admin) a do pole URL vložte adresu serveru výše.',
  'Potvrďte tlačítkem Create.',
  'Před prvním dotazem aplikaci zapněte v poli pro psání zprávy.',
];

export default function AdminMcpConnect() {
  const [copied, setCopied] = useState(false);
  const serverUrl = useMemo(
    () => (typeof window === 'undefined' ? '' : new URL('/api/mcp', window.location.origin).toString()),
    []
  );

  useEffect(() => {
    setSEO({ title: 'ChatGPT / MCP — Administrace MLŽIDLA®', robots: 'noindex, nofollow' });
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(serverUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
            <Bot size={22} />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/40">MCP · ChatGPT</p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-white lg:text-3xl">Připojení ChatGPT k datům MLŽIDLA®</h1>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/55">
          MCP (Model Context Protocol) umožňuje ChatGPT pracovat s daty aplikace přímo v konverzaci —
          produkty, reference, poptávky a další nástroje. Stačí zkopírovat adresu serveru a vložit ji do ChatGPT.
        </p>

        {/* Adresa serveru */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[.03] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-white/40">Adresa MCP serveru</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              readOnly
              value={serverUrl}
              aria-label="Adresa MCP serveru"
              onFocus={(e) => e.target.select()}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0d1117] px-4 py-3 font-mono text-[13px] text-cyan outline-none"
            />
            <button
              onClick={copy}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan px-5 text-sm font-bold text-ink transition hover:bg-white"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Zkopírováno' : 'Kopírovat'}
            </button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-white/40">
            <ShieldCheck size={13} className="text-cyan/70" />
            Server je chráněn OAuth — ChatGPT vás přesměruje na přihlášení do administrace a stránku souhlasu.
          </p>
        </div>

        {/* Kroky pro ChatGPT */}
        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/40">Jak připojit ChatGPT</p>
          <ol className="mt-4 space-y-4">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[.025] p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan/25 bg-cyan/10 font-mono text-xs font-bold text-cyan">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-white/70">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Přihlášení a souhlas + obnova */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[.025] p-5">
            <ShieldCheck size={18} className="text-cyan" />
            <p className="mt-3 font-heading text-base font-semibold text-white">Poslední krok: přihlášení</p>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              Po přidání serveru vás ChatGPT přesměruje na stránku se souhlasem. Přihlaste se svým admin účtem
              a přístup potvrďte — asistent pak pracuje výhradně pod vaším oprávněním.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[.025] p-5">
            <RefreshCw size={18} className="text-cyan" />
            <p className="mt-3 font-heading text-base font-semibold text-white">Po našich úpravách obnovte konektor</p>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              AI klienti si seznam nástrojů ukládají do mezipaměti. Když nasadíme změny, aplikaci v ChatGPT
              obnovte (případně odpojte a znovu připojte) a znovu potvrďte přístup.
            </p>
          </div>
        </div>

        {/* Další klienti */}
        <div className="mt-8 rounded-2xl border border-white/8 bg-white/[.025] p-5">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-white/40">
            <Cpu size={14} className="text-cyan/70" /> Další AI klienti
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Stejnou adresu serveru lze použít i v Claude, Cursor, Gemini CLI nebo jiném klientovi s podporou MCP.
            Kompletní návod pro všechny klienty najdete na veřejné stránce{' '}
            <a href="/connect" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan hover:underline">
              /connect <ExternalLink size={12} />
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}