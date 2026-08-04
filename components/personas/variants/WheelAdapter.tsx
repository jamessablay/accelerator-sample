import React from 'react';
import PersonaCompositionChart from '../PersonaCompositionChart';
import { personaCategories } from '../../../data/personasData';
import type { PersonaVizProps } from './types';

// -----------------------------------------------------------------------------
// The existing sunburst, wrapped to the shared variant contract.
//
// WHY AN ADAPTER RATHER THAN CHANGING THE CHART
// PersonaCompositionChart is 561 lines of hand-rolled polar geometry with three
// documented rebuild traps: forced arc orientation flips the bottom-quadrant
// labels upside down, a 27 character stage title clips at both ends of a 90
// degree arc, and a hardcoded label width cannot serve wedges that are 45 degrees
// in one stage and 90 in another. None of that is visible to tsc, and all of it
// is only findable by rendering.
//
// It is also the BASELINE in this comparison. Editing the thing you are
// A/B testing against invalidates the test.
//
// So the chart is untouched and this file translates props. It reads
// personaCategories directly because the chart wants the raw nested shape, not
// the derived StageMetrics the other three views use.
// -----------------------------------------------------------------------------

const WheelAdapter: React.FC<PersonaVizProps> = ({
  selectedPersonaId,
  selectedStageKey,
  onSelectPersona,
  onSelectStage,
}) => (
  <PersonaCompositionChart
    categories={personaCategories}
    onSelectPersona={onSelectPersona}
    selectedPersonaId={selectedPersonaId}
    onSelectCategory={onSelectStage}
    selectedCategoryKey={selectedStageKey}
  />
);

export default WheelAdapter;
