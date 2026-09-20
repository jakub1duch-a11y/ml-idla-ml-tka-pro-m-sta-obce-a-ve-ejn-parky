import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader, Mail, MapPin, Phone } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { trackInquirySubmitted } from '@/lib/ga4';
import { setSEO } from '@/lib/seo';
import InquiryHero from '@/components/premium/InquiryHero';
import InquiryTrust from '@/components/premium/InquiryTrust';
import GoogleContactBox from '@/components/forms/GoogleContactBox';

const baseProducts = ['AI návrh projektu', 'City Collection', 'Garden Collection', 'Zakázkové řešení', 'Smart řízení', 'Ještě nevím'];
const input = 'w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none';

export default function Poptavka() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [useGoogleContact, setUseGoogleContact] = useState(false);
  const [googleContact, setGoogleContact] = useState({ email: '', name: '', imageUrl: '' });
  const [contactConfirmed, setContactConfirmed] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const arSession = searchParams.get('ar_session') || '';
  const initialProduct = searchParams.get('produkt') || '';
  const products = initialProduct && !baseProducts.includes(initialProduct) ? [initialProduct, ...baseProducts] : baseProducts;
  const [form, setForm] = useState(() => ({
    jmeno: searchParams.get('jmeno') || '',
    email: searchParams.get('email') || '',
    telefon: searchParams.get('telefon') || '',
    firma: '',
    produkt: initialProduct,
    zprava: searchParams.get('zprava') || '',
  }));

  useEffect(() => {
    setSEO({
      title: 'Nezávazná poptávka | MLŽIDLA®',
      description: 'Navrhneme architektonický mlžicí systém přesně pro váš prostor.',
      canonicalPath: '/poptavka',
    });
  }, []);

  const change = (name) => (event) => setForm((values) => ({ ...values, [name]: event.target.value }));

  const applyGoogleContact = (contact) => {
    setGoogleContact(contact);
    setForm((values) => ({
      ...values,
      jmeno: contact.name || values.jmeno,
      email: contact.email || values.email,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      const response = await base44.functions.invoke('submitPoptavka', {
        ...form,
        use_google_contact: useGoogleContact,
        google_contact_email: googleContact.email,
        google_contact_name: googleContact.name,
        google_profile_image_url: googleContact.imageUrl,
        contact_confirmed_by_user: contactConfirmed,
        privacy_contact_consent: privacyConsent,
        service_type: initialProduct || 'general_inquiry',
        zprava: arSession ? `${form.zprava}\n\nAR session: ${arSession}` : form.zprava,
      });
      const created = response?.data?.inquiry || response?.inquiry;
      if (arSession) {
        try {
          const matches = await base44.entities.ARSession.filter({ session_key: arSession });
          const session = matches?.[0];
          if (session?.id) await base44.entities.ARSession.update(session.id, { status: 'inquiry_sent' });
        } catch (sessionError) {
          console.warn('AR session status update skipped', sessionError);
        }
      }
      trackInquirySubmitted('poptavka', form.produkt, created?.id || '');
      navigate('/dekujeme?zdroj=poptavka');
    } catch (submitError) {
      console.error('Inquiry submit failed', submitError);
      const code = submitError?.response?.data?.error || submitError?.data?.error || submitError?.message || '';
      setError(code === 'google_login_required'
        ? 'Přihlášení přes Google vypršelo. Přihlaste se prosím znovu, nebo pokračujte ručním vyplněním.'
        : 'Poptávku se nepodařilo uložit. Zkontrolujte kontaktní údaje a zkuste to znovu.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-background">
      <InquiryHero />
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <aside>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-teal-700">Bezplatná konzultace · bez závazků</p>
            <h2 className="font-heading text-4xl text-slate-950">Nechte si posoudit prostor.</h2>
            <p className="mt-5 leading-relaxed text-slate-600">Stačí několik informací, ideálně město, přibližná velikost prostoru a fotografie. Doporučíme vhodný typ řešení, orientační rozpočet a jasný další krok.</p>
            <div className="mt-10 space-y-5 text-sm text-slate-700">
              <a href="tel:+420774700390" className="flex items-center gap-3"><Phone size={17} className="text-teal-700" />+420 774 700 390</a>
              <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-3"><Mail size={17} className="text-teal-700" />obchod1@holmtec.cz</a>
              <p className="flex items-start gap-3"><MapPin size={17} className="mt-0.5 text-teal-700" />Trutnov, Česká republika</p>
            </div>
          </aside>

          <div>
            <InquiryTrust />
            <form onSubmit={submit} className="border border-slate-200 bg-white p-6 lg:p-10">
              <GoogleContactBox
                checked={useGoogleContact}
                onCheckedChange={setUseGoogleContact}
                onApply={applyGoogleContact}
              />

              <div id="contact-fields" className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
                <label className="font-mono text-xs uppercase tracking-wider text-slate-500">Jméno a příjmení *
                  <input required autoComplete="name" value={form.jmeno} onChange={change('jmeno')} placeholder="Jan Novák" className={input} />
                </label>
                <label className="font-mono text-xs uppercase tracking-wider text-slate-500">E-mail *
                  <input required autoComplete="email" type="email" value={form.email} onChange={change('email')} placeholder="jan@firma.cz" className={input} />
                </label>
                <label className="font-mono text-xs uppercase tracking-wider text-slate-500">Telefon
                  <input autoComplete="tel" value={form.telefon} onChange={change('telefon')} placeholder="+420 000 000 000" className={input} />
                </label>
                <label className="font-mono text-xs uppercase tracking-wider text-slate-500">Firma / organizace
                  <input autoComplete="organization" value={form.firma} onChange={change('firma')} placeholder="Název organizace" className={input} />
                </label>
              </div>

              <label className="mt-7 block font-mono text-xs uppercase tracking-wider text-slate-500">Typ projektu
                <select value={form.produkt} onChange={change('produkt')} className={input}>{products.map((item) => <option key={item}>{item}</option>)}</select>
              </label>
              <label className="mt-7 block font-mono text-xs uppercase tracking-wider text-slate-500">Jaký prostor řešíte? *
                <textarea required value={form.zprava} onChange={change('zprava')} rows={4} placeholder="Město, místo instalace, přibližné rozměry, způsob využití a případně odkaz na fotografie prostoru…" className={`${input} resize-none`} />
              </label>

              <div className="mt-7 space-y-3 border-t border-slate-100 pt-6">
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600">
                  <input required type="checkbox" checked={contactConfirmed} onChange={(event) => setContactConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300" />
                  <span>Potvrzuji, že uvedené kontaktní údaje jsou správné.</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600">
                  <input required type="checkbox" checked={privacyConsent} onChange={(event) => setPrivacyConsent(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300" />
                  <span>Souhlasím, aby MLŽIDLA.cz použila uvedené kontaktní údaje pro zpracování poptávky, přípravu návrhu a zaslání nabídky.</span>
                </label>
              </div>

              {error && <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</p>}
              <button disabled={sending} className="btn-inquiry-pulse mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground disabled:opacity-60">
                {sending ? <><Loader size={17} className="animate-spin" /> Odesílám…</> : <>Získat návrh a cenu <ArrowRight size={16} /></>}
              </button>
              <p className="mt-5 text-xs text-slate-400">Bezplatná konzultace. Bez závazků. Kontaktní údaje můžete před odesláním upravit.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
