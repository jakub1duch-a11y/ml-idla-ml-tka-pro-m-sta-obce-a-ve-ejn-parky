// Modelová sazba vodného a stočného používaná poradcem MLŽIDLA.
export const WATER_PRICE_CZK_M3 = 129.11;

const format = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 });

function eightHourWaterStats(consumption) {
  const flow = String(consumption ?? '').trim().match(/^(\d+(?:[.,]\d+)?)(?:\s*[-–—]\s*(\d+(?:[.,]\d+)?))?\s*l\s*\/\s*(hod|min|h)\b(?:\s*\([^()]*\)|\s+dle\s+[^0-9]+)?$/i);
  if (!flow) return null;

  const minimum = Number(flow[1].replace(',', '.'));
  const maximum = flow[2] ? Number(flow[2].replace(',', '.')) : minimum;
  if (maximum < minimum) return null;

  const hoursToUnit = flow[3].toLowerCase() === 'min' ? 60 : 1;
  const litres = (rate) => rate * hoursToUnit * 8;
  const range = (convert) => minimum === maximum ? format.format(convert(minimum)) : `${format.format(convert(minimum))}–${format.format(convert(maximum))}`;
  return { litres: range(litres), cost: range((rate) => litres(rate) / 1000 * WATER_PRICE_CZK_M3) };
}

export function eightHourWaterCost(consumption) {
  return eightHourWaterStats(consumption)?.cost || null;
}

export function eightHourWaterConsumption(consumption) {
  return eightHourWaterStats(consumption)?.litres || null;
}