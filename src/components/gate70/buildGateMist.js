import * as THREE from 'three';
import { CONFIG } from '@/components/gate70/gateConfig';

/**
 * Vytváří částicový systém vysokotlakých mlžítek.
 *
 * Klíčové vlastnosti:
 * - Částice nestoupají jako kouř, ale stříkají přímočaře z trysek do středu brány
 * - Velikost je extrémně malá, opacity velmi nízká (0.03) — jemný závoj
 * - Hustota, délka střiku a rychlost jsou mapovány na pozici scrollu
 * - Při ~50 % scrollu se objevuje duhový rozptyl (chromatická aberace)
 * - Při >75 % scrollu mlha bleskově zaniká (odpaření)
 *
 * Úprava: tlak (rychlost) → CONFIG.JET_SPEED, počet trysek → CONFIG.NOZZLE_COUNT
 */
export default function buildGateMist(nozzles, mobile) {
  const count = mobile ? CONFIG.PARTICLES_MOBILE : CONFIG.PARTICLES_DESKTOP;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  // Seed data pro každou částici — fáze, úhel rozptylu, spread faktor
  const seeds = Array.from({ length: count }, (_, i) => ({
    phase: (i * 0.6180339) % 1,           // Zlatý řez pro rovnoměrné rozložení
    angle: i * 2.39996,                    // Zlatý úhel
    spread: ((i * 17) % 100) / 100,        // 0–1 rozptyl v kuželu
    nozzleIdx: i % nozzles.length,          // Přiřazení k trysce
    sizeVar: 0.5 + ((i * 31) % 100) / 100,  // Variace velikosti
  }));

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Shader materiál — měkké kulaté sprite s additive blending
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: { value: CONFIG.PARTICLE_OPACITY },
      uPixelRatio: { value: Math.min(devicePixelRatio, mobile ? 1.25 : 1.75) },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uPixelRatio;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
        vAlpha = clamp(1.0 - length(mvPosition.xyz) / 12.0, 0.0, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uOpacity;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  const color = new THREE.Color();

  return {
    points,
    update(progress, time, reduced) {
      // Aktivace mlžení (od 25 % scrollu) a odpařování (od 75 %)
      const activation = THREE.MathUtils.clamp((progress - 0.25) * 4, 0, 1);
      const evaporation = 1 - THREE.MathUtils.clamp((progress - CONFIG.EVAPORATION_START) * 4.5, 0, 1);
      const intensity = activation * evaporation;

      points.visible = intensity > 0.001;
      material.uniforms.uOpacity.value = CONFIG.PARTICLE_OPACITY + intensity * 0.22;

      // Duhový efekt — chromatická aberace ve vodní tříšti
      const rainbowPhase = progress >= CONFIG.RAINBOW_START && progress <= CONFIG.RAINBOW_END;

      for (let i = 0; i < count; i++) {
        const s = seeds[i];
        const n = nozzles[s.nozzleIdx];

        // Životnost částice — mapováno na scroll rychlost
        const speedFactor = CONFIG.JET_SPEED + CONFIG.WATER_PRESSURE * 0.003;
        const life = (s.phase + (reduced ? 0 : time * speedFactor)) % 1;

        // Délka střiku — roste s aktivací, klesá s odpařováním
        const distance = life * CONFIG.JET_LENGTH * intensity;

        // Rozptyl v kuželu — širší s délkou
        const spread = distance * CONFIG.CONE_SPREAD * s.spread;
        const spreadX = Math.cos(s.angle) * spread;
        const spreadY = Math.sin(s.angle) * spread;
        const spreadZ = Math.sin(s.angle * 1.3) * spread;

        // Pozice: start u trysky + směr * vzdálenost + rozptyl + slabá gravitace
        positions[i * 3]     = n.pos.x + n.direction.x * distance + spreadX;
        positions[i * 3 + 1] = n.pos.y + n.direction.y * distance + spreadY - life * life * 0.03;
        positions[i * 3 + 2] = n.pos.z + n.direction.z * distance + spreadZ;

        // Barva částice
        if (rainbowPhase && s.spread > 0.62) {
          // Spektrální rozklad — duha ve vodní tříšti
          const hue = ((i % 180) / 180 + s.phase * 0.3) % 1;
          color.setHSL(hue, 0.72, 0.68);
        } else if (progress > 0.3 && progress < 0.5) {
          // Přechod z čisté azurové do bílé
          const t = (progress - 0.3) / 0.2;
          color.setRGB(0.62 + t * 0.38, 0.91 + t * 0.09, 1.0);
        } else {
          // Výchozí — čistá azurová/akvamarínová
          color.setRGB(0.62, 0.91, 1.0);
        }

        // Fade s životností — nejjasnější ve středu životnosti
        const lifeFade = Math.sin(life * Math.PI);
        colors[i * 3]     = color.r * lifeFade;
        colors[i * 3 + 1] = color.g * lifeFade;
        colors[i * 3 + 2] = color.b * lifeFade;

        // Velikost částice — měnící se s intenzitou
        sizes[i] = CONFIG.PARTICLE_SIZE * s.sizeVar * (0.5 + intensity * 0.5);
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;
    },
  };
}