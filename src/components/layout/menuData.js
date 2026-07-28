export const usageLinks = [
  ['Města a obce', 'Chladnější veřejný prostor.', '/vyuziti/mesta-obce'], ['Parky a hřiště', 'Bezpečné letní osvěžení.', '/vyuziti/parky-hriste'], ['Školy, školky a děti', 'Bezpečné ochlazení dětí.', '/vyuziti/skoly-skolky-deti'], ['Domovy seniorů', 'Komfort během veder.', '/vyuziti/domovy-senioru'], ['Hotely', 'Komfort pro hotelové hosty.', '/vyuziti/hotely'], ['Wellness terasy', 'Osvěžení spa zón.', '/vyuziti/wellness-terasy'], ['Koupaliště a aquaparky', 'Komfort kolem vody.', '/vyuziti/koupaliste'], ['Pro architekty', 'Mlha jako materiál návrhu.', '/vyuziti/architekti'], ['Komerční prostory', 'Pohodlí, které podporuje provoz.', '/vyuziti/komercni'], ['Eventy a festivaly', 'Osvěžení, na které se vzpomíná.', '/vyuziti/eventy'], ['Outdoor a zahrady', 'Chladivá oáza venku.', '/vyuziti/outdoor-zahrady'], ['Art instalace', 'Zakázkové mlžné skulptury.', '/vyuziti/art-instalace'], 
];

export const benefitLinks = [
  ['Zvýšení tržeb a prodeje', 'Pro gastro, retail a eventy.', '/prinosy-mlzitek/zvyseni-trzeb-a-prodeje'], ['Automatizace provozu', 'SMART APP, meteočidla a eco režim.', '/prinosy-mlzitek/automatizace-provozu'], ['Zabezpečení a shoda', 'Hygiena, filtrace a dohled.', '/prinosy-mlzitek/zabezpeceni-a-shoda'], ['Nižší provozní náklady', 'Úspora vody, energie i času.', '/prinosy-mlzitek/snizovani-provoznich-nakladu'],
];

export const mobileNavigation = [
  { label: 'Produkty a řešení', path: '/katalog', links: [['Designová architektonická mlžítka', '/reseni/designova'], ['Vstupní a uvítací mlžné brány', '/reseni/brany'], ['Chytré moduly a příslušenství', '/reseni/chytre-moduly'], ['Mobilní eventová mlžítka', '/reseni/mobilni-eventove']] },
  { label: 'Využití', path: '/vyuziti', links: usageLinks.map(([label, , path]) => [label, path]) },
  { label: 'Technologie a chytré řízení', path: '/jak-funguje-mlzeni', links: [['Jak funguje mlžení', '/jak-funguje-mlzeni'], ['Chytré řízení', '/chytra-mlzidla'], ['Smart ovládání', '/smart-ovladani']] },
  { label: 'Přínosy mlžítek', path: '/prinosy-mlzitek', links: benefitLinks.map(([label, , path]) => [label, path]) },
  { label: 'Realizace', path: '/reference' },
  { label: 'Inspirace', path: '/blog' },
  { label: 'Podpora a servis', path: '/podpora', links: [['Produktový poradce', '/poradce'], ['O nás', '/o-nas'], ['Výhody mlžítek', '/vyhody'], ['Nejčastější dotazy', '/faq'], ['Technické listy', '/ke-stazeni'], ['Servis a údržba', '/servis-udrzba'], ['Video ukázky', '/videosekce-mlzitka'], ['Certifikace', '/certifikace'], ['Kalkulačka nákladů', '/kalkulacka']] },
  { label: 'B2B partnerství', path: '/partnerstvi', links: [['Pro města a obce', '/vyuziti/mesta-obce'], ['Parky a hřiště', '/vyuziti/parky-hriste'], ['Školy, školky a děti', '/vyuziti/skoly-skolky-deti'], ['Domovy seniorů', '/vyuziti/domovy-senioru'], ['Hotely', '/vyuziti/hotely'], ['Wellness terasy', '/vyuziti/wellness-terasy']] },
];