export const MESSAGE_SIGNATURE = `S pozdravem a přáním klidného dne,

Ing. Radek Meduna
MLŽIDLA® · HolmTec s.r.o.
Tel.: +420 774 700 390
meduna@holmtec.cz · info@mlzidla.cz
mlzidla.cz`;

export const withSignature = (text = '') => text.includes('Ing. Radek Meduna')
  ? text.trim()
  : `${text.trim()}\n\n${MESSAGE_SIGNATURE}`.trim();