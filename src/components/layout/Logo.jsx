import React from "react";

const LOGO_ON_LIGHT = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/177576508956f83066d50ce992808b60_a_clean_white_background_with_a_modern_logo_on_th.png";
const LOGO_ON_DARK = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/eb9bb1640cb19e14d147da5791cc0b35_transparent_black_background_solid_black_with_t.png";
const LOGO_FOOTER = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b7c3dd4fe5bee17d90b81212ebbe055e_a_clean_logo_on_a_solid_black_background_a_large.png";

// Two transparent color variants of the same approved MLŽIDLA wordmark.
// tone describes the background: light = navy letters, dark = white letters.
export function MistZMark({ size = "md", className = "" }) {
  const sizes = { xs: "h-7", sm: "h-9", md: "h-11", lg: "h-14" };
  return <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/058086f9dba9852bce6cfd30ed13a6c4_mlzidla-favicon-256.png" alt="" aria-hidden="true" className={`w-auto object-contain ${sizes[size] || sizes.md} ${className}`} />;
}

export default function Logo({ size = "md", variant = "simple", tone = "dark", className = "" }) {
  const heights = { xs: "h-6", sm: "h-7", md: "h-8", lg: "h-11" };
  const source = variant === "footer" ? LOGO_FOOTER : tone === "light" ? LOGO_ON_LIGHT : LOGO_ON_DARK;
  return (
    <span className={`inline-flex min-w-0 flex-col items-start ${className}`}>
      <img src={source} alt={variant === "footer" ? "MLŽIDLA by holmtec" : "MLŽIDLA.cz"} className={`block w-auto max-w-full object-contain ${variant === "footer" ? "h-16 sm:h-20" : heights[size] || heights.md}`} />
      {variant === "full" && <span className="mt-1 text-[10px] font-medium tracking-[.08em] text-white/70 sm:text-xs">Architektura vodní mlhy <span className="text-white/45">· by holmtec</span></span>}
    </span>
  );
}
