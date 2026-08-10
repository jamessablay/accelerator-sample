// -----------------------------------------------------------------------------
// GROWTH LABELS: the strategic play against each persona, and who does not get one.
//
// A CLIENT DECLARATION, not a derivation. Lyka asked for this on 2026-08-10, on a
// marked up screenshot of the Flow view:
//
//   "Is there a way we can put clearer labels on the growth segment
//    opportunities?"
//
// with the three labels written out, and one clarification underneath that is the
// whole reason this file is keyed the way it is:
//
//   "The Primary HVA is only referring to Conflicted Troubleshooters, not
//    including the Disciplined Outsourcers."
//
// ⚠ KEYED BY PERSONA ID, NEVER BY STAGE. That clarification is a correction of an
// error nobody had made yet, and it is worth honouring precisely. CURIOUS CARRIES
// TWO PERSONAS, so a stage keyed label reading "Primary HVA" would sweep in
// Disciplined Outsourcers, which is the one thing the client explicitly ruled
// out. Stage is the natural key for a four stage ladder and it is the wrong one
// here. An id cannot make that mistake.
//
// THE TWO UNLABELLED PERSONAS ARE PART OF THE STATEMENT. Secure Sleepwalkers
// (Unaware) and Disciplined Outsourcers (Curious) carry no play, and that is the
// point rather than an omission: three of five personas are where the growth is.
// A well meant "label them all for consistency" would delete the finding and
// leave five decorations. data/__integrity.ts warns if the map ever covers every
// persona, the same guard MEDIA_FOCUS_JOURNEYS carries for the same reason.
//
// ONE DECLARATION, THREE VIEWS. Personas renders Wheel, Ladder and Flow over the
// same five personas, so the labels live here and every view reads them. A label
// applied in one view and not the others is exactly the kind of drift the media
// focus declaration was created to stop.
//
// COPY IS THE CLIENT'S, VERBATIM, including the ampersand in "Grow & shift". Do
// not house style it: they wrote these as the strategy line, not as UI copy.
//
// No React and no DOM types, so this stays importable from anywhere.
// -----------------------------------------------------------------------------

export interface GrowthLabel {
  /**
   * The play. Rendered as an uppercase tag.
   *
   * Two personas share `CONVERT`, which is correct: the client gave the same
   * play to Mindful Researchers and Devoted Caterers with different tactics.
   * The tag is not a unique key.
   */
  tag: string;
  /** The tactic, sentence case. Rendered beside or under the tag. */
  text: string;
}

/**
 * Persona id -> its play. Ids, not names: a name is display copy and the client
 * has already rewritten one persona's copy once (see personasData.ts).
 *
 *   101 Devoted Caterers          201 Mindful Researchers
 *   301 Conflicted Troubleshooters
 *   401 Disciplined Outsourcers   402 Secure Sleepwalkers   <- deliberately absent
 */
export const GROWTH_LABELS: Readonly<Record<number, GrowthLabel>> = {
  301: { tag: 'PRIMARY HVA', text: 'Grow & shift belief in simple steps' },
  201: { tag: 'CONVERT', text: 'Address price with evidence' },
  101: { tag: 'CONVERT', text: 'Reassure through social proof' },
};

/** The only test a view should need. Undefined means deliberately unlabelled. */
export const growthLabel = (personaId: number): GrowthLabel | undefined =>
  GROWTH_LABELS[personaId];

/**
 * Shown once per view, so a tag is never an unexplained badge.
 *
 * It says "three of the five" out loud because the absence is the finding, and
 * an absence cannot annotate itself: a reader who only sees the three labels has
 * no way to tell whether the other two were considered and passed over or simply
 * missed.
 */
export const GROWTH_LABEL_NOTE =
  'Tags mark the three personas carrying a growth play. The other two are unmarked deliberately.';
