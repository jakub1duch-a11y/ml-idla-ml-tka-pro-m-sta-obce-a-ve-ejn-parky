import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import buildGateModel from '@/components/gate70/buildGateModel';
import buildGateMist from '@/components/gate70/buildGateMist';
export default function createGateScene(host,variant,state) {
 const mobile=window.matchMedia('(max-width:767px)').matches;
 const renderer=new THREE.WebGLRenderer({antialias:!mobile,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.75));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.appendChild(renderer.domElement);
 renderer.domElement.setAttribute('aria-label','Koncepční trojrozměrný model brány GATE70');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,30);
 camera.position.set(3,1.8,6.7);camera.lookAt(0,1.1,0);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xd2ffff,0x23313e,2));
 const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-3,5,4);scene.add(key);
 const rim=new THREE.PointLight(0x22d3d5,12);rim.position.set(1,2,-2);scene.add(rim);
 const gate=buildGateModel(variant);scene.add(gate.root);const mist=buildGateMist(gate.nozzles,mobile);gate.root.add(mist.points);
 const grid=new THREE.GridHelper(8,32,0x236468,0x122529);grid.position.y=-.04;scene.add(grid);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.7,.05,64),new THREE.MeshStandardMaterial({color:0x0e191e,metalness:.6,roughness:.5}));base.position.y=-.04;scene.add(base);
 let active=true,raf=0,exploded=0;const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
 const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.position.z=camera.aspect<.75?9.6:6.7;camera.updateProjectionMatrix();};
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 const io=new IntersectionObserver(([e])=>{active=e.isIntersecting;},{rootMargin:'100px'});io.observe(host);
 const pointer=e=>{const r=host.getBoundingClientRect();state.current.pointer=(e.clientX-r.left)/r.width-.5;};const leave=()=>{state.current.pointer=0;};host.addEventListener('pointermove',pointer);host.addEventListener('pointerleave',leave);
 const draw=time=>{raf=requestAnimationFrame(draw);if(!active||document.hidden)return;const s=state.current;const autoExplode=!s.manual&&s.progress>.10&&s.progress<.24;exploded=THREE.MathUtils.lerp(exploded,s.exploded||autoExplode?1:0,reduced?1:.07);gate.root.rotation.y=THREE.MathUtils.lerp(gate.root.rotation.y,s.pointer*.35,.05);gate.update(exploded,s.progress);mist.update(s.progress,time/1000,reduced);rim.intensity=s.progress>=.5&&s.progress<=.75?18:8;renderer.render(scene,camera);host.dataset.progress=s.progress.toFixed(3);host.dataset.exploded=exploded>.5?'true':'false';};raf=requestAnimationFrame(draw);
 const loss=e=>{e.preventDefault();host.dataset.unavailable='true';};renderer.domElement.addEventListener('webglcontextlost',loss);
 return ()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);scene.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});env.dispose();renderer.dispose();renderer.domElement.remove();};
}