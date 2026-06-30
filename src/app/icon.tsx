import { ImageResponse } from "next/og";

// Replaces the default Next.js favicon with the brand mark — Hostinger
// violet rounded square + white chat-square glyph — matching the
// sidebar logo in `src/components/layout/sidebar.tsx`. Next.js renders
// this at build time and auto-injects <link rel="icon"> into <head>.
//
// This route takes precedence over src/app/favicon.ico, which is the
// Next.js default and can stay on disk harmlessly (or be removed).

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "#FF5C00", // DDM brand orange
          borderRadius: 6,
        }}
      >
        <svg
          width="20"
          height="18"
          viewBox="0 0 110 100"
          fill="none"
        >
          {/* Background divider outlines */}
          <path
            d="M 34,43 V 79 H 45 C 56,79 56,43 45,43 H 34 Z"
            stroke="#FF5C00"
            strokeWidth="13"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M 56,61 V 25 L 72,56 L 88,25 V 61"
            stroke="#FF5C00"
            strokeWidth="13"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Foreground DDM letters */}
          <path
            d="M 22,25 V 61 H 33 C 44,61 44,25 33,25 H 22 Z"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M 34,43 V 79 H 45 C 56,79 56,43 45,43 H 34 Z"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M 56,61 V 25 L 72,56 L 88,25 V 61"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Copyright badge */}
          <circle
            cx="99"
            cy="21"
            r="4.5"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          <path
            d="M 100.8,20 C 100.5,19.2 99.8,18.7 99,18.7 C 97.7,18.7 96.7,19.7 96.7,21 C 96.7,22.3 97.7,23.3 99,23.3 C 99.8,23.3 100.5,22.8 100.8,22"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
