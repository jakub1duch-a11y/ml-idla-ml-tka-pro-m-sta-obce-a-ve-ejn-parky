import * as THREE from 'three';
import { CONFIG } from '@/components/gate70/gateConfig';
export default function buildGateModel(variant) {
 const root=new THREE.Group(), frame=new THREE.Group(); root.add(frame);
 const metal=new THREE.MeshPhysicalMaterial({color:0xc7d6da,metalness:1,roughness:.32,clearcoat:1});
 const cyan=new THREE.MeshStandardMaterial({color:0x28e7cd,metalness:.5,roughness:.3});
 const pts=variant==='V'?[[-1,0,0],[-1,1.9,0],[-.97,2.10,0],[-.78,2.20,0],[0,2.10,0],[.78,2.20,0],[.97,2.10,0],[1,1.9,0],[1,0,0]]:[[-1,0,0],[-1,1.9,0],[-.98,2.08,0],[-.8,2.2,0],[.8,2.2,0],[.98,2.08,0],[1,1.9,0],[1,0,0]];
 const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)),false,'centripetal');
 frame.add(new THREE.Mesh(new THREE.TubeGeometry(curve,180,.038,16,false),metal));
 [-1,1].forEach(x=>{const foot=new THREE.Mesh(new THREE.CylinderGeometry(.11,.12,.035,24),metal);foot.position.set(x,.018,0);frame.add(foot);});
 const nozzles=[];
 // Ilustrační rozmístění pro vysvětlení principu; nahraďte ověřeným plánem trysek.
 for(let i=0;i<CONFIG.NOZZLE_COUNT;i++){
  const pos=curve.getPointAt(.16+i*.68/(CONFIG.NOZZLE_COUNT-1));
  const direction=new THREE.Vector3(-pos.x,1.03-pos.y,.2).normalize();
  const nozzle=new THREE.Mesh(new THREE.CylinderGeometry(.013,.018,.04,10),cyan);
  nozzle.position.copy(pos).addScaledVector(direction,.042);nozzle.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);frame.add(nozzle);nozzles.push({pos:pos.clone().addScaledVector(direction,.065),direction});
 }
 const equipment=new THREE.Group();equipment.visible=false;root.add(equipment);
 const parts=[];
 [['shaft',-.8,.18,.45,.45,.25],['control',.8,.36,.35,.24,.16]].forEach(([name,x,y,w,h,d])=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:name==='shaft'?0x263b42:0x36a89c,metalness:.6,roughness:.4}));mesh.position.set(x,y,.4);equipment.add(mesh);parts.push(mesh);});
 [-.25,0,.25].forEach(x=>{const filter=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.38,20),metal);filter.position.set(x,.28,.4);equipment.add(filter);parts.push(filter);});
 const valve=new THREE.Mesh(new THREE.TorusGeometry(.13,.025,12,32),cyan);valve.position.set(0,.65,.4);equipment.add(valve);parts.push(valve);
 const bases=parts.map(p=>p.position.clone());
 return {root,metal,nozzles,equipment,update(exploded,progress){metal.roughness=THREE.MathUtils.lerp(.32,.045,Math.min(progress*4,1));equipment.visible=exploded>0.01;parts.forEach((p,i)=>{p.position.copy(bases[i]);p.position.x+=(i%2?1:-1)*exploded*(.4+i*.1);p.position.y+=exploded*(.18+i*.13);});frame.position.y=exploded*.2;}};
}