type Props = { size?: number; className?: string };

/**
 * Sanningskompassen Riso Resistance patch mark.
 * Inline SVG so it scales everywhere (hero, header, favicon, badge).
 */
export function CompassMark({ size = 160, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Sanningskompassen"
    >
      <defs>
        <pattern id="halftone" patternUnits="userSpaceOnUse" width="6" height="6">
          <circle cx="1" cy="1" r="0.7" fill="oklch(0.74 0.13 75)" opacity="0.35" />
        </pattern>
      </defs>

      {/* Cream paper backdrop */}
      <circle cx="100" cy="100" r="98" fill="oklch(0.97 0.012 85)" />

      {/* Outer gold ring */}
      <circle cx="100" cy="100" r="94" fill="none" stroke="oklch(0.74 0.13 75)" strokeWidth="3" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="oklch(0.74 0.13 75)" strokeWidth="1" opacity="0.6" />

      {/* Navy field */}
      <circle cx="100" cy="100" r="82" fill="oklch(0.28 0.08 260)" />
      {/* Halftone overlay */}
      <circle cx="100" cy="100" r="82" fill="url(#halftone)" />

      {/* Curved top text */}
      <defs>
        <path id="top-arc" d="M 22 100 A 78 78 0 0 1 178 100" fill="none" />
        <path id="bot-arc" d="M 28 100 A 72 72 0 0 0 172 100" fill="none" />
      </defs>
      <text fontSize="13" fontWeight="700" letterSpacing="2.5" fill="oklch(0.74 0.13 75)" fontFamily="Bricolage Grotesque, sans-serif">
        <textPath href="#top-arc" startOffset="50%" textAnchor="middle">SANNINGSKOMPASSEN</textPath>
      </text>
      <text fontSize="8" fontWeight="600" letterSpacing="3" fill="oklch(0.74 0.13 75)" fontFamily="Inter, sans-serif">
        <textPath href="#bot-arc" startOffset="50%" textAnchor="middle">EST · JÄRVA · 2026</textPath>
      </text>

      {/* Compass needle, slight mis-registration ghost behind */}
      <g transform="translate(100 100)">
        <polygon points="0,-44 8,0 0,44 -8,0" fill="oklch(0.74 0.13 75)" opacity="0.35" transform="translate(2 1)" />
        <polygon points="0,-44 8,0 0,44 -8,0" fill="oklch(0.74 0.13 75)" />
        <polygon points="0,-44 8,0 0,0" fill="oklch(0.97 0.012 85)" opacity="0.9" />
        <circle cx="0" cy="0" r="5" fill="oklch(0.28 0.08 260)" stroke="oklch(0.74 0.13 75)" strokeWidth="1.5" />
      </g>

      {/* Cardinal stars */}
      <g fill="oklch(0.74 0.13 75)">
        <circle cx="20" cy="100" r="2" />
        <circle cx="180" cy="100" r="2" />
      </g>
    </svg>
  );
}
