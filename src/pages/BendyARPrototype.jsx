import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ArrowLeft, Box, Camera, Rotate3D, Ruler, ScanLine, TriangleAlert } from 'lucide-react';

const MODEL_URL = '/ar/bendy-single/bendy-single-ar-base-v1.glb';

export default function BendyARPrototype() {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7f8);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
    camera.position.set(2.7, 1.45, 3.25);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x8b97a0, 2.5);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 4.2);
    key.position.set(3, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xbdd9e5, 1.8);
    fill.position.set(-3, 2, -2);
    scene.add(fill);

    const grid = new THREE.GridHelper(4, 20, 0xcdd5d9, 0xe5eaed);
    grid.position.y = 0;
    scene.add(grid);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.38, 0.88, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 7;
    controls.maxPolarAngle = Math.PI / 2.02;
    controlsRef.current = controls;

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        const root = gltf.scene;
        root.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
        scene.add(root);
        setStatus('ready');
      },
      undefined,
      (err) => {
        console.error('BENDY GLB load error', err);
        setStatus('error');
      }
    );

    const resize = () => {
      const w = Math.max(mount.clientWidth, 280);
      const h = Math.max(mount.clientHeight, 420);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => m.dispose?.());
        }
      });
    };
  }, []);

  const resetView = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.set(2.7, 1.45, 3.25);
    controls.target.set(0.38, 0.88, 0);
    controls.update();
  };

  return (
    <main className="min-h-screen bg-[#f4f7f8] pt-24 pb-16 text-slate-900">
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/produkt/mlzitko-bendy" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <ArrowLeft size={16}/> Zpět na BENDY SINGLE®
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
            <TriangleAlert size={14}/> AR Base v1 · prototyp
          </span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.25fr_.75fr] lg:items-start">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <div ref={mountRef} className="relative h-[62vh] min-h-[500px] max-h-[760px] w-full">
              {status === 'loading' && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/75 text-sm font-medium text-slate-500">Načítám 3D model…</div>}
              {status === 'error' && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white px-8 text-center text-sm font-medium text-red-700">3D model se nepodařilo načíst.</div>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:px-5">
              <span className="inline-flex items-center gap-2 text-xs text-slate-500"><Rotate3D size={14}/> Tažením otáčejte · kolečkem / gestem přibližujte</span>
              <button type="button" onClick={resetView} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Obnovit pohled</button>
            </div>
          </div>

          <aside className="space-y-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-400">BENDY SINGLE® · 3D kontrola</p>
              <h1 className="mt-3 font-heading text-4xl font-light tracking-tight text-[#0b4860]">První 1:1 model pro AR.</h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">Základní geometrický model slouží k ověření proporcí, práce ve 3D a budoucího AR workflow. Není ještě určený jako výrobně přesný digitální dvojník.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Ruler size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Profil</span><strong className="mt-1 block text-sm">Ø60,2 mm</strong></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Box size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Výška</span><strong className="mt-1 block text-sm">≈ 1 800 mm</strong></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><ScanLine size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Měřítko</span><strong className="mt-1 block text-sm">1 : 1</strong></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Rotate3D size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Formát</span><strong className="mt-1 block text-sm">GLB</strong></div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
              Před ostrým AR ověříme přesný rádius / střednici, horní přesah, kotvení a skutečné pozice trysek. Potom model označíme jako produkční.
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/ai-vizualizace?produkt=BENDY%20SINGLE%C2%AE&slug=mlzitko-bendy" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b4860] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#08394c]"><Camera size={16}/> Vyfotit místo a vizualizovat</Link>
              <Link to="/poptavka?produkt=BENDY%20SINGLE%C2%AE" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50">Poptat BENDY SINGLE®</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
