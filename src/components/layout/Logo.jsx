import React from "react";

const LOGO_ON_LIGHT = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7b9d340612a718467276b0ab95f8143a_mlzidla_logo_approved_darktext.png";
const LOGO_ON_DARK = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bc4ef693b123cb99c9e12d742ca86967_mlzidla_logo_approved_whitetext.png";

// Two transparent color variants of the same approved MLŽIDLA wordmark.
// tone describes the background: light = navy letters, dark = white letters.
export function MistZMark({ size = "md", className = "" }) {
  const sizes = { xs: "h-7", sm: "h-9", md: "h-11", lg: "h-14" };
  return <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/058086f9dba9852bce6cfd30ed13a6c4_mlzidla-favicon-256.png" alt="" aria-hidden="true" className={`w-auto object-contain ${sizes[size] || sizes.md} ${className}`} />;
}

export default function Logo({ size = "md", variant = "simple", tone = "dark", className = "" }) {
  const heights = { xs: "h-6", sm: "h-7", md: "h-8", lg: "h-11" };
  const source = tone === "light" ? LOGO_ON_LIGHT : LOGO_ON_DARK;
  return (
    <span className={`inline-flex min-w-0 flex-col items-start ${className}`}>
      <img src={source} alt="MLŽIDLA.cz" width="1346" height="318" className={`block w-auto max-w-full object-contain ${heights[size] || heights.md}`} />
      {variant === "full" && <span className="mt-1 text-[10px] font-medium tracking-[.08em] text-white/70 sm:text-xs">Architektura vodní mlhy <span className="text-white/45">· by holmtec</span></span>}
    </span>
  );
}
