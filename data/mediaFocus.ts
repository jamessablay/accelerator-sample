// -----------------------------------------------------------------------------
// MEDIA FOCUS: which Consumer Journey cells carry the emphasis, and why.
//
// A CLIENT DECLARATION, not a derivation. Lyka asked for this on 2026-08-07:
//
//   "Across Troubleshooters, Researchers and Caterers can you highlight the
//    'Contemplation' and 'Preparation' boxes so they're easier to locate as I
//    present them? They are the key stages we are addressing through media."
//
// So it is a presentation aid with an argument inside it, and both halves are
// deliberate. THE THREE JOURNEYS ARE THE POINT AS MUCH AS THE TWO STAGES: the
// two unmarked journeys are the ones media is not addressing at these stages, so
// highlighting all five would delete the finding and leave only decoration. If a
// request ever arrives to "just highlight it everywhere", that is a change of
// meaning, not of styling.
//
// ONE DECLARATION, FIVE VIEWS. The Consumer Journey page renders five
// interchangeable views of this data and every one of them consumes this file,
// so the emphasis cannot drift between them or be applied to four of five.
//
// ⚠ STAGES ARE MATCHED BY TITLE, NEVER BY COLUMN INDEX. Same rule the gap
// matrix's axis follows, for the same reason: an index silently marks the wrong
// column when a stage is renamed or reordered, and every cell still looks
// deliberate. A title that matches nothing marks nothing, and
// data/__integrity.ts check 15 turns that into a console error rather than a
// quietly unhighlighted deck. The failure this guards is specifically invisible:
// nobody notices a highlight that is absent.
//
// No React and no DOM types, so this stays importable from anywhere.
// -----------------------------------------------------------------------------

import { JourneyType } from '../types';

/**
 * The Transtheoretical stages media addresses. Matched against
 * `JourneyStageDetail.title` byte for byte.
 */
export const MEDIA_FOCUS_STAGES: readonly string[] = ['Contemplation', 'Preparation'];

/** The journeys the emphasis applies to. The other two are unmarked on purpose. */
export const MEDIA_FOCUS_JOURNEYS: readonly JourneyType[] = [
  JourneyType.CONFLICTED_TROUBLESHOOTERS,
  JourneyType.MINDFUL_RESEARCHERS,
  JourneyType.DEVOTED_CATERERS,
];

/** Short tag rendered on a marked column or step. */
export const MEDIA_FOCUS_LABEL = 'Media focus';

/**
 * The one-line explanation, shown once per view.
 *
 * Without it the wash is an unexplained colour, and an unexplained colour on a
 * data view reads as an encoding: a viewer reasonably asks what green MEANS
 * about those cells. It means someone chose them.
 *
 * ⚠ IT NAMES THE COLOUR, so it belongs only to the four views that use the
 * wash. The gap matrix marks its cells with a DASHED OUTLINE instead (its fills
 * are already a diverging ramp, see that file's header) and therefore writes its
 * own sentence rather than importing this one. A shared string that describes an
 * encoding is only shareable between views that share the encoding.
 */
export const MEDIA_FOCUS_NOTE =
  'Green marks Contemplation and Preparation on the three journeys media is addressing.';

export const isFocusStage = (stageTitle: string): boolean =>
  MEDIA_FOCUS_STAGES.includes(stageTitle);

export const isFocusJourney = (type: JourneyType): boolean =>
  MEDIA_FOCUS_JOURNEYS.includes(type);

/** Both conditions. The only test any view should need. */
export const isFocusCell = (type: JourneyType, stageTitle: string): boolean =>
  isFocusJourney(type) && isFocusStage(stageTitle);
