// -----------------------------------------------------------------------------
// Persona visualisation registry.
//
// REVIEW SCAFFOLDING. Views of the same model exist so a direction can be
// chosen by looking rather than by imagining. Once it is chosen:
//
//   1. Delete the losing component files.
//   2. Cut PERSONA_VARIANTS down to the survivor.
//   3. If only one remains, delete VariantSwitcher and useVariant from the page.
//
// Order here is the order in the switcher. `wheel` is first because it is the
// baseline, and DEFAULT_PERSONA_VARIANT is the ladder because that is the view
// the comparison is really about.
//
// WAS FOUR, NOW THREE. `slope` (labelled "Index", ConversionSlope.tsx) was cut
// on 2026-08-04. It plotted market share against customer share as crossing
// lines with the conversion index on the right, which the Ladder already argues
// with a mirrored bar and the Flow already carries on its chips. A stored
// `pv=slope` is not a problem: useVariant validates against these ids and falls
// back to the default. `MAX_CONVERSION_INDEX` in data/audienceModel.ts is now
// definitively unused, though it was already unimported before this.
// -----------------------------------------------------------------------------

import WheelAdapter from './WheelAdapter';
import ReadinessLadder from './ReadinessLadder';
import MindsetFlow from './MindsetFlow';
import type { PersonaVariantDef, PersonaVariantId } from './types';

export type { PersonaVizProps, PersonaVariantId, PersonaVariantDef } from './types';

export const PERSONA_VARIANTS: readonly PersonaVariantDef[] = [
  {
    id: 'wheel',
    label: 'Wheel',
    hint: 'Baseline. The current sunburst: equal quadrants, share as text only.',
    shape: 'square',
    proportional: false,
    Component: WheelAdapter,
  },
  {
    id: 'ladder',
    label: 'Ladder',
    hint: 'Market above, Lyka customers below, sized to scale. The two bars invert.',
    shape: 'wide',
    proportional: true,
    // The only view that is flexbox all the way down, so the only one that can
    // genuinely use the vertical room. See `fills` in types.ts.
    fills: true,
    Component: ReadinessLadder,
  },
  {
    id: 'flow',
    label: 'Flow',
    // Fills too, but by a different mechanism from the ladder: it measures the
    // box and recomputes its own viewBox HEIGHT so `h-auto` lands on the
    // container. See the geometry header in MindsetFlow.
    fills: true,
    hint: 'One owner, four mindsets. Movement and the triggers that cause it.',
    shape: 'wide',
    proportional: true,
    Component: MindsetFlow,
  },
] as const;

export const PERSONA_VARIANT_IDS = PERSONA_VARIANTS.map((v) => v.id) as PersonaVariantId[];

export const DEFAULT_PERSONA_VARIANT: PersonaVariantId = 'ladder';

export const getPersonaVariant = (id: PersonaVariantId): PersonaVariantDef =>
  PERSONA_VARIANTS.find((v) => v.id === id) ?? PERSONA_VARIANTS[0];
