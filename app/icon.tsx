import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)",
          borderRadius: "7px",
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Highway Speed Strata */}
          <path
            d="M6 34H18"
            stroke="#93C5FD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <path
            d="M4 40H22"
            stroke="#93C5FD"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <path
            d="M8 28H15"
            stroke="#93C5FD"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />

          {/* Semi-Truck Cab Silhouette Fill */}
          <path
            d="M24 15C24 14.2 24.6 13.5 25.5 13.5H35C37.2 13.5 39.2 14.7 40.2 16.6L46.8 28.5C47.2 29.2 47.5 30 47.5 30.8V42.5C47.5 43.6 46.6 44.5 45.5 44.5H24V15Z"
            fill="white"
            fillOpacity="0.15"
          />

          {/* Precision Cab Outer Contour */}
          <path
            d="M23 16C23 14.3431 24.3431 13 26 13H35.2C37.5 13 39.6 14.2 40.7 16.3L47.2 28.2C47.7 29.1 48 30.1 48 31.2V42.5C48 44.1569 46.6569 45.5 45 45.5H23"
            stroke="white"
            strokeWidth="2.6"
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
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M25 37H31.5"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M25 41H35"
            stroke="#38BDF8"
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
            stroke="#38BDF8"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M18 55.5H46"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
