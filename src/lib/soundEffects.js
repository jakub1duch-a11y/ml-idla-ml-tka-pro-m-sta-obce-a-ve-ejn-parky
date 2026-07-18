const enabled = () => typeof window !== 'undefined' && window.localStorage.getItem('mlzidla-sound-effects') === 'on';

export const soundEffectsEnabled = () => enabled();

export const setSoundEffectsEnabled = (value) => {
  if (typeof window !== 'undefined') window.localStorage.setItem('mlzidla-sound-effects', value ? 'on' : 'off');
};

export const playSoundEffect = (type = 'click') => {
  if (!enabled() || typeof window === 'undefined') return;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = type === 'success' ? 660 : 480;
  gain.gain.setValueAtTime(0.025, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
  oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.12);
};