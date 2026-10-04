import React from 'react';

export default function PdFaq({ product }) {
  const explicitItems = Array.isArray(product?.faq_items)
    ? product.faq_items.filter((item) => item?.question && item?.answer)
    : [];
  const derivedItems = [
    product?.material && { question: `Z jakého materiálu je ${product.name}?`, answer: `${product.name} má v technických údajích uveden materiál: ${product.material}.` },
    product?.pressure && { question: `Jaký provozní tlak vyžaduje ${product.name}?`, answer: `U produktu ${product.name} je uveden provozní tlak ${product.pressure}. Finální nastavení se potvrzuje podle konkrétní konfigurace a místa instalace.` },
    product?.water_consumption && { question: `Jaká je spotřeba vody u ${product.name}?`, answer: `Uvedená spotřeba vody je ${product.water_consumption}. Skutečná spotřeba závisí na počtu trysek, tlaku a provozním režimu.` },
    product?.micron_size && { question: `Jak jemnou mlhu vytváří ${product.name}?`, answer: `Technický údaj pro tento produkt je ${product.micron_size}.` },
    product?.power_supply && { question: `Potřebuje ${product.name} elektrické napájení?`, answer: `Pro tento produkt je uvedeno: ${product.power_supply}. Přesné zapojení se potvrzuje podle zvoleného řízení.` },
  ].filter(Boolean);
  const items = explicitItems.length ? explicitItems : derivedItems.slice(0, 5);

  if (!items.length) return null;

  return (
    <section id="faq" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#0B97E8] sm:text-[11px]">FAQ · technické odpovědi</p>
        <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-[1.05] tracking-[-.03em] text-[#0A2342] sm:text-4xl">Nejčastější otázky k {product.name}.</h2>
        <div className="mt-8 divide-y divide-[#DCE8EF] border-y border-[#DCE8EF]">
          {items.map((item, index) => (
            <details key={`${item.question}-${index}`} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-heading text-lg font-semibold text-[#0A2342] marker:hidden">
                {item.question}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#0D2F4F]/68 sm:text-base">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
