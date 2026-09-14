import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader } from 'lucide-react';
import useWebRTCRoom from '@/hooks/useWebRTCRoom';
import VideoTile from './VideoTile';

export default function VideoCall({ room, user, onEnd }) {
  const { localStream, peers, error, toggle } = useWebRTCRoom({ room, user, active: true });
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const peerList = Object.entries(peers);

  const Btn = ({ on, onClick, OnIcon, OffIcon, label }) => (
    <button onClick={onClick} aria-label={label} className={`rounded-full p-3 ${on ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-300'}`}>
      {on ? <OnIcon size={16} /> : <OffIcon size={16} />}
    </button>
  );

  return (
    <div className="mb-4 rounded-xl border border-cyan/20 bg-black/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">Videohovor · {peerList.length + 1} účastník{peerList.length ? 'ů' : ''}</p>
        {!peerList.length && !error && <p className="text-[11px] text-white/35">Čekám na kolegu — ať otevře stejný kanál a klikne na Videohovor.</p>}
      </div>
      {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : (
        <div className={`grid gap-2 ${peerList.length ? 'grid-cols-2' : 'grid-cols-1 max-w-md'}`}>
          {localStream ? <VideoTile stream={localStream} label={`Vy · ${user.full_name || user.email}`} muted mirrored /> : (
            <div className="flex aspect-video items-center justify-center rounded-xl border border-white/10 bg-black"><Loader size={18} className="animate-spin text-cyan/50" /></div>
          )}
          {peerList.map(([email, p]) => <VideoTile key={email} stream={p.stream} label={p.name || email} />)}
        </div>
      )}
      <div className="mt-3 flex items-center justify-center gap-2">
        <Btn on={mic} onClick={() => { toggle('audio'); setMic((v) => !v); }} OnIcon={Mic} OffIcon={MicOff} label="Mikrofon" />
        <Btn on={cam} onClick={() => { toggle('video'); setCam((v) => !v); }} OnIcon={Video} OffIcon={VideoOff} label="Kamera" />
        <button onClick={onEnd} aria-label="Ukončit hovor" className="rounded-full bg-red-500 px-5 py-3 text-white"><PhoneOff size={16} /></button>
      </div>
    </div>
  );
}