import React from 'react';

export default function PdFaq({ product }) {
  const explicitItems = Array.isArray(product?.faq_items)
    ? product.faq_items.filter((item) => item?.question && item?.answer)
    : [];
  const derivedItems = [
    { question: 'Co potřebujete pro návrh instalace?', answer: 'Pošlete fotografii místa, typ povrchu a informaci o dostupnosti vody. Podle zvolené varianty upřesníme kotvení, připojení a stavební připravenost.' },
    { question: 'Lze mlžení ovládat automaticky?', answer: 'HolmTec a Mlžidla.cz mohou navrhnout řízení od zahradní varianty po městský systém. Časové scénáře a případná čidla se vybírají podle provozu; řízení není automaticky součástí základní dodávky.' },
    { question: 'Jak vybrat vhodné provedení?', answer: 'Do poptávky uveďte zamýšlené využití a zda má být instalace stálá nebo přenosná. Ověříme vhodnou variantu konkrétního produktu a dostupné příslušenství.' },
    { question: 'Bude mlžítko smáčet zem?', answer: 'Za horkého a suchého počasí se jemná mlha zpravidla rychleji odpařuje. Při vyšší vlhkosti, nižší teplotě, nevhodném směru trysek nebo intenzivním provozu však mohou povrchy zvlhnout. Suchý povrch nelze garantovat za všech podmínek.' },
    { question: 'Jak daleko od stolů a laviček mlžítko umístit?', answer: 'Nízkotlaká mlžítka zpravidla nedoporučujeme přímo mezi stoly a lavičky. Vítr může mlhu přenášet i několik metrů, proto nelze určit jednu univerzální vzdálenost. Konkrétní umístění doporučíme podle fotografie, orientace prostoru, směru trysek a provozních podmínek.' },
  ];
  const siteQuestions = derivedItems.slice(3);
  const items = [...(explicitItems.length ? explicitItems : derivedItems.slice(0, 3)),
    ...siteQuestions.filter((item) => !explicitItems.some((existing) =>
      /smáčet|smáčení|mokr|vzdálen|stol|lavič|odpař|vítr/i.test(existing.question) &&
      (/smáčet|smáčení|mokr|odpař/i.test(item.question) ? /smáčet|smáčení|mokr|odpař/i.test(existing.question) : /vzdálen|stol|lavič|vítr/i.test(existing.question))
    ))];

  if (!items.length) return null;

  return (
    <section id="faq" className="scroll-mt-36 bg-white py-16 lg:py-24">
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