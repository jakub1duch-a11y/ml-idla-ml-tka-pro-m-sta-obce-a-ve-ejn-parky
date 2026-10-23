import React from "react";
import logoHorizontal from "@/assets/brand/mlzidla-horizontal.svg";
import logoHorizontalLight from "@/assets/brand/mlzidla-horizontal-light.svg";
import logoMark from "@/assets/brand/mlzidla-mark.svg";

export { default as LOGO_VERTICAL_URL } from "@/assets/brand/mlzidla-vertical.svg";
export { default as LOGO_ICON_URL } from "@/assets/brand/mlzidla-icon.svg";
export const BRAND_LOGO_URL = logoHorizontal;
export const BRAND_LOGO_LIGHT_URL = logoHorizontalLight;
export const BRAND_MARK_URL = logoMark;

const HEIGHTS = { xs: 28, sm: 36, md: 46, lg: 60 };

// Zjednodušená značka (mlžná brána M s kapkou) — pro malé plochy.
export function MistZMark({ size = "md", className = "" }) {
  const h = { xs: 28, sm: 36, md: 44, lg: 56 }[size] || 44;
  return <img src={logoMark} alt="" aria-hidden="true" style={{ height: h, width: "auto" }} className={`block shrink-0 ${className}`} />;
}

// Horizontální logo. variant="full" = světlá verze pro tmavé plochy (patička);
// tone="light" = tmavá verze pro světlé plochy; jinak tmavá verze na bílém štítku.
export default function Logo({ size = "md", variant = "simple", tone = "dark", className = "" }) {
  // tone="light" = světlé pozadí → tmavá verze; jinak (tmavá hlavička/patička) světlá verze.
  const src = tone === "light" ? logoHorizontal : logoHorizontalLight;
  const chip = false;
  return (
    <span role="img" aria-label="MLŽIDLA.cz — architektura vodní mlhy" className={`inline-flex shrink-0 items-center pr-4 ${chip ? "bg-white px-2 py-1" : ""} ${className}`}>
      <img src={src} alt="" style={{ height: HEIGHTS[size] || 52, width: "auto" }} />
    </span>
  );
}