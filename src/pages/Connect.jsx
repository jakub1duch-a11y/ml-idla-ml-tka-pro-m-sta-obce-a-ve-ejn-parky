import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, ShieldCheck, RefreshCw } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const CLIENTS = [
  {
    id: 'claude',
    label: 'Claude',
    steps: [
      'Otevřete v Claude nabídku profilu a přejděte do Settings → Connectors.',
      'Klikněte na „Add custom connector“.',
      'Pojmenujte konektor (např. MLŽIDLA) a vložte adresu serveru výše.',
      'Potvrďte tlačítkem Add.',
    ],
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    steps: [
      'V ChatGPT otevřete Apps a zapněte Developer mode. ChatGPT upozorňuje, že vývojářský režim umožňuje připojit neověřené aplikace — připojujte jen servery, kterým důvěřujete.',
      'Klikněte na „Create app“, pojmenujte ji a vložte adresu serveru výše.',
      'Potvrďte tlačítkem Create.',
      'Před prvním dotazem aplikaci zapněte v poli pro psaní zprávy.',
    ],
  },
  {
    id: 'cursor',
    label: 'Cursor',
    steps: [
      'V Cursoru otevřete Settings → Tools & Integrations.',
      'Klikněte na „New MCP Server“ — otevře se soubor mcp.json.',
      'Přidejte položku, jejíž „url“ je adresa serveru výše, a soubor uložte.',
      'Server v seznamu přepněte na zapnuto.',
    ],
  },
  {
    id: 'custom',
    label: 'Vlastní klient',
    steps: [
      'Zkopírujte adresu serveru výše.',
      'V klientovi ji přidejte jako MCP server typu „streamable HTTP“.',
      'Většině klientů stačí jen název a adresa.',
      'Klienta následně načtěte znovu, aby se seznam nástrojů objevil.',
    ],
  },
];

export default function Connect() {
  const [active, setActive] = useState('claude');
  const [copied, setCopied] = useState(false);
  const serverUrl = useMemo(
    () => (typeof window === 'undefined' ? '' : new URL('/api/mcp', window.location.origin).toString()),
    []
  );

  useEffect(() => {
    setSEO({
      title: 'Připojení AI asistenta | MLŽIDLA®',
      description: 'Jak připojit Claude, ChatGPT, Cursor nebo vlastního AI klienta k datům MLŽIDLA®.',
    });
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(serverUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeClient = CLIENTS.find((c) => c.id === active);

  return (
    <div className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[.2em] text-primary">// AI konektor</p>
        <h1 className="mt-4 font-heading text-4xl tracking-[-.03em] text-secondary">Připojte svého AI asistenta</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Připojte Claude, ChatGPT, Cursor nebo jiného AI klienta a pracujte s daty MLŽIDLA® přímo v konverzaci.
          Stačí zkopírovat adresu serveru a vložit ji do svého klienta.
        </p>

        {/* Adresa serveru */}
        <div className="mt-10 border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Adresa serveru</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              readOnly
              value={serverUrl}
              aria-label="Adresa MCP serveru"
              onFocus={(e) => e.target.select()}
              className="min-w-0 flex-1 border border-border bg-muted px-4 py-3 font-mono text-[13px] text-secondary outline-none"
            />
            <button
              onClick={copy}
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Zkopírováno' : 'Kopírovat'}
            </button>
          </div>
        </div>

        {/* Klienti */}
        <div className="mt-10">
          <div className="flex flex-wrap gap-2">
            {CLIENTS.map((client) => (
              <button
                key={client.id}
                onClick={() => setActive(client.id)}
                className={`min-h-11 border px-4 text-sm font-semibold transition-colors ${
                  active === client.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-secondary hover:border-primary/40'
                }`}
              >
                {client.label}
              </button>
            ))}
          </div>

          <ol className="mt-6 space-y-4 border border-border bg-card p-6">
            {activeClient.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-primary/25 bg-muted font-mono text-xs text-primary">
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] leading-relaxed text-secondary/85">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Přihlášení a souhlas */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="border border-border bg-card p-5">
            <ShieldCheck size={18} className="text-primary" />
            <p className="mt-3 font-heading text-lg text-secondary">Poslední krok: přihlášení</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Po přidání serveru vás klient přesměruje na stránku se souhlasem. Přihlaste se svým účtem
              a přístup potvrďte — asistent pak pracuje výhradně pod vaším oprávněním a vidí jen to, co vy.
            </p>
          </div>
          <div className="border border-border bg-card p-5">
            <RefreshCw size={18} className="text-primary" />
            <p className="mt-3 font-heading text-lg text-secondary">Po našich úpravách obnovte konektor</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              AI klienti si seznam nástrojů ukládají do mezipaměti. Když nasadíme změny, konektor v klientovi
              obnovte (případně odpojte a znovu připojte) a znovu potvrďte přístup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}