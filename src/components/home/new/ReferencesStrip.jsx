import { useState, useEffect } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const CITY_REFERENCES = [
{
  city: 'Praha',
  code: 'PHA',
  label: 'městské parky, školy, pobytové zóny a veřejný prostor',
  href: '/reference'
},
{
  city: 'Polná',
  code: 'POL',
  label: 'slavnosti, eventy, Mrkvobraní a sezónní osvěžení',
  href: '/reference/mesto-polna-mlzitko-mrkev'
},
{
  city: 'Jičín',
  code: 'JIC',
  label: 'náměstí, promenády, parky a turistické trasy',
  href: '/reference/bendy-jicinske-namesti'
},
{
  city: 'Brno',
  code: 'BRN',
  label: 'sportoviště, parky, areály a pobytové zóny',
  href: '/reference'
}];


export default function ReferencesStrip() {
  const [cities, setCities] = useState(CITY_REFERENCES);

  useEffect(() => {
    base44.entities.Realizace.filter({ published: true, category: 'mestsky' }, '-year', 20).
    then((items) => {
      if (!items?.length) return;
      const merged = [...CITY_REFERENCES];
      items.forEach((item) => {
        const name = item.client || item.location || item.name || '';
        const normalized = name.toLowerCase();
        const existing = merged.find((city) => normalized.includes(city.city.toLowerCase()) || city.city.toLowerCase().includes(normalized));
        if (!existing && name) {
          merged.push({
            city: name.replace(/^Město\s+/i, '').trim(),
            code: name.slice(0, 3).toUpperCase(),
            label: item.short_description || item.description || 'veřejný prostor a realizace mlžení',
            href: item.slug ? `/reference/${item.slug}` : '/reference'
          });
        }
      });
      setCities(merged.slice(0, 8));
    }).
    catch(() => {});
  }, []);

  return (
    <section className="border-y border-[#D9E6ED] bg-white py-12 sm:py-16" aria-labelledby="city-references-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#0B83BC]">Místa a inspirace</p>
            <h2 id="city-references-title" className="mt-2 max-w-2xl font-heading text-2xl font-semibold tracking-[-.03em] text-[#0A2342] sm:text-3xl">Řešení, která vycházejí z konkrétního prostoru.</h2>
          </div>
          <Link to="/reference" className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[#0B5EA8] transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B97E8] focus-visible:ring-offset-4 sm:self-auto">Prohlédnout reference <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <Link key={`${city.code}-${city.city}`} to={city.href} className="group flex min-h-[132px] flex-col justify-between rounded-2xl border border-[#D9E6ED] bg-[#F7FBFD] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#79C8E5] hover:bg-[#EFF9FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B97E8] focus-visible:ring-offset-2">
              <div className="flex items-center justify-between gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#E1F4FB] text-[#0B5EA8]"><MapPin size={17} aria-hidden="true" /></span><span className="font-mono text-[10px] tracking-[.16em] text-[#0D2F4F]/35">{city.code}</span></div>
              <div className="mt-5"><h3 className="text-base font-semibold text-[#0A2342]">{city.city}</h3><p className="mt-1 text-xs leading-5 text-[#0D2F4F]/60">{city.label}</p></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );




















































}