# Deployment (Server Checklist)

This repo can be deployed as:
- Backend (Laravel): PHP-FPM + Nginx/Apache, or Docker
- Frontend (Next.js): Node server, or Vercel, or static export (if compatible)

## Backend (Laravel) Steps

- Provision DB (MySQL recommended for prod)
- Set `backend-laravel/.env` (from `backend-laravel/.env.production` template)
- Run:
  - `composer install --no-dev --optimize-autoloader`
  - `php artisan migrate --force`
  - `php artisan storage:link`
- Configure a queue worker for jobs (recommended):
  - Supervisor/systemd + `php artisan queue:work`

## Frontend (Next.js) Steps

- Set `NEXT_PUBLIC_API_URL` to your public API URL
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

Add the secrets below in each environment.

### Required Secrets (Per Environment)

- `SSH_HOST`: server host/IP
- `SSH_PORT`: SSH port (example: `22`)
- `SSH_USER`: SSH username
- `SSH_KEY`: private key (multi-line)
- `DEPLOY_PATH`: absolute path on server where the repo is cloned (example: `/var/www/parq`)
- `FRONTEND_API_URL`: public API base URL including `/api` (example: `https://api.parq.ma/api`)

### Server Prereqs (For These Workflows)

The deploy workflows run a "pull + build on server" strategy. The target server must have:
- Git access to the repo (already cloned at `DEPLOY_PATH`)
- PHP + Composer for Laravel
- Node + npm for Next.js

Restart commands are intentionally placeholders: adjust them to your setup (systemd, pm2, Docker, etc.).
