import * as THREE from 'three';
import { CONFIG } from '@/components/gate70/gateConfig';

/**
 * Staví realistický 3D model mlžné brány GATE70.
 * - Nerezový oblouk (U nebo V varianta)
 * - Patky / základové desky
 * - Mlžící trysky podél vnitřního oblouku
 * - Vnitřní technologie (rozložitelná): řídicí modul, šachta s ventilem, filtrace, rozvody
 */
export default function buildGateModel(variant) {
  const root = new THREE.Group();
  const frame = new THREE.Group();
  root.add(frame);

  // --- Materiály ---
  // Nerezová ocel — broušený, kovový povrch. Roughness se mění se scrollem (mokrý lesk).
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0xc8d4d8,
    metalness: 1,
    roughness: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.4,
  });

  // Akcent — azurová/akvamarínová pro technologické prvky
  const accent = new THREE.MeshStandardMaterial({
    color: 0x22d3d5,
    metalness: 0.6,
    roughness: 0.25,
    emissive: 0x0a4a4c,
    emissiveIntensity: 0.4,
  });

  // Tmavý kov pro patky a konstrukci
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x3a4a52,
    metalness: 0.8,
    roughness: 0.4,
  });

  // --- Geometrie oblouku ---
  // Kontrolní body pro Catmull-Rom křivku — tvar brány
  const pts = variant === 'V'
    ? [[-1.1, 0, 0], [-1.1, 1.95, 0], [-1.06, 2.15, 0], [-0.84, 2.28, 0], [0, 2.18, 0], [0.84, 2.28, 0], [1.06, 2.15, 0], [1.1, 1.95, 0], [1.1, 0, 0]]
    : [[-1.1, 0, 0], [-1.1, 2.0, 0], [-1.06, 2.18, 0], [-0.82, 2.3, 0], [0.82, 2.3, 0], [1.06, 2.18, 0], [1.1, 2.0, 0], [1.1, 0, 0]];

  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'centripetal');

  // Hlavní trubka — tlustší nerezový oblouk
  const tubeRadius = 0.045;
  frame.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 200, tubeRadius, 20, false), metal));

  // Vnitřní trubka — tenčí, pro vodní rozvody (viditelná při rozložení)
  const innerTube = new THREE.Mesh(new THREE.TubeGeometry(curve, 200, tubeRadius * 0.55, 16, false), darkMetal);
  innerTube.visible = false; // Zviditelní se při rozložení
  frame.add(innerTube);

  // --- Patky / základové desky ---
  [-1.1, 1.1].forEach(x => {
    const footBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.04, 32), darkMetal);
    footBase.position.set(x, 0.02, 0);
    frame.add(footBase);

    const footTop = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.06, 32), metal);
    footTop.position.set(x, 0.06, 0);
    frame.add(footTop);
  });

  // --- Mlžící trysky ---
  // Umístěny podél vnitřního oblouku, míří dovnitř průchodu
  const nozzles = [];
  for (let i = 0; i < CONFIG.NOZZLE_COUNT; i++) {
    const t = 0.14 + i * 0.72 / (CONFIG.NOZZLE_COUNT - 1);
    const pos = curve.getPointAt(t);

    // Směr do středu brány a mírně dolů
    const target = new THREE.Vector3(-pos.x * 0.3, 0.9, 0);
    const direction = new THREE.Vector3().subVectors(target, pos).normalize();

    // Tryska — malý váleček
    const nozzleGeo = new THREE.CylinderGeometry(0.014, 0.018, 0.05, 12);
    const nozzle = new THREE.Mesh(nozzleGeo, accent);
    nozzle.position.copy(pos).addScaledVector(direction, 0.05);
    nozzle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    frame.add(nozzle);

    // Halo kolem trysky — jemná světelná aura
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.02, 0.035, 16),
      new THREE.MeshBasicMaterial({ color: 0x46edda, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    halo.position.copy(nozzle.position);
    halo.quaternion.copy(nozzle.quaternion);
    halo.rotateX(Math.PI / 2);
    frame.add(halo);

    nozzles.push({
      pos: pos.clone().addScaledVector(direction, 0.07),
      direction,
      halo,
    });
  }

  // --- Vnitřní technologie (rozložitelná) ---
  const equipment = new THREE.Group();
  equipment.visible = false;
  root.add(equipment);
  const parts = [];

  // Řídicí modul (vlevo)
  const controlUnit = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.28, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x1a3a3c, metalness: 0.7, roughness: 0.3, emissive: 0x0a2a2c, emissiveIntensity: 0.3 })
  );
  controlUnit.position.set(-0.85, 0.42, 0.42);
  equipment.add(controlUnit);
  parts.push({ mesh: controlUnit, base: controlUnit.position.clone(), offset: new THREE.Vector3(-0.5, 0.15, 0.15) });

  // LED indikátor na řídicím modulu
  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0x46edda })
  );
  led.position.set(-0.85, 0.52, 0.52);
  equipment.add(led);

  // Šachta s chytrým ventilem (vpravo)
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.24, 0.5, 24),
    new THREE.MeshStandardMaterial({ color: 0x2a3a42, metalness: 0.6, roughness: 0.35 })
  );
  shaft.position.set(0.85, 0.3, 0.42);
  equipment.add(shaft);
  parts.push({ mesh: shaft, base: shaft.position.clone(), offset: new THREE.Vector3(0.5, 0.12, 0.15) });

  // Ventil — torus na šachtě
  const valve = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.028, 12, 32),
    accent
  );
  valve.position.set(0.85, 0.55, 0.42);
  valve.rotation.x = Math.PI / 2;
  equipment.add(valve);
  parts.push({ mesh: valve, base: valve.position.clone(), offset: new THREE.Vector3(0.5, 0.35, 0.15) });

  // Filtrace vody — tři válcové filtry
  [-0.28, 0, 0.28].forEach((x, idx) => {
    const filter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.42, 20),
      metal
    );
    filter.position.set(x, 0.28, 0.42);
    equipment.add(filter);
    parts.push({ mesh: filter, base: filter.position.clone(), offset: new THREE.Vector3(x * 0.8, 0.4 + idx * 0.08, 0.35) });
  });

  // Nerezové rozvody — trubky spojující komponenty
  const pipeMat = darkMetal;
  const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 12), pipeMat);
  pipe1.position.set(-0.3, 0.5, 0.42);
  pipe1.rotation.z = Math.PI / 2;
  equipment.add(pipe1);

  const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 12), pipeMat);
  pipe2.position.set(0.35, 0.5, 0.42);
  pipe2.rotation.z = Math.PI / 2;
  equipment.add(pipe2);

  // --- Update funkce — volá se každý frame ---
  return {
    root,
    metal,
    accent,
    nozzles,
    equipment,
    innerTube,
    update(exploded, progress) {
      // Roughness klesá s progresí — brána dostává mokrý, orosený lesk
      metal.roughness = THREE.MathUtils.lerp(0.28, 0.04, Math.min(progress * 3.5, 1));
      metal.clearcoatRoughness = THREE.MathUtils.lerp(0.15, 0.02, Math.min(progress * 3.5, 1));

      // Viditelnost vnitřní technologie
      equipment.visible = exploded > 0.01;
      innerTube.visible = exploded > 0.3;

      // Rozložení částí — každá část se posune svým směrem
      parts.forEach((p) => {
        p.mesh.position.copy(p.base).addScaledVector(p.offset, exploded);
      });

      // Celý rám se mírně zvedne při rozložení
      frame.position.y = exploded * 0.15;

      // Halo pulzování trysek — intenzita podle scrollu
      const mistIntensity = THREE.MathUtils.clamp((progress - 0.25) * 4, 0, 1) * (1 - THREE.MathUtils.clamp((progress - 0.75) * 4, 0, 1));
      nozzles.forEach(n => {
        if (n.halo && n.halo.material) {
          n.halo.material.opacity = 0.15 + mistIntensity * 0.35;
        }
      });
    },
  };
}