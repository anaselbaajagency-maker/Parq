# Repo Structure

## Apps

- `backend-laravel/` (Laravel):
  - REST API under `routes/api.php`
  - business logic under `app/Services`
  - jobs under `app/Jobs`

- `frontend/` (Next.js):
  - app router under `src/app/[locale]/...`
  - API client under `src/lib/api.ts`

- `mobile-app/` (Expo React Native):
  - API client under `src/services/api.js`

- `mobile/` (Flutter):
  - API client under `lib/core/api/api_client.dart`

## Monorepo Guideline

Treat each folder as an independent app with its own dependencies and CI steps.

