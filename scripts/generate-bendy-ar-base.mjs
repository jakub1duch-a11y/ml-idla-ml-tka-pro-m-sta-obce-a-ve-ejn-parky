import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Node polyfill used by THREE.GLTFExporter.
globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(buffer).toString('base64')}`;
      this.onloadend?.();
    });
  }
};

const OUT_DIR = path.resolve('public/ar/bendy-single');
fs.mkdirSync(OUT_DIR, { recursive: true });

// All dimensions are in metres. This is a prototype reference model, not a fabrication drawing.
const outerDiameter = 0.0602;
const radius = outerDiameter / 2;
const nominalHeight = 1.8;

// Approximate BENDY SINGLE silhouette for AR Base v1.
// The final control points will be replaced by verified workshop geometry.
const points = [
  new THREE.Vector3(0.00, 0.00, 0.00),
  new THREE.Vector3(0.00, 0.30, 0.00),
  new THREE.Vector3(0.01, 0.62, 0.00),
  new THREE.Vector3(0.04, 0.92, 0.00),
  new THREE.Vector3(0.11, 1.18, 0.00),
  new THREE.Vector3(0.24, 1.42, 0.00),
  new THREE.Vector3(0.43, 1.61, 0.00),
  new THREE.Vector3(0.67, 1.74, 0.00),
  new THREE.Vector3(0.90, nominalHeight, 0.00),
];

const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
const tube = new THREE.TubeGeometry(curve, 160, radius, 24, false);
const stainless = new THREE.MeshStandardMaterial({
  color: 0xbcc4c7,
  metalness: 0.92,
  roughness: 0.24,
});

const product = new THREE.Group();
product.name = 'BENDY_SINGLE_AR_BASE_v1';
product.userData = {
  product: 'BENDY SINGLE',
  profileDiameterMm: 60.2,
  nominalHeightMm: 1800,
  scale: '1:1',
  status: 'prototype',
  note: 'Approximate bend for visualization. Verify bend radius, anchoring and nozzle positions before production AR release.'
};

const body = new THREE.Mesh(tube, stainless);
body.name = 'BENDY_BODY_D60_2';
product.add(body);

// Smooth end closures; visual only.
const capGeometry = new THREE.SphereGeometry(radius, 24, 16);
const startCap = new THREE.Mesh(capGeometry, stainless);
startCap.position.copy(curve.getPoint(0));
startCap.name = 'LOWER_END';
product.add(startCap);
const endCap = new THREE.Mesh(capGeometry, stainless);
endCap.position.copy(curve.getPoint(1));
endCap.name = 'UPPER_END';
product.add(endCap);

// Empty reference nodes for future verified nozzle placement.
[0.76, 0.90].forEach((t, i) => {
  const marker = new THREE.Object3D();
  marker.name = `NOZZLE_REFERENCE_${i + 1}_APPROX`;
  marker.position.copy(curve.getPoint(t));
  marker.userData = { approximate: true, verifyBeforeRelease: true };
  product.add(marker);
});

const scene = new THREE.Scene();
scene.name = 'MLZIDLA_AR';
scene.add(product);
scene.updateMatrixWorld(true);

const exporter = new GLTFExporter();
const glb = await new Promise((resolve, reject) => {
  exporter.parse(scene, resolve, reject, {
    binary: true,
    onlyVisible: true,
    truncateDrawRange: true,
  });
});

const glbPath = path.join(OUT_DIR, 'bendy-single-ar-base-v1.glb');
fs.writeFileSync(glbPath, Buffer.from(glb));

const spec = {
  id: 'BENDY-SINGLE-AR-BASE-v1',
  product: 'BENDY SINGLE®',
  status: 'prototype',
  units: 'mm',
  scale: '1:1',
  profile: {
    availableDiameters: [50, 60.2, 70],
    availableWallThicknesses: [2, 2.5, 3],
    referenceDiameter: 60.2,
    referenceWallThickness: 2
  },
  dimensions: {
    nominalHeight: 1800,
    bendGeometry: 'approximate-v1'
  },
  ar: {
    anchor: 'ground-center',
    scaleLocked: true,
    glb: '/ar/bendy-single/bendy-single-ar-base-v1.glb',
    usdz: null
  },
  validationRequired: [
    'exact bend radius / centreline',
    'exact overall width and top offset',
    'anchoring geometry',
    'verified nozzle positions and orientation'
  ]
};
fs.writeFileSync(path.join(OUT_DIR, 'ar-spec.json'), JSON.stringify(spec, null, 2));
console.log(`Wrote ${glbPath} (${fs.statSync(glbPath).size} bytes)`);
console.log(`Wrote ${path.join(OUT_DIR, 'ar-spec.json')}`);
