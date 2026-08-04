import type React from 'react';
import type { Persona } from '../../../data/personasData';
import type { StageMetrics } from '../../../data/audienceModel';

// -----------------------------------------------------------------------------
// One contract, many views.
//
// Every persona view reads the same derived model and emits the same two
// selections, so pages/Personas.tsx stays a thin host and the two existing detail
// panels (PersonaDetail, CategoryDetail) are reused unchanged by all of them.
//
// Adding or removing a view is this union plus one registry entry. 'slope' was
// removed on 2026-08-04; see the header of ./index.ts.
// -----------------------------------------------------------------------------

export type PersonaVariantId = 'wheel' | 'ladder' | 'flow';

export interface PersonaVizProps {
  /** The readiness ladder, ordered Unaware to Ready. */
  stages: StageMetrics[];
  selectedPersonaId: number | null;
  selectedStageKey: string | null;
  onSelectPersona: (persona: Persona) => void;
  onSelectStage: (key: string) => void;
}

export interface PersonaVariantDef {
  id: PersonaVariantId;
  label: string;
  /** One line on what this view argues. Surfaces as the switcher tooltip. */
  hint: string;
  /**
   * 'square' gets the sunburst's centred aspect-square frame and the slide-left
   * panel behaviour. 'wide' fills the content width and the panel overlays.
   */
  shape: 'square' | 'wide';
  /**
   * True when size encodes market share. The "quadrants are equal" disclaimer in
   * the page header renders only when this is false, because it is a statement
   * about the sunburst and is untrue of everything else.
   */
  proportional: boolean;
  /**
   * True when the view should be handed the visualisation area's HEIGHT as well
   * as its width, because it can use it. Set on the ladder and the flow.
   *
   * The two do it by different means, and the distinction matters:
   *
   *  - The LADDER is flexbox all the way down, so `h-full` is enough: its bars
   *    are flex shares of whatever height they are given.
   *  - The FLOW is an SVG, and you cannot make one fill by stretching it.
   *    `preserveAspectRatio` would either letterbox it or turn the circles into
   *    ellipses. It measures the box and recomputes its own viewBox HEIGHT so
   *    that `h-auto` lands on the container, keeping viewBox WIDTH fixed so the
   *    horizontal scale, and therefore every type size, is unchanged.
   *
   * Both current wide views set it. A view should NOT, if its geometry is a
   * fixed plot area that extra height only pads: the removed Index view was the
   * example, since stretching a slope chart just spreads five labels apart.
   */
  fills?: boolean;
  Component: React.FC<PersonaVizProps>;
}
