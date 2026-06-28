import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Check, Droplets, Thermometer, Zap, Shield } from 'lucide-react';

// ─── Product database ──────────────────────────────────────────────────────────
const PRODUCTS = {
  mrak: {
    slug: 'mrak',
    name: 'MRAK',
    category: 'Art instalace',
    tagline: 'Organické křivky. Nebeský dotek.',
    lead: 'Mlžná skulptura ve tvaru stilizovaného mraku — pohyblivý oblak z nerezové oceli, který ochlazuje okolí a stává se centrem každého veřejného prostoru.',
    description: 'MRAK je naší nejúspěšnější zakázkovou skulpturou. Organické křivky jsou ohýbány z jednoho kusu trubky TR40×3 mm a svářeny do plynulého tvaru bez viditelných spojů. Povrch je broušen do saténového lesku — při odlesku slunce působí jako živý organismus. Pět trysek vytváří sametovou mlhavou závěs, která mizí ve vzduchu dřív, než dopadne na zem.',
    hero: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
    gallery: [
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/38d5a8482_Mlzitko-do-zahrady-tvar-mrak-VDMA.webp',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/a01ebd4e8_volnytvar-motorkar-apli.png',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/1e2e816a4_ker-mlzitko.png',
    ],
    nozzleImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/078e25764_3a4d19965_Food_Brand_System_Style_Guide_In_a_photographic_style_a_circular_mister_sprays_QKFDjh9F1.jpg',
    mistImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
    specs: [
      { label: 'Materiál', value: 'Nerezová ocel AISI 304' },
      { label: 'Trubka', value: 'TR40×3 mm — okrouhlá' },
      { label: 'Počet trysek', value: '5 ks (nastavitelné)' },
      { label: 'Tlak vody', value: '2–6 bar' },
      { label: 'Spotřeba vody', value: '7–10 l/h' },
      { label: 'Ochlazení', value: 'až −9 °C' },
      { label: 'Kapky', value: '10–50 μm' },
      { label: 'Výška', value: '80–180 cm (zakázková)' },
      { label: 'Povrch', value: 'Saténový brus, Ra 0.8' },
      { label: 'Kotvení', value: 'Zemní vrut nebo patka' },
      { label: 'Smart ovládání', value: 'WiFi + BT (volitelně)' },
      { label: 'Záruka', value: '5 let na konstrukci' },
    ],
    features: [
      { icon: Droplets, title: 'Sametová mlha', desc: 'Kapky 10–50 μm se odpařují ještě ve vzduchu — povrchy zůstanou suché.' },
      { icon: Thermometer, title: 'Ochlazení −9 °C', desc: 'Evaporační efekt snižuje teplotu okolního vzduchu až o 9 stupňů.' },
      { icon: Shield, title: 'AISI 304', desc: 'Potravinářský standard nerezové oceli. Korozivzdorná, bez údržby.' },
      { icon: Zap, title: 'Smart připojení', desc: 'Volitelný WiFi/BT modul — ovládání z mobilu, automatické scény.' },
    ],
    modules: [
      { name: 'Zemní vrut ∅60', desc: 'Rychlá instalace bez betonu', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/8fd8247c3_Copilot_20260506_023304.png' },
      { name: 'Kotvící patka', desc: 'Permanentní ukotvení do betonu', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/304a79acc_Copilot_20260506_022439.png' },
      { name: 'Smart WiFi modul', desc: 'Ovládání z mobilu odkudkoli', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3aa6b0337_51da7b088_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ1.png' },
    ],
    projects: [
      { name: 'Park Trutnov', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/e508e04b9_img-4513.jpeg' },
      { name: 'Letní festival Praha', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/af3c01f8d_3695-fullsizerender-1.jpeg' },
      { name: 'Soukromá zahrada', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/1f4f0ba99_img-3501.jpg' },
    ],
    related: ['gate60', 'volavka', 'kids'],
  },

  gate60: {
    slug: 'gate60',
    name: 'GATE 60',
    category: 'Komerční · Veřejné prostory',
    tagline: 'Vstupní portál z mlhy.',
    lead: 'Průchozí mlžná brána pro náměstí, parky a vstupy do budov. Spektakulární vizuální dojem a ochlazení −9 °C v průchozí zóně.',
    description: 'GATE 60 je mlžná brána vyrobená z trubek TR60×3 z oceli 1.4301 (AISI 304). Konstrukce je svařena do čistého rámu šíře 3 m a výšky 2,1 m. Pět trysek rovnoměrně pokrývá celou plochu průchodu. Brána je navržena pro trvalou instalaci ve veřejných prostorech — stadiony, parky, náměstí, vstupní zóny budov.',
    hero: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
    gallery: [
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/10d7399ee_Mlzitko-mlzici-brana-hranata-na-namesti-VDMA.webp',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/6bcee1127_kontinent-mlzitko.png',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/e03a84d77_L-Mltko_GATE_60_3R-1.png',
    ],
    nozzleImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/078e25764_3a4d19965_Food_Brand_System_Style_Guide_In_a_photographic_style_a_circular_mister_sprays_QKFDjh9F1.jpg',
    mistImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
    specs: [
      { label: 'Materiál', value: 'Nerezová ocel AISI 304 (1.4301)' },
      { label: 'Trubka', value: 'TR60×3 mm — okrouhlá' },
      { label: 'Počet trysek', value: '5 ks' },
      { label: 'Šíře brány', value: '3 000 mm' },
      { label: 'Výška brány', value: '2 100 mm' },
      { label: 'Tlak vody', value: '3–6 bar' },
      { label: 'Spotřeba vody', value: '8–12 l/h' },
      { label: 'Ochlazení', value: 'až −9 °C v průchodu' },
      { label: 'Kapky', value: '10–50 μm' },
      { label: 'Povrch', value: 'Saténový brus' },
      { label: 'Kotvení', value: 'Chemické kotvy M12' },
      { label: 'Záruka', value: '5 let na konstrukci' },
    ],
    features: [
      { icon: Droplets, title: 'Průchozí mlhavá clona', desc: 'Rovnoměrný mlhavý závěs přes celou šíři 3 m — dramatický vizuální efekt.' },
      { icon: Thermometer, title: 'Ochlazení v průchodu', desc: 'Kdo projde branou, pocítí okamžité ochlazení až o 9 °C.' },
      { icon: Shield, title: 'Vandal-proof design', desc: 'Masivní TR60 trubky. Robustní pro trvalé venkovní instalace.' },
      { icon: Zap, title: 'Smart automatika', desc: 'Automatická aktivace dle teploty čidla. Volitelný WiFi modul.' },
    ],
    modules: [
      { name: 'Chemické kotvy M12', desc: 'Pevné ukotvení do betonu', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/304a79acc_Copilot_20260506_022439.png' },
      { name: 'Smart WiFi modul', desc: 'Ovládání z mobilu odkudkoli', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3aa6b0337_51da7b088_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ1.png' },
      { name: 'Teplotní čidlo', desc: 'Automatický start při 28 °C', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/8fd8247c3_Copilot_20260506_023304.png' },
    ],
    projects: [
      { name: 'Náměstí — veřejný prostor', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/d6618acdb_cd290d8c-b544-42b4-9823-9661da467f33.jpg' },
      { name: 'Letní kino vstup', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/0b7f23005_3734-fullsizerender.jpg' },
      { name: 'Sportovní areál', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/f8370e628_573bb0e8-cd2d-4509-9b8f-738084ea3b2b.webp' },
    ],
    related: ['mrak', 'kids', 'volavka'],
  },

  kids: {
    slug: 'kids',
    name: 'Kids Edition',
    category: 'Outdoor · Hřiště & Školy',
    tagline: 'Hravý tvar. Bezpečná mlha.',
    lead: 'Mlžné prvky speciálně navržené pro dětská hřiště, mateřské školy a ZOO. Potravinářský standard materiálů, hladké svary, žádné ostré hrany.',
    description: 'Kids Edition je kategorie mlžných prvků navržená výhradně pro dětské prostory. Každý kus je vyroben z nerezové oceli AISI 304 s potravinářskou certifikací. Veškeré svary jsou broušeny do plynulých tvarů — žádné ostré hrany, na které by si dítě mohlo ublížit. Mikrotrysky produkují jemnou mlhu 10–30 μm, která se odpaří před dopadem — děti se dají mokrými, přesto se neukloužnou.',
    hero: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
    gallery: [
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/c9de9fd45_img-3558.jpeg',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/f01bc8d2c_img-4587.jpeg',
    ],
    nozzleImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/078e25764_3a4d19965_Food_Brand_System_Style_Guide_In_a_photographic_style_a_circular_mister_sprays_QKFDjh9F1.jpg',
    mistImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
    specs: [
      { label: 'Materiál', value: 'Nerezová ocel AISI 304 — potravinářský standard' },
      { label: 'Svary', value: 'Broušené do plynulosti, bez ostrých hran' },
      { label: 'Počet trysek', value: '3–8 ks (dle velikosti)' },
      { label: 'Kapky', value: '10–30 μm — ultrajemná mlha' },
      { label: 'Tlak vody', value: '2–4 bar' },
      { label: 'Spotřeba vody', value: '5–8 l/h' },
      { label: 'Ochlazení', value: 'až −7 °C' },
      { label: 'Certifikace', value: 'Potravinářský standard AISI 304' },
      { label: 'Výška', value: '60–140 cm (zakázková)' },
      { label: 'Kotvení', value: 'Zemní vrut nebo patka' },
      { label: 'Smart ovládání', value: 'Volitelně WiFi + automatika' },
      { label: 'Záruka', value: '5 let na konstrukci' },
    ],
    features: [
      { icon: Shield, title: 'Bezpečnost na prvním místě', desc: 'Potravinářský standard AISI 304, hladké svary, žádné ostré hrany.' },
      { icon: Droplets, title: 'Ultrajemná mlha 10–30 μm', desc: 'Povrchy zůstanou suché — děti se neklouznou.' },
      { icon: Thermometer, title: 'Ochlazení −7 °C', desc: 'Bezpečná zóna chladu i v nejteplejší dny.' },
      { icon: Zap, title: 'Automatická aktivace', desc: 'Spuštění při 28 °C, vypnutí při dešti nebo noci.' },
    ],
    modules: [
      { name: 'Zemní vrut ∅60', desc: 'Snadná instalace bez betonu', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/8fd8247c3_Copilot_20260506_023304.png' },
      { name: 'Dešťový senzor', desc: 'Automatické vypnutí za deště', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/304a79acc_Copilot_20260506_022439.png' },
      { name: 'Barevný povlak', desc: 'RAL barvy pro hravý vzhled', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png' },
    ],
    projects: [
      { name: 'MŠ Trutnov', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg' },
      { name: 'Dětské hřiště — Praha', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/c9de9fd45_img-3558.jpeg' },
      { name: 'ZOO projekt', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/f01bc8d2c_img-4587.jpeg' },
    ],
    related: ['mrak', 'gate60', 'volavka'],
  },

  aura: {
    slug: 'aura',
    name: 'AURA',
    category: 'Veřejné prostory · Parky · Hřiště',
    tagline: 'Kruh z mlhy. Centrum každého prostoru.',
    lead: 'AURA je mlžná skulptura ve tvaru kruhu — nerezový prsten s integrovanými tryskami vytváří dokonalý mlhový halo. Pro parky, náměstí, dětská hřiště i firemní areály.',
    description: 'Jednoduchý tvar, který okamžitě upoutá pozornost. Nerezový kruh průměru 80 cm nasazený na štíhlém sloupu — každý ví, co to je, každý se chce přiblížit. 8 trysek rovnoměrně rozmístěných po obvodu kruhu vytváří symetrický mlhový disk viditelný ze stovek metrů. AURA je dostupná ve třech velikostech — Standard (∅80 cm), Large (∅120 cm) a XL (∅160 cm pro veřejné instalace). Povrch je broušen do saténového lesku AISI 304. Instalace trvá jeden den.',
    hero: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
    gallery: [
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ad09f28ad_4ba76226-4e57-4242-bf1d-b9add4e0da7b.jpg',
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9897413c3_MlzitkoLizatko.png',
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9b46f2f7b_tepelnyostrov.png',
    ],
    nozzleImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/078e25764_3a4d19965_Food_Brand_System_Style_Guide_In_a_photographic_style_a_circular_mister_sprays_QKFDjh9F1.jpg',
    mistImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
    specs: [
      { label: 'Materiál', value: 'Nerezová ocel AISI 304' },
      { label: 'Průměr kruhu', value: '∅80 / 120 / 160 cm' },
      { label: 'Sloup', value: 'TR40×3 mm, výška 180–250 cm' },
      { label: 'Počet trysek', value: '8 ks (rovnoměrně po obvodu)' },
      { label: 'Tlak vody', value: '2–6 bar' },
      { label: 'Spotřeba vody', value: '8–12 l/h' },
      { label: 'Ochlazení', value: 'až −9 °C' },
      { label: 'Kapky', value: '10–50 μm' },
      { label: 'Povrch', value: 'Saténový brus, Ra 0.8' },
      { label: 'Kotvení', value: 'Zemní vrut nebo betonová patka' },
      { label: 'Smart ovládání', value: 'WiFi + BT (volitelně)' },
      { label: 'Záruka', value: '5 let na konstrukci' },
    ],
    features: [
      { icon: Droplets, title: 'Symetrický mlhový halo', desc: '8 trysek po obvodu kruhu vytváří dokonalý symetrický mlhový disk.' },
      { icon: Thermometer, title: 'Ochlazení −9 °C', desc: 'Evaporační efekt snižuje teplotu okolního vzduchu až o 9 stupňů Celsia.' },
      { icon: Shield, title: 'Pro všechny věkové skupiny', desc: 'Hladké svary, bez ostrých hran. Bezpečné pro děti i veřejné prostory.' },
      { icon: Zap, title: 'Ikonický tvar', desc: 'Okamžitě rozpoznatelný vizuální prvek — dominanta každého prostoru.' },
    ],
    modules: [
      { name: 'Zemní vrut ∅60', desc: 'Mobilní instalace bez betonu', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/8fd8247c3_Copilot_20260506_023304.png' },
      { name: 'Smart WiFi modul', desc: 'Ovládání z mobilu odkudkoli', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3aa6b0337_51da7b088_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ1.png' },
      { name: 'Noční LED podsvícení', desc: 'Ambientní osvětlení po setmění', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/304a79acc_Copilot_20260506_022439.png' },
    ],
    projects: [
      { name: 'Veřejný park — osvěžení ve městě', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png' },
      { name: 'Dětské hřiště — mateřská škola', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9897413c3_MlzitkoLizatko.png' },
      { name: 'Tepelný ostrov — řešení pro město', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9b46f2f7b_tepelnyostrov.png' },
    ],
    related: ['mrak', 'gate60', 'kids'],
  },

  volavka: {
    slug: 'volavka',
    name: 'Volavka',
    category: 'Rezidenční · Zahrada',
    tagline: 'Elegance pro soukromé zahrady.',
    lead: 'Subtilní mlžná skulptura s elegantně zahnutým ramenem. Designová dominanta zahrady a zároveň funkční prvek ochlazení terasy nebo posezení.',
    description: 'Volavka je definicí minimalismu. Jeden plynulý oblouk 120° z trubky TR60, jeden skrytý přívod vody, jedna tryska na špičce — a přesto největší estetický efekt v zahradě. Mobilní varianta se zemním vrutem nevyžaduje žádné stavební úpravy. Produkt je vyráběn výhradně zakázkově — každý zákazník si volí výšku, úhel oblouku a průměr trysky.',
    hero: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1035553df_FB_IMG_1782148329157.jpg',
    gallery: [
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1035553df_FB_IMG_1782148329157.jpg',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/9e50cca6a_573bb0e8-cd2d-4509-9b8f-738084ea3b2b1.webp',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/e508e04b9_img-4513.jpeg',
      'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/f01bc8d2c_img-4587.jpeg',
    ],
    nozzleImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/078e25764_3a4d19965_Food_Brand_System_Style_Guide_In_a_photographic_style_a_circular_mister_sprays_QKFDjh9F1.jpg',
    mistImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
    specs: [
      { label: 'Materiál', value: 'Nerezová ocel AISI 304' },
      { label: 'Trubka', value: 'TR60 — okrouhlá' },
      { label: 'Oblouk', value: '120° (zakázkový úhel)' },
      { label: 'Počet trysek', value: '1–3 ks' },
      { label: 'Tlak vody', value: '2–5 bar' },
      { label: 'Spotřeba vody', value: '4–7 l/h' },
      { label: 'Ochlazení', value: 'až −8 °C' },
      { label: 'Kapky', value: '10–50 μm' },
      { label: 'Výška', value: '100–200 cm (zakázková)' },
      { label: 'Kotvení', value: 'Zemní vrut ∅60 (mobilní)' },
      { label: 'Smart ovládání', value: 'Volitelně WiFi' },
      { label: 'Záruka', value: '5 let na konstrukci' },
    ],
    features: [
      { icon: Droplets, title: 'Jedna tryska, velký efekt', desc: 'Soustředěná mlha na špičce oblouku vytváří vizuálně silný mlhový oblak.' },
      { icon: Thermometer, title: 'Ideální pro terasy', desc: 'Pokryje ochlazením posezení pro 4–8 osob. Tiché, bez kondenzátu.' },
      { icon: Shield, title: 'Mobilní instalace', desc: 'Zemní vrut — zapíchnete, připojíte hadici a mlžítko je připraveno.' },
      { icon: Zap, title: 'Minimalistický design', desc: 'Žádné viditelné hadice, žádné hrany. Čistá linie jako socha.' },
    ],
    modules: [
      { name: 'Zemní vrut ∅60', desc: 'Mobilní instalace bez betonu', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/8fd8247c3_Copilot_20260506_023304.png' },
      { name: 'Smart WiFi modul', desc: 'Ovládání z mobilu', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3aa6b0337_51da7b088_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ1.png' },
      { name: 'Druhá tryska', desc: 'Rozšíření pokrytí o 50 %', image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/304a79acc_Copilot_20260506_022439.png' },
    ],
    projects: [
      { name: 'Soukromá zahrada — Liberec', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/9e50cca6a_573bb0e8-cd2d-4509-9b8f-738084ea3b2b1.webp' },
      { name: 'Restaurační terasa', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/e508e04b9_img-4513.jpeg' },
      { name: 'Hotelový resort', image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/f01bc8d2c_img-4587.jpeg' },
    ],
    related: ['mrak', 'gate60', 'kids'],
  },
};

const RELATED_META = {
  aura: { name: 'AURA', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png' },
  mrak: { name: 'MRAK', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png' },
  gate60: { name: 'GATE 60', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg' },
  kids: { name: 'Kids Edition', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg' },
  volavka: { name: 'Volavka', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1035553df_FB_IMG_1782148329157.jpg' },
};

// ─── Gallery ───────────────────────────────────────────────────────────────────
function Gallery({ images }) {
  const [active, setActive] = useState(0);
  const prev = () => setActive(i => (i - 1 + images.length) % images.length);
  const next = () => setActive(i => (i + 1) % images.length);
  const validImages = images.filter(Boolean);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card_bg">
        <motion.img
          key={active}
          src={validImages[active]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full h-full object-cover"
        />
        {validImages.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/70 border border-white/20 flex items-center justify-center text-white hover:bg-ink transition-all backdrop-blur-sm">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/70 border border-white/20 flex items-center justify-center text-white hover:bg-ink transition-all backdrop-blur-sm">
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {validImages.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? 'bg-cyan w-4' : 'w-1.5 bg-white/40'}`} />
              ))}
            </div>
          </>
        )}
      </div>
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${i === active ? 'border-cyan' : 'border-white/10 hover:border-white/30'}`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProduktDetail() {
  const { slug } = useParams();
  const product = PRODUCTS[slug];

  if (!product) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="text-white/40 mb-4">Produkt nenalezen.</p>
          <Link to="/kolekce" className="text-cyan hover:underline">← Zpět na kolekci</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">

      {/* Fullscreen hero with product image */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={product.hero} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 pb-12">
          <Link to="/kolekce" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={14} /> Zpět na produkty
          </Link>
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-2">HOLMTEC · {product.category.toUpperCase()}</p>
          <h1 className="font-heading font-extralight text-6xl lg:text-8xl text-white tracking-tight leading-none mb-4">{product.name}</h1>
          <p className="text-white/60 text-xl max-w-lg">{product.tagline}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/kontakt" className="flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
              Nezávazná poptávka <ArrowRight size={16} />
            </Link>
            <a href="mailto:obchod1@holmtec.cz?subject=Katalog — žádost o PDF"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
              Katalog PDF
            </a>
          </div>
        </div>
      </div>

      {/* Gallery + Info */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Gallery images={product.gallery} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24">
            <p className="text-white/60 leading-relaxed mb-8 text-lg">{product.lead}</p>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              {product.specs.slice(0, 4).map(s => (
                <div key={s.label} className="p-4 rounded-xl bg-card_bg border border-white/10">
                  <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-sm font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/kontakt"
                className="flex-1 text-center px-6 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
                ✦ Nezávazná poptávka
              </Link>
              <a href="mailto:obchod1@holmtec.cz?subject=Katalog — žádost o PDF"
                className="flex-1 text-center px-6 py-4 bg-white/5 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all">
                Katalog PDF
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-surface py-20">
       <div className="max-w-7xl mx-auto px-6 lg:px-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2">
             <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">O produktu</p>
             <h2 className="font-heading font-light text-3xl text-white mb-6">Každý detail záleží</h2>
              <p className="text-white/60 leading-relaxed text-lg">{product.description}</p>
            </div>
            <div className="space-y-3">
              {product.features.map(f => (
                <div key={f.title} className="flex gap-4 p-4 rounded-xl bg-card_bg border border-white/10 hover:border-cyan/30 transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan/20 transition-all">
                    <f.icon size={17} className="text-cyan" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{f.title}</p>
                    <p className="text-xs text-white/45 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full specs table */}
      <div className="py-20 bg-ink">
       <div className="max-w-7xl mx-auto px-6 lg:px-8">
         <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Technická data</p>
         <h2 className="font-heading font-light text-3xl text-white mb-10">Technické parametry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {product.specs.map((s, i) => (
              <div key={s.label} className={`flex items-center justify-between gap-6 px-6 py-4 bg-card_bg ${i === product.specs.length - 1 && product.specs.length % 2 !== 0 ? 'md:col-span-2' : ''}`}>
                <span className="text-xs font-mono text-white/40 tracking-widest uppercase whitespace-nowrap">{s.label}</span>
                <span className="text-sm font-semibold text-white text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nozzle + Mist detail */}
      <div className="py-20 bg-surface">
       <div className="max-w-7xl mx-auto px-6 lg:px-8">
         <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Detail technologie</p>
         <h2 className="font-heading font-light text-3xl text-white mb-10">Tryska & mlhovina zblízka</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden bg-card_bg border border-white/10">
              <img src={product.nozzleImage} alt="Detail trysky" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">Tryska AISI 316L</p>
                <h3 className="font-bold text-white text-lg">Precizní nerezová tryska</h3>
                <p className="text-sm text-white/60 mt-1">Průměr otvoru 0.12 mm. Životnost 10 000+ hodin. Výměna za 2 minuty.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden bg-card_bg border border-white/10">
              <img src={product.mistImage} alt="Detail mlhovina" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">Kapky 10–50 μm</p>
                <h3 className="font-bold text-white text-lg">Jemná mlhovina</h3>
                <p className="text-sm text-white/60 mt-1">Kapky se odpaří ve vzduchu. Povrchy zůstávají suché, vzduch chladný.</p>
              </div>
            </motion.div>
          </div>

          {/* Physics callout */}
          <div className="mt-6 p-8 rounded-2xl bg-gradient-to-r from-cyan/10 to-card_bg border border-cyan/20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '10–50 μm', label: 'Velikost kapky' },
              { val: '< 2 s', label: 'Čas odpaření' },
              { val: '−9 °C', label: 'Max. ochlazení' },
              { val: '100%', label: 'Bez chemie' },
            ].map(s => (
              <div key={s.val} className="text-center">
                <p className="font-black text-2xl text-cyan">{s.val}</p>
                <p className="text-xs font-mono text-white/40 tracking-widest uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modules & accessories */}
      <div className="py-20 bg-ink">
       <div className="max-w-7xl mx-auto px-6 lg:px-8">
         <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Rozšíření & příslušenství</p>
         <h2 className="font-heading font-light text-3xl text-white mb-10">Doporučené moduly</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {product.modules.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden bg-card_bg border border-white/10 hover:border-cyan/30 transition-all group">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Check size={13} className="text-cyan" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{m.name}</p>
                    <p className="text-xs text-white/40">{m.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Realized projects */}
      <div className="py-20 bg-surface">
       <div className="max-w-7xl mx-auto px-6 lg:px-8">
         <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Realizace</p>
         <h2 className="font-heading font-light text-3xl text-white mb-10">Podobné realizované projekty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {product.projects.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-sm font-bold text-white">{p.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="py-20 bg-ink">
       <div className="max-w-7xl mx-auto px-6 lg:px-8">
         <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Mohlo by vás zajímat</p>
         <h2 className="font-heading font-light text-3xl text-white mb-10">Podobné produkty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {product.related.map((rSlug, i) => {
              const r = RELATED_META[rSlug];
              if (!r) return null;
              return (
                <motion.div key={rSlug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/produkt/${rSlug}`} className="group block rounded-2xl overflow-hidden bg-card_bg border border-white/10 hover:border-cyan/40 transition-all">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <span className="font-bold text-white group-hover:text-cyan transition-colors">{r.name}</span>
                      <ArrowRight size={16} className="text-white/30 group-hover:text-cyan transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-surface">
       <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
         <h2 className="font-heading font-light text-3xl lg:text-4xl text-white mb-4">
           Chcete {product.name} pro váš prostor?
         </h2>
          <p className="text-white/50 mb-8">Nezávazná poptávka, 3D vizualizace do 48 h, montáž za jeden den.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/kontakt"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
              ✦ Nezávazná poptávka <ArrowRight size={16} />
            </Link>
            <Link to="/kolekce"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all">
              <ArrowLeft size={16} /> Zpět na kolekci
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}