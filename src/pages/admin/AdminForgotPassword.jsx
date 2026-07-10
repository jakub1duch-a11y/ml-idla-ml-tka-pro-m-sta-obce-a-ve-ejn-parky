import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // Always show success regardless
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 mb-4">
            <Mail className="w-7 h-7 text-cyan" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Obnovit heslo</h1>
          <p className="text-white/40 mt-2">Zašleme vám odkaz pro obnovení hesla</p>
        </div>

        <div className="bg-card_bg rounded-2xl border border-white/10 p-8">
          {sent ? (
            <p className="text-sm text-white/60 text-center">
              Pokud účet s tímto emailem existuje, obdržíte odkaz pro obnovení hesla.
            </p>
          ) : (
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
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 font-medium bg-cyan text-ink hover:bg-cyan/90" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Odesílám...
                  </>
                ) : (
                  "Odeslat odkaz pro obnovení"
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-white/30 mt-6">
          <Link to="/admin-login" className="hover:text-white/60 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Zpět na přihlášení
          </Link>
        </p>
      </div>
    </div>
  );
}