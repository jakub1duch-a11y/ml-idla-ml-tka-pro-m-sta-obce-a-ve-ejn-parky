import React from "react";

export const BRAND_LOGO_URL = "/media/brand/mlzidla-approved-20261023.svg";

// MLŽIDLA.cz — minimalistická mlžná brána ve tvaru M.
// Čisté vektorové SVG; symbol je samostatný a nemění geometrii žádného produktu.
export function MistZMark({ size = "md", className = "" }) {
  const sizes = {
    xs: "h-7 w-[22px]",
    sm: "h-9 w-[28px]",
    md: "h-11 w-[35px]",
    lg: "h-14 w-[44px]",
  };

  return (
    <svg
      aria-hidden="true"
      className={`block shrink-0 ${sizes[size] || sizes.md} ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mlzidla-gate-gradient" x1="5" y1="42" x2="42" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0878E8" />
          <stop offset="0.55" stopColor="#00B9F2" />
          <stop offset="1" stopColor="#8BE9F8" />
        </linearGradient>
      </defs>
      <path
        d="M7 41V23C7 13.6 14.6 6 24 6C33.4 6 41 13.6 41 23V41"
        stroke="url(#mlzidla-gate-gradient)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M13 40V25L24 34L35 25V40"
        stroke="url(#mlzidla-gate-gradient)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18 16.5H30" stroke="#67E8F9" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="24" cy="12.5" r="1.7" fill="#8BE9F8" />
    </svg>
  );
}

// One responsive wordmark shared by the header, footer and mobile navigation.
export default function Logo({
  size = "md",
  variant = "simple",
  tone = "dark",
  className = "",
}) {
  return (
    <span
      role="img"
      aria-label="MLŽIDLA.cz — venkovní mlžicí systémy"
      className={`mlz-wordmark mlz-wordmark--${size} ${tone === "light" ? "mlz-wordmark--ink" : "mlz-wordmark--white"} ${className}`}
    >
      <span className="mlz-wordmark__line" aria-hidden="true" style={{ display: "none" }}>
        <span className="mlz-wordmark__symbol">
          <img
            src={BRAND_LOGO_URL}
            alt=""
            className={`mlz-brand-logo ${size === "lg" ? "h-12 w-12" : size === "xs" ? "h-7 w-7" : "h-9 w-9"}`}
          />
        </span>
        <span className="mlz-wordmark__name">
          ML<span className="mlz-wordmark__accent">Ž</span>IDLA<span className="mlz-wordmark__domain">.cz</span>
        </span>
      </span>
      <img src={BRAND_LOGO_URL} alt="" style={{ height: size === "lg" ? 72 : size === "xs" ? 36 : 56, width: "auto", objectFit: "contain", background: "#fff", borderRadius: 6, padding: 3 }} />
      {variant === "full" && (
        <span className="mlz-wordmark__caption" aria-hidden="true">
          Architektura vodní mlhy
        </span>
      )}
    </span>
  );
}