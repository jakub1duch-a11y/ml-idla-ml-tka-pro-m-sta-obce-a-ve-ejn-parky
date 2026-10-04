import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

const ICE = { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] };

// Peer-to-peer video room. Signaling runs through the CallSignal entity + realtime subscription.
export default function useWebRTCRoom({ room, user, active }) {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState({}); // email -> { name, stream }
  const [error, setError] = useState('');
  const pcs = useRef({});
  const streamRef = useRef(null);

  useEffect(() => {
    if (!active || !user) return;
    let cancelled = false;
    const me = user.email;
    const send = (type, payload, to_email) => base44.entities.CallSignal.create({ room, from_email: me, from_name: user.full_name || me, to_email: to_email || '', type, payload: payload ? JSON.stringify(payload) : '' });

    const getPc = (email, name) => {
      if (pcs.current[email]) return pcs.current[email];
      const pc = new RTCPeerConnection(ICE);
      streamRef.current?.getTracks().forEach((t) => pc.addTrack(t, streamRef.current));
      pc.onicecandidate = (e) => { if (e.candidate) send('candidate', e.candidate, email); };
      pc.ontrack = (e) => setPeers((p) => ({ ...p, [email]: { name, stream: e.streams[0] } }));
      pc.onconnectionstatechange = () => { if (['failed', 'closed', 'disconnected'].includes(pc.connectionState)) drop(email); };
      pcs.current[email] = pc;
      return pc;
    };
    const drop = (email) => {
      pcs.current[email]?.close();
      delete pcs.current[email];
      setPeers((p) => { const n = { ...p }; delete n[email]; return n; });
    };

    const handle = async (s) => {
      if (s.room !== room || s.from_email === me || (s.to_email && s.to_email !== me)) return;
      const payload = s.payload ? JSON.parse(s.payload) : null;
      if (s.type === 'join') {
        const pc = getPc(s.from_email, s.from_name);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await send('offer', offer, s.from_email);
      } else if (s.type === 'offer') {
        const pc = getPc(s.from_email, s.from_name);
        await pc.setRemoteDescription(payload);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await send('answer', answer, s.from_email);
      } else if (s.type === 'answer') {
        await pcs.current[s.from_email]?.setRemoteDescription(payload);
      } else if (s.type === 'candidate') {
        await pcs.current[s.from_email]?.addIceCandidate(payload).catch(() => {});
      } else if (s.type === 'leave') {
        drop(s.from_email);
      }
    };

    let unsubscribe = () => {};
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        setLocalStream(stream);
        unsubscribe = base44.entities.CallSignal.subscribe((event) => { if (event.type === 'create') handle(event.data); });
        await send('join');
      } catch (e) {
        setError(e?.name === 'NotAllowedError' ? 'Přístup ke kameře/mikrofonu byl odepřen.' : 'Kameru nebo mikrofon se nepodařilo spustit.');
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe();
      send('leave').catch(() => {});
      Object.keys(pcs.current).forEach(drop);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setLocalStream(null);
      setPeers({});
      base44.entities.CallSignal.deleteMany({ room, from_email: me }).catch(() => {});
    };
  }, [active, room, user?.email]);

  const toggle = (kind) => {
    streamRef.current?.[kind === 'audio' ? 'getAudioTracks' : 'getVideoTracks']().forEach((t) => { t.enabled = !t.enabled; });
  };

  return { localStream, peers, error, toggle };
}