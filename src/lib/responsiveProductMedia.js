import variants from './responsiveMediaManifest.json';

/** Return a real srcSet only when derivative files exist in the approved build. */
export function responsiveProductSrcSet(url) {
  const local = variants[url];
  if (!local?.length) return undefined;
  return [...local.map((item) => `${item.url} ${item.width}w`), `${url} 1600w`].join(', ');
}
