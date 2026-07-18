export const usageLinks = [
  ['Města a obce', 'Chladnější veřejný prostor.', '/vyuziti/mesta-obce'], ['Parky a hřiště', 'Bezpečné letní osvěžení.', '/vyuziti/parky-hriste'], ['Koupaliště a aquaparky', 'Komfort kolem vody.', '/vyuziti/koupaliste'], ['Pro architekty', 'Mlha jako materiál návrhu.', '/vyuziti/architekti'], ['Komerční prostory', 'Pohodlí, které podporuje provoz.', '/vyuziti/komercni'], ['Eventy a festivaly', 'Osvěžení, na které se vzpomíná.', '/vyuziti/eventy'], ['Outdoor a zahrady', 'Chladivá oáza venku.', '/vyuziti/outdoor-zahrady'], ['Art instalace', 'Zakázkové mlžné skulptury.', '/vyuziti/art-instalace'], ['Školy, školky a děti', 'Jemné a bezpečné ochlazení.', '/vyuziti/skoly-skolky-deti'],
];

export const benefitLinks = [
  ['Zvýšení tržeb a prodeje', 'Pro gastro, retail a eventy.', '/prinosy-mlzitek/zvyseni-trzeb-a-prodeje'], ['Automatizace provozu', 'SMART APP, meteočidla a eco režim.', '/prinosy-mlzitek/automatizace-provozu'], ['Zabezpečení a shoda', 'Hygiena, filtrace a dohled.', '/prinosy-mlzitek/zabezpeceni-a-shoda'], ['Nižší provozní náklady', 'Úspora vody, energie i času.', '/prinosy-mlzitek/snizovani-provoznich-nakladu'],
];

export const mobileNavigation = [
  { label: 'Jak mlžení funguje?', path: '/jak-funguje-mlzeni', links: [['SMART APP řízení', '/smart-ovladani'], ['UV-C filtrace a hygiena', '/prinosy-mlzitek/zabezpeceni-a-shoda']] },
  { label: 'Produkty', path: '/katalog' },
  { label: 'Přínosy mlžítek', path: '/prinosy-mlzitek', links: benefitLinks.map(([label, , path]) => [label, path]) },
  { label: 'Realizace', path: '/reference' },
  { label: 'Novinky', path: '/blog' },
  { label: 'Podpora a servis', path: '/podpora' },
  { label: 'Technické listy', path: '/ke-stazeni' },
  { label: 'Certifikace a kvalita', path: '/certifikace' },
  { label: 'B2B Partnerství', path: '/partnerstvi' },
  { label: 'Využití B2B', path: '/vyuziti', links: usageLinks.map(([label, , path]) => [label, path]) },
];