import { useState } from 'react';
import { base44 } from '@/api/base44Client';

const POLL_MS = 10000;
const MAX_POLLS = 60;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const call = async (payload) => {
  const { data } = await base44.functions.invoke('generateLockedProductVideo', payload);
  if (data?.error) throw new Error(data.error);
  return data;
};

// PRODUCT LOCK video: reference skutečného produktu (web + Mlžný disk) -> AI Gateway job -> polling.
export default function useLockedVideo() {
  const [status, setStatus] = useState('');
  const [plan, setPlan] = useState(null);

  const loadPlan = async (payload) => {
    setPlan(null);
    try { setPlan(await call({ action: 'prepare', ...payload })); } catch { setPlan(null); }
  };

  const generate = async (payload) => {
    setStatus('Spouštím video s referencemi produktu…');
    let job = await call({ action: 'create', ...payload });
    const references = job.references || [];
    const prompt = job.prompt || '';
    for (let i = 0; i < MAX_POLLS && (job.status === 'queued' || job.status === 'in_progress'); i += 1) {
      setStatus(`Renderuji video… ${(i + 1) * (POLL_MS / 1000)} s`);
      await wait(POLL_MS);
      job = await call({ action: 'retrieve', videoId: job.id });
    }
    setStatus('');
    if (job.status === 'failed') throw new Error(job.error?.message || 'Generování videa selhalo.');
    if (job.status !== 'completed' || !job.url) throw new Error('Video se zatím nedokončilo. Zkuste to za chvíli znovu.');
    return { url: job.url, references, prompt };
  };

  return { status, plan, loadPlan, generate };
}