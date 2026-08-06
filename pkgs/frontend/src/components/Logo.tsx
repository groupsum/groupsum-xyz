/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: "lockup" | "symbol" | "wordmark";
  theme?: "light" | "dark" | "ambient";
}

/**
 * LogoSymbol - Representing the "Field Notes" creative territory:
 * Intersecting fine lines, precise coordinates, and a central registration node.
 */
export const LogoSymbol: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none align-middle ${className}`}
      aria-hidden="true"
    >
      {/* Outer bounding box frame - technical sketch style */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="4"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.15"
        strokeDasharray="2 2"
      />

      {/* Axis/Grid lines intersecting at coordinates */}
      <line x1="6" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.25" />
      <line x1="16" y1="6" x2="16" y2="26" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.25" />

      {/* Structured Path: Traces connecting evidence points */}
      <path
        d="M 6 22 L 14 14 L 20 20 L 26 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Registration Crosshair in corner */}
      <path
        d="M 23 23 L 27 23 M 25 21 L 25 25"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.4"
      />

      {/* Coherent Evidence points (circles) */}
      <circle cx="14" cy="14" r="2.5" fill="var(--color-signal, #c98232)" />
      <circle cx="26" cy="8" r="3" fill="currentColor" />
      <circle cx="6" cy="22" r="2" fill="currentColor" stroke="var(--color-canvas, #f3f1ea)" strokeWidth="1" />
    </svg>
  );
};

export const LogoWordmark: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <span
      className={`font-serif text-xl font-bold tracking-tight text-ink ${className}`}
      style={{ letterSpacing: "-0.03em" }}
    >
      Groupsum<span className="text-accent font-sans text-xs align-super ml-0.5">LLC</span>
    </span>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 32,
  variant = "lockup",
}) => {
  if (variant === "symbol") {
    return <LogoSymbol size={size} className={className} />;
  }

  if (variant === "wordmark") {
    return <LogoWordmark className={className} />;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoSymbol size={size} />
      <LogoWordmark />
    </div>
  );
};
