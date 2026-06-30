import { cn } from "@/lib/utils";

interface DdmLogoProps extends React.SVGProps<SVGSVGElement> {
  showBackground?: boolean;
  outlineColor?: string; // CSS color for the gap outline (defaults to var(--card))
}

export function DdmLogo({
  className,
  showBackground = false,
  outlineColor = "var(--card)",
  ...props
}: DdmLogoProps) {
  const logoSvg = (
    <svg
      viewBox="0 0 110 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full select-none", showBackground ? "text-white" : "text-primary", className)}
      {...props}
    >
      {/* 1. Background Mask/Outline paths for overlap (thick stroke) */}
      <path
        d="M 34,43 V 79 H 45 C 56,79 56,43 45,43 H 34 Z"
        stroke={outlineColor}
        strokeWidth="13"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M 56,61 V 25 L 72,56 L 88,25 V 61"
        stroke={outlineColor}
        strokeWidth="13"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* 2. Main foreground letter paths (thinner stroke) */}
      {/* First D (Top-Left) */}
      <path
        d="M 22,25 V 61 H 33 C 44,61 44,25 33,25 H 22 Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Second D (Bottom-Center) */}
      <path
        d="M 34,43 V 79 H 45 C 56,79 56,43 45,43 H 34 Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* M (Top-Right) */}
      <path
        d="M 56,61 V 25 L 72,56 L 88,25 V 61"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* Copyright symbol at the top right */}
      <circle
        cx="99"
        cy="21"
        r="4.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M 100.8,20 C 100.5,19.2 99.8,18.7 99,18.7 C 97.7,18.7 96.7,19.7 96.7,21 C 96.7,22.3 97.7,23.3 99,23.3 C 99.8,23.3 100.5,22.8 100.8,22"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );

  if (showBackground) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF5C00] p-1.5 shadow-sm shadow-[#FF5C00]/20">
        {logoSvg}
      </div>
    );
  }

  return logoSvg;
}
