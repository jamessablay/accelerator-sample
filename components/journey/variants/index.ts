// -----------------------------------------------------------------------------
// Consumer Journey visualisation registry.
//
// REVIEW SCAFFOLDING, same as the persona registry. Once a direction is chosen,
// delete the losers, cut this list down, and drop the switcher from the page.
//
// `table` is first because it is the baseline. DEFAULT_JOURNEY_VARIANT is the
// spine because that is the one that answers the actual complaint: the page is
// too text heavy.
// -----------------------------------------------------------------------------

import TableAdapter from './TableAdapter';
import JourneySpine from './JourneySpine';
import TensionMap from './TensionMap';
import FrictionStrip from './FrictionStrip';
import type { JourneyVariantDef, JourneyVariantId } from './types';

export type { JourneyVizProps, JourneyVariantId, JourneyVariantDef } from './types';

export const JOURNEY_VARIANTS: readonly JourneyVariantDef[] = [
  {
    id: 'table',
    label: 'Table',
    hint: 'Baseline. The current 6-column table, roughly 567 words per journey.',
    compactHeader: false,
    showsAllJourneys: false,
    Component: TableAdapter,
  },
  {
    id: 'spine',
    label: 'Spine',
    hint: 'The curve leads, one stage of detail at a time.',
    compactHeader: true,
    showsAllJourneys: false,
    Component: JourneySpine,
  },
  {
    id: 'tension',
    label: 'Compare',
    hint: 'All five journeys on one shared scale, with the emotion to reason gap.',
    compactHeader: true,
    showsAllJourneys: true,
    Component: TensionMap,
  },
  {
    id: 'strip',
    label: 'Strip',
    hint: 'All five stages at once, encoded rather than written.',
    compactHeader: true,
    showsAllJourneys: false,
    Component: FrictionStrip,
  },
] as const;

export const JOURNEY_VARIANT_IDS = JOURNEY_VARIANTS.map((v) => v.id) as JourneyVariantId[];

export const DEFAULT_JOURNEY_VARIANT: JourneyVariantId = 'spine';

export const getJourneyVariant = (id: JourneyVariantId): JourneyVariantDef =>
  JOURNEY_VARIANTS.find((v) => v.id === id) ?? JOURNEY_VARIANTS[0];
