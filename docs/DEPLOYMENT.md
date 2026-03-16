# Deployment (Server Checklist)

This repo can be deployed as:
- Backend (Laravel): PHP-FPM + Nginx/Apache, or Docker
- Frontend (Next.js): Node server, or Vercel, or static export (if compatible)

## Backend (Laravel) Steps

- Provision DB (MySQL recommended for prod)
- Set `backend-laravel/.env` (from `backend-laravel/.env.production` template)
- Set CORS allowlist:
  - `CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_DOMAIN.com`
  - `CORS_SUPPORTS_CREDENTIALS=true` (if cookie-based auth is used)
- Run:
  - `composer install --no-dev --optimize-autoloader`
  - `php artisan migrate --force`
  - `php artisan storage:link`
- Configure a queue worker for jobs (recommended):
  - Use Redis in production (`QUEUE_CONNECTION=redis`)
  - Supervisor/systemd + `php artisan queue:work redis --queue=media,billing,default --sleep=3 --tries=3 --max-time=3600`
  - Configure scheduler (`* * * * * php artisan schedule:run`) for failed-job pruning
- Backups:
  - Run `./scripts/ops/backup.sh` from cron
  - Test restore monthly using [BACKUP-RESTORE.md](./BACKUP-RESTORE.md)

## Frontend (Next.js) Steps

- Set `NEXT_PUBLIC_API_URL` to your public API URL
- Optional observability: set `NEXT_PUBLIC_SENTRY_DSN`
- Optional CDN: set `NEXT_PUBLIC_CDN_URL`
- Optional Web Vitals sink: set `NEXT_PUBLIC_WEB_VITALS_ENDPOINT`
- Build and run:
  - `npm ci`
  - `npm run build`
  - `npm run start`

## GitHub Actions

This repo includes:
- CI: `.github/workflows/ci.yml`
- Deploy (staging): `.github/workflows/deploy-staging.yml` (push to `develop`)
- Deploy (production): `.github/workflows/deploy-production.yml` (push to `main`)

### GitHub Environments (Recommended)

Create 2 environments in GitHub:
- `staging`
- `production`

You can bootstrap branch protection + environments with:
- `./scripts/github/configure-repo.sh`
- Full guide: [GITHUB-SETUP.md](./GITHUB-SETUP.md)

Add the secrets below in each environment.

### Required Secrets (Per Environment)

- `SSH_HOST`: server host/IP
- `SSH_PORT`: SSH port (example: `22`)
- `SSH_USER`: SSH username
- `SSH_KEY`: private key (multi-line)
- `DEPLOY_PATH`: absolute path on server where the repo is cloned (example: `/var/www/parq`)
- `FRONTEND_API_URL`: public API base URL including `/api` (example: `https://api.parq.ma/api`)

### Security Environment Variables (Backend)

- `SANCTUM_TOKEN_EXPIRATION`: API token lifetime in minutes
- `TOPUP_PROOF_URL_TTL_MINUTES`: signed URL lifetime for top-up proof files
- `AUDIT_LOG_CHANNEL`: audit log channel (default `audit`)
- `LOG_STRUCTURED=true`: JSON logs for centralized observability
- `SENTRY_ENABLED` + `SENTRY_BACKEND_DSN`: backend Sentry reporting
- `MAINTENANCE_BYPASS_TOKEN`: secure bypass for maintenance windows
- `DB_QUERY_PROFILING_ENABLED=true`: slow query profiler (with `DB_SLOW_QUERY_THRESHOLD_MS`)
- `PERF_PUBLIC_CACHE_TTL_SECONDS`: API response cache TTL for public endpoints

### Load Testing

- k6 scenario: `npm run loadtest:k6`
- Artillery scenario: `npm run loadtest:artillery`
- SLO targets and alerting: [PERFORMANCE-SLO.md](./PERFORMANCE-SLO.md)

### Server Prereqs (For These Workflows)

The deploy workflows run a "pull + build on server" strategy. The target server must have:
- Git access to the repo (already cloned at `DEPLOY_PATH`)
- PHP + Composer for Laravel
- Node + npm for Next.js

Restart commands are intentionally placeholders: adjust them to your setup (systemd, pm2, Docker, etc.).
