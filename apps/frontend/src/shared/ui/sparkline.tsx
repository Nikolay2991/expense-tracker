import * as React from "react";

// Decorative trend squiggle used inside the pastel stat cards.
const PATHS: Record<string, string> = {
  up: "M0 26 C 10 26, 16 10, 26 12 S 40 4, 52 14 S 66 2, 76 6",
  down: "M0 6 C 10 6, 16 22, 26 20 S 40 28, 52 18 S 66 30, 76 26",
  flat: "M0 18 C 12 10, 20 24, 34 16 S 54 8, 76 16",
};

export function Sparkline({
  variant = "up",
  className,
  color = "currentColor",
}: {
  variant?: "up" | "down" | "flat";
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 76 32"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d={PATHS[variant]}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
