import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import buildGateModel from '@/components/gate70/buildGateModel';
import buildGateMist from '@/components/gate70/buildGateMist';
import { CONFIG } from '@/components/gate70/gateConfig';

/**
 * Vytváří a spravuje Three.js scénu mlžné brány GATE70.
 *
 * Scéna obsahuje:
 * - Realistický 3D model brány s nerezovým povrchem (měnící roughness → mokrý lesk)
 * - Částicový systém vysokotlakých mlžítek (striktně směrem do středu, ne kouř)
 * - Dynamické osvětlení: key light, rim light (azurový), průrazné světlo při ~50% scrollu
 * - Prostředí: odrazová podlaha, jemná mřížka, atmosférická mlha
 * - Interakce: otáčení myší, scroll-driven animace
 */
export default function createGateScene(host, variant, state) {
  const mobile = window.matchMedia('(max-width:767px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({
    antialias: !mobile,
    alpha: true,
    powerPreference: mobile ? 'low-power' : 'high-performance',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0); // Průhledné pozadí — CSS gradient prosvítá
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'Interaktivní 3D model mlžné brány GATE70');

  // --- Scéna a kamera ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080d0f, 0.045); // Atmosférická mlha v hloubce

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.set(3.2, 1.9, 6.8);
  camera.lookAt(0, 1.1, 0);

  // --- Prostředí (PMREM pro reálné odlesky na kovu) ---
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04);
  scene.environment = env.texture;
  room.dispose();
  pmrem.dispose();

  // --- Osvětlení ---
  const hemi = new THREE.HemisphereLight(0xd2ffff, 0x1a2a30, 1.8);
  scene.add(hemi);

  // Key light — hlavní bílé světlo zleva nahoře
  const key = new THREE.DirectionalLight(0xffffff, 3.5);
  key.position.set(-3, 5, 4);
  scene.add(key);

  // Rim light — azurová/akvamarínová záře zezadu
  const rim = new THREE.PointLight(0x22d3d5, 10, 15);
  rim.position.set(1, 2, -2.5);
  scene.add(rim);

  // Průrazné světlo — ostrý směrový paprsek skrz bránu (aktivuje se při ~50% scrollu)
  const beam = new THREE.SpotLight(0xeaffff, 0, 12, Math.PI / 5, 0.5, 1.5);
  beam.position.set(0, 4, 3);
  beam.target.position.set(0, 1, 0);
  scene.add(beam);
  scene.add(beam.target);

  // Jemné akcentní světlo zespodu (odraz z podlahy)
  const fill = new THREE.PointLight(0x4becd8, 3, 8);
  fill.position.set(0, 0.2, 2);
  scene.add(fill);

  // --- Model brány + mlha ---
  const gate = buildGateModel(variant);
  scene.add(gate.root);

  const mist = buildGateMist(gate.nozzles, mobile);
  gate.root.add(mist.points);

  // --- Prostředí scény ---
  // Odrazová podlaha — tmavá, kovová
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.9, 0.04, 64),
    new THREE.MeshStandardMaterial({ color: 0x0a1418, metalness: 0.7, roughness: 0.35 })
  );
  base.position.y = -0.04;
  scene.add(base);

  // Jemná mřížka na podlaze
  const grid = new THREE.GridHelper(10, 40, 0x1a3a3c, 0x0d1e22);
  grid.position.y = -0.02;
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  scene.add(grid);

  // --- Animace ---
  let active = true;
  let raf = 0;
  let exploded = 0;

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 0.75 ? 9.8 : 6.8;
    camera.position.y = camera.aspect < 0.75 ? 2.1 : 1.9;
    camera.lookAt(0, 1.1, 0);
    camera.updateProjectionMatrix();
  };

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; }, { rootMargin: '100px' });
  io.observe(host);

  // Interakce myší — otáčení modelu
  const pointer = (e) => {
    const r = host.getBoundingClientRect();
    state.current.pointer = ((e.clientX - r.left) / r.width - 0.5);
  };
  const leave = () => { state.current.pointer = 0; };
  host.addEventListener('pointermove', pointer);
  host.addEventListener('pointerleave', leave);

  // Hlavní render loop
  const draw = (time) => {
    raf = requestAnimationFrame(draw);
    if (!active || document.hidden) return;

    const s = state.current;

    // Auto-explode mezi 8% a 26% scrollem (pokud uživatel nepřepnul manuálně)
    const autoExplode = !s.manual && s.progress > CONFIG.EXPLODE_START && s.progress < CONFIG.EXPLODE_END;
    exploded = THREE.MathUtils.lerp(exploded, s.exploded || autoExplode ? 1 : 0, reduced ? 1 : 0.06);

    // Otáčení modelu myší
    gate.root.rotation.y = THREE.MathUtils.lerp(gate.root.rotation.y, s.pointer * 0.4, 0.05);

    // Update modelu a mlhy
    gate.update(exploded, s.progress);
    mist.update(s.progress, time / 1000, reduced);

    // Průrazné světlo — intenzita narůstá kolem 50% scrollu
    const beamIntensity = s.progress >= 0.35 && s.progress <= 0.70
      ? THREE.MathUtils.lerp(0, 25, Math.sin((s.progress - 0.35) / 0.35 * Math.PI))
      : 0;
    beam.intensity = beamIntensity;

    // Rim light intenzita — pulzuje s mlžením
    rim.intensity = 8 + mist.points.visible ? 4 : 0;

    // Jemné kolébání kamery pro filmový dojem
    if (!reduced) {
      camera.position.x = 3.2 + Math.sin(time * 0.0003) * 0.08;
      camera.position.y = 1.9 + Math.cos(time * 0.0004) * 0.05;
      camera.lookAt(0, 1.1, 0);
    }

    renderer.render(scene, camera);

    // Datové atributy pro testování
    host.dataset.progress = s.progress.toFixed(3);
    host.dataset.exploded = exploded > 0.5 ? 'true' : 'false';
  };
  raf = requestAnimationFrame(draw);

  // WebGL context loss handler
  const loss = (e) => { e.preventDefault(); host.dataset.unavailable = 'true'; };
  renderer.domElement.addEventListener('webglcontextlost', loss);

  // Cleanup
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    host.removeEventListener('pointermove', pointer);
    host.removeEventListener('pointerleave', leave);
    scene.traverse((o) => {
      o.geometry?.dispose();
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      }
    });
    env.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}