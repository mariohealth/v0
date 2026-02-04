#!/usr/bin/env bash
set -euo pipefail

BASE_REF="${1:-origin/main}"
THRESHOLD="${BRANCH_HEALTH_THRESHOLD:-20}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository."
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
read -r BEHIND AHEAD < <(git rev-list --left-right --count "${BASE_REF}...HEAD")

echo "Branch health for: ${CURRENT_BRANCH}"
echo "Base ref: ${BASE_REF}"
echo "Commits ahead: ${AHEAD}"
echo "Commits behind: ${BEHIND}"

CHERRY_LINES="$(git cherry -v "${BASE_REF}" || true)"
CHERRY_IN_BASE_COUNT="$(printf "%s\n" "${CHERRY_LINES}" | awk '$1 == "-" {count++} END {print count+0}')"

if [ "${CHERRY_IN_BASE_COUNT}" -gt 0 ]; then
  echo "Warning: ${CHERRY_IN_BASE_COUNT} commits appear to be already in ${BASE_REF} (cherry-picked)."
fi

if [ "${AHEAD}" -gt "${THRESHOLD}" ] && [ "${CHERRY_IN_BASE_COUNT}" -gt 0 ]; then
  echo "Warning: branch is ${AHEAD} commits ahead with cherry-picked patches; consider resetting or rebasing."
fi
