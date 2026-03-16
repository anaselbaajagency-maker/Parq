#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required. Install it first: https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Please authenticate first: gh auth login"
  exit 1
fi

REPO_SLUG="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"

if [[ -z "${REPO_SLUG}" ]]; then
  echo "Unable to resolve repository slug from gh CLI."
  exit 1
fi

echo "Configuring GitHub repository: ${REPO_SLUG}"

MAIN_PROTECTION_PAYLOAD="$(cat <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Backend (Laravel)",
      "Frontend (Next.js)"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
JSON
)"

DEVELOP_PROTECTION_PAYLOAD="$(cat <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Backend (Laravel)",
      "Frontend (Next.js)"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
JSON
)"

echo "Applying branch protection: main"
gh api \
  --method PUT \
  --header "Accept: application/vnd.github+json" \
  "repos/${REPO_SLUG}/branches/main/protection" \
  --input - <<<"${MAIN_PROTECTION_PAYLOAD}" >/dev/null

echo "Applying branch protection: develop"
gh api \
  --method PUT \
  --header "Accept: application/vnd.github+json" \
  "repos/${REPO_SLUG}/branches/develop/protection" \
  --input - <<<"${DEVELOP_PROTECTION_PAYLOAD}" >/dev/null

echo "Creating/updating GitHub environments"
gh api --method PUT --header "Accept: application/vnd.github+json" "repos/${REPO_SLUG}/environments/staging" >/dev/null
gh api --method PUT --header "Accept: application/vnd.github+json" "repos/${REPO_SLUG}/environments/production" >/dev/null

echo "Done."
echo
echo "Next: add environment secrets for staging and production:"
echo "- SSH_HOST"
echo "- SSH_PORT"
echo "- SSH_USER"
echo "- SSH_KEY"
echo "- DEPLOY_PATH"
echo "- FRONTEND_API_URL"
