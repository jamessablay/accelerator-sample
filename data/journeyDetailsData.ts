
import React from 'react';
import { JourneyType, JourneySubCategoryKey } from '../types';
import BulbIcon from '../components/icons/BulbIcon';
import MagnifyingGlassIcon from '../components/icons/MagnifyingGlassIcon';
import ShoppingCartIcon from '../components/icons/ShoppingCartIcon';
import StarIcon from '../components/icons/StarIcon';
import StopIcon from '../components/icons/StopIcon';

// -----------------------------------------------------------------------------
// Lyka consumer journeys: five journeys, one per persona, on the
// Transtheoretical model (Precontemplation to Maintenance).
//
// SOURCE: "Lyka Consumer Journeys.pptx" in the project folder (a PDF export of
// the same deck sits beside it; the PPTX is used because PDF text extraction
// breaks words mid-token). GENERATED from that deck by a cell-level parse of its
// tables, not hand typed, so the prose cannot drift from the research.
//
// TWO THINGS THAT WILL BITE IF THIS IS HAND EDITED:
//
// 1. The bullet fields are SEMICOLON delimited. renderStandardList in
//    JourneyDetailTable splits on ';'. Use full stops only and the whole cell
//    renders as one long bullet, which is what Hamilton's data did.
//
// 2. Score strings need a DASH before the description. JourneyScoreGraph matches
//    /(\d+)\s*[-–—]\s*(.*)/ and does not accept a colon. With no separator at
//    all it concatenates every digit in the string, so "Emotional 80 worry at 3am"
//    parses as 803 and the curve clips outside the viewBox.
//
// This file is NOT pure data: it imports React and five icon components so each
// stage can carry a ReactNode.
// -----------------------------------------------------------------------------

export interface JourneyStageDetail {
  title: string;
  icon: React.ReactNode;
  /** Semicolon delimited. Doing, then the first-person Thinking / Feeling quote. */
  doingThinking: string;
  /** Semicolon delimited. Source "Barriers". */
  painPoints: string;
  /** Semicolon delimited. Source "Touchpoints". */
  influences: string;
  /** Semicolon delimited. Source "Opportunities for Lyka". */
  momentsToWin: string;
  /** "Emotional NN – description". The dash is required by the parser. */
  emotionalScore: string;
  /** "Rational NN – description". The dash is required by the parser. */
  rationalScore: string;
  /** Source "Likely pace". */
  duration: string;
  /** Source "Typical position". Shown in the stage-header pop-up. */
  definition?: string;
  /** The journey's critical conversion moment. Set on Action only. */
  coreQuestion?: string;
}

export interface JourneySubCategory {
  key: JourneySubCategoryKey;
  title: string;
  stages: JourneyStageDetail[];
}

export interface JourneyDetailsData {
  type: JourneyType;
  subCategories: Record<string, JourneySubCategory>;
}

// DEVOTED CATERERS
// 11% market / 27% of Lyka customers. Turn emotional alignment into confident trial, then sustain delight.
const devotedCaterersStages: JourneyStageDetail[] = [
  {
    title: "Precontemplation",
    icon: React.createElement(StopIcon),
    doingThinking: "They are already buying premium food, mixing formats, adding toppers or rotating flavours.; They may prepare occasional homemade additions and actively observe what their dog enjoys.; “I already put a lot of thought into what my dog eats. They deserve food they genuinely enjoy.”",
    painPoints: "Current feeding approach already feels premium and loving; Little dissatisfaction with the existing repertoire; Fresh feeding may not feel sufficiently differentiated",
    influences: "Instagram, TikTok and YouTube; Premium pet and lifestyle content; Vet and breeder advice; Friends and other dog owners; Brand advertising and social content; Pet retail and fresh-food displays",
    momentsToWin: "Show that Lyka delivers both nourishment and visible joy; Demonstrate variety without implying current care is inadequate; Establish fresh feeding as the next expression of devoted ownership",
    emotionalScore: "Emotional 80 – Love, pride and a strong “good dog owner” identity. Feeding is already a visible expression of care.",
    rationalScore: "Rational 55 – Their current premium or mixed-food repertoire appears to work, offering variety and flexibility without an urgent reason to change.",
    duration: "Brief or bypassed",
    definition: "Current repertoire feels loving and sufficient",
  },
  {
    title: "Contemplation",
    icon: React.createElement(BulbIcon),
    doingThinking: "They notice that their dog is becoming bored, fussy or less enthusiastic.; They encounter fresh-food content and begin wondering whether Lyka would make meals more enjoyable.; “They like their current food, but maybe there is something fresher, more exciting or better suited to them.”",
    painPoints: "Concern that their dog may reject the food; Existing premium or mixed diet already provides variety; Difficulty identifying why Lyka is meaningfully better",
    influences: "Appetite and fussiness content; Creator feeding demonstrations; Owner testimonials; Breed and dog-size content; Social video showing dogs eating Lyka; Search around fresh dog food and variety",
    momentsToWin: "Use real dog reactions as proof; Show dogs of different breeds, sizes and feeding histories; Position Lyka as an upgrade to the experience of mealtime",
    emotionalScore: "Emotional 90 – Anticipation around giving their dog something more enjoyable, alongside concern that the current food may no longer excite them.",
    rationalScore: "Rational 65 – Assessing whether fresh feeding offers meaningful improvements in quality, nourishment and variety.",
    duration: "Days to weeks",
    definition: "Open to finding something their dog may enjoy more",
  },
  {
    title: "Preparation",
    icon: React.createElement(MagnifyingGlassIcon),
    doingThinking: "They review recipes, ingredients, portion sizes, flavour options, daily cost and delivery.; They seek dogs similar to their own in reviews and assess whether Lyka can complement or replace the existing repertoire.; “Will my dog actually love it? Is it worth the additional cost, and will it give me enough flexibility and variety?”",
    painPoints: "Price, particularly for larger dogs; Freezer space and delivery logistics; Subscription commitment; Concern that full feeding reduces freedom to mix and rotate; Questions about flavour variety",
    influences: "Lyka website and quiz; Recipe and ingredient pages; Price-per-day calculator; Reviews and social proof; Transition and storage information; Retargeting and abandoned-cart activity",
    momentsToWin: "Offer a low-risk starter box; Allow partial feeding or mixed-feeding entry; Make recipe choice and flexibility highly visible; Explain price relative to their total current repertoire; Provide strong satisfaction reassurance",
    emotionalScore: "Emotional 85 – Excitement is moderated by fear that their dog may reject the food or that the experience will not live up to expectations.",
    rationalScore: "Rational 85 – Dog suitability, recipe range, daily price, portions, freezer space, delivery flexibility and transition requirements become highly important.",
    duration: "Days",
    definition: "Actively assessing whether Lyka deserves a role in the bowl",
  },
  {
    title: "Action",
    icon: React.createElement(ShoppingCartIcon),
    doingThinking: "They introduce Lyka gradually, watch how quickly the bowl is finished, inspect stool and digestion, and share the feeding experience with family or friends.; “Please love this. If they are excited at dinner and respond well, I will feel like I made the right decision.”",
    painPoints: "Slow food acceptance; Temporary digestive changes; Unclear portioning or transition pace; Household members feeding inconsistently; Frustration if the dog initially appears less enthusiastic",
    influences: "Delivery and unboxing; Transition guide; Email and SMS onboarding; Customer support; Feeding reminders; Dog-response stories and FAQs",
    momentsToWin: "Celebrate first-bowl and first-week milestones; Provide rapid human support; Set expectations around transition; Reassure through similar dog stories; Capture and reinforce early enthusiasm",
    emotionalScore: "Emotional 95 – The dog’s first reactions carry enormous emotional weight. Enthusiastic eating creates pride and reassurance; hesitation creates immediate concern.",
    // CLIENT EDIT (2026-08-10): the source deck truncates this descriptor mid-phrase
    // ("...transition progress and ease of"), which surfaced an "as supplied, not
    // completed" note the client flagged as a weird reference. Trimmed to the last
    // complete item so the clause reads cleanly and isTruncatedDescriptor() no longer
    // fires (the note then disappears from the spine, strip and gap matrix). Nothing
    // is invented; the incomplete trailing fragment is dropped. A regeneration from
    // the PPTX reverts this, so re-apply it.
    rationalScore: "Rational 80 – Closely monitoring appetite, digestion, stool, portions and transition progress.",
    duration: "First 2–4 weeks",
    definition: "Trialling and watching the dog’s response closely",
    coreQuestion: "The first visible moment their dog enthusiastically eats Lyka.",
  },
  {
    title: "Maintenance",
    icon: React.createElement(StarIcon),
    doingThinking: "They manage recipe rotation, delivery timing, portion adjustments and occasional mixed feeding.; They may photograph meals, recommend Lyka or share their dog’s response socially.; “This makes me feel like I am giving them something special, but it must stay enjoyable, convenient and visibly worthwhile.”",
    painPoints: "Recipe boredom; Delivery inflexibility; Cost accumulating over time; Travel and freezer inconvenience; Competitors offering greater novelty or promotional value",
    influences: "Subscription account; Recipe rotation and new product communications; Personalised CRM; Referral program; Owner community and UGC; Loyalty and milestone content",
    momentsToWin: "Introduce rotation, new recipes and personalised recommendations; Reward advocacy and referrals; Make pausing and changing deliveries easy; Turn their visible pride into social proof for other owners",
    emotionalScore: "Emotional 90 – Pride and reassurance when the dog continues to enjoy meals and Lyka feels like evidence of devoted care.",
    rationalScore: "Rational 70 – Evaluating continued variety, subscription flexibility, delivery reliability, convenience and long-term value.",
    duration: "Ongoing",
    definition: "Integrating Lyka into an emotionally rewarding feeding routine",
  },
];

// MINDFUL RESEARCHERS
// 15% market / 55% of Lyka customers. Make Lyka the most credible and defensible nutritional choice.
const mindfulResearchersStages: JourneyStageDetail[] = [
  {
    title: "Precontemplation",
    icon: React.createElement(StopIcon),
    doingThinking: "They feed a premium, tailored or vet-associated brand, may mix formats and regularly monitor weight, exercise and wellbeing.; “I am already making a considered choice based on my dog’s long-term needs.”",
    painPoints: "Current premium food already carries scientific or veterinary credibility; No visible health issue; Belief that the existing diet is already optimised",
    influences: "Vet and breeder advice; Search and long-form articles; Health and nutrition content; Premium pet brands; Podcasts and expert interviews; Online reviews",
    momentsToWin: "Build science and expert credibility before the owner becomes in-market; Own preventative nutrition and healthy longevity; Avoid simplistic “fresh is automatically better” claims",
    emotionalScore: "Emotional 65 – Confidence and pride in acting like a responsible owner who takes their dog’s health seriously.",
    rationalScore: "Rational 80 – Their existing food is supported by recognised nutrition, expert recommendations or a considered feeding rationale.",
    duration: "May be bypassed",
    definition: "Already health-conscious, but satisfied with the current nutritional plan",
  },
  {
    title: "Contemplation",
    icon: React.createElement(BulbIcon),
    doingThinking: "They encounter information about fresh feeding, ingredient processing or preventative health.; A life-stage change, vet discussion or subtle symptom increases interest.; “Could a fresh, personalised diet produce a better long-term outcome than what I currently use?”",
    painPoints: "Conflicting evidence about fresh, raw and processed food; Concern about marketing claims overstating benefits; Vet may not have raised a need to change",
    influences: "Google search; YouTube explainers; Veterinary and nutritionist content; Pet-health publications; Expert social content; Comparison articles and owner case studies",
    momentsToWin: "Explain the nutritional problem Lyka solves; Use expert-led education without fearmongering; Show how needs change by age, weight, breed and activity; Make evidence accessible rather than overly technical",
    emotionalScore: "Emotional 75 – Cautious concern about whether their current approach is genuinely delivering the best long-term outcome.",
    rationalScore: "Rational 90 – Actively investigating fresh feeding, ingredients, processing, life-stage needs, preventative health and potential benefits.",
    duration: "Weeks to months",
    definition: "Investigating whether their dog could receive better long-term nutrition",
  },
  {
    title: "Preparation",
    icon: React.createElement(MagnifyingGlassIcon),
    doingThinking: "They compare Lyka with premium kibble, raw, therapeutic diets and other fresh brands.; They examine formulation, credentials, nutrient adequacy, ingredients, evidence, reviews and price.; “Is this complete and balanced? Who formulated it? Is the evidence strong enough, and is it suitable for my specific dog?”",
    painPoints: "Questions about complete-and-balanced formulation; Lack of independent or expert validation; Therapeutic or breed-specific diet concerns; Difficulty comparing unlike feeding formats; Long-term price and freezer requirements",
    influences: "Lyka formulation and ingredient pages; Expert credentials; Complete-and-balanced information; Personalised feeding calculator; FAQs and comparison tools; Retargeting and email education; Reviews with measurable outcomes",
    momentsToWin: "Create a high-quality evidence hub; Provide ingredient and nutrient transparency; Offer side-by-side feeding comparisons; Make expert credentials prominent; Provide dog-specific recommendations; Enable them to share information with their vet",
    emotionalScore: "Emotional 70 – Wants confidence and control, but may feel anxious about making a decision that cannot be fully substantiated.",
    rationalScore: "Rational 95 – Peak evidence requirement: formulation, complete-and-balanced credentials, expert authority, dog-specific suitability, comparisons, price and logistics.",
    duration: "Several days to weeks",
    definition: "Conducting active evidence-led evaluation",
  },
  {
    title: "Action",
    icon: React.createElement(ShoppingCartIcon),
    doingThinking: "They follow the transition schedule carefully, monitor stool, weight, appetite, energy and coat, and may discuss the switch with their vet.; “I have made a considered decision, but I need evidence that the transition is progressing properly.”",
    painPoints: "Normal transition changes may be interpreted as a warning sign; Difficulty determining how quickly benefits should appear; Weight or portion-management uncertainty; Contradictory advice from a vet or online source",
    influences: "Structured transition guide; Email and SMS onboarding; Progress checkpoints; Customer support; Vet-facing information; Portion and weight-management tools",
    momentsToWin: "Give measurable transition checkpoints; Explain expected versus concerning responses; Provide progress tracking; Offer proactive portion and weight support; Reinforce the evidence behind the decision",
    emotionalScore: "Emotional 80 – Hopeful but vigilant. They want reassurance that their carefully considered decision was correct.",
    rationalScore: "Rational 90 – Methodically monitoring transition, appetite, stool, weight, energy and other indicators against expectations.",
    duration: "First 2–6 weeks",
    definition: "Transitioning methodically and monitoring outcomes",
    coreQuestion: "The point at which they can confidently explain why Lyka is right for their specific dog, not merely why fresh food sounds appealing.",
  },
  {
    title: "Maintenance",
    icon: React.createElement(StarIcon),
    doingThinking: "They assess longer-term outcomes, adjust portions or recipes, revisit health goals and evaluate whether Lyka continues to justify the investment.; “I will stay if the health rationale remains credible, the outcomes are visible and the service continues to support my dog’s changing needs.”",
    painPoints: "Benefits may become less salient over time; Questions about changing nutritional needs; Price increases; Lack of ongoing evidence or personalisation; Service problems undermine trust in the overall proposition",
    influences: "Personalised health content; Portion and recipe reviews; Subscription management; Health milestone communications; Customer surveys; Expert webinars and research updates; Referral and advocacy",
    momentsToWin: "Provide regular feeding-plan reviews; Adapt recommendations as the dog ages; Make progress and outcomes visible; Share credible research and expert content; Encourage evidence-rich testimonials and referrals",
    emotionalScore: "Emotional 75 – Ongoing reassurance and responsible-owner pride when Lyka continues to support the dog’s wellbeing.",
    rationalScore: "Rational 85 – Reviewing sustained health outcomes, portions, changing life-stage needs, price and service performance.",
    duration: "Ongoing",
    definition: "Validating sustained health value and adapting the plan",
  },
];

// CONFLICTED TROUBLESHOOTERS
// 25% market / 9% of Lyka customers. Turn uncertainty into a simple, supported and low-risk path forward.
const conflictedTroubleshootersStages: JourneyStageDetail[] = [
  {
    title: "Precontemplation",
    icon: React.createElement(StopIcon),
    doingThinking: "They rotate foods, add toppers, offer treats, skip or delay meals, or tolerate inconsistent eating.; They may manage symptoms individually without questioning the broader feeding approach.; “My dog is just fussy” or “They have always had a sensitive stomach. We keep trying different things.”",
    painPoints: "Problems are attributed to the dog rather than the food; Repeated experimentation feels normal; Low knowledge and low mental bandwidth; Avoiding another decision",
    influences: "General social media; Friends and family; Pet retail; Breeders and groomers; Occasional vet visits; Existing brand communications",
    momentsToWin: "Make common feeding problems recognisable; Avoid blame and perfectionist pet-parent language; Show that uncertainty is normal and solvable",
    emotionalScore: "Emotional 70 – Background frustration, guilt and resignation around fussiness or recurring problems, although these feelings may have become normalised.",
    rationalScore: "Rational 50 – Using patchwork solutions (different foods, toppers, treats or advice) without reassessing the entire feeding approach.",
    duration: "Until a recurring or acute trigger",
    definition: "Experiencing problems but treating them as isolated or normal",
  },
  {
    title: "Contemplation",
    icon: React.createElement(BulbIcon),
    doingThinking: "A problem becomes harder to ignore: food refusal, digestive upset, skin irritation, weight change, low energy or a vet concern.; They begin searching for explanations and asking others for advice.; “Maybe the food is part of the problem. I need something better, but I do not know who or what to believe.”",
    painPoints: "Too much contradictory information; Symptoms may have multiple causes; Fear of choosing incorrectly; Cost of veterinary and nutritional advice; Guilt or fear of being judged",
    influences: "Problem-led Google search; TikTok and Instagram; YouTube; Facebook dog groups; Reddit and forums; Vet, trainer or groomer advice; Owner testimonials",
    momentsToWin: "Build communications around specific problems, not generic wellness; Use relatable owner stories; Turn symptom recognition into a simple next step; Explain when veterinary advice is needed",
    emotionalScore: "Emotional 95 – Anxiety, urgency, guilt and hope intensify when a visible health or feeding problem suggests that the current approach is not working.",
    rationalScore: "Rational 65 – Searching for a cause and attempting to understand whether food could explain the issue.",
    duration: "Hours to weeks",
    definition: "Recognising that the current feeding approach may be contributing",
  },
  {
    title: "Preparation",
    icon: React.createElement(MagnifyingGlassIcon),
    doingThinking: "They compare multiple products, read forums, watch reviews and seek recommendations.; Their research is often fragmented and driven by urgency rather than a structured decision process.; “This could work, but I have already wasted money on other solutions. I need to know it is suitable, easy and low-risk.”",
    painPoints: "Previous failed products or wasted food; Dog rejection risk; Price and subscription concerns; Complex nutritional claims; Lack of time to compare options; Concern the process will add work",
    influences: "Lyka quiz; Problem-specific landing pages; Owner reviews involving similar issues; Price and feeding calculator; Live chat and customer support; Retargeting; Trial offer and guarantee information",
    momentsToWin: "Simplify the decision to three or four key proof points; Offer a low-risk starter path; Use a clear guarantee; Provide problem-specific recommendations; Make human support visible before purchase; Demonstrate convenience concretely",
    emotionalScore: "Emotional 90 – Fear of wasting money, choosing incorrectly or putting the dog through another unsuccessful experiment.",
    rationalScore: "Rational 80 – Comparing suitability, owner reviews, convenience, dog acceptance, price, guarantees and likely outcomes.",
    duration: "Hours to days",
    definition: "Seeking a solution quickly but struggling to compare options",
  },
  {
    title: "Action",
    icon: React.createElement(ShoppingCartIcon),
    doingThinking: "They begin transitioning but watch every response closely.; They may change the plan, add other foods or stop temporarily if the dog hesitates or experiences digestive changes.; “Is this reaction normal? Are they eating enough? Should I keep going or stop before I make things worse?”",
    painPoints: "Food refusal or hesitation; Temporary digestive changes; Mixing and transition confusion; Inconsistent feeding by household members; Expectation of immediate improvement; Anxiety leading to premature cancellation",
    influences: "Transition guide; Daily onboarding communications; Human support and live chat; Symptom and stool guidance; Feeding reminders; FAQs based on dog response; Delivery notifications",
    momentsToWin: "Deliver intensive transition support; Proactively answer “is this normal?”; Use daily or staged guidance; Provide fast access to a real person; Reinforce small early wins; Prevent a temporary response becoming cancellation",
    emotionalScore: "Emotional 95 – Hypervigilant to every reaction. Food refusal or digestive changes can create immediate panic; early improvement creates major relief.",
    rationalScore: "Rational 85 – Monitoring transition timing, portions, appetite, stool and symptoms while deciding whether to continue.",
    duration: "First 2–4 weeks",
    definition: "Trialling Lyka with high anxiety and low tolerance for complications",
    coreQuestion: "When Lyka feels like the end of trial and error, rather than another experiment.",
  },
  {
    title: "Maintenance",
    icon: React.createElement(StarIcon),
    doingThinking: "If Lyka works, they settle into the routine and feel significant relief.; However, price, delivery, storage or another episode can quickly reactivate doubt.; “This is such a relief when it works, but I cannot manage a complicated or unreliable system.”",
    painPoints: "Cost pressure; Operational friction; Recurrence of the original symptom; Failure to recognise gradual benefits; Competing advice; Subscription management becomes another task",
    influences: "CRM based on original problem; Progress reminders; Easy account changes; Customer support; Reassurance stories; Referral from similar owners; Retention and win-back communications",
    momentsToWin: "Continue reflecting the original problem and progress; Make account management effortless; Provide periodic reassurance and health check-ins; Reinforce time saved as well as health outcomes; Use successful owners as proof for other Troubleshooters",
    emotionalScore: "Emotional 85 – Relief and regained control when Lyka solves the problem, tempered by anxiety that it may return.",
    rationalScore: "Rational 75 – Evaluating whether the food continues to work without adding excessive cost, complexity or operational effort.",
    duration: "Vulnerable during first 3–6 months",
    definition: "Staying if Lyka reduces problems and makes feeding easier",
  },
];

// DISCIPLINED OUTSOURCERS
// 22% market / 6% of Lyka customers. Give trusted permission to change, then replace the old routine with a better one.
const disciplinedOutsourcersStages: JourneyStageDetail[] = [
  {
    title: "Precontemplation",
    icon: React.createElement(StopIcon),
    doingThinking: "They purchase the same brand and pack size, serve consistent portions at fixed times and follow advice originally provided by a vet or breeder.; “The vet recommended this, my dog is healthy and the routine has worked for years. There is no reason to interfere.”",
    painPoints: "No perceived need to change; Current diet is associated with expert authority; Strong habitual routine; Fresh and DTC formats feel unfamiliar; Low interest in researching alternatives",
    influences: "Veterinarian and clinic; Breeder; Established pet-food brands; Pet retail; FTA and mainstream media; Existing routine and packaging",
    momentsToWin: "Build credibility through vets and expert environments; Establish Lyka as responsible nutrition, not indulgence; Use ageing and prevention to create latent relevance",
    emotionalScore: "Emotional 35 – Calm, settled and largely free from feeding anxiety because the existing routine appears successful.",
    rationalScore: "Rational 75 – The current food is justified through consistency, expert recommendation, predictable portions and years of apparent success.",
    duration: "Potentially years",
    definition: "Dominant stage: current routine is proven and responsible",
  },
  {
    title: "Contemplation",
    icon: React.createElement(BulbIcon),
    doingThinking: "A vet raises weight, ageing, digestion, skin, mobility or another health issue.; Alternatively, the current food stops working or the dog’s needs visibly change.; “If their needs have changed, I want to do the responsible thing, but I need credible guidance.”",
    painPoints: "Vet does not explicitly recommend changing food; Current health issue may not be connected to nutrition; Fresh food may appear consumer-led rather than expert-led",
    influences: "Veterinary appointment; Diagnostic or ageing conversation; Clinic content; Trusted family or owner recommendation; Search following expert advice; Pet-health and prevention information",
    momentsToWin: "Equip vets and health professionals with clear evidence; Connect life-stage change to nutritional change; Give permission to reconsider without invalidating prior choices",
    emotionalScore: "Emotional 70 – Concern rises when a vet, diagnosis or changing life-stage need suggests that the established routine may no longer be right.",
    rationalScore: "Rational 85 – Seeking authoritative confirmation of what has changed and whether a different feeding approach is required.",
    duration: "Often triggered suddenly",
    definition: "A trusted expert or changing health need creates doubt",
  },
  {
    title: "Preparation",
    icon: React.createElement(MagnifyingGlassIcon),
    doingThinking: "They ask whether Lyka is appropriate, review expert credentials, assess the feeding plan and determine how the new routine will operate.; “Is this properly formulated and recommended by people I trust? Tell me exactly what to do.”",
    painPoints: "Need for credible expert approval; Concerns about complete-and-balanced nutrition; Switching from a vet or therapeutic brand; Subscription and delivery unfamiliarity; Price compared with bulk dry food; Storage and routine disruption",
    influences: "Vet-facing Lyka material; Expert formulation content; Clear feeding plan; Price and portion calculator; Customer support; Straightforward FAQs; Transition guidance",
    momentsToWin: "Provide clear expert credentials; Offer vet-shareable summaries; Present a structured feeding and transition plan; Make DTC logistics simple and predictable; Demonstrate long-term health fit",
    emotionalScore: "Emotional 60 – Cautious rather than excited; wants to avoid acting irresponsibly or abandoning proven advice without justification.",
    rationalScore: "Rational 95 – Peak focus on formulation, expert recommendation, feeding instructions, health suitability, cost and routine fit.",
    duration: "Days to weeks",
    definition: "Seeking expert reassurance and a structured replacement routine",
  },
  {
    title: "Action",
    icon: React.createElement(ShoppingCartIcon),
    doingThinking: "They follow the transition schedule precisely, measure portions and seek reassurance if the dog’s response deviates from expectations.; “I will follow the plan, but I need to know any changes are expected and safe.”",
    painPoints: "Any deviation creates concern; Dog reluctance or digestive change; Unclear instructions; Delivery problems; Household members failing to follow the plan",
    influences: "Printed and digital transition plan; Portion instructions; Email or SMS reminders; Customer-service support; Delivery tracking; Vet or expert reassurance",
    momentsToWin: "Use precise instructions and proactive reassurance; Provide a printed plan where useful; Make access to help straightforward; Confirm that the owner is following the correct process",
    emotionalScore: "Emotional 65 – Reassured by structure but uneasy when the dog’s response differs from the prescribed plan.",
    rationalScore: "Rational 90 – Carefully following portions, timings, transition instructions and professional guidance.",
    duration: "First 3–6 weeks",
    definition: "Following instructions carefully and protecting consistency",
    coreQuestion: "A credible expert makes changing food feel more responsible than staying the same.",
  },
  {
    title: "Maintenance",
    icon: React.createElement(StarIcon),
    doingThinking: "Once the routine is established, they continue reliably.; They may review the feeding plan at vet visits or when the dog’s health changes.; “This works, it is predictable and my dog appears healthy. I am comfortable staying with it.”",
    painPoints: "Price increases; Disruption to delivery or stock; New veterinary advice; Changing health needs; Complexity in adjusting portions or schedules",
    influences: "Subscription reminders; Feeding-plan reviews; Age, weight and health updates; Vet check-ins; Easy delivery management; Preventative health CRM",
    momentsToWin: "Become the new dependable routine; Provide proactive plan reviews; Communicate changes clearly and early; Link feeding adjustments to vet and health milestones; Reward consistency rather than novelty",
    emotionalScore: "Emotional 50 – Calm confidence once Lyka becomes the new established routine.",
    rationalScore: "Rational 85 – Continued loyalty depends on predictability, health outcomes, delivery reliability and ongoing expert legitimacy.",
    duration: "Long-term and stable",
    definition: "Remaining loyal if Lyka becomes the new reliable routine",
  },
];

// SECURE SLEEPWALKERS
// 27% market / 3% of Lyka customers. Create a genuine reason to reconsider without making feeding feel harder or implying they have failed their dog.
const secureSleepwalkersStages: JourneyStageDetail[] = [
  {
    title: "Precontemplation",
    icon: React.createElement(StopIcon),
    doingThinking: "They buy familiar supermarket food, serve it with minimal thought and change only when necessary.; Feeding may be functional rather than highly monitored.; “My dog eats it and seems fine. Food does not need to be complicated.”",
    painPoints: "No perceived problem; Lower involvement in dog nutrition; Familiar routine validates itself; Price sensitivity; Low digital and subscription affinity; Fresh feeding appears unnecessary or indulgent",
    influences: "FTA television; Commercial radio; Facebook; Mainstream news; Supermarket and pet retail; Friends and family; Occasional veterinarian contact",
    momentsToWin: "Normalise fresh feeding through broad, mainstream communications; Use simple quality-of-life and healthy-ageing stories; Avoid criticism of existing owners or feeding choices; Build familiarity before a need occurs",
    emotionalScore: "Emotional 20 – Little emotional tension around feeding. The dog seems content and the owner feels settled in their choices.",
    rationalScore: "Rational 60 – The current routine wins through familiarity, value, convenience and easy supermarket availability.",
    duration: "Potentially indefinite",
    definition: "Dominant and potentially permanent stage",
  },
  {
    title: "Contemplation",
    icon: React.createElement(BulbIcon),
    doingThinking: "Their older dog slows down, gains or loses weight, becomes fussy, develops digestive or skin problems, or stops eating the usual food.; A vet or family member suggests reconsidering nutrition.; “Something has changed, but is new food really necessary? I do not want to overreact or waste money.”",
    painPoints: "Symptoms may be dismissed as normal ageing; Limited interest in researching causes; Distrust of premium or emotional pet-parent marketing; Concern about being pressured or judged",
    influences: "Vet appointment; Family recommendation; Facebook owner story; Mainstream health or ageing content; Retail or clinic visibility; Search after a visible problem emerges",
    momentsToWin: "Make visible symptoms relevant without catastrophising; Use relatable older-dog stories; Show practical improvement rather than abstract optimisation; Use vets, family and mainstream social proof",
    emotionalScore: "Emotional 65 – Concern rises when the dog visibly declines, stops eating or develops a problem that can no longer be ignored.",
    rationalScore: "Rational 65 – Beginning to assess whether food is responsible and whether changing it is genuinely necessary.",
    duration: "Trigger-led; weeks or months",
    definition: "A visible, undeniable issue creates relevance",
  },
  {
    title: "Preparation",
    icon: React.createElement(MagnifyingGlassIcon),
    doingThinking: "They look at a limited number of options, compare price, serving effort and likely dog acceptance, and seek basic reassurance rather than detailed nutritional education.; “What will this cost? Will my dog eat it? Is it straightforward, and can I stop if it does not work?”",
    painPoints: "Price premium; Subscription discomfort; Freezer space; Delivery complexity; Too much information; Unclear immediate benefit; Concern the dog will reject it",
    influences: "Simple Lyka website journey; Price-per-day information; Phone or human support; Straightforward testimonials; Starter offer; Clear delivery and cancellation information",
    momentsToWin: "Keep the proposition extremely simple; Explain price per day clearly; Offer an accessible starter option or partial feeding; Show exactly how storage, serving and delivery work; Make cancellation and flexibility explicit",
    emotionalScore: "Emotional 50 – Wary of overreacting, wasting money or being drawn into an unnecessarily premium solution.",
    rationalScore: "Rational 80 – Strong focus on price per day, dog acceptance, serving ease, storage, delivery and cancellation flexibility.",
    duration: "Often short once need is accepted",
    definition: "Reluctantly assessing whether change is necessary and affordable",
  },
  {
    title: "Action",
    icon: React.createElement(ShoppingCartIcon),
    doingThinking: "They trial the food, often with a low tolerance for transition complexity.; They watch whether the dog eats it and whether feeding remains manageable.; “This needs to be easy. If my dog will not eat it or the process becomes difficult, I will go back to what I know.”",
    painPoints: "Transition feels like effort; Dog refuses the first meals; Confusion about thawing, serving or storage; Delivery timing; Low willingness to persist through temporary problems",
    influences: "Simple transition instructions; Printed guidance; Delivery notification; Phone, email or chat support; Basic feeding reminders; Clear account controls",
    momentsToWin: "Minimise onboarding steps; Provide simple, repeated instructions; Offer accessible human support; Reinforce immediate benefits such as eating enjoyment and convenience; Avoid information overload",
    emotionalScore: "Emotional 55 – Concerned about whether the dog will eat the food, but has limited patience for a complicated transition.",
    rationalScore: "Rational 75 – Quickly evaluating acceptance, effort, storage, cost and whether the process works as promised.",
    duration: "First 2–4 weeks",
    definition: "Trying Lyka if the process appears simple and justified",
    coreQuestion: "A visible problem makes the current routine feel less safe and simple than changing.",
  },
  {
    title: "Maintenance",
    icon: React.createElement(StarIcon),
    doingThinking: "They continue if the dog accepts it and the routine stays easy.; They may not actively track benefits or participate deeply in the brand relationship.; “I will keep using it if it works without creating extra cost, effort or hassle.”",
    painPoints: "Cost remains visible; Benefits are not actively noticed; Travel and freezer inconvenience; Subscription inertia becomes irritation; Easily tempted back by supermarket convenience or promotion",
    influences: "Delivery reminders; Easy pause and cancellation; Basic health and ageing content; Customer service; Loyalty value; Simple referral mechanisms",
    momentsToWin: "Keep service predictable; Remind them of visible outcomes; Make delivery changes effortless; Offer practical loyalty value; Use life-stage prompts to keep the product relevant; Do not expect high community engagement or advocacy",
    emotionalScore: "Emotional 40 – Satisfied when Lyka works, but unlikely to build a highly expressive emotional relationship with the brand.",
    rationalScore: "Rational 70 – Retention depends on continued convenience, predictable delivery, manageable price and visible dog acceptance.",
    duration: "Vulnerable to price and inconvenience",
    definition: "Staying only if Lyka remains convenient, accepted and worth the cost",
  },
];

export const journeys: Record<JourneyType, JourneyDetailsData> = {
  [JourneyType.DEVOTED_CATERERS]: {
    type: JourneyType.DEVOTED_CATERERS,
    subCategories: {
      [JourneySubCategoryKey.MACRO_JOURNEY]: {
        key: JourneySubCategoryKey.MACRO_JOURNEY,
        title: "Devoted Caterers journey",
        stages: devotedCaterersStages,
      },
    },
  },
  [JourneyType.MINDFUL_RESEARCHERS]: {
    type: JourneyType.MINDFUL_RESEARCHERS,
    subCategories: {
      [JourneySubCategoryKey.MACRO_JOURNEY]: {
        key: JourneySubCategoryKey.MACRO_JOURNEY,
        title: "Mindful Researchers journey",
        stages: mindfulResearchersStages,
      },
    },
  },
  [JourneyType.CONFLICTED_TROUBLESHOOTERS]: {
    type: JourneyType.CONFLICTED_TROUBLESHOOTERS,
    subCategories: {
      [JourneySubCategoryKey.MACRO_JOURNEY]: {
        key: JourneySubCategoryKey.MACRO_JOURNEY,
        title: "Conflicted Troubleshooters journey",
        stages: conflictedTroubleshootersStages,
      },
    },
  },
  [JourneyType.DISCIPLINED_OUTSOURCERS]: {
    type: JourneyType.DISCIPLINED_OUTSOURCERS,
    subCategories: {
      [JourneySubCategoryKey.MACRO_JOURNEY]: {
        key: JourneySubCategoryKey.MACRO_JOURNEY,
        title: "Disciplined Outsourcers journey",
        stages: disciplinedOutsourcersStages,
      },
    },
  },
  [JourneyType.SECURE_SLEEPWALKERS]: {
    type: JourneyType.SECURE_SLEEPWALKERS,
    subCategories: {
      [JourneySubCategoryKey.MACRO_JOURNEY]: {
        key: JourneySubCategoryKey.MACRO_JOURNEY,
        title: "Secure Sleepwalkers journey",
        stages: secureSleepwalkersStages,
      },
    },
  },
};
