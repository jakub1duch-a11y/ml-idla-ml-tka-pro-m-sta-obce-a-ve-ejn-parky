// Varianty obrazových nabídek: ceny jsou z centrálního ceníku (ProductOfferProfile / Kalkulace 2026),
// fotografie jsou originály z Mlžného disku nebo katalogu, bez AI překreslení konstrukce.
export const VARIANTS = [
  { key: 'mrak-2424', title: 'MLŽNÝ MRAK 2424', subtitle: 'Klasický MRAK · doporučené řešení', slug: 'mlzitko-mrak', profileKey: 'MRAK H1600', fixedPrice: 72200, driveFiles: ['1dEX1K4GDx1VKBVJx1nBCJDsdaqbhHJKR'], spec: [['Výška', 'H1600'], ['Profil', 'TR40×3'], ['Provedení', '9× R93']], recommended: true },
  { key: 'mrak-1414', title: 'MLŽNÝ MRAK 1414', subtitle: 'Menší tvarová varianta MRAKU', slug: 'mlzitko-mrak-1414', fixedPrice: 0, driveFiles: ['1saDqN3I7w3Ny_MPK9sgRXRBJewEErbw-', '1W7pELD1L6vnOaz1wAhSz1oNjLaTX3C9F'], spec: [['Typ', 'MRAK 1414'], ['Materiál', 'Nerezová ocel'], ['Cena', 'dle potvrzeného podkladu']], priceFromOrderAlternative: true },
  { key: 'aura-garden', title: 'MLŽÍTKO AURA GARDEN', subtitle: 'Kruhová hlavice pro zahrady a terasy', slug: 'aura-mlzitko', profileKey: 'AURA_700', driveFiles: ['1WM-HfvNzGvSQyOwMUjUaG3QpNp8Og3m7'], spec: [['Profil', 'TR42×3'], ['Rádius / výška', 'R750 / H2200'], ['Tlak', '2–5 bar']] },
  { key: 'lizatko', title: 'MLŽNÉ LÍZÁTKO', subtitle: 'Kruhový motiv pro pobytové zóny', slug: 'mlzitko-lizatko', profileKey: 'LÍZÁTKO', driveFiles: ['1gw-fMJSoo1b8xEBhKqWitWRoX_7ZBcj_'], spec: [['Profil', 'TR42×3'], ['Výška / průměr', 'H1600 / D700'], ['Povrch', 'saténový brus']] },
  { key: 'linea-trubka', title: 'LINEA · trubkový sloupek', subtitle: 'Rovné sloupkové mlžítko, kulatý profil', slug: 'linea-mlzitko', profileKey: 'LINEA CE70', driveFiles: [], catalogImage: true, spec: [['Profil', 'trubka TR40–60'], ['Provedení', 'rovný sloupek'], ['Tlak', '2–8 bar']], priceNote: 'Cena trubkového provedení se potvrzuje dle zvoleného profilu.' },
  { key: 'linea-jekl', title: 'LINEA · jekl 4hran', subtitle: 'Rovné sloupkové mlžítko, hranatý profil', slug: 'linea-mlzitko', profileKey: 'LINEA CE70', driveFiles: ['1i2V6HG9jTPjyCaCQ9f2fiTwNX4b9038p'], spec: [['Profil', 'jekl 70×70×3'], ['Výška', 'H1800'], ['Provedení', 'hranatý sloupek']] },
  { key: 'bendy', title: 'MLŽÍTKO BENDY', subtitle: 'Ikonický ohyb pro zahradu i město', slug: 'mlzitko-bendy', profileKey: 'BENDY_60', driveFiles: [], catalogImage: true, spec: [['Trubka', 'TR60×2 / 70×2'], ['Trysky', '2 ks'], ['Tlak', '2–8 bar']] },
];

export const PRICE_ALIASES: Record<string, string> = {
  'MRAK H1600': 'mlzitko-mrak', AURA_700: 'aura-mlzitko', 'LÍZÁTKO': 'mlzitko-lizatko', 'LINEA CE70': 'linea-mlzitko', BENDY_60: 'mlzitko-bendy',
};