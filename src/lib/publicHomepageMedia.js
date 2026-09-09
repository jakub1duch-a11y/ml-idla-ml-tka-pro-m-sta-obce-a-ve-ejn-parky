import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const cache = new Map();
const pending = new Map();

export async function loadHomepageMedia(key) {
  if (cache.has(key)) return cache.get(key);
  if (pending.has(key)) return pending.get(key);

  const request = base44.functions.invoke('publicHomepageMedia', { key })
    .then((response) => {
      const url = response?.data?.data_url || '';
      if (url) cache.set(key, url);
      pending.delete(key);
      return url;
    })
    .catch((error) => {
      pending.delete(key);
      console.warn(`Homepage media ${key} is unavailable`, error);
      return '';
    });

  pending.set(key, request);
  return request;
}

export function useHomepageMedia(key) {
  const [url, setUrl] = useState(() => cache.get(key) || '');

  useEffect(() => {
    let active = true;
    if (!url) loadHomepageMedia(key).then((value) => { if (active && value) setUrl(value); });
    return () => { active = false; };
  }, [key, url]);

  return url;
}
