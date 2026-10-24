import React, { useId } from "react";

// Nový MLŽIDLA® symbol: kapka + tekuté písmeno Ž. SVG zůstává ostré na mobilu i Retina displejích.
export function MistZMark({ size = "md", className = "" }) {
  const svgId = useId().replace(/:/g, "");
  const sizes = {
    xs: "h-7 w-[22px]",
    sm: "h-9 w-[28px]",
    md: "h-11 w-[35px]",
    lg: "h-14 w-[44px]"
  };

  return null;





































































}

// One readable wordmark across header, footer and the mobile menu.
export default function Logo({
  size = "md",
  variant = "simple",
  tone = "dark",
  className = ""
}) {
  const heights = { xs: "h-6", sm: "h-7", md: "h-8", lg: "h-11" };
  const src = tone === "light"
    ? "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/c3e649a6f_mlzidla-cz-logo.png"
    : "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/3a15a0e79_mlzidla-cz-logo-white.png";
  return (
    <span className={`inline-flex flex-col ${className}`}>
      <img src={src} alt="MLŽIDLA.cz" className={`${heights[size] || heights.md} w-auto`} />
      {variant === "full" &&
      <span className="mlz-wordmark__caption" aria-hidden="true">
          Architektura vodní mlhy
        </span>
      }
    </span>);

}