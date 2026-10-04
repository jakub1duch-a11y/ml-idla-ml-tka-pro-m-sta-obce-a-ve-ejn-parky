import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const items = {
  'bendy':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/1b393ddd5_file_00000000256881f595029a892ebe07b3.png',
  'bendy-radius-s':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/69c22b375_file_00000000fb4c82469c90ac7d4b9f81c9.png',
  'bendy-radius-m':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/b6fd0b135_file_00000000ede481f4914fb4d80c173604.png',
  'bendy-radius-l':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e32805e09_file_0000000019e48243bd5b212e3c4562a3.png',
  'bendy-field':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/ff706f45e_file_000000004b8081f5bb89dbb5b43664b5.png',
  'aura-garden':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8cb34e2c3_generated_image.png',
  'linea-ce':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4a183deae_generated_image.png',
  'linea-gate':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ab84deeba_generated_image.png',
  'linea-avenue':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e3e9b011c_generated_image.png',
  'y-armist-tr60':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3063e3653_MlzitkoY-ARMISTTR60_3.png',
  'y-armist-j70':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/93cd8ff63_MlzitkoY-ARMISTJ70_2.png',
  'steblo':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/486dbd1bb_mlzitko-steblo-katalog2.png',
  'gate':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bec7f86a9_generated_image.png',
  'mrak':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ef3414919_generated_image.png',
  'spirala':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6ce3864ad_generated_image.png',
  'mrkev':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c3535394a_mlzitko-MRKEV_render.png',
  'teepee':'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/ebbd577b1_07_teepee_brno_portrait.jpg'
};

const OUT = 'public/media/studio';
await fs.mkdir(OUT, { recursive: true });
const W = 1200, H = 1500;

for (const [slug, url] of Object.entries(items)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const src = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(src).metadata();
    const maxW = Math.round(W * 0.74), maxH = Math.round(H * 0.76);
    const scale = Math.min(maxW / (meta.width || maxW), maxH / (meta.height || maxH));
    const rw = Math.max(1, Math.round((meta.width || maxW) * scale));
    const rh = Math.max(1, Math.round((meta.height || maxH) * scale));
    const resized = await sharp(src).resize(rw, rh, { fit: 'inside', withoutEnlargement: false }).png().toBuffer();

    const svg = `
      <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fbfdff"/>
            <stop offset="1" stop-color="#eef3f6"/>
          </linearGradient>
          <filter id="blur"><feGaussianBlur stdDeviation="20"/></filter>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#bg)"/>
        <ellipse cx="${W/2}" cy="${H-145}" rx="${Math.max(120, rw*0.24)}" ry="28" fill="#183246" fill-opacity="0.14" filter="url(#blur)"/>
      </svg>`;
    const left = Math.round((W-rw)/2);
    const top = Math.round(H-rh-H*0.08);
    const output = path.join(OUT, `${slug}-studio.webp`);
    await sharp(Buffer.from(svg))
      .composite([{ input: resized, left, top }])
      .webp({ quality: 92, effort: 5 })
      .toFile(output);
    console.log(`OK ${slug} -> ${output}`);
  } catch (err) {
    console.error(`ERR ${slug}: ${err.message}`);
  }
}
