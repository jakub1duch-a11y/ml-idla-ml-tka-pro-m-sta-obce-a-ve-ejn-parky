import { base44 } from '@/api/base44Client';

export async function generateHiggsfieldProductMotion({
  productSlug,
  prompt = '',
  duration = 5,
  resolution = '720p',
}) {
  if (!productSlug) throw new Error('productSlug is required');

  const response = await base44.functions.invoke('higgsfieldProductMotion', {
    productSlug,
    prompt,
    duration,
    resolution,
  });

  return response?.data || response;
}
