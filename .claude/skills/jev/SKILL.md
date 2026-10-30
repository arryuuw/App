---
name: jev
description: Route a requested coding task through Jev before substantive work. Use only when the user invokes /jev.
argument-hint: "[task or pasted specification]"
disable-model-invocation: true
---

Route and implement this request:

$ARGUMENTS

1. Retain every shared context, constraint, scope lock, stop-and-ask trigger, and verification requirement throughout.
2. Classify before substantive work: one coherent substantive unit gets one route; multiple independently implementable substantive features/work units are routed separately, in requested order, immediately before each unit. Do not split a feature into its reads, commands, edits, tests, commits, or other implementation steps.
3. For each unit without a user-explicit model/tier override, follow the installed `jevrouter` procedure at `.claude/skills/jevrouter/SKILL.md` and route among haiku, sonnet, and opus. Include the shared requirements when routing and when delegating.
4. Report every decision exactly as `JevRouter: <tier> selected (<confidence>)`. Dispatch haiku or opus substantive work through Agent with that model; let the Sonnet parent work for sonnet unless isolation is useful.
5. An explicit user model/tier choice bypasses Jev only for that unit. If Jev fails, say so briefly and use Sonnet; never fall back to Opus.
