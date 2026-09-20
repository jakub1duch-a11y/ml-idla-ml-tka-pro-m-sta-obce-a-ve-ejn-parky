import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { BellRing, CheckCircle2, Loader2, Settings2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import GoogleIcon from '@/components/GoogleIcon';
import { useAuth } from '@/lib/AuthContext';
import { EMAIL_TOPIC_OPTIONS, sanitizeEmailTopics } from '@/lib/emailPreferences';
import { trackNewsletterSignup } from '@/lib/ga4';

const VIEW_STATE_KEY = 'mz_email_prompt_views_v1';
const DISMISSED_UNTIL_KEY = 'mz_email_prompt_dismissed_until_v1';
const SUBSCRIBED_KEY = 'mz_email_prompt_subscribed_v1';
const SHOWN_THIS_SESSION_KEY = 'mz_email_prompt_shown_session_v1';
const RETURN_PARAM = 'email_preferences';
const VIEW_THRESHOLD = 3;
const VIEW_DEDUPLICATION_MS = 30 * 60 * 1000;
const DISMISSAL_MS = 30 * 24 * 60 * 60 * 1000;
const SUCCESS_MS = 365 * 24 * 60 * 60 * 1000;

const EXCLUDED_PATHS = [
  '/poptavka',
  '/kontakt',
  '/dekujeme',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/muj-projekt',
  '/admin',
];

const readViewState = () => {
  try {
    return JSON.parse(localStorage.getItem(VIEW_STATE_KEY) || '{}');
  } catch {
    return {};
  }
};

const isSuppressed = () => {
  const dismissedUntil = Number(localStorage.getItem(DISMISSED_UNTIL_KEY) || 0);
  const subscribedUntil = Number(localStorage.getItem(SUBSCRIBED_KEY) || 0);
  return dismissedUntil > Date.now() || subscribedUntil > Date.now();
};

export default function ReturningVisitorEmailPopup() {
  const location = useLocation();
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const [visible, setVisible] = useState(false);
  const [topics, setTopics] = useState([]);
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingPreferences, setCheckingPreferences] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const pageViews = useMemo(() => Number(readViewState().count || 0), [visible]);
  const isExcluded = EXCLUDED_PATHS.some((path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  useEffect(() => {
    if (isExcluded) return undefined;

    const params = new URLSearchParams(window.location.search);
    const returnedFromLogin = params.get(RETURN_PARAM) === '1';
    if (returnedFromLogin) {
      params.delete(RETURN_PARAM);
      const nextSearch = params.toString();
      window.history.replaceState(
        window.history.state,
        '',
        location.pathname + (nextSearch ? '?' + nextSearch : '') + location.hash
      );
      const timer = window.setTimeout(() => setVisible(true), 500);
      return () => window.clearTimeout(timer);
    }

    if (isSuppressed() || sessionStorage.getItem(SHOWN_THIS_SESSION_KEY)) return undefined;

    const now = Date.now();
    const current = readViewState();
    const isDuplicate = current.lastPath === location.pathname
      && now - Number(current.lastViewedAt || 0) < VIEW_DEDUPLICATION_MS;
    const nextCount = Math.max(0, Number(current.count || 0)) + (isDuplicate ? 0 : 1);

    localStorage.setItem(VIEW_STATE_KEY, JSON.stringify({
      count: nextCount,
      lastPath: location.pathname,
      lastViewedAt: now,
    }));

    if (nextCount < VIEW_THRESHOLD) return undefined;

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(SHOWN_THIS_SESSION_KEY, '1');
      setVisible(true);
    }, 9000);

    return () => window.clearTimeout(timer);
  }, [isExcluded, location.hash, location.pathname]);

  useEffect(() => {
    if (!visible || !isAuthenticated || !user?.email || done) return undefined;
    let active = true;
    setCheckingPreferences(true);

    base44.functions.invoke('saveEmailPreferences', { action: 'get' })
      .then((response) => {
        if (!active) return;
        const preferences = response?.data || response || {};
        if (preferences.marketing_consent && preferences.status === 'active') {
          localStorage.setItem(SUBSCRIBED_KEY, String(Date.now() + SUCCESS_MS));
          setVisible(false);
          return;
        }
        setTopics(sanitizeEmailTopics(preferences.topics));
      })
      .catch(() => null)
      .finally(() => {
        if (active) setCheckingPreferences(false);
      });

    return () => {
      active = false;
    };
  }, [done, isAuthenticated, user?.email, visible]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_UNTIL_KEY, String(Date.now() + DISMISSAL_MS));
    setVisible(false);
  };

  const signInWithGoogle = () => {
    const returnUrl = new URL(window.location.href);
    returnUrl.searchParams.set(RETURN_PARAM, '1');
    base44.auth.loginWithProvider(
      'google',
      returnUrl.pathname + returnUrl.search + returnUrl.hash
    );
  };

  const toggleTopic = (topic) => {
    setError('');
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic]
    );
  };

  const savePreferences = async (event) => {
    event.preventDefault();
    if (!consent) {
      setError('Pro aktivaci potvrďte souhlas s e-mailovými upozorněními.');
      return;
    }
    if (topics.length === 0) {
      setError('Vyberte alespoň jedno téma.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('saveEmailPreferences', {
        action: 'save',
        marketing_consent: true,
        topics,
        source: 'returning_visitor_google_popup',
        name: user?.full_name || user?.name || '',
        page_view_count_at_signup: Number(readViewState().count || 0),
      });
      trackNewsletterSignup('returning_visitor_google_popup');
      localStorage.setItem(SUBSCRIBED_KEY, String(Date.now() + SUCCESS_MS));
      setDone(true);
      window.setTimeout(() => setVisible(false), 2600);
    } catch {
      setError('Nastavení se nepodařilo uložit. Zkuste to prosím znovu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[260] flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) dismiss();
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-prompt-title"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="relative max-h-[calc(100vh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/10 bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Zavřít nabídku upozornění"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
            >
              <X size={17} />
            </button>

            <div className="grid md:grid-cols-[.82fr_1.18fr]">
              <div className="bg-[#0d2d38] p-6 text-white sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
                  <BellRing size={23} />
                </div>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[.18em] text-cyan">
                  Pro návštěvníky MLŽIDLA.cz
                </p>
                <h2 id="email-prompt-title" className="mt-2 text-2xl font-light leading-tight sm:text-3xl">
                  Ať vám neunikne to podstatné
                </h2>
                <p className="mt-4 text-sm leading-6 text-white/65">
                  Vyberte si, které informace mají smysl právě pro váš projekt. Nastavení pak kdykoli změníte v portálu Můj projekt.
                </p>
                <div className="mt-6 space-y-3 text-xs leading-5 text-white/65">
                  <p className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-cyan" /> Jen vámi vybraná témata</p>
                  <p className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-cyan" /> Žádná aktivace bez souhlasu</p>
                  <p className="flex gap-2"><Settings2 size={15} className="mt-0.5 shrink-0 text-cyan" /> Správa přes mlzidla.cz</p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {done ? (
                  <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-950">Upozornění jsou nastavena</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Budeme respektovat váš výběr. Preference můžete později změnit v portálu.
                    </p>
                    <Link to="/muj-projekt#email-preferences" className="mt-5 text-sm font-semibold text-cyan-800 underline underline-offset-4">
                      Otevřít Můj projekt
                    </Link>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="flex min-h-[330px] flex-col justify-center">
                    <p className="text-xs font-mono uppercase tracking-[.15em] text-cyan-800">Jednoduché a pod kontrolou</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">Přihlaste se účtem Google</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Po přihlášení vyberete konkrétní témata a teprve potom upozornění výslovně aktivujete.
                    </p>
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      disabled={isLoadingAuth}
                      className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {isLoadingAuth ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon className="h-5 w-5" />}
                      Přihlásit se přes Google
                    </button>
                    <button type="button" onClick={dismiss} className="mt-3 text-xs font-medium text-slate-400 hover:text-slate-700">
                      Teď ne
                    </button>
                    <p className="mt-6 text-[10px] leading-4 text-slate-400">
                      Přihlášení samo o sobě nic neaktivuje. Servisní zprávy k existující poptávce nejsou tímto nastavením dotčeny.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={savePreferences}>
                    <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 px-4 py-3">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-800">Přihlášený účet</p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-900">{user?.email}</p>
                    </div>

                    <fieldset className="mt-5" disabled={checkingPreferences || saving}>
                      <legend className="text-sm font-semibold text-slate-900">Co chcete dostávat?</legend>
                      <div className="mt-3 grid gap-2">
                        {EMAIL_TOPIC_OPTIONS.map((option) => (
                          <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-cyan-300">
                            <input
                              type="checkbox"
                              checked={topics.includes(option.value)}
                              onChange={() => toggleTopic(option.value)}
                              className="mt-0.5 h-4 w-4 accent-cyan-700"
                            />
                            <span>
                              <span className="block text-xs font-semibold text-slate-900">{option.label}</span>
                              <span className="mt-0.5 block text-[10px] leading-4 text-slate-500">{option.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-600">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => {
                          setConsent(event.target.checked);
                          setError('');
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-700"
                      />
                      <span>
                        Souhlasím se zasíláním vybraných e-mailových upozornění společností HolmTec s.r.o. Souhlas mohu kdykoli odvolat.{' '}
                        <Link to="/gdpr" className="font-semibold underline underline-offset-2">Ochrana osobních údajů</Link>
                      </span>
                    </label>

                    {error && <p role="alert" className="mt-3 text-xs font-semibold text-rose-700">{error}</p>}

                    <button
                      type="submit"
                      disabled={saving || checkingPreferences}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0d2d38] px-5 text-sm font-bold text-white transition hover:bg-[#123c49] disabled:opacity-50"
                    >
                      {(saving || checkingPreferences) && <Loader2 size={17} className="animate-spin" />}
                      {checkingPreferences ? 'Načítám nastavení…' : saving ? 'Ukládám…' : 'Aktivovat e-mailová upozornění'}
                    </button>
                    <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">
                      Zobrazeno po {Math.max(VIEW_THRESHOLD, pageViews)} zobrazeních stránek. Bez potvrzení nic neodesíláme.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
