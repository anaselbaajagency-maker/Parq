# Branching / PR Flow

## Branches

- `main`: production-ready only
- `develop`: staging/integration

## Working Branches

- `feature/<name>`: new features (merge into `develop`)
- `fix/<name>`: bug fixes (merge into `develop`)
- `hotfix/<name>`: urgent production fix (merge into `main` and backport to `develop`)

## PR Rules (Recommended)

- No direct pushes to `main` (protected branch)
- Require CI green (backend tests + frontend lint/build)
- Require 1 review minimum

