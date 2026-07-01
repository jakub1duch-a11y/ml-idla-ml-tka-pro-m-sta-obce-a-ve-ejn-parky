import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
{
  tag: 'Města a obce',
  title: 'Mlžné sochy pro veřejný prostor',
  desc: 'Zakázkové mlžítko MRKEV zdobí náměstí města Polná — spojuje lokální identitu s příjemným ochlazením pro chodce v horkých letních dnech.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/596fefdec_MlnsochaMRKEV-mstoPoln.jpg',
  path: '/kategorie/mesta-obce'
},
{
  tag: 'Parky a hřiště',
  title: 'Bezpečné mlžení pro dětská hřiště',
  desc: 'Interaktivní mlžné prvky pro parky a mateřské školy. Potravinářská nerez, bez chemie — jen radost a osvěžení pro nejmenší.',
  image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg',
  path: '/kategorie/parky-hriste'
},
{
  tag: 'Eventy & festivaly',
  title: 'Mlžení pro festivaly a venkovní akce',
  desc: 'Y-ARMIST a mobilní mlžné rámy chladí davy návštěvníků na festivalech a sportovních areálech — vysoký výkon, snadná instalace.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3063e3653_MlzitkoY-ARMISTTR60_3.png',
  path: '/kategorie/eventy'
},
{
  tag: 'Komerční prostory',
  title: 'Elegantní mlžítka pro exkluzivní interiéry',
  desc: 'Mlžítko AURA v nerezovém provedení doplňuje prostory hotelů, restaurací i domovů pro seniory — tichý, funkční a designový prvek.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3ffb5387e_mlzitkoprodomovsenioru-2.jpeg',
  path: '/kategorie/komercni'
},
{
  tag: 'Koupaliště & aquaparky',
  title: 'Mlžné brány pro rekreační areály',
  desc: 'Designová mlžná brána GATE70 z nerezi AISI 316L ochlazuje vstupy koupališť a aquaparků až o −9 °C bez kapek na zemi.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a116eb0b_mlnbranaGATE70U-mlzitkapromesta.png',
  path: '/kategorie/koupaliste'
},
{
  tag: 'Pro architekty',
  title: 'Zakázkový design a CAD podklady',
  desc: 'Od skici po realizaci — mlžné sochy na míru s kompletní technickou dokumentací pro architektonické a urbanistické studie.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2dcd39f66_MRKEV_rozkres1.png',
  path: '/kategorie/architekti'
}];


export default function CategorySlider() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((idx) => setCurrent(idx), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % categories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const cat = categories[current];

  return null;










































































}