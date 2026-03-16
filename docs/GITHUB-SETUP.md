# GitHub Setup (Branch Protection + Environments)

This project keeps GitHub policy in code and provides an apply script.

## Included in Repo

- Policy file: `.github/settings.yml`
- Apply script: `scripts/github/configure-repo.sh`

## What It Configures

### Branch: `main`

- Blocks direct pushes (protected branch)
- Requires CI checks:
  - `Backend (Laravel)`
  - `Frontend (Next.js)`
- Requires 1 approving review
- Enforces linear history + conversation resolution

### Branch: `develop`

- Protected branch
- Requires CI checks:
  - `Backend (Laravel)`
  - `Frontend (Next.js)`
- Enforces linear history + conversation resolution

### Environments

- Creates/updates:
  - `staging`
  - `production`

## One-Time Apply

Prerequisites:
- GitHub CLI (`gh`)
- Admin rights on repository
- Authenticated session (`gh auth login`)

Run:

```bash
./scripts/github/configure-repo.sh
```

## Add Environment Secrets

Set the following secrets in both `staging` and `production`:

- `SSH_HOST`
- `SSH_PORT`
- `SSH_USER`
- `SSH_KEY`
- `DEPLOY_PATH`
- `FRONTEND_API_URL`
