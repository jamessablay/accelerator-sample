// -----------------------------------------------------------------------------
// Lyka audience personas: five personas across the four-stage readiness ladder.
//
// GENERATED, not hand written. The records below were emitted from a parse of the
// source document, so the prose cannot drift from the research. If that document
// is revised, REGENERATE rather than editing this file by hand.
//
// SOURCE: "Audience Personas_Enriched Version for Aaron.docx" in
// .../New Business/Lyka/Roy Morgan/. Every bullet under barriers, triggers,
// motivations and influences is transcribed VERBATIM from that document, as are
// all percentages, the Lyka natural fit ratings and the movement goals. Nothing
// in this file is agency invention.
//
// The four stage names come from the Roy Morgan Single Source profile exports in
// the same folder (Unaware / Curious / Considering / Ready Owner .prwx), so the
// ladder is a research artefact, not a framework laid over the data afterwards.
//
// STRUCTURE: Curious carries TWO personas (Conflicted Troubleshooters and
// Disciplined Outsourcers); the other three stages carry one each. On the wheel
// the Curious quadrant therefore splits into two 45 degree wedges while the other
// three personas each get a full 90 degrees. That is why the two Curious titles
// are the shortest: they have half the arc to label.
//
// ⚠ ONE PLACEMENT HERE IS A CLIENT DECISION, NOT THE RESEARCH'S. On 2026-08-07
// Lyka asked for Disciplined Outsourcers to sit in CURIOUS. The source document
// places them in Unaware / Unconvinced, so this is the one field in this file
// that its generator would not produce. It is `category` (plus the `stageLabel`
// that must follow it) on id 401 and NOTHING ELSE: every string on that record is
// still the research's own, verbatim, including two that now read against the new
// stage and were deliberately NOT reworded, because they are copy the client
// reads as theirs:
//
//   - `movement`  "Unconvinced → Considering or Ready after an expert or health
//                 trigger." The ladder now starts that jump from Curious.
//   - `barriers[0]` "No immediate evidence that their current routine is
//                 failing." That is an Unaware posture as the source frames it.
//
// So REGENERATING THIS FILE SILENTLY REVERTS THE MOVE. It will put 401 back in
// Unaware, the stage shares will go back to 49/25 and integrity check 7b will
// fail against categoryData until that is reconciled too. Re-apply the two fields
// after any regeneration.
//
// `avatar` and `videoUrl` are still EMPTY on every record, and the persona films
// that landed on 2026-08-04 did NOT change that. They are joined by persona id in
// data/personaMedia.ts instead, precisely because this file is generated: a path
// typed in here is deleted the next time someone follows the instruction above,
// silently, leaving the slot in its empty state. `videoUrl` remains a valid per
// record override and personaVideo() prefers it; nothing sets it today.
// -----------------------------------------------------------------------------

export interface Persona {
  id: number;
  /** Full persona name from the source document. */
  name: string;
  /** Short label rendered inside the outer-ring wedge. Abbreviated to fit the arc. */
  title: string;
  /** Readiness stage. MUST be a categoryData key. */
  category: string;
  /** The stage heading as written in the source doc, e.g. "UNAWARE / UNCONVINCED". */
  stageLabel: string;
  /** Share of the Australian dog-owner market. */
  marketShare: string;
  /** Share of Lyka's current customer base. */
  customerShare: string;
  /** Lyka natural fit, verbatim: Very High | High Growth Potential | Medium | Low. */
  solutionFit: string;
  /** The justification for the fit rating. Empty where the source gave none. */
  fitRationale: string;
  /** The stated movement goal for this persona. */
  movement: string;
  /** One-sentence pull-out: the first line of the source Snapshot. */
  snapshot: string;
  /** The remainder of the source Snapshot, joined. */
  description: string;
  barriers: string[];
  triggers: string[];
  motivations: string[];
  influences: string[];
  /** Empty by design. See the note above. */
  avatar: string;
  /** Empty by design. See the note above. */
  videoUrl: string;
}

export enum PersonaType {
  /** Single bucket. The chart reads it and groups its personas by `category`. */
  LYKA_AUDIENCE = 'LYKA_AUDIENCE',
}

export interface PersonaCategory {
  type: PersonaType;
  personas: Persona[];
}

const lykaPersonas: Persona[] = [
  {
    id: 101,
    name: "Devoted Caterers",
    title: "Devoted Caterers",
    category: "Ready",
    stageLabel: "READY",
    marketShare: "11%",
    customerShare: "27%",
    solutionFit: "Very High",
    fitRationale: "Lyka already aligns strongly with their emotional relationship with feeding, openness to fresh food and willingness to experiment. The task is not to change belief; it is to make starting feel easy, exciting and low-risk.",
    movement: "Ready → Trial → Repeat purchase and advocacy.",
    snapshot: "Highly involved owners who see feeding as one of the clearest ways to express love and care for their dog. Success is measured through visible enjoyment: whether the dog is excited, satisfied and eating happily.",
    description: "More likely to be younger-to-midlife, metropolitan, higher-income family households with children at home. Their dog is deeply integrated into family life and is often treated as a best friend, family member or child. Comfortable experimenting with different brands, formats and meal combinations. 46% provide mixed meals, compared with 36% of the market, and they are more likely to use premium and fresh-food brands. Already highly aligned with Lyka: 82% are extremely open to fresh food, 75% to DTC dog food and 74% say they are likely to try Lyka within six months. The directional Roy Morgan Ready-stage overlay supports a premium, experimental mindset: 56.6% say they want the best and are willing to pay for it (ix 140), while 50.7% seek new experiences in everyday life (ix 129).",
    barriers: [
      "Their dog’s response is the ultimate decision-maker. A strong nutritional proposition will not overcome concern that the dog may reject the food or become unsettled during transition.",
      "They may already use a repertoire of premium kibble, raw, fresh meat, supplements and treats, so Lyka must prove why it deserves a larger role in the bowl rather than simply becoming one more option.",
      "Price can still create hesitation, particularly for larger dogs or households already spending heavily across multiple food formats.",
      "Subscription, freezer storage, delivery management and travel can introduce friction into a feeding approach currently built around flexibility.",
      "Overly clinical communications risk underplaying the emotional and sensory benefit they seek: seeing their dog genuinely enjoy mealtime.",
    ],
    triggers: [
      "Visible proof of dogs enjoying the food, particularly dogs of a similar size, breed, age or feeding history.",
      "A personalised recommendation showing exactly what their dog should receive and why.",
      "A low-risk starter box, partial-feeding option, transition plan or satisfaction guarantee.",
      "Current-food boredom, rejection or a decline in enthusiasm at mealtimes.",
      "Owner testimonials demonstrating appetite, coat, digestion, energy or weight-management benefits.",
      "A clear price-per-day explanation that helps them compare Lyka with the total cost of their current feeding repertoire.",
    ],
    motivations: [
      "Make their dog feel loved through food that is enjoyable, varied and visibly rewarding.",
      "Feel proud that they are giving their dog something better than a basic or purely functional meal.",
      "Be an attentive owner who notices preferences and adapts accordingly.",
      "Give their dog the best possible life without having to prepare every meal from scratch.",
      "Discover something new that creates an immediate, positive response from their dog.",
    ],
    influences: [
      "High-intent search and retargeting once they begin investigating fresh food or personalised feeding.",
      "Instagram, TikTok and YouTube content that shows real dogs eating, transitioning and responding to Lyka.",
      "Owner reviews, creator demonstrations and before-and-after stories are likely to be more persuasive than abstract health claims alone.",
      "Personalised landing pages based on dog size, breed, age, fussiness or health goal.",
      "CRM and email are important for converting interest and maintaining confidence through trial; the Ready-stage audience is more receptive than average to relevant email and online advertising.",
      "BVOD and premium social video can establish Lyka as an emotionally rewarding upgrade, while owned content completes the practical sale.",
    ],
    avatar: "",
    videoUrl: "",
  },
  {
    id: 201,
    name: "Mindful Researchers",
    title: "Mindful Researchers",
    category: "Considering",
    stageLabel: "CONSIDERING",
    marketShare: "15%",
    customerShare: "55%",
    solutionFit: "Very High",
    fitRationale: "Mindful Researchers are described as Considering, but a meaningful proportion are already behaviourally Ready. Their high Lyka intent, fresh-food openness and DTC comfort suggest the segment should be divided into upper-Considering and Ready audiences during activation.",
    movement: "Considering → Ready → Trial.",
    snapshot: "Nutrition-first owners who see food as a long-term health decision rather than simply a way to satisfy hunger.",
    description: "More likely to be metropolitan, aged 25–44, professionally employed, higher-income and living in family households. They tend to have younger dogs without an obvious health problem and are trying to protect future wellbeing rather than only respond to illness. Proactive and information-rich: they combine veterinary or breeder advice with their own research, online reviews, brand information and comparison. More likely to mix foods and experiment, but they do so deliberately rather than impulsively. They want to understand the nutritional logic behind the decision. Already highly open to the Lyka model: 70% are extremely open to fresh food, 86% to DTC and 70% say they are likely to try Lyka. Their current use of brands such as Royal Canin reflects comfort with tailored, clinical and scientifically framed nutrition propositions. The Roy Morgan Considering-stage overlay suggests strong commercial value: 31.5% earn $100,000 or more personally (ix 132) and 94.2% agree quality is more important than price (ix 130).",
    barriers: [
      "They need to know that fresh food is demonstrably complete, balanced and appropriate, not merely more natural, premium-looking or emotionally appealing.",
      "Competing claims create decision paralysis. The more brands promise “better health,” the more evidence they feel they need before acting.",
      "They may be reluctant to move away from a vet-recommended, breed-specific or therapeutic food that currently feels responsible and safe.",
      "They need clarity on formulation, nutrient standards, ingredient quality and the expertise behind the recipes.",
      "Price is considered through incremental health value rather than absolute affordability: what does Lyka deliver beyond premium kibble, supplements or mixed feeding?",
      "Storage, travel, household delegation, delivery reliability and transition can make the new routine feel harder than the existing one.",
      "Unsupported or anti-kibble messaging could reduce credibility by making Lyka appear ideological rather than evidence-led.",
    ],
    triggers: [
      "Veterinary nutritionist or credible expert endorsement.",
      "Transparent explanation of how recipes are formulated and how complete-and-balanced standards are met.",
      "Dog-specific recommendations based on age, breed, weight, activity and health needs.",
      "Comparison tools that allow them to assess Lyka against their current feeding approach without oversimplifying the decision.",
      "Case studies showing measurable outcomes rather than emotional testimonials alone.",
      "A personalised feeding and cost calculator that makes the economics tangible.",
      "A supported transition plan, satisfaction guarantee and low-risk first order.",
    ],
    motivations: [
      "Protect their dog’s long-term health and quality of life.",
      "Feel informed, confident and in control of an important care decision.",
      "Make a choice that is defensible to themselves, their vet and other knowledgeable owners.",
      "Prevent future health problems rather than waiting until something goes wrong.",
      "Ensure that premium expenditure is producing meaningful nutritional value.",
      "Reinforce their identity as a responsible and proactive dog owner.",
    ],
    influences: [
      "Search, YouTube explainers and comparison content during active evaluation.",
      "Long-form expert content that explains ingredients, formulation, nutritional standards and potential outcomes.",
      "Premium digital publishing, pet-health environments, podcasts and credible editorial partnerships.",
      "BVOD and high-attention video can introduce the proposition, but must lead to a deeper proof hub rather than attempt to resolve the full decision in the advertisement.",
      "Instagram and social video support discovery, while retargeting should progressively answer evidence, price, transition and convenience objections.",
      "A diagnostic quiz or personalised feeding assessment provides a strong bridge between paid media and conversion.",
      "CRM should function as an objection-resolution sequence, not merely a discount mechanism.",
    ],
    avatar: "",
    videoUrl: "",
  },
  {
    id: 301,
    name: "Conflicted Troubleshooters",
    title: "Conflicted Troubleshooters",
    category: "Curious",
    stageLabel: "CURIOUS",
    marketShare: "25%",
    customerShare: "9%",
    solutionFit: "High Growth Potential",
    fitRationale: "This is the largest realistic audience-shifting opportunity. They already feel a problem and are open to alternatives, but Lyka must position itself as the clearest and safest next step, not as another feeding philosophy they need to research.",
    movement: "Curious → Considering. An acute health or fussiness trigger can produce a direct Curious → Ready jump.",
    snapshot: "Younger, less-experienced and more time-pressured owners who suspect their current approach may not be working but do not know what the better answer is.",
    description: "More likely to live alone, with parents or in shared households, although the segment also includes busy young families navigating competing responsibilities. Their dogs create more active feeding and health challenges: 38% have a dog with a health issue, compared with 29% of the market, and 58% describe their dog as choosy with food, compared with 49%. They experience feeding as a process of trial and error. They are willing to experiment but often lack the knowledge or confidence to evaluate competing advice. Time and mental bandwidth are major constraints: 33% say they do not have time to spend making meals, compared with 26% of the market. They seek advice from social media, reviews, online forums and other owners who have faced a similar problem. Commercial openness is substantial: 68% are likely to try a different brand, 54% are likely to try Lyka, and 40% are extremely open to both fresh food and DTC. The directional Roy Morgan Curious overlay shows they are not inherently low-value: 58.9% want the best and are willing to pay for it (ix 146). The issue is confidence, not lack of aspiration.",
    barriers: [
      "Low confidence in their own ability to judge what is nutritionally right.",
      "Conflicting online advice creates more work and uncertainty rather than resolving the problem.",
      "Fear of paying a premium for another product the dog rejects or that fails to improve the issue.",
      "Low mental bandwidth for research, portion calculations, storage and a complicated transition process.",
      "Their current feeding repertoire may be imperfect but familiar; a failed switch feels wasteful, costly and emotionally draining.",
      "They may seek quick fixes for symptoms without connecting the issue to the overall feeding approach.",
      "Judgemental “perfect pet parent” messaging can increase guilt and avoidance rather than motivate change.",
    ],
    triggers: [
      "Food refusal, worsening fussiness or loss of enthusiasm at mealtimes.",
      "A change in digestion, stool quality, skin, coat, energy, weight or mobility.",
      "A diagnosis, ageing-related concern or veterinary recommendation.",
      "A testimonial featuring the same problem, dog type or owner situation.",
      "A trusted owner explaining the difference Lyka made in practical, non-technical terms.",
      "A diagnostic quiz that turns a vague concern into a clear recommendation.",
      "A small starter pack, partial-feeding approach or guarantee that limits the consequences of another failed experiment.",
      "Clear transition support and access to help when the dog’s response is uncertain.",
    ],
    motivations: [
      "Find something that finally works for both the dog and the owner.",
      "Reduce the stress and guilt associated with not knowing whether they are feeding correctly.",
      "Feel reassured and in control without having to become a nutrition expert.",
      "Solve a visible problem such as fussiness, digestion or low energy.",
      "Find a convenient solution that does not add more complexity to an already busy life.",
      "Avoid wasting money and food on repeated unsuccessful trials.",
    ],
    influences: [
      "High-intent problem searches around fussy eating, sensitive stomachs, allergies, skin, weight, ageing, low energy and food rejection.",
      "Short-form social and creator content that quickly creates recognition: “That sounds like my dog.”",
      "YouTube explainers and owned articles that provide the next layer of reassurance once the problem has been recognised.",
      "Forums, pet communities, review environments and owner groups where people seek situation-specific advice.",
      "Vet, trainer, groomer, breeder and pet-retail partnerships close to the moment a problem becomes salient.",
      "Paid social should lead to problem-specific landing pages rather than a generic fresh-food homepage.",
      "Triggered CRM based on the owner’s stated problem, dog profile and main objection.",
      "Trial and transition content should remain visible after acquisition because this audience is at greater risk of abandoning the switch when uncertainty appears.",
    ],
    avatar: "",
    videoUrl: "",
  },
  {
    id: 401,
    name: "Disciplined Outsourcers",
    title: "Outsourcers",
    // CLIENT PLACEMENT, 2026-08-07. The source document has these two fields as
    // "Unaware" / "UNAWARE / UNCONVINCED". See the ⚠ note in the file header:
    // these are the only two values here the generator would not produce, and a
    // regeneration reverts them.
    category: "Curious",
    stageLabel: "CURIOUS",
    marketShare: "22%",
    customerShare: "6%",
    solutionFit: "Medium",
    fitRationale: "They are not the strongest broad conversion audience, but they may move quickly once a credible expert gives them a reason and permission to change. They can jump directly from Unconvinced to Considering or Ready without progressing sequentially through the framework.",
    movement: "Unconvinced → Considering or Ready after an expert or health trigger.",
    snapshot: "Pragmatic, routine-oriented owners who have found an approach that appears to work and see little value in changing it without a credible reason.",
    description: "Slightly older and more likely to be empty nesters, although they otherwise appear across income, gender and location groups. Their dog is generally regarded as a family member, and they demonstrate responsible care through consistency, exercise and adherence to established expert advice. They outsource nutritional judgement to veterinarians, breeders or recognised brands rather than researching extensively themselves. 57% identify the vet as an extremely influential source, and for 19% the vet is their only extremely influential source. They are confident and future-oriented but prefer a consistent diet over variety. Their current routine may have been recommended years earlier and subsequently become habitual. Only 9% are extremely open to fresh food, 2% to DTC and 36% say they are likely to try Lyka. However, most report being somewhat open, suggesting resistance is conditional rather than absolute. Their claimed weekly wet and dry food spend is $31, below the market average of $37.",
    barriers: [
      "No immediate evidence that their current routine is failing.",
      "The existing diet may carry the authority of a veterinarian, breeder or trusted science-led brand.",
      "Changing food without expert permission can feel irresponsible rather than progressive.",
      "Fresh feeding may be perceived as less proven, unnecessarily indulgent or driven by consumer trends.",
      "Subscription, freezer storage, delivery and portioning can appear disruptive to a simple, repeatable routine.",
      "Lower current category expenditure makes Lyka’s premium more visible.",
      "Broad emotional claims are unlikely to overpower years of apparently successful routine.",
    ],
    triggers: [
      "A direct recommendation from a veterinarian or another trusted pet-health professional.",
      "A new diagnosis, ageing-related concern or evidence that the dog’s nutritional needs have changed.",
      "Credible prevention evidence showing that “appearing healthy” is not the same as optimising long-term health.",
      "A vet or expert explaining why Lyka is complete, balanced and compatible with responsible care.",
      "A simple partial-feeding option that allows them to evolve the routine rather than abandon it.",
      "Transition instructions that preserve structure, portion control and consistency.",
      "A trusted peer with a similar dog demonstrating practical, sustained success.",
    ],
    motivations: [
      "Keep their dog healthy through consistent and responsible care.",
      "Feel confident that they are following credible professional guidance.",
      "Maintain a feeding routine that is simple, predictable and easy to administer.",
      "Avoid unnecessary experimentation or introducing risk into something that already appears to work.",
      "Make disciplined choices that support long-term wellbeing.",
      "Receive permission to change from a source they regard as more knowledgeable than themselves.",
    ],
    influences: [
      "Veterinarians, clinics, breeders and pet-health partnerships are the most important influence environments.",
      "Pet-retail and point-of-care activity can introduce Lyka when the owner is already thinking about health or changing needs.",
      "Search becomes valuable after an expert or health trigger, rather than as a continuous discovery channel.",
      "Expert video, clear FAQs and straightforward comparison tools should support, not attempt to replace, the authority recommendation.",
      "FTA television, radio and news can create familiarity, but broad exposure alone is unlikely to generate immediate action.",
      "CRM should emphasise routine simplicity, expert credentials and transition guidance rather than novelty or experimentation.",
      "Ageing, mobility and prevention contexts are more relevant than premium lifestyle imagery.",
    ],
    avatar: "",
    videoUrl: "",
  },
  {
    id: 402,
    name: "Secure Sleepwalkers",
    title: "Sleepwalkers",
    category: "Unaware",
    stageLabel: "UNAWARE / UNCONVINCED",
    marketShare: "27%",
    customerShare: "3%",
    solutionFit: "Low",
    fitRationale: "Secure Sleepwalkers are the largest segment but the weakest near-term commercial opportunity. Lyka should build familiarity and category belief through broader activity, but avoid mistaking audience scale for convertibility.",
    movement: "Unaware → Curious.",
    snapshot: "Relaxed, hands-off owners who are confident that their current feeding routine is good enough and feel little urgency to investigate alternatives.",
    description: "More likely to be older, female, regional, lower-income and living in empty-nester households. They are also less likely to be early technology adopters or active participants in communities. More likely to have older dogs, but they report fewer perceived health problems than other owners. This may reflect genuine health or lower vigilance rather than objectively lower need. Their relationship with the dog is more traditionally pet-oriented. They care about the dog but are less likely to link feeding choices to their personal identity. Price, convenience and familiarity dominate brand selection. They tend to use a smaller brand repertoire and prefer established supermarket options. Their openness is the lowest of any segment: 31% are likely to try Lyka, 6% are extremely open to DTC and 3% are extremely open to fresh food. Their claimed weekly food spend is $31, compared with the market average of $37. The directional Roy Morgan Unaware overlay is also older and less exploratory: 22.4% are aged 65+ (ix 142) and only 24% say they seek new experiences in everyday life (ix 61).",
    barriers: [
      "They do not perceive a meaningful problem that requires solving.",
      "Their dog appears to eat the current food and remain sufficiently healthy, validating the existing routine.",
      "Fresh food can feel unnecessary, expensive or designed for more intensive “pet parent” cultures.",
      "They are less likely to actively research, follow expert content or respond to brand communications.",
      "Subscription and delivery introduce complexity into a purchase currently completed easily through the supermarket.",
      "Asking them to change can imply that their previous care was inadequate, creating defensiveness.",
      "The perceived benefit is too distant or abstract to justify paying more now.",
      "Their lower digital responsiveness makes direct performance targeting less efficient.",
    ],
    triggers: [
      "A visible deterioration in health, appetite, digestion, mobility, weight, skin or energy.",
      "Their dog beginning to reject a long-standing food.",
      "Ageing-related advice that makes changing nutritional needs relevant.",
      "A trusted friend or family member with a similar dog sharing a credible experience.",
      "Repeated broad exposure that normalises fresh feeding before a problem occurs.",
      "Straightforward price-per-day framing that reduces the appearance of an inaccessible premium.",
      "An easy partial-feeding or introductory option that does not require a complete lifestyle change.",
      "Retail or veterinary presence that makes Lyka feel established rather than niche or internet-only.",
    ],
    motivations: [
      "Keep their dog content without making feeding more complicated.",
      "Feel settled and confident in a routine that has worked over time.",
      "Avoid unnecessary expenditure or experimentation.",
      "Purchase food that is easy to find, serve and store.",
      "Respond when there is a real, visible need, not simply because a brand says there could be a better option.",
      "Protect themselves from feeling judged or pressured by more intensive pet-care standards.",
    ],
    influences: [
      "FTA television, commercial radio, Facebook, mainstream news and retail environments provide broad reach.",
      "Media reach itself should not be confused with conversion potential; their media consumption is generally broad rather than uniquely distinctive.",
      "Retail presence, veterinary familiarity and repeated brand exposure can help make Lyka feel mainstream before a trigger occurs.",
      "Simple owner stories involving older dogs will be more accessible than lengthy nutritional education.",
      "Communications should be non-judgemental and focused on ageing, maintaining quality of life and practical improvement.",
      "Direct-response investment should remain limited until a dog-related trigger or clear intent signal is present.",
      "Search and retargeting become relevant only once an active health, appetite or ageing concern develops.",
    ],
    avatar: "",
    videoUrl: "",
  },
];

export const personaCategories: PersonaCategory[] = [
  {
    type: PersonaType.LYKA_AUDIENCE,
    personas: lykaPersonas,
  },
];
