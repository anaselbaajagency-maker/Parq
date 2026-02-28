# TODO / Roadmap (Code Quality, Security, SaaS, Performance)

This is a practical checklist for taking ParqV2 from "works" to "production SaaS".

## Executed Batch (2026-02-28)

- Security: route rate limits + backend/frontend security headers + CORS allowlist via env.
- Mobile readiness: `/api/v1` compatibility route and mobile env templates.
- Process: changelog/versioning docs + CodeQL workflow.

## 0) GitHub / Process (Now)

- [ ] Protect `main`: block direct pushes, require CI checks, require 1 review
- [ ] Protect `develop`: require CI checks
- [ ] Create GitHub Environments: `staging`, `production` + add deploy secrets
- [x] Add a `CHANGELOG.md` and versioning strategy (tags/releases)

## 1) Code Quality

Backend (Laravel):
- [ ] Add static analysis (Larastan / PHPStan) + run in CI
- [x] Enforce formatting (Pint already exists) + fail CI on diff
- [ ] Add request validation FormRequests everywhere (no raw `request()->all()` in services)
- [ ] Add API resource transformers for consistent responses
- [ ] Increase test coverage: auth, listings filters, wallet edge cases, permissions

Frontend (Next.js):
- [ ] Tighten TypeScript types: remove `any` gradually (track warnings)
- [ ] Add component/unit tests (React Testing Library) for critical flows
- [ ] Add e2e smoke tests (Playwright): login, create listing, admin screens
- [ ] Add `--max-warnings=0` later once warnings are cleaned

## 2) Security

Backend:
- [ ] Decide auth for web + mobile: Sanctum (SPA) or JWT/OAuth2 (mobile-friendly)
- [x] Rate-limit sensitive endpoints (OTP, login, password reset)
- [ ] Add RBAC (admin vs user) with policies/guards and enforce everywhere
- [ ] Validate uploads (mime/size), store outside webroot, use signed URLs if needed
- [ ] Centralize audit logging for wallet/admin actions
- [x] Set secure headers + CORS rules per environment (no wildcard in prod)

Frontend:
- [x] CSP + security headers (via Next config / reverse proxy)
- [ ] Avoid storing long-lived tokens in localStorage (prefer httpOnly cookies if possible)

GitHub:
- [ ] Enable Dependabot PR auto-merge rules (optional)
- [x] Add CodeQL (if repo is eligible) or alternative SAST

## 3) SaaS Readiness

- [x] Environment config templates: `.env.example` for each app with required vars documented
- [ ] Observability: Sentry (frontend + backend), structured logs, request IDs
- [ ] Background jobs: Redis queue + retries + dead-letter strategy
- [ ] Backups + restore drills (DB + storage)
- [ ] Admin "maintenance mode" controls with safe access gates
- [ ] Data lifecycle: soft-deletes, GDPR-style delete/anonymize flow (if needed)

## 4) Performance (Target: 10k daily users)

Backend:
- [ ] DB indexes for common filters/search; add query profiling
- [ ] Cache hot endpoints (Redis) + HTTP caching headers where possible
- [ ] Offload heavy work to queue (images processing, notifications, daily deductions)
- [ ] Use pagination everywhere + cursor pagination for large feeds
- [ ] Add rate limits per IP/user/token

Frontend:
- [ ] Use `next/image` for listing images (reduce LCP)
- [ ] Add CDN for assets/images + caching headers
- [ ] Measure Core Web Vitals and fix biggest regressions

Load testing:
- [ ] k6/Artillery scripts for critical APIs (listings search, listing details, wallet ops)
- [ ] Define SLOs (p95 latency, error rate) + alerting

## 5) Mobile (Android/iOS) Backend Readiness

- [x] API versioning (`/api/v1/...`) + backward compatibility rules
- [ ] Token auth + refresh tokens + device/session management
- [ ] Push notifications (FCM/APNs) endpoints + background jobs
- [ ] File uploads optimized for mobile (chunking/signed uploads if needed)
- [ ] Clear error contracts (error codes/messages) for consistent UX
