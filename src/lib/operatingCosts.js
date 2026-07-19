export const WATER_RATE_WITH_SEWER = 129.11;
export const FLOW_PER_NOZZLE_4_BAR = 7.2;
export const HOURS_PER_DAY = 8;
export const ACCESSORY_CATEGORY_ID = '6a5119a4abdfd991c476d9fc';

const NOZZLE_COUNTS = {
  aura: 1, 'gate-60-76': 5, gate70: 5, 'bendy-60': 2,
  'y-armist-tr60': 3, 'y-armist-j70': 3, 'linea-el70': 4,
  mrak: 1, spirala: 1, 'linea-40-60': 1, Lizatko: 1,
  'ostrev-mlzitko': 7,
};

export const isMistingProduct = (product) => product?.category_id !== ACCESSORY_CATEGORY_ID && Boolean(product?.slug);

export function getNozzleCount(product) {
  const stated = Number(`${product?.micron_size || ''} ${product?.water_consumption || ''}`.match(/(\d+)\s*trysk/i)?.[1]);
  return NOZZLE_COUNTS[product?.slug] || stated || 1;
}

export function calculateOperatingCosts(nozzles, seasonDays = 120) {
  const hourlyLiters = nozzles * FLOW_PER_NOZZLE_4_BAR;
  const build = (hours) => {
    const liters = hourlyLiters * hours;
    return { hours, liters, cost: liters / 1000 * WATER_RATE_WITH_SEWER };
  };
  return { hourlyLiters, day: build(HOURS_PER_DAY), week: build(HOURS_PER_DAY * 7), season: build(HOURS_PER_DAY * seasonDays) };
}