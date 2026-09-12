// Mapa produktových řad na složky sdíleného disku MLŽNÝ DISK / 01_PRODUKTOVY_KATALOG
// Každá řada: Drive složka + slugy produktů, kterým se média přiřadí.

export const CATALOG_LINES = {
  bendy: { folderId: '1JwPiTtlROg6zD23V0caeUVm7NO0E_nHd', slugs: ['mlzitko-bendy', 'bendy-radius-s', 'bendy-radius-m', 'bendy-radius-l', 'bendy-field'] },
  steblo: { folderId: '1JwPiTtlROg6zD23V0caeUVm7NO0E_nHd', slugs: ['mlzitko-steblo', 'mlzitko-2-stebla', 'bendy-back-to-back', 'bendy-alej', 'brana-bendy', 'mlzitko-bendy-field'] },
  aura: { folderId: '1CKaaqf7wMwp5DWtbH0tqBDlVVHy0Czc4', slugs: ['aura-mlzitko', 'aura-duo'] },
  linea: { folderId: '15RH-7vaGhkDoOSB8UKj9Eybgj1n3BiZy', slugs: ['linea-mlzitko', 'linea-solo', 'linea-gate', 'linea-avenue'] },
  yarmist: { folderId: '1OtbstfDyf0yWodTet3asJfYPg-odzfNn', slugs: ['y-armist-tr60', 'y-armist-j70', 'ostrev-mlzitko'] },
  ostrev: { folderId: '1pQVR2pnM-UCvkKORGL4KFvwBhzH1PN0s', slugs: ['ostrev-city', 'mlzny-sloupost-ostrev'] },
  mrak: { folderId: '1NKKbz7H4a-BlnJc6-9AsujMqNRXALwed', slugs: ['mlzitko-mrak'] },
  teepee: { folderId: '1dirolGsk-D3qyDaImD9GW77w7j-DaJph', slugs: ['teepee'] },
  spirala: { folderId: '1DrG1Di5n7FH9IKgGMELydaDeiq5m1H20', slugs: ['mlzna-spirála'] },
  lizatko: { folderId: '1Evg3b3JirJVMaEZ6fQV8dxofSO6culMk', slugs: ['mlzitko-lizatko'] },
  kruh: { folderId: '1T6hv8BRWtNTOKAWR1xGspKgDIofL6bGk', slugs: ['mlzitko-kruh'] },
  mrkev: { folderId: '1WcwvVoL3vg-URkKqKdWQyV0QRQaIhHlT', slugs: ['mlzitko-mrkev'] },
  gate: { folderId: '1I2LyRvqAGYCuKNWpCI9ytoytta_Lsez4', slugs: ['mlzna-brana-gate'] },
  animal: { folderId: '1RuT7-h72ETzzYtxgSOG7_c4DMIf925zG', slugs: ['mlzitko-kapr', 'mlzitko-pav', 'mlzitko-volavka'] },
  flora: { folderId: '1SEd_ekFNC6T5sgtduYOATNYR9MsyyAUH', slugs: ['mlzitko-kvet-4'] },
  funny: { folderId: '1pxyuaNzgybcUw0wnxzrhcPnpe7NCIiYR', slugs: ['mlzitko-slunce'] },
};

// Složky, které se při procházení přeskočí (zdrojáky, výroba, nabídky)
export const SKIP_FOLDER_RE = /original|zdroj|vyroba|dilna|nabidk|cenov|dokument|katalog|tabul|kontakt/i;

// Klíčová slova ve jménu podsložky/souboru, podle kterých se odhadne role média
export function guessRole(pathName) {
  const s = pathName.toLowerCase();
  if (/video|\.mp4|\.mov/.test(s)) return 'video';
  if (/foto_real|real|instal|realiz|reference|test/.test(s)) return 'realization';
  if (/vizual|render|gemini|chatgpt|ai_/.test(s)) return 'render';
  if (/detail|tryska|makro/.test(s)) return 'detail';
  return 'gallery';
}