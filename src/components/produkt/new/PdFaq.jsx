import React from 'react';

export default function PdFaq({ product }) {
  const items = Array.isArray(product?.faq_items)
    ? product.faq_items.filter((item) => item?.question && item?.answer)
    : [];

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
