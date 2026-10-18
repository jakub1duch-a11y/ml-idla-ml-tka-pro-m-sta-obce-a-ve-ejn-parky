---
name: evaluating-skills
description: Evaluate and improve agent skills with realistic test cases, evidence-based assertions, baseline comparisons, and iterative human review. Use when creating, auditing, or revising any Agent Skill.
---

# Evaluating skill output quality

Use eval-driven iteration to establish whether a skill reliably improves results across realistic prompts, edge cases, and a baseline without the skill.

## Workflow

1. **Create test cases first.** Store them in `evals/evals.json`. Each case needs a realistic user prompt, a human-readable expected result, and optional input files. Start with 2–3 diverse cases, including at least one ambiguous or malformed-input edge case.
2. **Run a clean comparison.** Run every prompt with the candidate skill and with no skill (or the previous version). Isolate each run from prior task context. Keep input files and prompts identical.
3. **Add objective assertions after inspecting outputs.** Prefer observable checks (valid JSON, expected files exist, required sections or counts). Avoid vague checks such as “the output is good” and brittle checks that require exact wording when equivalent wording is acceptable.
4. **Grade with evidence.** For each assertion, record PASS/FAIL and concrete output evidence. Use scripts for mechanical checks; use a human or blind LLM review for holistic qualities such as clarity, usability, organization, and visual polish.
5. **Aggregate results.** Record pass rates, runtime, and token use for both configurations, plus the difference. Only interpret standard deviation when there are enough repeated runs.
6. **Analyze patterns.** Remove assertions that always pass, repair assertions that fail in both configurations, investigate flaky outcomes and outliers, and identify checks that pass only with the skill.
7. **Improve generally, not narrowly.** Combine failed assertions, reviewer feedback, and execution traces. Clarify ambiguous instructions, remove wasteful steps, and explain why important instructions matter. Avoid adding rules that only overfit one test prompt.
8. **Repeat and review.** Snapshot the prior skill, run a new numbered iteration, grade it, inspect actual outputs, and stop when feedback is consistently clear or further changes no longer produce meaningful gains.

## Suggested workspace

```text
<skill-name>/
  SKILL.md
  evals/evals.json
<skill-name>-workspace/
  iteration-1/
    eval-<case>/
      with_skill/outputs/
      with_skill/timing.json
      with_skill/grading.json
      without_skill/outputs/
      without_skill/timing.json
      without_skill/grading.json
    benchmark.json
    feedback.json
```

Keep test inputs fixed across comparisons. Record token count and duration for each run. Store generated grading and benchmark data separately from authored test cases.

## Quality safeguards

- Every PASS must cite concrete evidence.
- Assertions must be verifiable from the output and should test meaningful outcomes.
- Human review complements automated checks; neither alone is sufficient for all tasks.
- Compare quality gains against additional latency and token cost.
- Treat inconsistent results as a signal to inspect ambiguity, run isolation, and task variance.
- Do not claim a skill is effective from a single successful example; compare multiple prompts and a baseline.

Reference: https://agentskills.io/skill-creation/evaluating-skills
