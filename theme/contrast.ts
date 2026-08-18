// -----------------------------------------------------------------------------
// WCAG contrast maths.
//
// Lives in the theme container because it is the only thing that can tell you
// whether a client's palette is legal BEFORE it ships. `data/__integrity.ts`
// carried private copies of all three of these; it imports them from here now,
// so the assertion and the theme agree by construction rather than by luck.
//
// SAME TWO CONSTRAINTS AS THE REST OF theme/: no React, no DOM types. This file
// is loaded by the browser, by the Cloudflare Worker, by Tailwind's config
// loader and by the Vite config. Keep it plain TS.
// -----------------------------------------------------------------------------

/** Parse `#RGB` or `#RRGGBB` into 0..255 channels. */
export const parseHex = (hex: string): [number, number, number] => {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

/** WCAG 2.x relative luminance. */
export const luminance = (hex: string): number => {
  const [r, g, b] = parseHex(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2.x contrast ratio between two hex colours. 1:1 to 21:1. */
export const contrast = (a: string, b: string): number => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

export const contrastVsWhite = (hex: string): number => contrast(hex, '#FFFFFF');

/**
 * Mix a hex colour toward white by `t` (0..1).
 *
 * Returns an `rgb()` STRING, not a hex, which is deliberate and load bearing:
 * both media plan budget charts and the APEX methodology bar pass the result
 * straight to Chart.js, and a caller that expected hex would silently produce
 * an invalid colour if this ever changed shape.
 */
export const lighten = (hex: string, t: number): string => {
  const [r, g, b] = parseHex(hex);
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

/**
 * Mix a hex colour toward BLACK by `t` (0..1), returning a hex.
 *
 * Returns hex rather than the `rgb()` string `lighten()` returns, and the
 * asymmetry is deliberate rather than an oversight: `lighten()` feeds Chart.js
 * datasets, where a string is fine, while this feeds theme tokens that have to
 * be composable and comparable, including by the contrast helpers above.
 *
 * Darkening along the channel like this holds the hue and drops the value, so a
 * brand's darkest ink stays recognisably that brand's colour rather than sliding
 * toward grey. That is what makes it safe to derive a chrome surface from a
 * client palette without seeing the result.
 */
export const darken = (hex: string, t: number): string => {
  const [r, g, b] = parseHex(hex);
  const mix = (c: number) => Math.round(c * (1 - t));
  const hx = (c: number) => mix(c).toString(16).padStart(2, '0');
  return `#${hx(r)}${hx(g)}${hx(b)}`.toUpperCase();
};

/**
 * Flatten a semi transparent colour onto an opaque one, returning hex.
 *
 * Needed because contrast is only defined between OPAQUE colours, and this app
 * has real text set in `white/70`, `white/10` borders and washes at fractional
 * alpha. Measuring `#FFFFFF` against a dark ground when what actually renders is
 * 70% white over that ground overstates the ratio, which is the comfortable
 * direction to be wrong in and therefore the dangerous one.
 */
export const compositeOnto = (fg: string, alpha: number, bg: string): string => {
  const [fr, fg_, fb] = parseHex(fg);
  const [br, bg_, bb] = parseHex(bg);
  const mix = (f: number, b: number) => Math.round(f * alpha + b * (1 - alpha));
  const hx = (c: number) => c.toString(16).padStart(2, '0');
  return `#${hx(mix(fr, br))}${hx(mix(fg_, bg_))}${hx(mix(fb, bb))}`.toUpperCase();
};

/** The floors this design system holds itself to. Used by theme checks and by
 *  `data/__integrity.ts`, so there is one definition of "legal". */
export const FLOOR = {
  /** AA body text on its own background. */
  text: 4.5,
  /** WCAG 1.4.11 non-text: icons, controls, meaningful strokes and marks. */
  nonText: 3.0,
  /** Sunburst wedge fills, which carry white labels aided by a halo. */
  wedge: 2.7,
} as const;
