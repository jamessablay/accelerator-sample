export enum Page {
  // Business Dashboard was removed on 2026-08-11 on client direction. It had
  // never carried Lyka data: its Power BI slot was empty (the inherited embed
  // was another client's report and was deleted at conversion), so the page
  // only ever rendered an "awaiting data connection" empty state. The page,
  // its icon and its nav entry are gone; git history has them if a real Lyka
  // report URL ever arrives.
  TEN_THINGS = 'Ten Things The Data Says',
  PERSONAS = 'Personas',
  CUSTOMER_JOURNEY = 'Consumer Journey',
  INTERACTIVE_MEDIA_PLAN = 'Interactive Media Plan',
  APEX_BY_SPEED = 'APEX by SPEED',
  NOTION_COWORKING = 'Notion Coworking Setup',
  ECOSYSTEM = 'Plugging Into The Ecosystem',
}

/**
 * One journey per persona, not per readiness stage.
 *
 * The source deck maps a full Transtheoretical journey (Precontemplation to
 * Maintenance) onto each of the five personas, so the Consumer Journey tab strip
 * is a persona selector. Keep these members aligned with the persona names in
 * data/personasData.ts and with `journeyTopLevelDetails` in
 * pages/CustomerJourney.tsx.
 */
export enum JourneyType {
  DEVOTED_CATERERS = 'DEVOTED_CATERERS',
  MINDFUL_RESEARCHERS = 'MINDFUL_RESEARCHERS',
  CONFLICTED_TROUBLESHOOTERS = 'CONFLICTED_TROUBLESHOOTERS',
  DISCIPLINED_OUTSOURCERS = 'DISCIPLINED_OUTSOURCERS',
  SECURE_SLEEPWALKERS = 'SECURE_SLEEPWALKERS',
}

export enum JourneySubCategoryKey {
  MACRO_JOURNEY = 'MACRO_JOURNEY',
}
