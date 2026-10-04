import { useEffect, useRef, useState } from 'react';

/**
 * Hlasový vstup přes Web Speech API (čeština). Vrací průběžný text a stav nahrávání.
 */
export default function useVoiceInput(onResult) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);
  const callbackRef = useRef(onResult);
  callbackRef.current = onResult;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    setSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'cs-CZ';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0].transcript).join(' ').trim();
      const isFinal = event.results[event.results.length - 1].isFinal;
      callbackRef.current?.(transcript, isFinal);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    return () => { try { recognition.abort(); } catch (_) {} };
  }, []);

  const toggle = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (listening) { recognition.stop(); return; }
    setListening(true);
    recognition.start();
  };

  return { listening, supported, toggle };
}