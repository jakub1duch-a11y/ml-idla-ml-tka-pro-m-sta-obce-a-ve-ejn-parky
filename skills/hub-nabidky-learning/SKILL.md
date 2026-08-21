# Hub nabídky — learning skill

## Purpose
Use this skill when preparing, reviewing, visualizing, pricing, presenting, or improving offers in MLŽIDLA® Sales Hub. The goal is to turn user requirements, criticism, approved outputs, rejected patterns, and commercial outcomes into reusable rules for the next offer.

## Non-negotiable technical-data rule
For all extracted or generated technical product data: **use null when unknown / do not infer**. Never invent pressure, water consumption, nozzle count, material grade, dimensions, coverage, price, warranty, installation conditions, certifications, or references. If a fact is not explicitly supported by a trusted product record, approved source, or project document, return `null` in structured data and mark it as a point for technical confirmation in client-facing material.

## Learning loop
1. Read the current inquiry, project, product references, approved visualization assets, pricing source, and active OfferLearningFeedback records.
2. Separate hard facts from preferences, hypotheses, estimates, and missing inputs.
3. Apply active lessons ordered by priority. Direct user criticism overrides older style preferences when they conflict.
4. Generate the offer or visualization.
5. Before sending, run a quality review for technical accuracy, product geometry, pricing provenance, presentation quality, and client clarity.
6. Capture explicit user feedback as one of: user_requirement, critique, approved_pattern, rejected_pattern, result_outcome.
7. Convert repeated feedback into a concise reusable lesson. Never generalize a one-off technical fact into a universal product rule.
8. Record commercial outcomes such as approved/order/rejected as evidence, not as proof that every design choice was correct.

## Visual rules
- Preserve exact product geometry from approved product references.
- SINGLE = exactly one real product; DUO = exactly two of the same product; ALEJ = repeated identical product. Do not invent a new product when only the arrangement changes.
- Architectural visualizations must look physically plausible, correctly scaled, clean, premium, and suitable for B2B/public-sector presentation.
- Mist must originate only from real nozzle positions and behave as fine water mist, not smoke.
- Keep source architecture, perspective, and existing site elements intact unless the brief explicitly asks for a redesign.

## Offer rules
- Clearly separate confirmed price, conditional price, estimate, and manual/project calculation.
- Never surface placeholder prices such as 0 or 1 CZK as a valid customer price.
- Client-facing PDFs and presentations must not contain internal notes, IDs, debugging text, hidden uncertainty, or raw workflow instructions.
- Explain unknowns as items to confirm before production, not as invented specifications.
- Prefer clear visual hierarchy: project goal, proposed solution, visualization, technical scope, price, delivery/installation, smart control if relevant, next step, and project contact.

## Feedback priorities
Priority 5: safety, technical accuracy, product geometry, legal/financial correctness.
Priority 4: explicit user criticism or requirement repeated across offers.
Priority 3: approved presentation/copy patterns and stable brand conventions.
Priority 2: performance optimizations and optional workflow preferences.
Priority 1: experiments that may be ignored when they conflict with stronger evidence.

## Structured extraction contract
When importing Firecrawl or competitor data, preserve source URLs and provenance. Unknown values must be `null`. Never coerce missing technical values to zero, false, or guessed text. Any field used in pricing or technical documentation must be traceable to a source or explicitly labeled as an estimate.

## Quality gate before send
The offer is ready only when:
- product identity and geometry are correct,
- quantity/configuration matches the inquiry,
- technical claims are sourced or explicitly pending confirmation,
- price status and source are visible internally,
- visualizations match the offered variant,
- client copy is professional and concise,
- no internal data leaks into the client output,
- the user can still review and approve the final send action.
