# Backup & Restore Runbook

This runbook covers database + Laravel storage backup/restore for ParqV2.

## 1) Backup

Run from repo root:

```bash
DB_CONNECTION=mysql \
DB_HOST=127.0.0.1 \
DB_PORT=3306 \
DB_DATABASE=parq \
DB_USERNAME=parq_user \
DB_PASSWORD='change-me' \
./scripts/ops/backup.sh
```

Artifacts are saved in `backups/<timestamp>/`:
- `database.sql` (or `database.sqlite`)
- `storage-app.tar.gz`
- `public-storage-symlink-target.tar.gz` (if present)
- `SHA256SUMS`

## 2) Restore

```bash
DB_CONNECTION=mysql \
DB_HOST=127.0.0.1 \
DB_PORT=3306 \
DB_DATABASE=parq \
DB_USERNAME=parq_user \
DB_PASSWORD='change-me' \
./scripts/ops/restore.sh ./backups/20260228-120000
```

## 3) Restore Drill Policy

- Run a restore drill at least once per month.
- Restore into a staging environment (never directly into production).
- Verify:
  - API health endpoint responds.
  - Latest listings exist.
  - Uploaded files are readable.
  - Queue worker starts cleanly.
- Record drill date, duration, and validation notes.

## 4) Recommended Retention

- Daily backups: keep 14 days.
- Weekly backups: keep 8 weeks.
- Monthly backups: keep 6 months.

Adapt retention to legal/business requirements.
