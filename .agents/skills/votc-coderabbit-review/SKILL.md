---
name: votc-coderabbit-review
description: Use when working in the VOTC app repo with CodeRabbit PR review comments. Produces a structured review-response plan that maps each CodeRabbit observation and recommendation to a verified proposed solution before implementation.
---

# VOTC CodeRabbit Review

## Core Workflow

1. Verify every CodeRabbit finding against the current branch before accepting it.
2. Produce a structured plan before editing for every new CodeRabbit review batch unless the user explicitly says to proceed without planning.
3. Keep CodeRabbit's observation and recommendation distinct from the proposed local solution.
4. Wait for user approval before editing code, docs, tests, or workflow files.
5. Group related comments when they share one implementation.
6. Include validation. Use `npm run build` by default and add targeted checks such as `npm run typecheck:web`, `npm run typecheck:node`, `npm run dev`, or `npm run build:win` when relevant.

## VOTC-Specific Review Patterns

- Config/defaults: keep `default_userdata/`, settings repositories, and renderer settings UI aligned.
- IPC/preload: verify main, preload, and renderer contracts together.
- Game data parsing: inspect `src/main/gameData/parseLog.ts` and use representative CK3 log data when possible.
- LLM providers: keep provider registry, schemas, settings UI, and validation behavior aligned.
- Overlay/focus behavior: be explicit when CK3 was not running during validation.
