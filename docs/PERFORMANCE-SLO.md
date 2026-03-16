# Performance SLOs and Alerting

This document defines baseline SLOs for ParqV2 at ~10k daily users.

## API SLO Targets

- Availability: `>= 99.9%` over 30 days.
- Error rate (5xx): `<= 1%` per 5-minute window.
- p95 latency:
  - `GET /api/listings`: `< 450ms`
  - `GET /api/listings/{id}`: `< 500ms`
  - `GET /api/wallet/balance`: `< 350ms`
- p99 latency (all API): `< 900ms`

## Frontend Web Vitals Budgets

- LCP `< 2.5s`
- INP `< 200ms`
- CLS `< 0.1`
- TTFB `< 800ms`

Web Vitals are emitted by `frontend/src/components/WebVitalsReporter.tsx` and can be shipped to `NEXT_PUBLIC_WEB_VITALS_ENDPOINT`.

## Alert Rules (Recommended)

- `Critical`: 5xx error rate > 2% for 10 minutes.
- `High`: p95 latency > 700ms for 15 minutes.
- `Medium`: queue backlog older than 5 minutes.
- `High`: failed jobs > 100 in 10 minutes.
- `Critical`: availability < 99.5% over rolling 1 hour.

## Runbook Notes

- Run k6 smoke profile before major releases:
  - `k6 run tests/load/k6/listings-wallet.js`
- Run Artillery scenario for longer soak checks:
  - `npx artillery run tests/load/artillery/listings-wallet.yml`
- Investigate slow queries from `slow_query_detected` logs when query profiling is enabled.
