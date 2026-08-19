import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X, Bell } from 'lucide-react';
import { isStandalone, pushSupported, subscribeToPush } from '@/lib/pushNotifications';

const STORAGE_KEY = 'mlzidla_admin_install_prompt_seen_v1';

export default function AdminInstallPrompt({ user }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin' || isStandalone()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const timer = setTimeout(() => setVisible(true), 700);
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    if (isIos) setIosHelp(true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, [user]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) {
      setIosHelp(true);
      return;
    }
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      localStorage.setItem(STORAGE_KEY, '1');
      setVisible(false);
      if (pushSupported() && Notification.permission === 'default') {
        try { await subscribeToPush(); } catch (_error) {}
      }
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-3xl border border-cyan/20 bg-[#0d1117] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/10 text-cyan"><Smartphone size={22} /></div>
          <button onClick={dismiss} className="rounded-lg p-2 text-white/35 hover:bg-white/5 hover:text-white" aria-label="Zavřít"><X size={17} /></button>
        </div>
        <h2 className="mt-5 text-xl font-semibold text-white">Nainstalovat Admin MLŽIDLA</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">Přidejte si zabezpečenou administraci na plochu telefonu. Po otevření se spustí přímo admin dashboard a přístup zůstává podmíněný přihlášením administrátora.</p>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 text-xs text-white/55"><Bell size={14} className="text-cyan" /> Upozornění na poptávky, nabídky a follow-upy lze povolit po instalaci.</div>
        {iosHelp && !deferredPrompt ? (
          <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/65">Na iPhonu/iPadu otevřete nabídku <strong className="text-white">Sdílet</strong> a zvolte <strong className="text-white">Přidat na plochu</strong>.</div>
        ) : (
          <button onClick={install} disabled={installing} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan px-4 py-3 text-sm font-bold text-[#0d1117] hover:bg-cyan/90 disabled:opacity-60"><Download size={17} /> {installing ? 'Instaluji…' : 'Nainstalovat aplikaci'}</button>
        )}
        <button onClick={dismiss} className="mt-3 w-full py-2 text-xs text-white/35 hover:text-white/60">Teď ne</button>
      </div>
    </div>
  );
}
