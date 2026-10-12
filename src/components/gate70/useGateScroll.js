import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);
export default function useGateScroll(section,state,onStage) {
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const mobile=window.matchMedia('(max-width:767px)').matches;
  // Lenis uses the native document: anchors, keyboard and sticky positioning remain intact.
  const lenis=reduced?null:new Lenis({duration:1.05,smoothWheel:!mobile,anchors:true});
  state.current.scrollTo=(top)=>{if(lenis)lenis.scrollTo(top,{immediate:true});else window.scrollTo({top,behavior:'instant'});};
  const tick=t=>lenis?.raf(t*1000);if(lenis){gsap.ticker.add(tick);lenis.on('scroll',ScrollTrigger.update);}
  let last=-1;const tween=gsap.to(state.current,{progress:1,ease:'none',scrollTrigger:{trigger:section.current,start:'top top',end:'bottom bottom',pin:section.current.querySelector('.gate-sticky'),pinSpacing:false,pinType:'fixed',scrub:true,onUpdate:self=>{const stage=Math.min(3,Math.floor(self.progress*4));if(stage!==last){last=stage;onStage(stage);}}}});
  // Re-measure the fixed pin immediately when crossing a responsive breakpoint.
  const resizeObserver=new ResizeObserver(()=>{tween.scrollTrigger?.refresh();lenis?.resize();});
  resizeObserver.observe(section.current);
  ScrollTrigger.refresh();
  return ()=>{resizeObserver.disconnect();tween.scrollTrigger?.kill();tween.kill();if(lenis){gsap.ticker.remove(tick);lenis.destroy();}};
 },[section,state,onStage]);
}