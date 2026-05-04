# AGENTS.md

This file is a thin maintainer note for contributors using Codex. Canonical app usage notes live in `README.md`; repo-local workflow details live here and in `.agents/skills/`.

## Preferred Workflow

- Start with `npm ci`.
- Run `npm run typecheck` for a quick TypeScript validation pass.
- Run `npm run build` as the baseline validation command before commits.
- Run `npm run dev` for local Electron/Vite development.
- Run `npm run build:win` when installer, updater, Windows packaging, or Electron Builder behavior changes.

## Repo-Specific Cautions

- This is the official 2.x Electron app for Voices of the Court. Do not use the legacy `Demeter29/Voices_of_the_Court` repo for app work.
- Keep edits non-destructive. Do not revert unrelated work in the tree.
- Renderer UI is React/Sass under `src/renderer/`; main-process code is under `src/main/`; preload APIs are under `src/preload/`.
- Runtime app data uses Electron's app data location for product name `VOTC`. Avoid confusing generated user data with repo defaults in `default_userdata/`.
- CK3 integration depends on game logs, clipboard commands, run file output, focus monitoring, and an overlay window. Be explicit when validation did not include a real CK3 session.
- When dependencies change, update `package.json` and `package-lock.json` together.
- When default scripts, actions, prompts, or game-data typedefs change, check whether `npm run typedefs` should refresh generated default user data.

## Branch Purpose

This repository is a fork of `Voices-of-the-Court/VOTC`.

- `main`: local development branch tracking `adunato/main`.
- `upstream-main`: clean branch tracking `Voices-of-the-Court/main`, used for upstream updates and upstream-ready PR work.
- `local-tools`: local overlay branch for repository maintenance artifacts that can be reapplied after refreshing `main` from `upstream-main`.
- `change/CRXXX-*`: per-change working branches mapped to a change request.
- `pr/CRXXX-*`: upstream-ready PR branches created after a change is completed and tested. Strip `.agents/`, `AGENTS.md`, and `change_requests/` before opening upstream PRs.

Use the repo-local skills for detailed project workflows:

- `$votc-branch-maintenance`: rebuild `main` from `upstream-main`, maintain `local-tools`, and manage local overlay artifacts.
- `$votc-change-request`: create and manage `change/CRXXX-*` branches and `change_requests/` docs.
- `$votc-coderabbit-review`: triage, verify, plan, and address CodeRabbit PR review comments.
- `$votc-pr-description`: draft or update `change_requests/CRXXX_*/PR.md` for a change request.
- `$votc-upstream-pr`: prepare clean `pr/CRXXX-*` branches with `.agents/scripts/new-upstream-pr.ps1` before upstream PR work.

Keep `change_requests/tracker.md` current when CR state changes, including creation, archive/supersession, local merge, PR opening, and PR merge.

## Version Truth

- Canonical version: root `package.json`
- Build configuration: `electron-builder.yml`, `electron.vite.config.ts`
- Release tag format: `vX.Y.Z`
- Current release source is `Voices-of-the-Court/VOTC`, not `Voices-of-the-Court/votc_mod`.

When changing release or packaging behavior, inspect these together:

- `package.json`
- `package-lock.json`
- `electron-builder.yml`
- `electron.vite.config.ts`
- `.github/workflows/`
- `README.md`

## Frontend and Electron Changes

- Prefer existing React component, Zustand store, Sass, and preload API patterns over new abstractions.
- For renderer changes, run `npm run typecheck:web`; for main/preload changes, run `npm run typecheck:node`.
- For IPC/preload changes, verify both the preload contract and renderer call sites.
- For UI changes, run the app with `npm run dev` when feasible and capture manual verification notes.
