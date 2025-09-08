#!/usr/bin/env bash
set -e
echo "Branch: $(git branch --show-current)"
echo "Last commit:"; git --no-pager log -1 --oneline
echo
echo "Lint:"; npm run -s lint || true
echo
echo "Typecheck:"; npm run -s typecheck || true
echo
echo "Tests:"; npm test --silent -- --passWithNoTests || true

