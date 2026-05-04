---
name: votc-branch-maintenance
description: Maintain the local branch model for the VOTC Electron app. Use when Codex needs to reset or rebuild main from upstream-main, reapply the local-tools overlay, inspect or update local-only tooling artifacts, or explain this repository's fork branch strategy.
---

# VOTC Branch Maintenance

Use this skill only in the `Voices-of-the-Court/VOTC` app repository.

## Branch Model

- `upstream-main`: clean upstream-compatible branch tracking `Voices-of-the-Court/main`.
- `main`: local development branch tracking `adunato/main`.
- `local-tools`: local overlay branch for repo maintenance artifacts reapplied after refreshing `main` from `upstream-main`.
- `change/CRXXX-*`: working branches for individual change requests.
- `pr/CRXXX-*`: upstream-ready PR branches derived from completed CR work.

## Local Overlay Contents

Keep `local-tools` limited to local repo workflow artifacts:

- `.agents/skills/`
- `.agents/scripts/`
- `AGENTS.md`
- `change_requests/`
- `change_requests/tracker.md`

If another local-only artifact is needed, add it deliberately and update `AGENTS.md` in the same change.

## Rebuild Main Workflow

Before any destructive operation:

1. Confirm the current branch and working tree with `git status --short --branch`.
2. Preserve or commit unrelated work. Never reset over user changes without explicit instruction.
3. Verify `upstream-main` and `local-tools` exist locally.

To rebuild `main` when explicitly asked:

1. Switch to `main`.
2. Reset or overwrite `main` from `upstream-main` as requested by the user.
3. Merge `local-tools` into `main`.
4. Resolve conflicts by preserving upstream product code and local overlay artifacts.
5. Run `git status --short --branch` and summarize the resulting state.
6. If the user wants `origin/main` to match the rebuilt local `main`, publish with `git push --force-with-lease origin main` after explicit confirmation.
