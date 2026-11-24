import React from "react";

interface BrandLogoProps {
  layout?: "stacked" | "horizontal";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  hideText?: boolean;
}

export function BrandLogo({
  layout = "stacked",
  size = "md",
  showTagline = true,
  className = "",
  hideText = false,
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={`flex ${
        layout === "stacked"
          ? "flex-col items-center text-center"
          : "items-center gap-3.5 text-left"
      } ${className}`}
    >
      {/* Modern Geometric Truck Cab + Dynamic Highway + ET Monogram Logo */}
      <div
        className={`relative ${iconSizes[size]} rounded-2xl p-0.5 shadow-lg shadow-blue-600/25 transition-transform duration-300 hover:scale-105 flex-shrink-0`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full rounded-2xl"
        >
          <defs>
            {/* Deep Royal-to-Indigo Gradient */}
            <linearGradient
              id="brand-gradient"
              x1="0"
              y1="0"
              x2="64"
              y2="64"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Aerodynamic Speed Streak */}
            <linearGradient
              id="streak-glow"
              x1="6"
              y1="0"
              x2="32"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.85" />
            </linearGradient>

            {/* Cyan-to-Blue Highway Accent */}
            <linearGradient
              id="road-glow"
              x1="12"
              y1="52"
              x2="52"
              y2="52"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>

          {/* Rounded base badge */}
          <rect width="64" height="64" rx="16" fill="url(#brand-gradient)" />

          {/* Background Highway Speed Strata */}
          <path
            d="M6 34H18"
            stroke="url(#streak-glow)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M4 40H22"
            stroke="url(#streak-glow)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8 28H15"
            stroke="url(#streak-glow)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />

          {/* Aerodynamic Semi-Truck Cab Silhouette */}
          {/* Subtle Cab Fill */}
          <path
            d="M24 15C24 14.2 24.6 13.5 25.5 13.5H35C37.2 13.5 39.2 14.7 40.2 16.6L46.8 28.5C47.2 29.2 47.5 30 47.5 30.8V42.5C47.5 43.6 46.6 44.5 45.5 44.5H24V15Z"
            fill="white"
            fillOpacity="0.12"
          />

          {/* Precision Cab Outer Contour */}
          <path
            d="M23 16C23 14.3431 24.3431 13 26 13H35.2C37.5 13 39.6 14.2 40.7 16.3L47.2 28.2C47.7 29.1 48 30.1 48 31.2V42.5C48 44.1569 46.6569 45.5 45 45.5H23"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* High-Gloss Aerodynamic Windshield */}
          <path
            d="M35.5 17H28V28.5H43.2L37.4 18.2C37 17.5 36.3 17 35.5 17Z"
            fill="white"
            fillOpacity="0.95"
          />

          {/* Integrated Geometric "E" Monogram (Horizontal Speed Wings) */}
          <path
            d="M25 33H35"
            stroke="url(#road-glow)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M25 37H31.5"
            stroke="url(#road-glow)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M25 41H35"
            stroke="url(#road-glow)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Integrated Geometric "T" Monogram (Cab Grille & Front Pillar) */}
          <path
            d="M38 33H44"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M41 33V41.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Precision Wheels with Chrome Hubs */}
          <circle
            cx="43"
            cy="45.5"
            r="4.2"
            fill="#0F172A"
            stroke="white"
            strokeWidth="1.8"
          />
          <circle cx="43" cy="45.5" r="1.5" fill="#38BDF8" />

          <circle
            cx="27"
            cy="45.5"
            r="4.2"
            fill="#0F172A"
            stroke="white"
            strokeWidth="1.8"
          />
          <circle cx="27" cy="45.5" r="1.5" fill="#38BDF8" />

          {/* Highway Horizon & Speed Motion Trails */}
          <path
            d="M11 51.5C21 51.5 31 50 53 50"
            stroke="url(#road-glow)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M18 55.5H46"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
        </svg>
      </div>

      {/* Typography */}
      {!hideText && (
        <div className="transition-opacity duration-200">
          <div
            className={`font-black tracking-tight ${textSizes[size]} text-slate-900 leading-none select-none`}
          >
            <span>Easy</span>{" "}
            <span className="text-blue-600 font-extrabold tracking-tight">
              Trucking
            </span>
          </div>
          {showTagline && (
            <p className="mt-1.5 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
              US Logistics & Dispatch OS
            </p>
          )}
        </div>
      )}
    </div>
  );
}
export default BrandLogo;
