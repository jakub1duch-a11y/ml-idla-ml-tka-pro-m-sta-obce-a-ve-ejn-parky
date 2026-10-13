// Načítání originálních produktových fotografií (Mlžný disk / katalog) pro obrazové nabídky a AI vizualizace.
const toBase64 = (bytes) => {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};

export const toDataUrl = ({ bytes, type }) => `data:${type};base64,${toBase64(bytes)}`;

export async function driveImage(accessToken, id, size = 1600) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?fields=mimeType,thumbnailLink&supportsAllDrives=true`, { headers, signal: AbortSignal.timeout(15000) });
  const meta = await metaRes.json();
  const url = meta.thumbnailLink ? meta.thumbnailLink.replace(/=s\d+$/, `=s${size}`) : `https://www.googleapis.com/drive/v3/files/${id}?alt=media&supportsAllDrives=true`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`Fotografii ${id} nelze načíst.`);
  return { bytes: new Uint8Array(await res.arrayBuffer()), type: res.headers.get('content-type') || meta.mimeType || 'image/jpeg' };
}

export async function urlImage(url) {
  const full = url?.startsWith('/') ? `https://mlzidla.cz${url}` : url;
  if (!full) return null;
  const res = await fetch(full, { signal: AbortSignal.timeout(20000) });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.startsWith('image/')) return null;
  return { bytes: new Uint8Array(await res.arrayBuffer()), type };
}