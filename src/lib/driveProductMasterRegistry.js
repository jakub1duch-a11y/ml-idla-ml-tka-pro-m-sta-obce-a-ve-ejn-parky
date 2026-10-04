// MLŽIDLA exact product visualization registry.
// Google Drive MLZNY DISK is the primary source of truth for product geometry and approved references.
// Never fall back to a visually similar product family when an exact source is missing.

export const DRIVE_MASTER_POLICY_VERSION = '2026-09-23.1';

export const DRIVE_MASTER_POLICY = {
  sourceDriveName: 'MLZNY DISK',
  sourceDriveId: '0ACRsWxU90i5aUk9PVA',
  requireExactProductMatch: true,
  requireMasterReference: true,
  requireHumanVerification: true,
  prohibitCrossFamilyFallback: true,
  prohibitInventedGeometry: true,
  noTextInsideGeneratedVisual: true,
  generatedVisualLabel: 'Ilustrační vizualizace',
};

export const EXACT_PRODUCT_DRIVE_SOURCES = {
  bendy: {
    folderId: '1JwPiTtlROg6zD23V0caeUVm7NO0E_nHd',
    aliases: ['bendy', 'mlzitko-bendy', 'bendy-single', 'bendy-field'],
  },
  steblo: {
    folderId: '1cPqOLEIB_qBzCzEfvICG3xCFR7cxSGj9',
    aliases: ['steblo', 'stéblo', 'mlzitko-steblo', 'mlzitko-2-stebla'],
  },
  linea: {
    folderId: '15RH-7vaGhkDoOSB8UKj9Eybgj1n3BiZy',
    aliases: ['linea', 'linea-mlzitko', 'linea-solo'],
    note: 'LINEA is the straight/slender column product. Do not substitute LineaCe or gate imagery.',
  },
  lineace: {
    folderId: '1LXNhFna8CdVhFizMiLZx3MIIBXmYFR7a',
    aliases: ['lineace', 'linea-ce', 'linea ce', 'linea-ce70'],
    note: 'LineaCe is a distinct product variant and must never be used as LINEA.',
  },
};

export function normalizeProductKey(product = {}) {
  const value = `${product.slug || ''} ${product.name || ''}`.toLowerCase();
  if (/linea\s*ce|lineace|linea-ce/.test(value)) return 'lineace';
  if (/st[eé]blo/.test(value)) return 'steblo';
  if (/bendy/.test(value)) return 'bendy';
  if (/linea/.test(value)) return 'linea';
  return null;
}

export function getExactDriveMaster(product = {}) {
  const key = normalizeProductKey(product);
  return key ? EXACT_PRODUCT_DRIVE_SOURCES[key] || null : null;
}

export function validateProductForVisualization(product = {}) {
  const driveSource = getExactDriveMaster(product);
  const masterUrl = product.visual_master_reference_url
    || (product.hero_visual_verified ? product.hero_product_image_url : '')
    || '';

  const errors = [];
  if (!driveSource) errors.push('Produkt nemá přesně definovaný Drive MASTER zdroj.');
  if (!masterUrl) errors.push('Produkt nemá schválenou MASTER referenci.');
  if (!product.visual_master_verified) errors.push('MASTER reference není lidsky ověřená.');

  return {
    ok: errors.length === 0,
    errors,
    driveSource,
    masterUrl,
    policyVersion: DRIVE_MASTER_POLICY_VERSION,
  };
}
