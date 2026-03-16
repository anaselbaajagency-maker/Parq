# Security Hardening

## Auth Strategy (Web + Mobile)

- Auth system: Laravel Sanctum for both web and mobile.
- Web clients: use `client_type=web` and short-lived Sanctum tokens.
- Mobile clients: use `client_type=mobile` (or OTP flow) with token abilities scoped to mobile.
- Token expiration is controlled by `SANCTUM_TOKEN_EXPIRATION` (minutes).

## RBAC

- Admin-only APIs are protected with `auth:sanctum` + `role:admin`.
- Listing mutations require authenticated users and enforce owner/admin checks.

## Upload Security

- Top-up proof uploads are stored on private disk (`local`), not publicly exposed.
- Proof links are delivered as temporary signed URLs (`secure.topup-proof`) with short TTL.
- Upload validation enforces mime type and size limits.

## Audit Logging

- Sensitive wallet/admin actions are written to `audit` log channel.
- Channel is configurable via `AUDIT_LOG_CHANNEL`.

