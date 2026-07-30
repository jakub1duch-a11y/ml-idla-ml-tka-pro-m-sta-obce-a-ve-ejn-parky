export const MESSAGE_SIGNATURE = `S pozdravem,
tým technické podpory Mlžidla.cz

Ing. Radek Meduna
Tel.: +420 774 700 390
E-mail pro objednávku:
- meduna@holmtec.cz
- info@mlzidla.cz`;

export const withSignature = (text = '') => text.includes('tým technické podpory Mlžidla.cz')
  ? text.trim()
  : `${text.trim()}\n\n${MESSAGE_SIGNATURE}`.trim();