import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Droplet,
  Filter,
  SlidersHorizontal,
  SprayCan,
  Wind,
  ThermometerSun,
  Waves,
  Ruler,
  Gauge,
  CloudSun,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { setSEO } from '@/lib/seo';
import BenefitsSlider from '@/components/technologie/BenefitsSlider';
import AnatomySection from '@/components/technologie/AnatomySection';
import SmartManagementSection from '@/components/technologie/SmartManagementSection';
import FormFunctionSection from '@/components/technologie/FormFunctionSection';
import IntegrationSection from '@/components/technologie/IntegrationSection';
import ProcessSection from '@/components/technologie/ProcessSection';
import InstallationComparisonSection from '@/components/technologie/InstallationComparisonSection';
import ContextLinks from '@/components/common/ContextLinks';

const FLOW = [
  { icon: Droplet, num: '01', title: 'Voda', text: 'Napojení na vodovodní řád podle požadavků konkrétního modelu a projektu.' },
  { icon: Filter, num: '02', title: 'Filtrace', text: 'Filtrace chrání trysky a pomáhá udržet systém dlouhodobě servisovatelný.' },
  { icon: SlidersHorizontal, num: '03', title: 'Řízení', text: 'Ventil a volitelné smart řízení určují, kdy a jak dlouho systém pracuje.' },
  { icon: SprayCan, num: '04', title: 'Tryska', text: 'Tryska rozděluje vodu na jemné kapky. Její charakteristika se páruje s tlakem a průtokem.' },
  { icon: Wind, num: '05', title: 'Mlha', text: 'Kapky se rozptýlí do okolního vzduchu podle směru trysky, výšky a proudění.' },
  { icon: ThermometerSun, num: '06', title: 'Odpar', text: 'Při odpařování voda spotřebovává teplo z okolí a lokálně zlepšuje tepelný komfort.' },
];

const FACTORS = [
  { icon: ThermometerSun, title: 'Teplota vzduchu', text: 'Vyšší teplota obvykle vytváří větší potenciál pro evaporační ochlazení.' },
  { icon: CloudSun, title: 'Relativní vlhkost', text: 'Čím sušší vzduch, tím snáze se voda odpařuje. Ve vysoké vlhkosti je účinek odparu menší.' },
  { icon: Wind, title: 'Proudění vzduchu', text: 'Vítr a lokální proudění rozhodují, kde se mlha skutečně pohybuje a jak dlouho v zóně zůstává.' },
  { icon: Ruler, title: 'Výška a rozmístění', text: 'Rozteč, orientace a výška trysek se navrhují podle pohybu lidí a geometrie prostoru.' },
  { icon: Gauge, title: 'Tryska, tlak a průtok', text: 'Charakter mlhy vzniká kombinací konkrétní trysky a dostupných hydraulických podmínek.' },
  { icon: SlidersHorizontal, title: 'Řízení provozu', text: 'Délka cyklu a podmínky spínání pomáhají vyvažovat komfort, spotřebu a provozní režim.' },
];

const SYSTEM = [
  { icon: Droplet, title: 'Přívod vody', text: 'Projektově řešené napojení a uzavírací prvky.' },
  { icon: Filter, title: 'Filtrace', text: 'Ochrana trysek a stabilnější provoz.' },
  { icon: SlidersHorizontal, title: 'Ventil a řízení', text: 'Od manuálního spínání po automatizaci a více zón.' },
  { icon: Waves, title: 'Rozvod', text: 'Skrytý nebo integrovaný rozvod podle typu výrobku.' },
  { icon: SprayCan, title: 'Mlžicí trysky', text: 'Konfigurace podle modelu, tlaku a požadované zóny.' },
  { icon: Wrench, title: 'Servisní režim', text: 'Přístup k filtraci, proplachu a výměně servisních dílů.' },
];

export default function Technologie() {
  useEffect(() => {
    setSEO({
      title: 'Jak funguje mlžení | Technologie MLŽIDLA®',
      description: 'Jak funguje nízkotlaké mlžení MLŽIDLA®: voda, filtrace, řízení, trysky, odpar, smart provoz a projektové dimenzování bez vysokotlakého čerpadla.',
      keywords: 'jak funguje mlžení, technologie mlžení, nízkotlaké mlžítko, evaporační chlazení, mlžné trysky, mlžítka bez vysokotlakého čerpadla',
      canonicalPath: '/jak-to-funguje',
    });
  }, []);

  return (
    <main className="min-h-screen bg-background pb-20 text-foreground">
      <section className="relative min-h-[700px] overflow-hidden bg-primary text-white lg:min-h-[760px]">
        <img
          src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ccf06b29a_mlzidla-mlzitka-pro-mesta-obce.webp"
          alt="Nízkotlaké mlžítko ve veřejném prostoru"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/88 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-primary/15" />

        <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-end px-6 pb-16 pt-28 lg:min-h-[760px] lg:px-10 lg:pb-20">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="font-mono text-[11px] uppercase tracking-[.2em] text-accent"
            >
              Jak to funguje / Technologie mlžení
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-5 max-w-4xl font-heading text-5xl leading-[.98] tracking-[-.04em] sm:text-6xl lg:text-8xl"
            >
              Jak funguje nízkotlaká mlha.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-7 max-w-2xl text-lg leading-8 text-white/75 lg:text-xl"
            >
              Voda z řádu projde filtrací a řízením do přesně zvolených trysek. Jemné kapky se v kontaktu se vzduchem částečně odpařují a při odparu odebírají okolí teplo. Nízkotlaké řady MLŽIDLA® tak pracují bez vysokotlakého čerpadla.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {['Vodovodní řád', 'Filtrace', 'Řízení', 'Trysky', 'Evaporace'].map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-white/[.07] px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur-sm">{item}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Princip v 6 krocích</p>
            <h2 className="mt-4 font-heading text-4xl leading-[1.04] tracking-[-.03em] lg:text-5xl">Od vody v potrubí k příjemnější pobytové zóně.</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Technologie není jen tryska. Stabilní výsledek vzniká až propojením přívodu vody, filtrace, hydrauliky, správného rozmístění a provozního řízení.</p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {FLOW.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="relative min-h-[220px] bg-card p-6"
              >
                <span className="absolute right-5 top-5 font-mono text-[10px] tracking-[.14em] text-muted-foreground/55">{step.num}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-secondary">
                  <step.icon size={18} />
                </div>
                <h3 className="mt-8 font-heading text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <BenefitsSlider />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-12 max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Co rozhoduje o výsledku</p>
          <h2 className="mt-4 font-heading text-4xl leading-[1.04] tracking-[-.03em] lg:text-5xl">Účinek mlžení není jedno univerzální číslo.</h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">Evaporační chlazení je citlivé na okolní podmínky. Proto u projektu neřešíme pouze počet trysek, ale celý prostor a způsob jeho používání.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FACTORS.map((factor, index) => (
            <motion.article
              key={factor.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.42, delay: index * 0.045 }}
              className="rounded-2xl border border-border bg-card p-6 lg:p-7"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-secondary"><factor.icon size={17} /></div>
              <h3 className="mt-5 font-heading text-2xl">{factor.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{factor.text}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-secondary/25 bg-secondary/[.055] p-7 sm:p-9">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-secondary">Projektový princip</p>
          <p className="mt-3 max-w-4xl font-heading text-2xl leading-snug sm:text-3xl">Neprodáváme „−10 °C“ jako univerzální parametr. Navrhujeme mlžení tak, aby odpovídalo reálnému místu, klimatu, pohybu lidí a dostupné hydraulice.</p>
        </div>
      </section>

      <section className="border-y border-border bg-muted/35 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Co systém obsahuje</p>
              <h2 className="mt-4 font-heading text-4xl leading-[1.04] tracking-[-.03em] lg:text-5xl">Technologie od přípojky až po servis.</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Konkrétní sestava se liší podle produktu, počtu zón, vody, kotvení a požadované úrovně automatizace.</p>
              <Link to="/smart-ovladani" className="btn-secondary-outline mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">Chytré řízení <ArrowRight size={15} /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {SYSTEM.map((item, index) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.045 }} className="rounded-2xl border border-border bg-background p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-secondary"><item.icon size={17} /></div>
                    <div><h3 className="font-heading text-xl">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnatomySection />
      <SmartManagementSection />
      <FormFunctionSection />
      <IntegrationSection />
      <ProcessSection />
      <InstallationComparisonSection />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-6 rounded-3xl border border-border bg-card p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-4">
            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-secondary"><ShieldCheck size={19} /></div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-secondary">Voda, hygiena a provoz</p>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl">Aerosolový systém potřebuje promyšlený provozní režim.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">U veřejných a citlivých instalací řešíme kvalitu vody, filtraci, omezení stagnace, proplach, sezónní odstávku a servisní přístup podle charakteru projektu a místních požadavků.</p>
            </div>
          </div>
          <Link to="/ochrana-zdravi" className="btn-secondary-outline inline-flex h-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">Hygiena a údržba <ArrowRight size={15} /></Link>
        </div>
      </section>

      <ContextLinks eyebrow="Další krok" title="Od principu mlžení k výběru a provozu systému." items={[
        { path: '/mestske-mlzitka', kicker: 'Výběr řešení', title: 'Městská mlžítka', text: 'Produkty pro veřejný prostor, parky, náměstí a sportoviště.' },
        { path: '/smart-ovladani', kicker: 'Automatizace', title: 'Chytré ovládání', text: 'Čas, teplota, volitelné senzory a vzdálená správa podle konfigurace.' },
        { path: '/ochrana-zdravi', kicker: 'Hygiena', title: 'Ochrana zdraví', text: 'Voda, proplach, údržba a provozní režim veřejných instalací.' },
        { path: '/vyhody', kicker: 'Přínosy', title: 'Výhody a benefity', text: 'Co správně navržené mlžení přináší uživatelům a prostoru.' },
        { path: '/udrzitelnost', kicker: 'Mikroklima', title: 'Udržitelnost', text: 'Spotřeba vody, materiály a dlouhodobý provoz v městském klimatu.' },
        { path: '/reference', kicker: 'Praxe', title: 'Reference', text: 'Reálné realizace a konkrétní použití technologie.' },
      ]} />

      <div className="mx-auto mt-14 flex max-w-7xl justify-start px-6 lg:px-10">
        <Link to="/poptavka" className="btn-metallic-mist px-8 py-3 text-sm font-bold">Navrhnout řešení pro můj prostor <ArrowRight size={16} /></Link>
      </div>
    </main>
  );
}
