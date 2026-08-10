export enum Page {
  BUSINESS_DASHBOARD = 'Business Dashboard',
  TEN_THINGS = 'Ten Things The Data Says',
  PERSONAS = 'Personas',
  CUSTOMER_JOURNEY = 'Consumer Journey',
  INTERACTIVE_MEDIA_PLAN = 'Interactive Media Plan',
  APEX_BY_SPEED = 'APEX by SPEED',
  NOTION_COWORKING = 'Notion Coworking Setup',
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
