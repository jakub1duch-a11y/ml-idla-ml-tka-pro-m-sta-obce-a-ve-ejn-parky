import React from "react";

const LOGO_DARK = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e5e08f1b34bb79650fac64705a85145f_mlzidla-logo-web-dark.png";
const LOGO_LIGHT = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/11bdd7fdde1f06b5959ea8336413c05a_mlzidla-logo-web-light.png";

// Shared approved raster master: identical lettering across header, footer and mobile.
export function MistZMark({ size = "md", className = "" }) {
  const sizes = { xs: "h-7", sm: "h-9", md: "h-11", lg: "h-14" };
  return <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/058086f9dba9852bce6cfd30ed13a6c4_mlzidla-favicon-256.png" alt="" aria-hidden="true" className={`w-auto object-contain ${sizes[size] || sizes.md} ${className}`} />;
}

export default function Logo({ size = "md", variant = "simple", tone = "dark", className = "" }) {
  const heights = { xs: "h-6", sm: "h-7", md: "h-8", lg: "h-11" };
  const source = tone === "light" ? LOGO_DARK : LOGO_LIGHT;
  return (
    <span className={`inline-flex min-w-0 flex-col items-start ${className}`}>
      <img src={source} alt="MLŽIDLA.cz" width="1610" height="510" className={`block w-auto max-w-full object-contain ${heights[size] || heights.md}`} />
      {variant === "full" && <span className="mt-1 text-[10px] font-medium tracking-[.08em] text-white/70 sm:text-xs">Architektura vodní mlhy <span className="text-white/45">· by holmtec</span></span>}
    </span>
  );
}
