import { AbsoluteFill, Composition, interpolate, useCurrentFrame, Easing } from 'remotion';

const curve = 'M 120 610 H 440 Q 560 610 560 490 V 310 Q 560 150 720 150 H 1150 Q 1310 150 1310 310 V 600 H 1730';
export const ProductionHero: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [15, 125], [0, 1], {extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
  const reveal = interpolate(frame, [0, 18, 215, 239], [0, 1, 1, 0], {extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const stage = frame < 70 ? 0 : frame < 140 ? 1 : 2;
  const names = ['NEREZOVÁ TRUBKA', 'OHÝBÁNÍ A TVAROVÁNÍ', 'FINÁLNÍ PRVEK'];
  return <AbsoluteFill style={{background:'radial-gradient(ellipse at 72% 30%, #12445a, #061722 66%)', color:'#fff',fontFamily:'Arial, sans-serif',opacity:reveal}}>
    <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <defs><linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#63818f"/><stop offset=".4" stopColor="#fff"/><stop offset=".75" stopColor="#a4bcc5"/><stop offset="1" stopColor="#4c6877"/></linearGradient><pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 H 0 V 80" fill="none" stroke="#8bb8c4" strokeOpacity=".1"/></pattern></defs>
      <rect width="1920" height="1080" fill="url(#grid)"/>
      <path d={curve} fill="none" stroke="#6698a6" strokeWidth="38" strokeOpacity=".2" strokeLinecap="round"/>
      <path d={curve} fill="none" stroke="url(#steel)" strokeWidth="34" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-draw}/>
      <path d={curve} fill="none" stroke="#74e6f4" strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-draw}/>
    </svg>
    <div style={{position:'absolute',left:100,top:70,letterSpacing:7,fontWeight:700,fontSize:25,color:'#82ebf4'}}>MLŽIDLA × HOLMTEC / VÝROBNÍ PŘÍBĚH</div>
    <div style={{position:'absolute',left:100,bottom:105}}><div style={{fontSize:29,letterSpacing:5,color:'#82ebf4',fontWeight:700}}>0{stage+1} / {names[stage]}</div><div style={{fontSize:100,fontWeight:800,letterSpacing:-5,lineHeight:1.03,marginTop:24}}>Od trubky k tvaru.</div><div style={{fontSize:29,color:'#c1d3da',marginTop:20}}>Schematické znázornění · nikoli záběr výroby ani výrobní výkres</div></div>
  </AbsoluteFill>;
};
export const MyComposition = () => <Composition id="ProductionHero" component={ProductionHero} durationInFrames={240} fps={30} width={1920} height={1080}/>;
