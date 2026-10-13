export const SUPLA_OFFER = { base: 29639, shaft: 18900, withShaft: 48539, image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/34a09ac6b_generated_image.png' };

export function drawSuplaOfferPages(doc, c, { header, text, image, diagram, money }) {
  const ink = '#102f3a', cyan = '#27bdc5', pale = '#e7f4f4', yellow = '#fff3cf';
  const note = (value, y) => { doc.setFillColor(yellow); doc.rect(14, y, 182, 24, 'F'); text(doc, value, 19, y + 7, 172, 9, false, ink); };
  let y = header(doc, c, 'Chytre rizeni mlzeni SUPLA', 'VOLITELNE ROZSIRENI / WI-FI + MOBILNI APLIKACE');
  y = text(doc, 'Od manualniho spousteni k pohodlnemu provozu. Vyberte jednu ze dvou alternativ; automatizace neni soucasti zakladni ceny mlzitka.', 14, y, 182, 11, false, ink) + 8;
  note('SUPLA bez servisni sachty: 29 639 Kc bez DPH. SUPLA se servisni sachtou: 48 539 Kc bez DPH.', y); y += 32;
  image(doc, c.suplaImage, 14, y, 182, 96);
  text(doc, 'Ilustracni sestava: telefon, ridici jednotka, ventil a servisni box. Nejde o montazni dokumentaci ani presny seznam dodavaneho hardware.', 14, y + 102, 182, 8, false, ink);
  text(doc, 'Wi-Fi / internet  |  mobilni zapnuti a vypnuti  |  casove plany', 14, y + 122, 182, 12, true, ink);

  doc.addPage(); y = header(doc, c, 'Jedna vrstva pro bezny provoz,', 'automatizaci i servis.');
  const benefits = [
    ['Ovladani v aplikaci', 'Zapnuti a vypnuti mlzeni pres SUPLA pri dostupnem internetu.'],
    ['Provozni harmonogram', 'Casova okna a cykly podle skutecneho vyuziti zahrady nebo skolniho arealu.'],
    ['Pristup k technologii', 'Varianta se servisnim boxem usnadnuje kontrolu a sezonni udrzbu.'],
    ['Rozsireni podle projektu', 'Teplotni, pohybova a prutokova cidla pouze podle zvolene a potvrzene vybavy.']
  ];
  for (const [title, body] of benefits) { doc.setFillColor(pale); doc.rect(14, y, 182, 32, 'F'); text(doc, title, 20, y + 9, 169, 12, true, ink); text(doc, body, 20, y + 18, 168, 9, false, ink); y += 38; }
  note('Pred instalaci overime tlak a kvalitu vody, Wi-Fi signal, internet, bezpecne napajeni, umisteni elektroniky a moznost zazimovani.', y + 2);

  for (const shaft of [false, true]) {
    doc.addPage(); const total = shaft ? SUPLA_OFFER.withShaft : SUPLA_OFFER.base;
    y = header(doc, c, shaft ? 'Varianta B' : 'Varianta A', shaft ? 'Se servisni sachtou' : 'Bez servisni sachty');
    doc.setFillColor(yellow); doc.rect(14, y, 182, 29, 'F');
    text(doc, `${money(total)} bez DPH`, 20, y + 12, 170, 19, true, ink);
    text(doc, shaft ? '29 639 Kc rizeni + 18 900 Kc servisni sachta' : 'Cena rizeni SUPLA bez servisni sachty', 20, y + 22, 170, 9, false, ink); y += 39;
    diagram(doc, y, shaft); y += 52;
    const rows = [['Rizeni SUPLA / Wi-Fi / aplikace', SUPLA_OFFER.base], ...(shaft ? [['Servisni sachta / box', SUPLA_OFFER.shaft]] : [])];
    for (const [label, price] of rows) { doc.setFillColor(pale); doc.rect(14, y, 182, 18, 'F'); text(doc, label, 19, y + 11, 115, 10, false, ink); text(doc, money(price), 143, y + 11, 48, 11, true, ink); y += 21; }
    y = text(doc, `Automatizace celkem bez DPH: ${money(total)}`, 14, y + 5, 182, 13, true, ink) + 6;
    if (c.total > 0) y = text(doc, `Produkt + varianta ${shaft ? 'B' : 'A'}: ${money(c.total + total)} bez DPH`, 14, y, 182, 12, true, ink) + 9;
    y = text(doc, shaft ? 'Servisni pristup shora pro kontrolu, udrzbu a zazimovani. Pred realizaci overime odvodneni, ochranu proti zaplaveni a mrazu, unosnost umisteni a Wi-Fi signal.' : 'Pro instalaci do existujiciho chraneneho servisniho prostoru. Pred realizaci overime kryti elektroniky, bezpecne napajeni, pristup k ventilu a zimni odstaveni.', 14, y, 182, 10, false, ink) + 8;
    note('Ceny bez DPH. Volitelna alternativa, nikoli automaticky zapocteny doplnek. Doprava, vykopy, stavebni prace, montaz v miste a dalsi senzory nejsou v techto castkach zahrnuty.', Math.min(y, 253));
  }
}