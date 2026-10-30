@AGENTS.md

## JevRouter

Before substantive executable work (coding, debugging, multi-file edits, refactors, tests, deployment prep), when the user has not named a model/tier, follow `.claude/skills/jevrouter/SKILL.md` once to pick haiku, sonnet, or opus, then announce `JevRouter: <tier> selected (<confidence>)`. Dispatch haiku/opus work via the Agent tool with that `model`; sonnet continues directly. Skip for chat, explanations, trivial edits, or explicit single operations. If routing fails (e.g. missing `OPENROUTER_API_KEY`), say so briefly and use Sonnet, never Opus.
