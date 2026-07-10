import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { LogOut, Loader2 } from "lucide-react";

export default function AdminLogout() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await base44.auth.logout();
      } finally {
        setDone(true);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 mb-4">
          <LogOut className="w-7 h-7 text-cyan" aria-hidden="true" />
        </div>
        {done ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Byli jste odhlášeni</h1>
            <p className="text-white/40 mb-6">Vaše administrátorská relace byla ukončena.</p>
            <Link to="/admin-login" className="inline-block px-6 py-3 rounded-full bg-cyan text-ink text-sm font-bold hover:bg-cyan/90 transition-all">
              Přihlásit se znovu
            </Link>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 text-white/50">
            <Loader2 className="w-4 h-4 animate-spin" /> Odhlašuji...
          </div>
        )}
      </div>
    </div>
  );
}