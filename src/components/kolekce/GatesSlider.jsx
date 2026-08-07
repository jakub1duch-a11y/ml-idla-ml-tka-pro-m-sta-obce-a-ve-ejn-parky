import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Building2, Factory, Tent, Palette } from 'lucide-react';
import GateSlideCard from '@/components/kolekce/GateSlideCard';

const USE_CASES = [
{ icon: Building2, title: 'Vstup na náměstí a do parku', desc: 'Mlžná brána jako dominanta veřejného prostoru — chladí a zdobí zároveň.' },
{ icon: Factory, title: 'Vjezd do obchodního centra', desc: 'Reprezentativní vstupní portál pro komerční a administrativní areály.' },
{ icon: Tent, title: 'Vstup na event či festival', desc: 'Rychlá montáž, výrazný zážitek pro návštěvníky v horkých letních měsících.' },
{ icon: Palette, title: 'Architektonická dominanta', desc: 'Custom rozměry a tvar navržené přesně dle projektové dokumentace.' }];


const B2G_LINKS = [
{ label: 'Města a obce', path: '/kategorie/mesta-obce' },
{ label: 'Komerční prostory', path: '/kategorie/komercni' },
{ label: 'Eventy & festivaly', path: '/kategorie/eventy' },
{ label: 'Pro architekty', path: '/kategorie/architekti' }];


const GATES = [
{
  name: 'GATE70',
  tagline: 'Vstupní mlžná brána',
  short_description: 'Designová mlžná brána z nerezové oceli AISI 316L — ochlazení až −9 °C bez kapek na zemi, smart Wi-Fi řízení.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png'
},
{
  name: 'LINEA CE70',
  tagline: 'Obloukový mlžný systém',
  short_description: 'Zakřivený obloukový design z nerezi AISI 316L — ikonická architektura pro náměstí, bazény a veřejné prostory.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/82914bed5_C-MlzitkoLINEA_CE70_couple1.png'
}];


export default function GatesSlider() {
  const scrollRef = useRef(null);
  const scrollBy = (amount) => scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return null;







































































}