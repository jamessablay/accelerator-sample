// -----------------------------------------------------------------------------
// THE TAILWIND SCALE, DERIVED.
//
// `tailwind.config.ts` is four lines that spread this object. Everything in it
// comes from the theme, so the utility classes and the TS tokens cannot describe
// different systems.
//
// This replaces an inline `tailwind.config` <script> in index.html that shipped
// alongside the Tailwind CDN. Three things were wrong with that arrangement
// beyond the duplication:
//
//   1. The CDN ships a JIT COMPILER to the browser and generates the stylesheet
//      at runtime, on every load, on the client's machine.
//   2. It is a third party network dependency on the critical path. A client
//      whose corporate network blocks unpkg/jsdelivr style CDNs sees the deck
//      COMPLETELY UNSTYLED, in a meeting, with no fallback.
//   3. Utility ORDER was not controllable, which is the actual root cause of the
//      `.font-mono` bug: Tailwind's default `.font-mono` loaded after the hand
//      written rule and won at equal specificity, so 87 elements across 24 files
//      rendered in the OS monospace instead of the brand face.
//
// All three go away with a real build.
// -----------------------------------------------------------------------------

import { ELEVATION, NAV_BG, ease, palette, theme } from './index';
import {
  AGENCY,
  LINE_HEIGHT,
  MOTION,
  RADIUS,
  SCREENS,
  SPACE,
  TRACKING,
  TYPE,
  type TypeToken,
} from './house';

/** `fontSize` scale: the TYPE steps zipped with their line heights. */
const fontSize = (Object.keys(TYPE) as TypeToken[]).reduce(
  (acc, token) => {
    acc[token] = [`${TYPE[token]}px`, { lineHeight: String(LINE_HEIGHT[token]) }];
    return acc;
  },
  {} as Record<string, [string, { lineHeight: string }]>,
);

export const tailwindPreset = {
  theme: {
    extend: {
      screens: { ...SCREENS },

      fontSize,

      // Tailwind OWNS the three family utilities now. The hand written
      // `.font-display` / `.font-mono` rules that used to sit in index.html are
      // gone, along with the documented warning never to declare
      // `fontFamily.display` in the config because it would race them. With one
      // owner there is no race to lose.
      fontFamily: {
        display: theme.typefaces.display,
        sans: theme.typefaces.body,
        mono: theme.typefaces.mono,
      },

      letterSpacing: {
        eyebrow: TRACKING.eyebrow,
        caps: TRACKING.caps,
        display: TRACKING.display,
      },

      // SEMANTIC colour names, matching theme/types.ts. The previous config
      // declared a `lyka` namespace whose utilities were used exactly ZERO
      // times across the whole codebase, while 61 arbitrary `bg-[#hex]` values
      // did the work instead. These exist so that hover and focus states, which
      // an inline style cannot express, have somewhere brand aware to go.
      colors: {
        brand: {
          'ink-deepest': palette.inkDeepest,
          'ink-strong': palette.inkStrong,
          ink: palette.ink,
          'ink-muted': palette.inkMuted,
          'accent-text': palette.accentText,
          accent: palette.accent,
          warm: palette.warm,
          'warm-alt': palette.warmAlt,
          'warm-soft': palette.warmSoft,
          page: palette.page,
          surface: palette.surface,
          'surface-alt': palette.surfaceAlt,
          'surface-sunk': palette.surfaceSunk,
          hairline: palette.hairline,
          'hairline-soft': palette.hairlineSoft,
          'nav-bg': NAV_BG,
        },
        agency: { red: AGENCY.red },
      },

      // ADDS to Tailwind's numeric scale rather than replacing it, so `p-4` is
      // still 16px and no existing utility changed meaning. These give the
      // handful of recurring surface decisions a name: `p-card`, `gap-section`.
      spacing: {
        tight: SPACE.tight,
        card: SPACE.card,
        panel: SPACE.panel,
        section: SPACE.section,
      },

      borderRadius: {
        control: RADIUS.control,
        card: RADIUS.card,
        surface: RADIUS.surface,
      },

      boxShadow: {
        sm: ELEVATION.sm,
        md: ELEVATION.md,
        lg: ELEVATION.lg,
        xl: ELEVATION.xl,
      },

      // The house curve as the DEFAULT, plus the other two members of the same
      // family. The old approach was a `*` rule in index.html setting
      // transition-timing-function, which never applied: a `*` selector is
      // specificity 0-0-0 and every `ease-out` utility is 0-1-0, so the
      // utilities won regardless of source order. The comment beside it claimed
      // the opposite for months.
      transitionTimingFunction: {
        DEFAULT: ease,
        'ease-in-out': ease,
        out: MOTION.decelerate,
        in: MOTION.accelerate,
      },

      transitionDuration: {
        DEFAULT: MOTION.duration.fast,
        fast: MOTION.duration.fast,
        base: MOTION.duration.base,
        slow: MOTION.duration.slow,
      },

      // FOCUS RING. Thirteen controls were drawing Tailwind's stock blue on a
      // teal and cream deck, and three of those paired it with `ring-offset-2`
      // and no offset colour, which paints a WHITE halo on a cream page.
      // Setting both defaults repairs every one of them without touching a
      // component. Deliberately `accent-text`, not `accent`: the ring has to
      // clear the 3:1 non-text floor against the page.
      ringColor: { DEFAULT: palette.accentText },
      ringOffsetColor: { DEFAULT: palette.page },

      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: `fadeIn ${MOTION.duration.slow} ${ease} forwards`,
      },
    },
  },
};
