import { useState, useEffect } from 'react';
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

  return null;




















































}