import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { playSoundEffect, setSoundEffectsEnabled, soundEffectsEnabled } from '@/lib/soundEffects';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(soundEffectsEnabled());
  const toggle = () => { const next = !enabled; setSoundEffectsEnabled(next); setEnabled(next); if (next) playSoundEffect(); };
  return <button type="button" onClick={toggle} aria-pressed={enabled} aria-label={enabled ? 'Vypnout zvukové efekty' : 'Zapnout zvukové efekty'} className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">{enabled ? <Volume2 size={19} /> : <VolumeX size={19} />}</button>;
}