import { base44 } from '@/api/base44Client';

export async function generateHiggsfieldProductMotion({
  productSlug,
  prompt = '',
  duration = 5,
  resolution = '720p',
  aspectRatio = '16:9',
}) {
  if (!productSlug) throw new Error('productSlug is required');

  const response = await base44.functions.invoke('higgsfieldProductMotion', {
    productSlug,
    prompt,
    duration,
    resolution,
    aspectRatio,
  });

  const data = response?.data || response;
  if (data?.error || !data?.success || !data?.url) {
    throw new Error(data?.error || 'Higgsfield nevrátil platné video.');
  }
  return data;
}
