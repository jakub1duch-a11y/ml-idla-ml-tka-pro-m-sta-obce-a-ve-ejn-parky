import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const CATEGORY_LABELS = {
  mestsky: 'Městský',
  event: 'Event',
  soukromy: 'Soukromý',
  prumyslovy: 'Průmyslový'
};

const FALLBACK = [
{
  id: 'f1',
  location: 'Praha — ZOO Praha',
  category: 'mestsky',
  year: 2025,
  name: 'ZOO Praha — Mlžné chlazení',
  description: 'Instalace mlžných soch v areálu ZOO Praha. Systém zajišťuje optimální mikroklima pro zvířata i návštěvníky při letních teplotách.',
  image_url: 'https://lh3.googleusercontent.com/d/1JTKWVGMNje7h4Tq0IVdwlaVJOlDuAoOk',
  stats: [{ val: '−9 °C', label: 'pokles teploty' }, { val: '1 den', label: 'montáž' }, { val: '5 let', label: 'záruka' }]
},
{
  id: 'f2',
  location: 'Praha 6 — Divoká Šárka',
  category: 'mestsky',
  year: 2025,
  name: 'Přírodní amfiteátr s mlžnou oázou',
  description: 'V nejnavštěvovanějším pražském přírodním parku jsme instalovali 3 mlžné sochy GATE 60 podél hlavní promenády. V horkých dnech teplota v bezprostřední blízkosti klesla o 7 °C.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
  stats: [{ val: '−7 °C', label: 'pokles teploty' }, { val: '34 %', label: 'více návštěvníků' }, { val: '3 ks', label: 'GATE 60' }]
},
{
  id: 'f3',
  location: 'Praha 1 — Náměstí Republiky',
  category: 'mestsky',
  year: 2026,
  name: 'Designová mlžná socha AURA',
  description: 'Pro Prahu 1 jsme navrhli custom mlžnou sochu AURA jako dominantu náměstí. Průměr 160 cm, 8 trysek, ovládání přes Smart systém napojený na meteorologická data.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
  stats: [{ val: '−9 °C', label: 'pokles teploty' }, { val: '160 cm', label: 'průměr AURA' }, { val: 'Smart', label: 'automatické řízení' }]
}];


export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Realizace.list().
    then((items) => {
      const published = (items || []).filter((i) => i.published);
      // Map to consistent shape with fallback stats
      const mapped = published.map((r) => ({
        ...r,
        stats: [
        { val: `${r.year}`, label: 'Rok realizace' },
        { val: CATEGORY_LABELS[r.category] || r.category || '—', label: 'Typ projektu' },
        { val: r.product_used || 'HolmTec', label: 'Produkt' }]

      }));
      setProjects(mapped.length > 0 ? mapped : FALLBACK);
    }).
    catch(() => setProjects(FALLBACK)).
    finally(() => setLoading(false));
  }, []);

  const project = projects[active];

  return null;























































































}