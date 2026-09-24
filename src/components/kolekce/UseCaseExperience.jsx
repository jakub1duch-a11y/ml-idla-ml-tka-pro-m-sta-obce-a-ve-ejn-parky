import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { CITY_ITEMS, GARDEN_ITEMS } from '@/components/kolekce/useCaseData';
import UseCaseCard from '@/components/kolekce/UseCaseCard';
import { base44 } from '@/api/base44Client';

const CITY_MEDIA_KEYWORDS = {
  'Náměstí & centrum města': ['namesti', 'náměstí', 'centrum', 'city', 'mesto', 'město', 'urban', 'bendy', 'linea', 'gate'],
  'Parky & promenády': ['park', 'promenada', 'promenáda', 'alej', 'zeleň', 'zelen', 'steblo', 'bendy'],
  'Nádraží & dopravní uzly': ['nadrazi', 'nádraží', 'terminal', 'doprav', 'station', 'uzel'],
  'Sportoviště': ['sport', 'stadion', 'hriste', 'hřiště', 'beh', 'běh', 'cyklo'],
  'Hotely & resorty': ['hotel', 'resort', 'terasa', 'hospitality'],
  'Lázně & wellness': ['lazne', 'lázně', 'wellness', 'spa', 'relax'],
  'Domovy seniorů': ['senior', 'domov', 'pecovat', 'pečovat', 'klidova', 'klidová'],
  'Veřejné instituce': ['skola', 'škola', 'urad', 'úřad', 'instituce', 'verejn', 'veřejn', 'dvur', 'dvůr'],
};

const normalize = (value = '') => value
  .toString()
  .toLocaleLowerCase('cs')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const assetText = (asset) => normalize([
  asset?.file_name,
  asset?.media_group,
  asset?.product_slug,
  asset?.file_type,
].filter(Boolean).join(' '));

const rankAssetForItem = (asset, item) => {
  const haystack = assetText(asset);
  const keywords = CITY_MEDIA_KEYWORDS[item.title] || [];
  let score = 0;

  for (const keyword of keywords) {
    if (haystack.includes(normalize(keyword))) score += 4;
  }

  const titleWords = normalize(item.title)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);

  for (const word of titleWords) {
    if (haystack.includes(word)) score += 2;
  }

  if (asset?.product_slug) score += 1;
  return score;
};

function applyApprovedMedia(items, assets) {
  if (!Array.isArray(assets) || assets.length === 0) return items;

  const available = [...assets];
  return items.map((item) => {
    if (!available.length) return item;

    const ranked = available
      .map((asset, index) => ({ asset, index, score: rankAssetForItem(asset, item) }))
      .sort((a, b) => b.score - a.score || a.index - b.index);

    const selected = ranked[0]?.asset;
    if (!selected?.file_url) return item;

    const sourceIndex = available.findIndex((asset) => asset.id === selected.id);
    if (sourceIndex >= 0) available.splice(sourceIndex, 1);

    return {
      ...item,
      image: selected.file_url,
      imageAlt: selected.file_name || item.title,
      mediaSource: 'approved-admin',
    };
  });
}

export default function UseCaseExperience({ variant = 'city' }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [approvedMedia, setApprovedMedia] = useState([]);

  useEffect(() => {
    if (variant !== 'city') return undefined;

    let active = true;

    const loadApprovedMedia = async () => {
      try {
        const rows = await base44.entities.MediaFile.list('-created_date', 120);
        if (!active) return;

        const approved = (rows || []).filter((row) =>
          row?.media_role === 'render' &&
          typeof row?.file_url === 'string' &&
          row.file_url.length > 0 &&
          String(row?.file_type || '').toLowerCase().startsWith('image')
        );

        setApprovedMedia(approved);
      } catch {
        if (active) setApprovedMedia([]);
      }
    };

    loadApprovedMedia();
    return () => { active = false; };
  }, [variant]);

  const baseItems = variant === 'garden' ? GARDEN_ITEMS : CITY_ITEMS;
  const items = useMemo(
    () => variant === 'city' ? applyApprovedMedia(baseItems, approvedMedia) : baseItems,
    [variant, baseItems, approvedMedia]
  );

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [36, -36]);
  const ySecondary = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-24, 32]);
  const lineWidth = useTransform(scrollYProgress, [0.05, 0.6], ['0%', '100%']);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-[#D3E2E8] bg-[#F4FAFC] py-20 sm:py-24">
      <motion.div style={{ y }} className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-[#22D3EE]/15 blur-3xl" />
      <motion.div style={{ y: ySecondary }} className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#153863]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[.2em] text-[#153863]">// Kde MLŽIDLA dávají smysl</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-[-.035em] text-[#0A1628] sm:text-5xl">
              {variant === 'garden' ? 'Ochlazení pro místa, kde chcete zůstat déle.' : 'Ochlazení tam, kde se město skutečně používá.'}
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-2xl text-base leading-7 text-[#5A6B78] sm:text-lg">
              {variant === 'garden'
                ? 'Od soukromé zahrady přes hotelovou terasu až po lázeňský nebo seniorský areál. Jemná mlha vytváří příjemnější mikroklima bez toho, aby přebila architekturu prostoru.'
                : 'Náměstí, parky, sportoviště, nádraží, promenády, hotely, lázně i domovy seniorů. Navrhujeme ochlazovací body podle pohybu lidí, stínu, větru a skutečného provozu.'}
            </p>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mt-5 font-heading text-xl font-semibold tracking-[-.02em] text-[#153863] sm:text-2xl"
            >
              Ochlazujeme vzduch kolem vás. Dýchejte lépe.
            </motion.p>
          </div>
        </div>

        <div className="mt-10 h-[2px] w-full bg-[#D3E2E8]">
          <motion.div style={{ width: lineWidth }} className="h-full bg-[#22D3EE]" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <UseCaseCard key={item.title} item={item} index={index} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
