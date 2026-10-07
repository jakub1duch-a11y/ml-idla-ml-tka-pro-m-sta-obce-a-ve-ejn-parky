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

  return (
    <svg
      viewBox="0 0 64 92"
      fill="none"
      aria-hidden="true"
      className={`${sizes[size] || sizes.md} shrink-0 overflow-visible w-[8px] ${className}`}>
      
      <defs>
        <linearGradient
          id={`${svgId}-z-ribbon`}
          x1="12"
          y1="17"
          x2="55"
          y2="82"
          gradientUnits="userSpaceOnUse">
          
          <stop stopColor="#A8F0FF" />
          <stop offset="0.24" stopColor="#00B7FF" />
          <stop offset="0.58" stopColor="#0878E8" />
          <stop offset="0.82" stopColor="#00C6FF" />
          <stop offset="1" stopColor="#7DD3FC" />
        </linearGradient>
        <linearGradient
          id={`${svgId}-drop`}
          x1="22"
          y1="1"
          x2="42"
          y2="28"
          gradientUnits="userSpaceOnUse">
          
          <stop stopColor="#00C6FF" />
          <stop offset="0.6" stopColor="#0097F5" />
          <stop offset="1" stopColor="#0A5ED7" />
        </linearGradient>
      </defs>

      <g className="mlz-logo-drop">
        <path
          d="M32 2C32 2 20.2 15.8 20.2 23.1C20.2 29.7 25.5 35 32 35C38.5 35 43.8 29.7 43.8 23.1C43.8 15.8 32 2 32 2Z"
          fill={`url(#${svgId}-drop)`} />
        
        <ellipse
          cx="27.4"
          cy="18.4"
          rx="3.7"
          ry="7"
          fill="white"
          opacity=".52"
          transform="rotate(28 27.4 18.4)" />
        
      </g>

      <g className="mlz-logo-ribbon">
        <path
          d="M13 39.5C13 36.7 15.2 34.5 18 34.5H52C52 41.7 49.1 47.3 43.8 52.2L27 67.8C23.8 70.8 23.1 74.5 25.3 77.5C27 79.8 29.9 81 34 81H53.5L58 87H30.2C21.7 87 15.8 84.2 12.8 79.2C9 72.9 11.2 65 18.6 58.4L36.8 42.2H18C15.2 42.2 13 41.7 13 39.5Z"
          fill={`url(#${svgId}-z-ribbon)`} />
        
        <path
          d="M36.8 42.2H18C15.2 42.2 13 40.1 13 37.4V34.5H52C52 38.1 51.2 41.3 49.5 44.2C45.3 46.4 40.2 46.2 36.8 42.2Z"
          fill="#8DEBFF"
          opacity=".58" />
        
        <path
          d="M20.8 58.7C26.6 53.8 33.2 49.7 39.5 44.7C33.8 52.4 27.1 59.7 21.7 66.3C17.9 71 17.7 76 21.8 80.8C13.6 77.2 13.3 67.1 20.8 58.7Z"
          fill="white"
          opacity=".2" />
        
      </g>
    </svg>);

}

// One readable wordmark across header, footer and the mobile menu.
export default function Logo({
  size = "md",
  variant = "simple",
  tone = "dark",
  className = ""
}) {
  return (
    <span
      role="img"
      aria-label="MLŽIDLA"
      className={`mlz-wordmark mlz-wordmark--${size} ${tone === "light" ? "mlz-wordmark--ink" : "mlz-wordmark--white"} ${className}`}>
      
      <span className="mlz-wordmark__line" aria-hidden="true">
        <span className="mlz-wordmark__symbol">
          <MistZMark size={size === "lg" ? "md" : "sm"} />
        </span>
        <span className="mlz-wordmark__name">MLŽIDLA</span>
        <sup className="mlz-wordmark__registered">®</sup>
      </span>
      {variant === "full" &&
      <span className="mlz-wordmark__caption" aria-hidden="true">
          Architektura vodní mlhy
        </span>
      }
    </span>);

}