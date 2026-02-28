# Environments

## Local (Developer Machine)

- Backend: `http://127.0.0.1:8000` (Laravel `php artisan serve`)
- Frontend: `http://localhost:3000` (Next `npm run dev`)
- Frontend config: `frontend/.env.local` -> `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api`

## Staging (Optional)

- Branch: `develop`
- Purpose: validate new changes with real integrations and sample data
- Recommended: separate DB + separate API keys

## Production

- Branch: `main`
- Purpose: stable, monitored, backups enabled

## Secrets / Config

- Never commit real `.env` secrets to git
- Use GitHub Environments + Secrets for deploy workflows

