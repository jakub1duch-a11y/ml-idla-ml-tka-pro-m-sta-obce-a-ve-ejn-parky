import React, { useEffect, useState } from 'react';
import { Smartphone, X } from 'lucide-react';

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

export default function InstallAppButton({ className = '' }) {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone());
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setPrompt(e); };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  const install = async () => {
    if (prompt) {
      prompt.prompt();
      await prompt.userChoice;
      setPrompt(null);
      return;
    }
    setShowIosHint(true);
  };

  return (
    <>
      <button onClick={install} className={className}>
        <Smartphone size={16} /> Instalovat do mobilu
      </button>
      {showIosHint && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center" onClick={() => setShowIosHint(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">Přidat na plochu</p>
                <h3 className="mt-1 text-lg text-white">Administrace jako aplikace</h3>
              </div>
              <button onClick={() => setShowIosHint(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-white/70">
              {isIOS() ? (
                <>
                  <li>1. Otevřete tuto stránku v Safari.</li>
                  <li>2. Klepněte na tlačítko Sdílet (čtverec se šipkou).</li>
                  <li>3. Zvolte „Přidat na plochu“ a potvrďte.</li>
                </>
              ) : (
                <>
                  <li>1. Otevřete nabídku prohlížeče (⋮).</li>
                  <li>2. Zvolte „Přidat na plochu“ nebo „Instalovat aplikaci“.</li>
                  <li>3. Potvrďte — ikona Admin se objeví na ploše.</li>
                </>
              )}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}