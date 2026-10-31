// Modelová sazba vodného a stočného používaná poradcem MLŽIDLA.
export const WATER_PRICE_CZK_M3 = 129.11;

const format = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 });

export function eightHourWaterCost(consumption) {
  const flow = String(consumption ?? '').trim().match(/^(\d+(?:[.,]\d+)?)(?:\s*[-–—]\s*(\d+(?:[.,]\d+)?))?\s*l\s*\/\s*(hod|min|h)\b(?:\s*\([^()]*\)|\s+dle\s+[^0-9]+)?$/i);
  if (!flow) return null;

  const minimum = Number(flow[1].replace(',', '.'));
  const maximum = flow[2] ? Number(flow[2].replace(',', '.')) : minimum;
  if (maximum < minimum) return null;

  const hoursToUnit = flow[3].toLowerCase() === 'min' ? 60 : 1;
  const cost = (rate) => format.format(rate * hoursToUnit * 8 / 1000 * WATER_PRICE_CZK_M3);
  return minimum === maximum ? cost(minimum) : `${cost(minimum)}–${cost(maximum)}`;
}
