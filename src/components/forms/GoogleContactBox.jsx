import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import GoogleIcon from '@/components/GoogleIcon';

const profileValue = (user, keys) => keys.map((key) => user?.[key]).find(Boolean) || '';

export default function GoogleContactBox({ checked, onCheckedChange, onApply, contactFieldsId = 'contact-fields' }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const appliedAfterLogin = useRef(false);
  const requestedGoogleContact = new URLSearchParams(window.location.search).get('google_contact') === '1';

  const applyGoogleContact = () => {
    if (!user) return;
    onApply({
      name: profileValue(user, ['full_name', 'name', 'display_name']),
      email: profileValue(user, ['email']),
      imageUrl: profileValue(user, ['profile_image_url', 'profile_picture', 'avatar_url', 'picture']),
    });
  };

  useEffect(() => {
    if (!requestedGoogleContact || !isAuthenticated || !user || appliedAfterLogin.current) return;
    appliedAfterLogin.current = true;
    onCheckedChange(true);
    applyGoogleContact();
  }, [requestedGoogleContact, isAuthenticated, user]);

  if (isLoadingAuth) {
    return <div className="mb-7 h-[92px] animate-pulse rounded-2xl border border-slate-200 bg-slate-50" aria-label="Načítání kontaktního účtu" />;
  }

  if (!isAuthenticated || !user) {
    const signInWithGoogle = () => {
      const returnUrl = new URL(window.location.href);
      returnUrl.searchParams.set('google_contact', '1');
      base44.auth.loginWithProvider('google', returnUrl.toString());
    };
    const continueManually = () => document.getElementById(contactFieldsId)?.querySelector('input')?.focus();

    return (
      <div className="mb-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"><GoogleIcon className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-950">Zrychlete poptávku přihlášením přes Google</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Po přihlášení automaticky předvyplníme vaše jméno a e-mail.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={signInWithGoogle} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0d2d38] px-4 text-xs font-bold text-white transition hover:bg-[#123c49]">
            Přihlásit přes Google <ArrowRight size={13} />
          </button>
          <button type="button" onClick={continueManually} className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:border-cyan-300">
            Pokračovat bez přihlášení
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-7 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            onCheckedChange(event.target.checked);
            if (event.target.checked) applyGoogleContact();
          }}
          className="mt-1 h-4 w-4 rounded border-cyan-300 text-cyan-700"
        />
        <span>
          <span className="block text-sm font-semibold text-slate-950">Použít můj Google účet jako kontaktní údaje</span>
          <span className="mt-1 block text-xs leading-5 text-slate-500">Jméno a e-mail předvyplníme z přihlášeného účtu pouze pro zpracování poptávky a přípravu nabídky.</span>
        </span>
      </label>
      {checked && (
        <div className="mt-3 flex items-center gap-2 border-t border-cyan-100 pt-3 text-xs text-cyan-900">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>{user.email}. Údaje můžete před odesláním změnit.</span>
        </div>
      )}
      <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-slate-500"><ShieldCheck size={13} className="mt-0.5 shrink-0 text-cyan-700" />Google účet slouží pouze k bezpečnému předvyplnění kontaktu.</p>
    </div>
  );
}
