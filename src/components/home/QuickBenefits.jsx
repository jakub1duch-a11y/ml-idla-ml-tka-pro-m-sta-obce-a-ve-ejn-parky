import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CoolingCardEffect from '@/components/home/CoolingCardEffect';
import { ArrowRight, Building2, Cloud, Cog, Droplets, Leaf, PencilRuler, ShieldCheck, ThermometerSnowflake, Truck, Utensils, Wind, Wrench } from 'lucide-react';

export const QUICK_BENEFITS = [
  { icon: Droplets, value: 'Úsporné nízkotlaké mlžení', text: 'Jemná vodní mlha ochlazuje prostor s minimální spotřebou vody.', detail: 'Pracovní tlak 2–8 bar · cílené mlžení bez mokrého efektu' },
  { icon: ThermometerSnowflake, value: 'Ochlazení až o 12 °C', text: 'Okamžitá úleva pro terasy, parky i frekventovaný veřejný prostor.', detail: 'Pocitové ochlazení v aktivní zóně · okamžitý efekt', to: '/vyuziti' },
  { icon: Leaf, value: 'Ekologické ochlazení', text: 'Příjemnější mikroklima bez klimatizace a bez mokrého efektu.', detail: 'Voda se mění na jemnou mlhu · bez energeticky náročné klimatizace' },
  { icon: Cloud, value: 'Jemná mlha 50–100 μm', text: 'Jemné kapénky vytvářejí viditelný osvěžující oblak.', detail: 'Kapénky 50–100 μm · rovnoměrné rozprostření v prostoru' },
  { icon: Cog, value: 'Nerezová konstrukce', text: 'Precizní komponenty navržené pro dlouhodobý provoz.', detail: 'Nerez AISI 316L · odolné provedení pro venkovní použití' },
  { icon: ShieldCheck, value: 'Bezpečný provoz', text: 'Promyšlené řešení pro veřejný prostor.', detail: 'Navrženo pro pohyb lidí · komfortní a přehledná instalace' },
  { icon: Wrench, value: 'Servis a údržba', text: 'Dostupná péče pro spolehlivý provoz v každé sezóně.', detail: 'Sezónní kontrola · snadná údržba systému' },
  { icon: Truck, value: 'Montáž po celé ČR', text: 'Dodávka a instalace po celé zemi.', detail: 'Návrh, dodávka i odborná montáž na jednom místě' },
  { icon: Building2, value: 'Pro města a obce', text: 'Nová vrstva letního komfortu pro veřejný prostor.', detail: 'Parky, pěší zóny i náměstí · řešení na míru místu', to: '/vyuziti/mesta-obce' },
  { icon: Utensils, value: 'Restaurace a terasy', text: 'Příjemnější pobyt ve slunečném prostoru.', detail: 'Více komfortu pro hosty · příjemnější letní provoz', to: '/vyuziti/hotely' },
  { icon: PencilRuler, value: 'Zakázková výroba', text: 'Přesné řešení na míru konkrétnímu místu.', detail: 'Tvar, rozsah i rozmístění podle prostoru' },
  { icon: Wind, value: 'Okamžité osvěžení', text: 'Jemná mlha se rozprostře do okolního prostoru.', detail: 'Aktivace během okamžiku · viditelný mlžný efekt' },
];

export default function QuickBenefits({ className = '', compact = false, limit, enableCooling = false }) {
  const benefits = limit ? QUICK_BENEFITS.slice(0, limit) : QUICK_BENEFITS;
  const [coolingIndex] = useState(() => Math.floor(Math.random() * benefits.length));
  const [openIndex, setOpenIndex] = useState(null);
 </div>;
}