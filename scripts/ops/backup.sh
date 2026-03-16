#!/usr/bin/env bash
set -euo pipefail

: "${APP_DIR:=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
: "${BACKUP_DIR:=${APP_DIR}/backups}"
: "${DB_CONNECTION:=mysql}"

timestamp="$(date +%Y%m%d-%H%M%S)"
run_dir="${BACKUP_DIR}/${timestamp}"

mkdir -p "${run_dir}"

echo "[backup] writing artifacts to ${run_dir}"

if [[ "${DB_CONNECTION}" == "mysql" ]]; then
  : "${DB_HOST:?DB_HOST is required for mysql backups}"
  : "${DB_PORT:=3306}"
  : "${DB_DATABASE:?DB_DATABASE is required for mysql backups}"
  : "${DB_USERNAME:?DB_USERNAME is required for mysql backups}"
  : "${DB_PASSWORD:?DB_PASSWORD is required for mysql backups}"

  MYSQL_PWD="${DB_PASSWORD}" mysqldump \
    --host="${DB_HOST}" \
    --port="${DB_PORT}" \
    --user="${DB_USERNAME}" \
    --single-transaction \
    --quick \
    "${DB_DATABASE}" > "${run_dir}/database.sql"
elif [[ "${DB_CONNECTION}" == "sqlite" ]]; then
  : "${SQLITE_PATH:=${APP_DIR}/backend-laravel/database/database.sqlite}"
  cp "${SQLITE_PATH}" "${run_dir}/database.sqlite"
else
  echo "[backup] unsupported DB_CONNECTION=${DB_CONNECTION}" >&2
  exit 1
fi

tar -czf "${run_dir}/storage-app.tar.gz" -C "${APP_DIR}/backend-laravel/storage" app

if [[ -d "${APP_DIR}/backend-laravel/public/storage" ]]; then
  tar -czf "${run_dir}/public-storage-symlink-target.tar.gz" -C "${APP_DIR}/backend-laravel/public" storage
fi

(cd "${run_dir}" && shasum -a 256 * > SHA256SUMS)

echo "[backup] done: ${run_dir}"
