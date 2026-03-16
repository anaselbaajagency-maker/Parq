#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <backup_dir>" >&2
  exit 1
fi

: "${APP_DIR:=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
: "${DB_CONNECTION:=mysql}"

backup_dir="$1"

if [[ ! -d "${backup_dir}" ]]; then
  echo "[restore] backup directory not found: ${backup_dir}" >&2
  exit 1
fi

echo "[restore] restoring from ${backup_dir}"

if [[ -f "${backup_dir}/SHA256SUMS" ]]; then
  (cd "${backup_dir}" && shasum -a 256 -c SHA256SUMS)
fi

if [[ "${DB_CONNECTION}" == "mysql" ]]; then
  : "${DB_HOST:?DB_HOST is required for mysql restores}"
  : "${DB_PORT:=3306}"
  : "${DB_DATABASE:?DB_DATABASE is required for mysql restores}"
  : "${DB_USERNAME:?DB_USERNAME is required for mysql restores}"
  : "${DB_PASSWORD:?DB_PASSWORD is required for mysql restores}"

  MYSQL_PWD="${DB_PASSWORD}" mysql \
    --host="${DB_HOST}" \
    --port="${DB_PORT}" \
    --user="${DB_USERNAME}" \
    "${DB_DATABASE}" < "${backup_dir}/database.sql"
elif [[ "${DB_CONNECTION}" == "sqlite" ]]; then
  : "${SQLITE_PATH:=${APP_DIR}/backend-laravel/database/database.sqlite}"
  cp "${backup_dir}/database.sqlite" "${SQLITE_PATH}"
else
  echo "[restore] unsupported DB_CONNECTION=${DB_CONNECTION}" >&2
  exit 1
fi

tar -xzf "${backup_dir}/storage-app.tar.gz" -C "${APP_DIR}/backend-laravel/storage"

if [[ -f "${backup_dir}/public-storage-symlink-target.tar.gz" ]]; then
  tar -xzf "${backup_dir}/public-storage-symlink-target.tar.gz" -C "${APP_DIR}/backend-laravel/public"
fi

echo "[restore] done"
