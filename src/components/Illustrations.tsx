import * as React from "react";

/**
 * Minimalist black & white quiz illustrations (shadcn-style)
 * - Uses currentColor for strokes/fills so you can control with text-white/text-black
 * - Tailwind-ready via className
 * - Two components: PracticeModeIcon and ExamModeIcon
 */

type IconProps = {
  className?: string;
  size?: number | string;
  title?: string;
  strokeWidth?: number;
};

const toDim = (s?: number | string) => (typeof s === "number" ? s : s || 128);

export function PracticeModeIcon({
  className,
  size = 128,
  title = "Practice Mode Illustration",
  strokeWidth = 1.75,
}: IconProps) {
  const dim = toDim(size);
  return (
    <svg
      role="img"
      aria-label={title}
      width={dim}
      height={dim}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{title}</title>
      {/* Frame corners */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        <path
          d="M8 16h10M8 16v10M120 16h-10M120 16v10M8 112h10M8 112v-10M120 112h-10M120 112v-10"
          opacity=".35"
        />
      </g>

      {/* Stacked cards */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="18" y="24" width="92" height="64" rx="12" opacity=".25" />
        <rect x="14" y="30" width="92" height="64" rx="12" opacity=".5" />
        <rect x="10" y="36" width="92" height="64" rx="12" />

        {/* Header line and dots */}
        <line x1="14" y1="48" x2="98" y2="48" opacity=".5" />
        <circle cx="18" cy="42" r="2" />
        <circle cx="24" cy="42" r="2" opacity=".6" />
        <circle cx="30" cy="42" r="2" opacity=".35" />

        {/* Multiple choice list */}
        <g>
          <circle cx="26" cy="62" r="4" />
          <line x1="34" y1="62" x2="86" y2="62" />
          {/* selected */}
          <circle cx="26" cy="74" r="4" />
          <circle cx="26" cy="74" r="2" fill="currentColor" stroke="none" />
          <line x1="34" y1="74" x2="86" y2="74" />
          <circle cx="26" cy="86" r="4" />
          <line x1="34" y1="86" x2="86" y2="86" />
        </g>

        {/* Input field (short answer) */}
        <g>
          <rect x="22" y="96" width="56" height="12" rx="3" opacity=".12" />
          <line x1="22" y1="108" x2="78" y2="108" />
        </g>

        {/* Progress bar */}
        <g>
          <line x1="10" y1="108" x2="102" y2="108" opacity=".2" />
          <line
            x1="10"
            y1="108"
            x2="62"
            y2="108"
            strokeWidth={strokeWidth + 0.5}
          />
        </g>
      </g>
    </svg>
  );
}

export function ExamModeIcon({
  className,
  size = 128,
  title = "Exam Mode Illustration",
  strokeWidth = 1.75,
}: IconProps) {
  const dim = toDim(size);
  return (
    <svg
      role="img"
      aria-label={title}
      width={dim}
      height={dim}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{title}</title>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Clipboard/backing sheet */}
        <rect x="18" y="16" width="92" height="96" rx="12" opacity=".25" />
        <rect x="14" y="20" width="92" height="96" rx="12" opacity=".5" />
        <rect x="10" y="24" width="92" height="96" rx="12" />
        <rect x="38" y="18" width="36" height="10" rx="3" />

        {/* Top status: timer + progress */}
        <circle cx="20" cy="32" r="5" />
        <path d="M20 29v3M20 32h3" />
        <line x1="30" y1="32" x2="100" y2="32" opacity=".25" />
        <line x1="30" y1="32" x2="70" y2="32" strokeWidth={strokeWidth + 0.5} />

        {/* Exam rows with answer bubbles (A–D) */}
        {Array.from({ length: 4 }).map((_, i) => {
          const y = 46 + i * 16;
          return (
            <g key={i}>
              <line x1="16" y1={y} x2="68" y2={y} />
              <circle cx="76" cy={y} r="4" />
              <circle cx="88" cy={y} r="4" />
              <circle cx="100" cy={y} r="4" />
              <circle cx="112" cy={y} r="4" />
            </g>
          );
        })}

        {/* One filled bubble to imply selection */}
        <circle cx="88" cy="78" r="4" />
        <circle cx="88" cy="78" r="2" fill="currentColor" stroke="none" />

        {/* Bottom actions area / submission hint */}
        <rect x="16" y="92" width="36" height="10" rx="2" opacity=".12" />
        <rect x="56" y="92" width="46" height="10" rx="2" opacity=".12" />
      </g>
    </svg>
  );
}

/* Usage examples:
  <PracticeModeIcon className="text-white" />
  <ExamModeIcon className="text-white" />
  <PracticeModeIcon className="text-black" size={160} />
*/

/**
 * FlashcardBW — minimalist, shadcn-style SVG for dark UIs
 * - Black & white only (uses currentColor for strokes/fills)
 * - Works as an inline icon/illustration
 * - No external deps; Tailwind-ready via className
 */
export function FlashcardBW({
  className,
  size = 128,
  title = "Flashcard Illustration",
  strokeWidth = 1.75,
}: {
  className?: string;
  size?: number | string;
  title?: string;
  strokeWidth?: number;
}) {
  const dim = typeof size === "number" ? size : size || 128;
  return (
    <svg
      role="img"
      aria-label={title}
      width={dim}
      height={dim}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{title}</title>
      {/* All strokes use currentColor so you can set text-white or text-black outside */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Stacked cards (subtle offsets) */}
        <rect
          x="22"
          y="28"
          rx="10"
          ry="10"
          width="84"
          height="60"
          opacity="0.25"
        />
        <rect
          x="18"
          y="34"
          rx="10"
          ry="10"
          width="84"
          height="60"
          opacity="0.5"
        />

        {/* Top card */}
        <rect x="14" y="40" rx="12" ry="12" width="84" height="60" />

        {/* Header strip (minimal) */}
        <line x1="18" y1="52" x2="94" y2="52" opacity="0.5" />
        <circle cx="22" cy="46" r="2" />
        <circle cx="28" cy="46" r="2" opacity="0.6" />
        <circle cx="34" cy="46" r="2" opacity="0.35" />

        {/* Content lines */}
        <line x1="26" y1="66" x2="74" y2="66" opacity="0.65" />
        <line x1="26" y1="74" x2="62" y2="74" opacity="0.5" />
        <line x1="26" y1="90" x2="86" y2="90" opacity="0.65" />
        <line x1="26" y1="98" x2="70" y2="98" opacity="0.5" />

        {/* Question mark (minimal path) */}
        <path d="M72 70c0-7 5-12 12-12 6 0 11 4 11 10 0 5-3 8-8 10-4 2-5 4-5 8v4" />
        <circle cx="82" cy="98" r="2.5" fill="currentColor" stroke="none" />

        {/* Flash bolt (simple) */}
        <path
          d="M100 84l-6 10h6l-3 10 10-14h-6l3-6z"
          fill="currentColor"
          stroke="none"
        />

        {/* Minimal frame corners (shadcn-esque hint) */}
        <path
          d="M8 20h10M8 20v10M120 20h-10M120 20v10M8 116h10M8 116v-10M120 116h-10M120 116v-10"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

/* Usage examples (Tailwind/shadcn):
  <FlashcardBW className="text-white" />           // dark bg
  <FlashcardBW className="text-black" />           // light bg
  <FlashcardBW className="text-white drop-shadow" size={160} />
*/
