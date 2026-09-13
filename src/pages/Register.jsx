import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, KeyRound } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const nextUrl = safeReturnTo("next");

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", nextUrl);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Hesla se neshodují");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep("otp");
      setInfo(`Ověřovací kód jsme poslali na ${email}.`);
    } catch (err) {
      setError(err.message || "Registrace se nezdařila");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      base44.auth.setToken(result.access_token);
      window.location.href = nextUrl;
    } catch (err) {
      setError(err.message || "Neplatný ověřovací kód");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      await base44.auth.resendOtp(email);
      setInfo("Nový kód byl odeslán.");
    } catch (err) {
      setError(err.message || "Kód se nepodařilo odeslat znovu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={step === "otp" ? KeyRound : UserPlus}
      title={step === "otp" ? "Ověřte svůj e-mail" : "Vytvořit účet"}
      subtitle={step === "otp" ? "Zadejte kód z e-mailu" : "Registrace k účtu Mlžidla.cz"}
      footer={
        <>
          Už máte účet?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Přihlásit se
          </Link>
        </>
      }
    >
      {step === "form" && (
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-sm font-medium mb-6"
            onClick={handleGoogle}
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">nebo</span>
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      {info && !error && (
        <div className="mb-4 p-3 rounded-lg bg-muted text-foreground text-sm">
          {info}
        </div>
      )}

      {step === "form" ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Heslo</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Potvrzení hesla</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Vytvářím účet...
              </>
            ) : (
              "Vytvořit účet"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Ověřovací kód</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="pl-10 h-12 tracking-widest"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ověřuji...
              </>
            ) : (
              "Ověřit a pokračovat"
            )}
          </Button>
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="w-full text-sm text-primary hover:underline disabled:opacity-50"
          >
            Poslat kód znovu
          </button>
        </form>
      )}
    </AuthLayout>
  );
}