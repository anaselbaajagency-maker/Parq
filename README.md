# ParqV2 (Monorepo)

This repo contains the Parq platform:
- `backend-laravel/`: Laravel API (auth, listings, wallet, admin)
- `frontend/`: Next.js web app (FR/AR) + admin UI
- `mobile-app/`: Expo React Native app (Android/iOS)
- `mobile/`: Flutter app (legacy/experimental)

## Branches / Environments

- `develop`: staging/integration (server "staging" if you deploy one)
- `main`: production

See `docs/ENVIRONMENTS.md` and `docs/BRANCHING.md`.

## Local Dev (Quickstart)

### Backend (Laravel)

```bash
cd backend-laravel
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend (Next.js)

```bash
cd frontend
npm ci
npm run dev
```

Create/update `frontend/.env.local`:
- `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api`

### Run Both (Convenience)

From repo root:

```bash
npm run start:dev
```

## Tests

Backend feature tests can run with SQLite in-memory:

```bash
cd backend-laravel
DB_CONNECTION=sqlite DB_DATABASE=':memory:' php artisan test
```

## Deploy

See `docs/DEPLOYMENT.md` for a server checklist and GitHub Actions skeleton.

