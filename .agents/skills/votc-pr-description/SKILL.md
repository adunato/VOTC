---
name: votc-pr-description
description: Create or update VOTC pull request description artifacts in change_requests/CRXXX_*/PR.md, including why, what changed, validation, docs and release impact, and UI evidence.
---

# VOTC PR Description

## Workflow

1. Confirm the working directory is the VOTC app repository.
2. Determine the CR ID from the user request or current `change/CRXXX-*` or `pr/CRXXX-*` branch.
3. Find the matching `change_requests/CRXXX_*` folder.
4. Read HLD/IP, inspect status, inspect diff/commits against the intended baseline, and gather validation evidence.
5. Create or update `PR.md` using the template below.
6. Do not claim commands, screenshots, or manual checks unless they actually happened.

## Template

```markdown
## Why this change

## What changed

- 

## Validation

- [ ] `npm run build`
- [ ] Manual Electron verification completed
- [ ] Manual CK3 integration verification completed, if applicable

### Manual verification notes

- 

## Docs and release impact

- [ ] No docs changes needed
- [ ] Updated docs / README as needed
- [ ] Version/release files updated, if applicable

## UI evidence (if applicable)
```
