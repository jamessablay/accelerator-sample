import type { Persona } from './personasData';

// -----------------------------------------------------------------------------
// Persona film, kept OUT of personasData.ts on purpose.
//
// personasData.ts is GENERATED from the research document, and its own header
// says to regenerate rather than hand edit. A `videoUrl` typed into a generated
// file is deleted the next time anyone follows that instruction, and the failure
// is silent: the slot simply falls back to its empty state and the deck quietly
// loses its film. This map is the join instead, so regenerating the research
// cannot touch the footage and adding footage cannot touch the research.
//
// KEYED BY PERSONA ID, not by name. Names are display copy and the source
// document could reword one; the ids are stable. A key that matches no persona
// renders nothing at all, which is exactly the silent join data/__integrity.ts
// exists to catch, so it asserts both directions.
//
// THE FILES. Five Veo generated vignettes, one per persona, delivered
// 2026-08-04. Each is 1080x1920 h264, 8 seconds, 24fps: native 9:16, matching
// PersonaMediaSlot's frame exactly. Verified with ffprobe, and cropdetect
// reports full width content (`crop=1080:1888:0:16`) on all five, so **they have
// no baked in side bars**. That matters: the slot used to apply
// `transform: scale(1.08)` to crop the pillarboxing on Hamilton Island's films,
// and left in place it would have cropped roughly 4% off every edge of correctly
// framed portrait footage. It was removed when these landed.
// -----------------------------------------------------------------------------

/** Persona id to a path under `public/`. Asserted against personasData in dev. */
export const PERSONA_VIDEOS: Readonly<Record<number, string>> = {
  101: '/personaVideos/devoted-caterers.mp4',
  201: '/personaVideos/mindful-researchers.mp4',
  301: '/personaVideos/conflicted-troubleshooters.mp4',
  401: '/personaVideos/disciplined-outsourcers.mp4',
  402: '/personaVideos/secure-sleepwalkers.mp4',
};

/**
 * The film for a persona, or '' if there is none.
 *
 * `persona.videoUrl` still wins when set, so the generated field stays a valid
 * override rather than becoming dead weight. It is empty on every record today.
 */
export const personaVideo = (persona: Persona): string =>
  persona.videoUrl || PERSONA_VIDEOS[persona.id] || '';
