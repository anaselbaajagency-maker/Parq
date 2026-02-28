# Versioning Strategy

## Branches

- `main`: production releases only
- `develop`: integration/staging

## Versioning

- Use Semantic Versioning: `MAJOR.MINOR.PATCH`
- Tag releases on `main` as `vX.Y.Z`
- Keep unreleased changes under `## [Unreleased]` in `CHANGELOG.md`

## Release Flow

1. Merge tested changes into `develop`
2. Open release PR `develop -> main`
3. Update `CHANGELOG.md`:
   - move entries from `Unreleased` to new version section with date
4. Merge to `main`
5. Create Git tag: `vX.Y.Z`
6. Trigger production deploy workflow

