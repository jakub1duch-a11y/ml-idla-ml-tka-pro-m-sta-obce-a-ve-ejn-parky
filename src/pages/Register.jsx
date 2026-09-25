import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ChevronDown, Eye, EyeOff, Loader2, Check, ArrowRight, KeyRound } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

const PROFILE_TYPES = [
  "Město / obec", "Veřejná instituce", "Architekt", "Krajinný architekt",
  "Architekt a urbanista", "Projektant / návrhář", "Konstrukční kancelář",
  "Inženýrská firma", "Společnost veřejných prací", "Krajinářská firma",
  "Developer / investor", "Hotel / wellness", "Restaurace / gastro",
  "Event / promotér", "Prodejce / distributor", "Instalační technik",
  "Soukromý zákazník", "Student", "Ostatní"
];

const fieldClass = "h-14 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100/70";
const labelClass = "mb-2 block text-[13px] font-semibold tracking-[.01em] text-slate-600";

export default function Register() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", company: "", profileType: "", address: "",
    city: "", postalCode: "", country: "Česká republika", companyId: "",
    phone: "", email: "", newsletter: false, password: "", confirmPassword: "", otpCode: ""
  });

  const requestedNext = safeReturnTo("next");
  const nextUrl = requestedNext === "/" ? "/klientska-sekce" : requestedNext;
  const set = (key) => (e) => setForm((v) => ({ ...v, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const passwordScore = useMemo(() => {
    const p = form.password;
    return [p.length >= 9, /[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
  }, [form.password]);

  const nextProfile = (e) => {
    e.preventDefault();
    setError("");
    if (!form.firstName.trim() || !form.lastName.trim() || !form.profileType) {
      setError("Doplňte jméno, příjmení a typ profilu.");
      return;
    }
    setStep("account");
  };

  const handleGoogle = () => base44.auth.loginWithProvider("google", nextUrl);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Hesla se neshodují.");
    if (passwordScore < 3) return setError("Zvolte silnější heslo – alespoň 9 znaků, číslo a velké písmeno nebo speciální znak.");
    setLoading(true);
    try {
      await base44.auth.register({ email: form.email.trim(), password: form.password });
      setStep("otp");
      setInfo(`Ověřovací kód jsme poslali na ${form.email.trim()}.`);
    } catch (err) {
      setError(err.message || "Registrace se nezdařila.");
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email: form.email.trim(), otpCode: form.otpCode.trim() });
      base44.auth.setToken(result.access_token);
      await base44.auth.updateMe({
        first_name: form.firstName.trim(), last_name: form.lastName.trim(),
        company: form.company.trim(), profile_type: form.profileType,
        phone: form.phone.trim(), address: form.address.trim(), city: form.city.trim(),
        postal_code: form.postalCode.trim(), country: form.country.trim(),
        company_id: form.companyId.trim(), newsletter: form.newsletter
      });
      setStep("success");
    } catch (err) {
      setError(err.message || "Ověření se nezdařilo. Zkontrolujte kód a zkuste to znovu.");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setLoading(true); setError("");
    try { await base44.auth.resendOtp(form.email.trim()); setInfo("Nový ověřovací kód byl odeslán."); }
    catch (err) { setError(err.message || "Kód se nepodařilo odeslat."); }
    finally { setLoading(false); }
  };

  const panelMotion = reduced ? {} : { initial:{opacity:0,y:18}, animate:{opacity:1,y:0}, exit:{opacity:0,y:-12}, transition:{duration:.38,ease:[.22,1,.36,1]} };

  return (
    <main className="min-h-screen bg-[#f4f7f8] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(520px,720px)]">
        <section className="relative hidden overflow-hidden bg-[#07131d] lg:block">
          <img src="/media/hero/hero-mestske-mlzitko.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" onError={(e)=>{e.currentTarget.style.display="none"}} />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(7,19,29,.9),rgba(7,19,29,.24)_58%,rgba(7,19,29,.72))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_34%,rgba(34,211,238,.2),transparent_28%)]" />
          <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
            <Link to="/" className="text-sm font-black tracking-[.24em] text-white">MLŽIDLA.CZ</Link>
            <div className="max-w-xl pb-8 text-white">
              <p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Klientská sekce</p>
              <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-.045em] xl:text-6xl">Váš projekt.<br/>Na jednom místě.</h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/70">Nabídky, vizualizace, objednávky, dokumentace i servis vašeho mlžicího systému v jednom bezpečném účtu.</p>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[610px]">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/" className="font-black tracking-[.2em] lg:hidden">MLŽIDLA.CZ</Link>
              <div className="ml-auto flex items-center gap-2 text-xs font-semibold text-slate-400">
                {["Profil","Účet","Ověření"].map((x,i)=>{
                  const active = {profile:0,account:1,otp:2,success:3}[step] >= i;
                  return <React.Fragment key={x}><span className={`flex h-7 w-7 items-center justify-center rounded-full border ${active?"border-cyan-400 bg-cyan-50 text-cyan-700":"border-slate-200 bg-white"}`}>{active && {profile:0,account:1,otp:2,success:3}[step] > i ? <Check size={13}/> : i+1}</span>{i<2&&<span className="h-px w-5 bg-slate-200"/>}</React.Fragment>
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === "profile" && <motion.div key="profile" {...panelMotion}>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-700">Vytvořit klientský účet</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">Řekněte nám, kdo jste.</h2>
                <p className="mt-4 text-sm leading-6 text-slate-500">Profil přizpůsobí klientskou sekci vašemu typu projektu. Inspirováno jednoduchostí profesionálních architektonických portálů, v designu MLŽIDLA.cz.</p>

                <form onSubmit={nextProfile} className="mt-8 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label><span className={labelClass}>Jméno *</span><input className={fieldClass} value={form.firstName} onChange={set("firstName")} autoComplete="given-name" required /></label>
                    <label><span className={labelClass}>Příjmení *</span><input className={fieldClass} value={form.lastName} onChange={set("lastName")} autoComplete="family-name" required /></label>
                  </div>
                  <label><span className={labelClass}>Firma / organizace</span><input className={fieldClass} value={form.company} onChange={set("company")} autoComplete="organization" placeholder="Město, ateliér, firma…" /></label>
                  <label className="block"><span className={labelClass}>Jsem / zastupuji *</span>
                    <div className="relative"><select className={fieldClass+" appearance-none pr-12"} value={form.profileType} onChange={set("profileType")} required><option value="">Vyberte si svůj profil</option>{PROFILE_TYPES.map(x=><option key={x}>{x}</option>)}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/></div>
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2"><span className={labelClass}>Adresa</span><input className={fieldClass} value={form.address} onChange={set("address")} autoComplete="street-address" /></label>
                    <label><span className={labelClass}>PSČ</span><input className={fieldClass} value={form.postalCode} onChange={set("postalCode")} autoComplete="postal-code" /></label>
                    <label><span className={labelClass}>Město / obec</span><input className={fieldClass} value={form.city} onChange={set("city")} autoComplete="address-level2" /></label>
                    <label><span className={labelClass}>Země</span><input className={fieldClass} value={form.country} onChange={set("country")} autoComplete="country-name" /></label>
                    <label><span className={labelClass}>IČ</span><input className={fieldClass} value={form.companyId} onChange={set("companyId")} inputMode="numeric" /></label>
                  </div>
                  {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                  <motion.button whileHover={reduced?undefined:{y:-2}} whileTap={reduced?undefined:{scale:.985}} className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#07131d] font-bold text-white shadow-[0_18px_45px_rgba(7,19,29,.16)] transition hover:bg-[#0b2433]">Pokračovat <ArrowRight size={17} className="transition group-hover:translate-x-1"/></motion.button>
                </form>
              </motion.div>}

              {step === "account" && <motion.div key="account" {...panelMotion}>
                <button onClick={()=>{setStep("profile");setError("")}} className="mb-6 text-sm font-semibold text-slate-500 hover:text-slate-950">← Zpět k profilu</button>
                <h2 className="text-4xl font-semibold tracking-[-.04em] sm:text-5xl">Přihlašovací údaje.</h2>
                <p className="mt-4 text-sm leading-6 text-slate-500">Po registraci budete přesměrováni přímo do své klientské sekce.</p>
                <button type="button" onClick={handleGoogle} className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white font-semibold transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"><GoogleIcon className="h-5 w-5"/>Pokračovat přes Google</button>
                <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[.15em] text-slate-400"><span className="h-px flex-1 bg-slate-200"/><span>nebo e-mailem</span><span className="h-px flex-1 bg-slate-200"/></div>
                <form onSubmit={handleRegister} className="space-y-5">
                  <label className="block"><span className={labelClass}>E-mail *</span><input className={fieldClass} type="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder="vas@email.cz" required /></label>
                  <label className="block"><span className={labelClass}>Telefon</span><input className={fieldClass} type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+420" /></label>
                  <label className="block"><span className={labelClass}>Heslo *</span><div className="relative"><input className={fieldClass+" pr-12"} type={showPassword?"text":"password"} value={form.password} onChange={set("password")} autoComplete="new-password" required/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button></div></label>
                  {form.password && <div><div className="grid grid-cols-4 gap-1.5">{[0,1,2,3].map(i=><span key={i} className={`h-1.5 rounded-full ${i<passwordScore?(passwordScore<3?"bg-amber-400":"bg-emerald-400"):"bg-slate-200"}`}/>)}</div><p className="mt-2 text-xs text-slate-400">{passwordScore<3?"Použijte alespoň 9 znaků, číslo a velké písmeno.":"Silné heslo"}</p></div>}
                  <label className="block"><span className={labelClass}>Potvrzení hesla *</span><input className={fieldClass} type="password" value={form.confirmPassword} onChange={set("confirmPassword")} autoComplete="new-password" required /></label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4"><input type="checkbox" checked={form.newsletter} onChange={set("newsletter")} className="mt-1 h-4 w-4 accent-cyan-500"/><span className="text-sm leading-6 text-slate-600">Chci dostávat novinky, inspiraci a informace o řešeních MLŽIDLA.cz.</span></label>
                  {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                  <motion.button disabled={loading} whileHover={reduced?undefined:{y:-2}} whileTap={reduced?undefined:{scale:.985}} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#07131d] font-bold text-white disabled:opacity-50">{loading?<><Loader2 size={17} className="animate-spin"/>Vytvářím účet…</>:<>Vytvořit účet <ArrowRight size={17}/></>}</motion.button>
                  <p className="text-center text-xs leading-5 text-slate-400">Registrací souhlasíte se zpracováním údajů pro správu klientského účtu. <Link to="/gdpr" className="underline hover:text-slate-700">Ochrana osobních údajů</Link></p>
                </form>
              </motion.div>}

              {step === "otp" && <motion.div key="otp" {...panelMotion} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700"><KeyRound size={26}/></div>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-.04em]">Ověřte svůj e-mail.</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">{info}</p>
                <form onSubmit={handleVerify} className="mx-auto mt-8 max-w-sm space-y-5">
                  <input className={fieldClass+" text-center text-2xl font-bold tracking-[.35em]"} inputMode="numeric" autoComplete="one-time-code" value={form.otpCode} onChange={set("otpCode")} placeholder="000000" required autoFocus/>
                  {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                  <button disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#07131d] font-bold text-white disabled:opacity-50">{loading?<Loader2 className="animate-spin" size={18}/>:"Ověřit a pokračovat"}</button>
                  <button type="button" onClick={handleResend} disabled={loading} className="text-sm font-semibold text-cyan-700 hover:underline">Poslat kód znovu</button>
                </form>
              </motion.div>}

              {step === "success" && <motion.div key="success" {...panelMotion} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={28}/></div>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-.04em]">Účet je připraven.</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">Váš klientský profil byl vytvořen. Teď můžete spravovat projekty, nabídky, dokumentaci a servis.</p>
                <button onClick={()=>{window.location.href=nextUrl}} className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#07131d] px-8 font-bold text-white transition hover:-translate-y-0.5">Přejít do klientské sekce <ArrowRight size={17}/></button>
              </motion.div>}
            </AnimatePresence>

            {step !== "success" && <p className="mt-8 text-center text-sm text-slate-500">Už máte účet? <Link to="/login" className="font-bold text-slate-900 hover:text-cyan-700">Přihlásit se</Link></p>}
          </div>
        </section>
      </div>
    </main>
  );
}
