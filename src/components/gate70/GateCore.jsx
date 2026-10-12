import React,{useCallback,useEffect,useRef,useState} from 'react';
import { CONFIG,STAGES,PHOTOS } from '@/components/gate70/gateConfig';
import createGateScene from '@/components/gate70/createGateScene';
import useGateScroll from '@/components/gate70/useGateScroll';
export default function GateCore({variant,onVariant}) {
 const section=useRef(null),host=useRef(null),state=useRef({progress:0,exploded:false,pointer:0});
 const [stage,setStage]=useState(0),[exploded,setExploded]=useState(false),[error,setError]=useState(false);
 const onStage=useCallback(i=>setStage(i),[]);useGateScroll(section,state,onStage);
 useEffect(()=>{setError(false);try{return createGateScene(host.current,variant,state);}catch{setError(true);}},[variant]);
 const toggle=()=>{state.current.manual=true;state.current.exploded=!exploded;setExploded(!exploded);};
 return <section ref={section} className="gate-scroll" id="gate-jadro" style={{'--gate-scroll-distance':`${CONFIG.SCROLL_DISTANCE}px`}} aria-label="Čtyři fáze mlžné brány">
  <div className="gate-sticky">
   <div className="gate-core-top"><span className="gate-kicker">GATE70 / NÍZKOTLAKÁ KOLEKCE</span><a href="#gate-poptavka" className="gate-brand-button">Poptat řešení →</a></div>
   <div className="gate-core-layout">
    <div className="gate-core-copy"><span className="gate-kicker">{STAGES[stage][0]} / 04 · PRINCIP MLŽENÍ</span><h1>{stage===0?<>Průchod.<br/>Do jiného<br/><em>mikroklimatu.</em></>:STAGES[stage][1]}</h1><p>{stage===0?'Architektonická mlžná brána. Čistá geometrie nerezu a jemná vodní mlha pro příjemnější městský prostor.':STAGES[stage][2]}</p><div className="gate-variant-buttons">{['U','V'].map(v=><button key={v} aria-pressed={variant===v} onClick={()=>onVariant(v)}>GATE70-{v}</button>)}</div><div className="gate-core-facts"><div><strong>2–8 <small>bar</small></strong><span>Katalogový rozsah</span></div><div><strong>50–100 <small>μm</small></strong><span>Dle konfigurace</span></div></div><a className="gate-inline-link" href="#gate-galerie">Prohlédnout městské vizualizace ↗</a></div>
    <div className="gate-scene-wrap"><div ref={host} className="gate-scene" data-testid="gate-scene"/>{error&&<img className="gate-scene-poster" src={PHOTOS[variant==='U'?0:1].url} alt="Referenční vizualizace brány GATE70"/>}<div className="gate-model-tag">Koncepční 3D model podle fotografií<br/>Nejde o výrobní dokumentaci</div><button className="gate-explode" aria-pressed={exploded} onClick={toggle}>{exploded?'Složit technologii':'Rozložit technologii'} <span>↗</span></button></div>
   </div>
   {exploded&&<div className="gate-equipment-note">Schéma volitelné sestavy: řídicí modul · ventil a šachta · stupně filtrace · nerezové rozvody. Rozsah určuje projekt, nejde o skutečný vnitřní řez bránou.</div>}
   <div className="gate-stage-track">{STAGES.map(([n,title],i)=><button key={n} aria-current={stage===i?'step':undefined} onClick={()=>{const el=section.current;const y=el.getBoundingClientRect().top+window.scrollY;state.current.scrollTo?.(y+(el.offsetHeight-window.innerHeight)*(i/4+.01));}}><span>{n}</span>{title}</button>)}<span className="gate-scroll-hint">Pokračujte posunutím ↓</span></div>
  </div>
 </section>;
}