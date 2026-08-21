import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    setError("");
    base44.auth.loginWithProvider("google", `${window.location.origin}/admin`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "Neplatný email nebo heslo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#1f4e61]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 mb-4">
            <ShieldCheck className="w-7 h-7 text-cyan" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Administrace</h1>
          <p className="text-white/40 mt-2">Přihlaste se ke správě mlžidla.cz</p>
        </div>

        <div className="bg-card_bg rounded-2xl border border-white/10 p-8">
          {error &&
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          }
          <Button type="button" variant="outline" onClick={handleGoogle} className="mb-5 h-12 w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            <GoogleIcon className="mr-2 h-5 w-5" /> Přihlásit přes Google
          </Button>
          <div className="relative mb-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"/></div><div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-card_bg px-3 text-white/30">nebo heslem</span></div></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/60">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="admin@mlzidla.cz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  required />
                
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/60">Heslo</Label>
                <Link to="/admin-forgot-password" className="text-xs text-cyan hover:underline">
                  Zapomenuté heslo?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  required />
                
              </div>
            </div>
            <Button type="submit" className="w-full h-12 font-medium bg-cyan text-ink hover:bg-cyan/90" disabled={loading}>
              {loading ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Přihlašování...
                </> :

              "Přihlásit se"
              }
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-white/30 mt-6">
          <Link to="/" className="hover:text-white/60 transition-colors">← Zpět na web</Link>
        </p>
      </div>
    </div>);

}