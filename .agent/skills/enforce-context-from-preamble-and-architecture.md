# Skill: Enforce Context from `preamble.md` and `architecture.md`

## Purpose
Use this skill before responding to any user prompt so outputs stay aligned with project intent, structure, and architecture.

## When to Invoke
- At the start of every new prompt/task
- Before proposing implementation plans
- Before creating or modifying code
- Before finalizing output

## Required Inputs
- `preamble.md`
- `architecture.md`

## Reusable Action
1. Read `preamble.md`.
2. Read `architecture.md`.
3. Extract constraints, conventions, and architectural boundaries.
4. Apply those constraints to planning, implementation, and final response.
5. If conflict exists between prompt and architecture, ask for clarification before proceeding.

## Output Contract
Every response should be consistent with:
- Project goals in `preamble.md`
- Design boundaries in `architecture.md`

## Enforcement Note
Do not skip this skill. Treat it as mandatory pre-execution context loading for all prompts.
