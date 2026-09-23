import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function StainlessMistObject() {
  const group = useRef();
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.025;
  });

  const particles = useMemo(() => {
    const positions = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.45 + Math.random() * 1.7;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0.6 + Math.random() * 2.8;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  return (
    <group ref={group}>
      <Float speed={0.7} rotationIntensity={0.08} floatIntensity={0.16}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 3.2, 48]} />
          <meshPhysicalMaterial color="#c8d0d5" metalness={1} roughness={0.17} clearcoat={0.8} />
        </mesh>
        <mesh position={[0.52, 1.13, 0]} rotation={[0, 0, -0.72]}>
          <cylinderGeometry args={[0.11, 0.11, 1.45, 48]} />
          <meshPhysicalMaterial color="#d9dee1" metalness={1} roughness={0.16} clearcoat={0.9} />
        </mesh>
        <mesh position={[1.03, 1.65, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.55, 48]} />
          <meshPhysicalMaterial color="#edf0f1" metalness={1} roughness={0.14} clearcoat={1} />
        </mesh>
      </Float>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={particles} count={particles.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#d8f7ff" transparent opacity={0.38} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

export default function HomeMist3DScene() {
  return (
    <section className="relative overflow-hidden bg-[#08131f] py-20 sm:py-24 lg:py-28" aria-label="3D ukázka mlžítka">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,211,238,.12),transparent_35%),radial-gradient(circle_at_20%_30%,rgba(255,196,128,.08),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-7 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
        <div className="flex flex-col justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[.24em] text-[#22D3EE]">// 3D mist experience</p>
          <h2 className="mt-4 max-w-xl font-heading text-4xl font-semibold leading-[.98] tracking-[-.04em] text-white sm:text-5xl">
            Nerez, světlo a mlha v pohybu.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
            Interaktivní WebGL vrstva ukazuje princip produktu bez změny jeho výrobní geometrie. Pro konkrétní produkty se používají schválené fotografie a modely.
          </p>
          <div className="mt-7 flex flex-wrap gap-2 text-[11px] text-white/55">
            {['Three.js', 'React Three Fiber', 'WebGL mist', 'Reduced-motion safe'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5">{item}</span>
            ))}
          </div>
        </div>
        <div className="h-[440px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[.025] sm:h-[540px]">
          <Canvas camera={{ position: [4.5, 2.1, 5.2], fov: 37 }} dpr={[1, 1.7]}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[4, 6, 5]} intensity={3.5} color="#ffd8a8" />
            <directionalLight position={[-4, 3, 2]} intensity={2.2} color="#9cecff" />
            <Suspense fallback={null}>
              <StainlessMistObject />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}