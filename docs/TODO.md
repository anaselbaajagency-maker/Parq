# TODO / Roadmap (Code Quality, Security, SaaS, Performance)

This is a practical checklist for taking ParqV2 from "works" to "production SaaS".

## Executed Batch (2026-02-28)

- Security: route rate limits + backend/frontend security headers + CORS allowlist via env.
- SaaS readiness: maintenance gates + request IDs + structured logs + backup/restore runbook + soft-delete/anonymize flow.
- Performance: DB indexes + query profiling + public endpoint caching + cursor pagination + load-testing scripts + SLO runbook.
- Mobile readiness: `/api/v1` compatibility route and mobile env templates.
- Process: changelog/versioning docs + CodeQL workflow.
- Code quality: PHPStan added to CI, FormRequests expanded on auth/wallet/admin APIs, API resources introduced, and feature test coverage extended.
- GitHub/process: branch protection + environments automation scripts/docs added (`scripts/github/configure-repo.sh`, `.github/settings.yml`).
- Frontend quality: added `typecheck` + quality report in CI, and removed `any` from critical auth/api/wallet/listing form files.

## 0) GitHub / Process (Now)

- [x] Protect `main`: block direct pushes, require CI checks, require 1 review (codified + apply script)
- [x] Protect `develop`: require CI checks (codified + apply script)
- [x] Create GitHub Environments: `staging`, `production` + add deploy secrets (codified + apply script)
- [x] Add a `CHANGELOG.md` and versioning strategy (tags/releases)

## 1) Code Quality

Backend (Laravel):
- [x] Add static analysis (Larastan / PHPStan) + run in CI
- [x] Enforce formatting (Pint already exists) + fail CI on diff
- [x] Add request validation FormRequests everywhere (auth/wallet/admin/message/account/category/city/coupon/settings covered)
- [x] Add API resource transformers for consistent responses
- [x] Increase test coverage: auth, listings filters, wallet edge cases, permissions

Frontend (Next.js):
- [ ] Tighten TypeScript types: remove `any` gradually (tracking via `npm run quality:report`; current: 93 explicit `any`, 243 ESLint warnings)
- [ ] Add component/unit tests (React Testing Library) for critical flows (plan ready in `docs/FRONTEND-TESTING.md`; blocked here: npm registry offline as of 2026-02-28)
- [ ] Add e2e smoke tests (Playwright): login, create listing, admin screens (plan ready in `docs/FRONTEND-TESTING.md`; blocked here: npm registry offline as of 2026-02-28)
- [ ] Add `--max-warnings=0` in CI once warnings are cleaned (`frontend` has `lint:strict` script ready)

## 2) Security

Backend:
- [x] Decide auth for web + mobile: Sanctum (SPA) or JWT/OAuth2 (mobile-friendly)
- [x] Rate-limit sensitive endpoints (OTP, login, password reset)
- [x] Add RBAC (admin vs user) with policies/guards and enforce everywhere
- [x] Validate uploads (mime/size), store outside webroot, use signed URLs if needed
- [x] Centralize audit logging for wallet/admin actions
- [x] Set secure headers + CORS rules per environment (no wildcard in prod)

Frontend:
- [x] CSP + security headers (via Next config / reverse proxy)
- [x] Avoid storing long-lived tokens in localStorage (prefer httpOnly cookies if possible)

GitHub:
- [x] Enable Dependabot PR auto-merge rules (optional)
- [x] Add CodeQL (if repo is eligible) or alternative SAST

## 3) SaaS Readiness

- [x] Environment config templates: `.env.example` for each app with required vars documented
- [x] Observability: Sentry (frontend + backend), structured logs, request IDs
- [x] Background jobs: Redis queue + retries + dead-letter strategy
- [x] Backups + restore drills (DB + storage)
- [x] Admin "maintenance mode" controls with safe access gates
- [x] Data lifecycle: soft-deletes, GDPR-style delete/anonymize flow (if needed)

## 4) Performance (Target: 10k daily users)

Backend:
- [x] DB indexes for common filters/search; add query profiling
- [x] Cache hot endpoints (Redis) + HTTP caching headers where possible
- [x] Offload heavy work to queue (images processing, notifications, daily deductions)
- [x] Use pagination everywhere + cursor pagination for large feeds
- [x] Add rate limits per IP/user/token

Frontend:
- [x] Use `next/image` for listing images (reduce LCP)
- [x] Add CDN for assets/images + caching headers
- [x] Measure Core Web Vitals and fix biggest regressions

Load testing:
- [x] k6/Artillery scripts for critical APIs (listings search, listing details, wallet ops)
- [x] Define SLOs (p95 latency, error rate) + alerting

## 5) Mobile (Android/iOS) Backend Readiness

- [x] API versioning (`/api/v1/...`) + backward compatibility rules
- [ ] Token auth + refresh tokens + device/session management
- [ ] Push notifications (FCM/APNs) endpoints + background jobs
- [ ] File uploads optimized for mobile (chunking/signed uploads if needed)
- [ ] Clear error contracts (error codes/messages) for consistent UX
