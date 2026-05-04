---
name: votc-upstream-pr
description: Prepare VOTC app changes for upstream contribution. Use when Codex needs to turn a completed change/CRXXX-* branch into a clean pr/CRXXX-* branch, strip local-only artifacts, validate the upstream-ready diff, or prepare a PR to Voices-of-the-Court/main.
---

# VOTC Upstream PR

## Branch Intent

- Source work comes from `change/CRXXX-*`.
- Upstream-ready work goes to `pr/CRXXX-*`.
- `upstream-main` is the clean integration branch for upstream PRs into `Voices-of-the-Court/main`.
- `local-tools` and `main` may contain local-only artifacts that must not leak upstream.

## Local-Only Artifacts To Strip

- `.agents/skills/`
- `.agents/scripts/`
- `AGENTS.md`
- `change_requests/`
- design documents, scratch notes, or utility scripts not intended for upstream

## PR Branch Workflow

1. Confirm the completed CR branch and intended CR number.
2. Read `change_requests/tracker.md` and confirm the CR is active.
3. Run:

   ```powershell
   .\.agents\scripts\new-upstream-pr.ps1 -SourceBranch change/CRXXX-short-title -PrBranch pr/CRXXX-short-title
   ```

4. Review `git diff --name-status upstream-main..HEAD` and confirm local-only artifacts are absent.
5. Run additional validation required by touched areas.
6. Do not push or create the GitHub PR unless the user explicitly asks.
