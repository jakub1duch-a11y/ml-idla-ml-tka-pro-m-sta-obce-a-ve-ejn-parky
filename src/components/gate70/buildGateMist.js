import * as THREE from 'three';
import { CONFIG } from '@/components/gate70/gateConfig';
export default function buildGateMist(nozzles,mobile) {
 const count=mobile?CONFIG.PARTICLES_MOBILE:CONFIG.PARTICLES_DESKTOP;
 const positions=new Float32Array(count*3),colors=new Float32Array(count*3),seeds=Array.from({length:count},(_,i)=>({phase:(i*.6180339)%1,angle:i*2.39996,spread:((i*17)%100)/100}));
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
 const material=new THREE.PointsMaterial({size:CONFIG.PARTICLE_SIZE,transparent:true,opacity:.03,depthWrite:false,blending:THREE.AdditiveBlending,vertexColors:true,sizeAttenuation:true});
 const points=new THREE.Points(geometry,material);const color=new THREE.Color();
 return {points,update(progress,time,reduced){
  const activation=THREE.MathUtils.clamp((progress-.25)*4,0,1),evaporation=1-THREE.MathUtils.clamp((progress-.75)*4,0,1);
  const intensity=activation*evaporation;points.visible=intensity>.001;material.opacity=.03+intensity*.20;
  for(let i=0;i<count;i++){
   const s=seeds[i],n=nozzles[i%nozzles.length];
   // Direct jets with a widening cone and slight gravity, never rising smoke.
   const life=(s.phase+(reduced?0:time*(.22+CONFIG.WATER_PRESSURE*.025)))%1;
   const distance=life*(.18+activation*1.10)*evaporation;
   const spread=distance*.16*s.spread;
   positions[i*3]=n.pos.x+n.direction.x*distance+Math.cos(s.angle)*spread;
   positions[i*3+1]=n.pos.y+n.direction.y*distance+Math.sin(s.angle)*spread-life*life*.045;
   positions[i*3+2]=n.pos.z+n.direction.z*distance+Math.sin(s.angle*1.3)*spread;
   const spectral=progress>.5&&progress<.75;
   if(spectral&&s.spread>.68)color.setHSL((i%120)/120,.65,.72);else color.setRGB(.62,.91,1);
   colors[i*3]=color.r*(1-life);colors[i*3+1]=color.g*(1-life);colors[i*3+2]=color.b*(1-life);
  }
  geometry.attributes.position.needsUpdate=true;geometry.attributes.color.needsUpdate=true;
 }};
}