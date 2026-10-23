const photo = key => `https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/${key}_generated_image.png`;
const TOPICS = [
  ['konstrukce', 'KONSTRUKCE', 'usazení mlžítka v přesné geometrii', 'Koncept usazení, nikoli výrobní výkres. Základ, kotvy a přívod vody musí určit technický návrh.'],
  ['material', 'MATERIÁL', 'struktury nerezového povrchu', 'Vizualizace povrchu není materiálový certifikát. Konkrétní povrchovou úpravu potvrdíme pro objednané provedení.'],
  ['svar-ohyb', 'SVÁR A OHYB', 'ohybů a svarového spoje', 'Vzhled a poloha svaru jsou ilustrační, nikoli doložený detail konkrétního výrobku.'],
  ['automaticke-rizeni', 'INSTALACE A AUTOMATIKA', 'mlžítka bez technických prvků v záběru', 'Automatika nenahrazuje pravidelné kontroly, hygienu vody, servis a zazimování. Přívod vody, napájení a krytí posoudí odborník.'],
  ['osazeni', 'TRYSKY A SPOTŘEBA', 'produktového osazení s mlhou', 'AI obrázek ilustruje vzhled, nikoli přesnou polohu nebo počet trysek. Katalogový počet je uveden v číselném schématu pod obrázkem.'],
  ['vyroba', 'VÝROBA', 'dílenské kontroly', 'Ilustrační výrobní prostředí, nikoli dokumentární fotografie vlastní dílny nebo skutečné kontroly výrobku.'],
  ['detail-mlhy', 'VODNÍ MLHA', 'trysky s jemnými kapkami', 'Vzhled mlhy není měřením velikosti kapek ani zárukou konkrétního teplotního poklesu.'],
  ['komfort-lidi', 'KOMFORT LIDÍ', 'pobytu lidí u mlžítka', 'Návrhová vizualizace s lidmi, nikoli fotografie skutečné zakázky. Umístění a provozní režim vyžadují posouzení konkrétního místa.'],
];
export default function detailSeriesContent({ name, prefix, images, titles, shape, material, comfort, technicalImage }) {
  const texts = [
    `${shape} Tvar vychází z hlavní produktové fotografie; usazení se navrhuje s ohledem na podloží, povrch, přívod vody a přístup pro údržbu.`,
    `Produktové podklady uvádějí ${material}. Detail přibližuje povrch a jeho odlesky; vzhled není náhradou technické specifikace. Pravidelná péče pomáhá zachovat čistý povrch.`,
    `${shape} U spoje a ohybu je důležitá návaznost povrchů, přesnost provedení a servisní přístup. Přesné konstrukční řešení se potvrzuje před výrobou.`,
    'Volitelné chytré řízení může spouštět vodní zónu podle časového plánu a nastavených cyklů. S kompatibilním čidlem lze přidat teplotní podmínku. Technické zázemí navrhujeme mimo mlžítko, aby nerušilo jeho tvar ani architekturu místa.',
    'Osazení a výpočet oddělujeme od ilustračního obrázku. Níže je uveden počet trysek z katalogových podkladů a modelová spotřeba vody pro konkrétní provedení.',
    'Před výrobou se potvrzují rozměry, provedení, počet trysek a způsob kotvení. Kontrola povrchů a návazností patří k přípravě prvku, který má obstát vzhledem i praktičností.',
    'Jemný rozptyl vody vyniká v protisvětle. Jeho skutečnou podobu v prostoru ovlivňuje typ trysek, tlak, vítr, teplota a vlhkost vzduchu.',
    `${comfort} Mlha doplňuje stín, zeleň a místa k sezení. Umístění musí respektovat pěší trasy a umožnit bezpečný průchod.`,
  ];
  const technical = technicalImage ? {
    image: technicalImage,
    label: 'TECHNICKÉ ZÁZEMÍ MIMO MLŽÍTKO',
    alt: `${name} · AI vizualizace samostatné podzemní šachty s výkopem a přívody`,
    caption: 'Samostatná ilustrace: podzemní šachta s výkopem, přívod vody s filtrem a uzavíracím ventilem, elektrické vedení v oddělené chráničce a kryté řízení nad vodní hladinou. Technické prvky záměrně nestojí u mlžítka, aby nerušily jeho estetiku ani architekturu místa. Návrhové schéma, nikoli návod k zapojení.',
  } : null;
  return TOPICS.map(([id, topic, subject, note], i) => ({ id, prefix, eyebrow: `${String(i + 1).padStart(2, '0')} / ${topic}`, title: titles[i], image: photo(images[i]), alt: `${name} · AI vizualizace ${subject}`, text: texts[i], note, technical: id === 'automaticke-rizeni' ? technical : null }));
}