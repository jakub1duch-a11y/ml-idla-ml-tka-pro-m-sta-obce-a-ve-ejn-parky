// Nové mediální assety — B2G/B2B prezentace MLŽIDLA
// Všechna videa: autoplay / muted / loop / playsinline, poster = jpg

export const VIDEO_ASSETS = {
  // V1 — Hero: BENDY na náměstí v Jičíně (18 s, 832×464)
  heroJicin: {
    src: 'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/825fc9c6e_bendy_jicin_namesti_mlha.mp4',
    poster: 'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/774e88bcb_v2_jicin_bendy.jpg',
  },
  // V2 — Montáž MLŽIDLA 2026 (18 s, 1280×720, s hudbou)
  montage2026: {
    src: 'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/6ef6d8e60_mlzidla_montage_2026.mp4',
    poster: 'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/780206311_v3_montage_a.jpg',
  },
  // V3 — Klip realizace (16 s, 1280×720)
  realizaceKlip: {
    src: 'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/215781135_mlzidla_realizace_klip_720p.mp4',
    poster: 'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/f3ed5dc3f_v4_a.jpg',
  },
  // V4 — Čtvercová smyčka 5 s (1080×1080, bez zvuku) — pro CTA pozadí
  loopSquare: {
    src: 'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/8bae3b9b5_mlzidla_loop_1080sq.mp4',
    poster: 'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/f3ed5dc3f_v4_a.jpg',
  },
};

// Klidná paleta BrandProfile
export const BRAND = {
  blue: '#0B5EA8',
  navy: '#0D2F4F',
  ice: '#EAF5FB',
  white: '#FFFFFF',
};

// BENDY slugy pro produktový detail
export const BENDY_SLUGS = ['mlzitko-bendy', 'bendy-60', 'bendy-alej', 'bendy-arc'];

// Skryj produkty s archivovaným slugem
export const isArchived = (slug) => typeof slug === 'string' && slug.startsWith('archived-');