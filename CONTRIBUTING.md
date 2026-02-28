# Contributing

## Branching

See `docs/BRANCHING.md`.

## Local Checks

Backend:

```bash
cd backend-laravel
DB_CONNECTION=sqlite DB_DATABASE=':memory:' php artisan test
```

Frontend:

```bash
cd frontend
npm ci
npm run lint
npm run build
```

## PRs

- Keep PRs small and focused.
- Do not commit secrets or `.env` files.

