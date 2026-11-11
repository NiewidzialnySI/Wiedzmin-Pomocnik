#!/usr/bin/env bash
# Publikacja na GitHub + GitHub Pages (wymaga: gh auth login).
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_NAME="${1:-Wiedzmin-Pomocnik}"
OWNER="$(gh api user -q .login)"

if ! git remote get-url origin &>/dev/null; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin \
    --description "Interaktywny pomocnik do gry Wiedźmin: Stary Świat."
fi

git push -u origin main

# GitHub Pages — statyczna strona z katalogu głównego (index.html).
gh api -X POST "repos/${OWNER}/${REPO_NAME}/pages" \
  -f build_type=legacy \
  -f 'source[branch]=main' \
  -f 'source[path]=/' 2>/dev/null || \
gh api -X PUT "repos/${OWNER}/${REPO_NAME}/pages" \
  -f build_type=legacy \
  -f 'source[branch]=main' \
  -f 'source[path]=/'

echo ""
echo "Strona (po 1–2 min.): https://${OWNER}.github.io/${REPO_NAME}/"
echo "Repozytorium: https://github.com/${OWNER}/${REPO_NAME}"
