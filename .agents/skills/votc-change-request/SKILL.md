---
name: votc-change-request
description: Create and manage VOTC app change requests. Use when Codex needs to start a new CR, create change_requests/CRXXX_* documentation, create a change/CRXXX-* branch, draft or update HLD and implementation plans, or align work with this project's change request practice.
---

# VOTC Change Request

Use this skill only in the `Voices-of-the-Court/VOTC` app repository.

## CR Numbering

1. Inspect `change_requests/tracker.md`, active `change_requests/CRXXX_*` folders, and archived `change_requests/archive/CRXXX_*` folders.
2. Pick the next `CRXXX` number after the highest existing tracked, active, or archived CR.
3. Use folder names like `change_requests/CR003_short_title`.
4. Use branch names like `change/CR003-short-title`.

## Required Files

Each CR folder must contain:

- `HLD.md`
- `IMPLEMENTATION_PLAN.md`

Keep these files in `change/CRXXX-*` and `local-tools`. Remove them from upstream PR branches unless the user explicitly wants the docs included upstream.

## New CR Workflow

1. Start from `main` unless the user specifies `upstream-main`.
2. Create and switch to `change/CRXXX-short-title`.
3. Create `HLD.md` with title, status, goals, proposed solution, risks, and validation.
4. Create `IMPLEMENTATION_PLAN.md` with prerequisites, atomic tasks, files affected, verification, and rollback.
5. Update `change_requests/tracker.md`.
6. Commit only the CR docs and tracker update with a message like `docs: init CRXXX short title`.
7. Ask for HLD approval before writing implementation code when starting a brand-new change.

## Implementation Rules

- Read `AGENTS.md` first.
- Use `npm run build` as the baseline validation command.
- Use `npm run dev` for manual app testing when UI, IPC, preload, tray, overlay, or startup behavior changes.
- Use `npm run build:win` when Windows packaging, installer, updater, or Electron Builder behavior changes.
- For CK3 integration changes, record whether verification used a real CK3 session, representative `debug.log` content, or a narrower local check.
