import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, CheckCircle, ChevronDown, Loader2, Phone, Send, ShieldCheck, Sparkles, User, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STARTERS = [
'Jaké mlžítko je vhodné na zahradu nebo terasu?',
'Co zvolit pro náměstí, park nebo školní hřiště?',
'Jak připravit přívod vody a kotvení?',
'Na co si dát pozor při instalaci mlžítka?',
'Jak funguje chytré ovládání a automatizace?'];


const EXAMPLES = [
'Máme dlážděné náměstí přibližně 20 × 12 m a chceme ochladit průchozí zónu.',
'Chci mlžení na zahradní terasu a nevím, jaký typ kotvení zvolit.',
'Řešíme dětské hřiště a potřebujeme doporučit umístění i přípravu vody.'];


const INITIAL = {
  role: 'assistant',
  text: 'Dobrý den, jsem AI poradce MLŽIDLA®. Pomohu vám vybrat vhodné mlžítko, posoudit prostor a vysvětlit, co připravit pro instalaci. U konkrétních cen a technických parametrů používám pouze ověřené údaje.'
};

function transcriptFrom(messages) {
  return messages.
  map((message) => `${message.role === 'assistant' ? 'AI poradce' : 'Klient'}: ${message.text}`).
  join('\n\n').
  slice(0, 12000);
}

export default function MistingAdvisorWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [followUps, setFollowUps] = useState(STARTERS.slice(0, 4));
  const [topic, setTopic] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [contactOpen, setContactOpen] = useState(false);
  const [contact, setContact] = useState({ name: '', phone: '', email: '', consent: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');

  const userMessageCount = useMemo(() => messages.filter((message) => message.role === 'user').length, [messages]);

  const send = async (value) => {
    const text = String(value ?? input).trim();
    if (!text || busy) return;
    const nextMessages = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setInput('');
    setBusy(true);
    setError('');
    try {
      const response = await base44.functions.invoke('mistingAdvisorChat', {
        messages: nextMessages,
        source_page: window.location.href
      });
      const result = response?.data || response || {};
      const reply = String(result.reply || '').trim();
      setMessages((current) => [...current, {
        role: 'assistant',
        text: reply || 'Děkuji. Pro přesnější doporučení potřebuji ještě doplnit několik údajů o prostoru.'
      }]);
      if (result.topic) setTopic(result.topic);
      if (Array.isArray(result.recommended_products)) setRecommendedProducts(result.recommended_products);
      if (Array.isArray(result.follow_up_questions) && result.follow_up_questions.length) {
        setFollowUps(result.follow_up_questions);
      }
    } catch (_error) {
      setError('AI poradce se teď nepodařilo načíst. Můžete nám zanechat kontakt a tým se vám ozve do 24 hodin.');
      setContactOpen(true);
    } finally {
      setBusy(false);
    }
  };

  const submitLead = async (event) => {
    event.preventDefault();
    if (!contact.name.trim() || !contact.phone.trim() || !contact.consent || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const transcript = transcriptFrom(messages);
      const response = await base44.functions.invoke('submitMistingAdvisorLead', {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        source_page: window.location.href,
        topic,
        summary: messages.filter((message) => message.role === 'user').map((message) => message.text).slice(-3).join(' · '),
        transcript,
        recommended_products: recommendedProducts,
        consent: true
      });
      const result = response?.data || response || {};
      setSubmitted(result);
    } catch (_error) {
      setError('Kontakt se nepodařilo odeslat. Zkontrolujte údaje a zkuste to prosím znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[95] sm:bottom-6 sm:right-6">
      {!open &&
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center rounded-full border border-cyan-200/80 bg-[#0d2d38] py-2.5 pl-3 pr-5 text-left text-white shadow-[0_16px_50px_rgba(13,45,56,.28)] transition hover:-translate-y-0.5 hover:bg-[#123c49] gap- mr-48"
        aria-label="Otevřít AI poradce MLŽIDLA">
        
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300/15 text-xl">💧</span>
          <span>
            <span className="block text-xs font-bold">Potřebujete pomoci?</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[.14em] text-cyan-200">AI podpora 24/7</span>
          </span>
        </button>
      }

      {open &&
      <section className="flex h-[min(720px,calc(100vh-32px))] w-[min(410px,calc(100vw-24px))] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_26px_90px_rgba(13,45,56,.28)]">
          <header className="bg-[#0d2d38] px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#61d5e5]"><Bot size={20} /></span>
                <div>
                  <p className="text-sm font-bold">Poradce MLŽIDLA®</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[.13em] text-[#8fe4ef]"><Sparkles size={11} /> AI podpora 24/7</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-white/55 hover:bg-white/10 hover:text-white" aria-label="Zavřít poradce"><X size={17} /></button>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-white/60">Výběr mlžítka · vhodný prostor · instalace · kotvení · příprava projektu</p>
          </header>

          {submitted ?
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle size={26} /></span>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">Děkujeme, kontakt jsme přijali.</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">Tým MLŽIDLA.cz naváže na tuto komunikaci a ozve se vám nejpozději do 24 hodin.</p>
              <div className="mt-5 w-full rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-left">
                <p className="text-[10px] font-bold uppercase tracking-[.14em] text-cyan-800">Další krok</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">V klientské sekci můžete sledovat svou poptávku, návrh a později obchodní nabídku. Pokud jste uvedli e-mail, používejte při přihlášení stejnou adresu.</p>
                <Link to="/klientska-sekce" onClick={() => setOpen(false)} className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#0d2d38] px-4 py-3 text-xs font-bold text-white">Přihlásit do klientské sekce</Link>
              </div>
              <button type="button" onClick={() => {setSubmitted(null);setContactOpen(false);setMessages([INITIAL]);setFollowUps(STARTERS.slice(0, 4));}} className="mt-5 text-xs font-semibold text-slate-500 hover:text-slate-900">Začít nový dotaz</button>
            </div> :

        <>
              <div className="flex-1 overflow-y-auto bg-[#f5f8f8] px-4 py-4">
                <div className="space-y-3">
                  {messages.map((message, index) =>
              <div key={index} className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-xs leading-5 ${message.role === 'assistant' ? 'mr-auto border border-slate-200 bg-white text-slate-700' : 'ml-auto bg-[#0d2d38] text-white'}`}>
                      <div className="whitespace-pre-line">{message.text}</div>
                    </div>
              )}
                  {busy && <div className="mr-auto flex max-w-[88%] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-500"><Loader2 size={13} className="animate-spin" /> Připravuji doporučení…</div>}
                </div>

                {!busy && followUps.length > 0 &&
            <div className="mt-4">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[.14em] text-slate-400">Časté otázky</p>
                    <div className="flex flex-wrap gap-2">
                      {followUps.slice(0, 4).map((question) =>
                <button key={question} type="button" onClick={() => send(question)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-[10px] font-semibold leading-4 text-slate-600 hover:border-cyan-300 hover:text-cyan-900">{question}</button>
                )}
                    </div>
                  </div>
            }

                {userMessageCount === 0 &&
            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-3.5">
                    <p className="text-[9px] font-bold uppercase tracking-[.14em] text-slate-400">Příklad zprávy</p>
                    <div className="mt-2 space-y-2">
                      {EXAMPLES.map((example) => <button key={example} type="button" onClick={() => send(example)} className="block w-full text-left text-[10px] leading-4 text-slate-500 hover:text-cyan-800">„{example}“</button>)}
                    </div>
                  </div>
            }

                {error && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] leading-5 text-rose-700">{error}</p>}

                {(contactOpen || userMessageCount >= 2) &&
            <form onSubmit={submitLead} className="mt-5 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
                    <button type="button" onClick={() => setContactOpen((value) => !value)} className="flex w-full items-center justify-between text-left">
                      <span><span className="block text-xs font-bold text-slate-900">Chcete doporučení na míru?</span><span className="mt-0.5 block text-[10px] text-slate-500">Zanechte kontakt. Ozveme se nejpozději do 24 hodin.</span></span>
                      <ChevronDown size={15} className={`text-slate-400 transition ${contactOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {contactOpen && <div className="mt-4 space-y-3">
                      <label className="block text-[10px] font-semibold text-slate-600">Jméno *
                        <div className="relative mt-1"><User size={13} className="absolute left-3 top-3 text-slate-400" /><input required value={contact.name} onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-cyan-400" placeholder="Jan Novák" /></div>
                      </label>
                      <label className="block text-[10px] font-semibold text-slate-600">Telefon *
                        <div className="relative mt-1"><Phone size={13} className="absolute left-3 top-3 text-slate-400" /><input required autoComplete="tel" value={contact.phone} onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-cyan-400" placeholder="+420 000 000 000" /></div>
                      </label>
                      <label className="block text-[10px] font-semibold text-slate-600">E-mail <span className="font-normal text-slate-400">(doporučeno pro klientskou sekci)</span>
                        <input type="email" autoComplete="email" value={contact.email} onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-cyan-400" placeholder="vas@email.cz" />
                      </label>
                      <label className="flex cursor-pointer items-start gap-2 text-[10px] leading-4 text-slate-500">
                        <input type="checkbox" required checked={contact.consent} onChange={(event) => setContact((current) => ({ ...current, consent: event.target.checked }))} className="mt-0.5" />
                        <span>Souhlasím s použitím kontaktu pro zpracování dotazu, navazující konzultaci a přípravu nezávazné nabídky.</span>
                      </label>
                      <button type="submit" disabled={submitting || !contact.name.trim() || !contact.phone.trim() || !contact.consent} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0d2d38] px-4 py-3 text-xs font-bold text-white disabled:opacity-40">{submitting ? <><Loader2 size={13} className="animate-spin" /> Odesílám…</> : <><Send size={13} /> Odeslat kontakt a komunikaci</>}</button>
                    </div>}
                  </form>
            }
              </div>

              <div className="border-t border-slate-200 bg-white p-3">
                <div className="flex gap-2">
                  <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => {if (event.key === 'Enter' && !event.shiftKey) {event.preventDefault();send();}}} rows={2} placeholder="Napište, kde chcete mlžítko použít…" className="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-5 outline-none focus:border-cyan-400" />
                  <button type="button" onClick={() => send()} disabled={busy || !input.trim()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0d2d38] text-white disabled:opacity-35" aria-label="Odeslat zprávu"><Send size={16} /></button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-[9px] text-slate-400"><span className="flex items-center gap-1"><ShieldCheck size={10} /> AI doporučení je orientační; finální řešení ověří tým.</span><button type="button" onClick={() => setContactOpen(true)} className="font-semibold text-cyan-800">Chci kontakt</button></div>
              </div>
            </>
        }
        </section>
      }
    </div>);

}