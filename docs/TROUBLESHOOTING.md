# Troubleshooting

Common issues and fixes while developing PropertyMate.

## Expo / Video
- `TypeError: Cannot read properties of undefined (reading 'prototype')` in tests:
  - Mock `expo-video` in tests to avoid loading native module.
- NativeSharedObjectNotFoundException on `pause()`:
  - Guard cleanup with optional chaining and try/catch.

## Jest / CI
- Tests failing due to Supabase client:
  - Mock `src/services/supabase.ts` in tests.
- `react-hooks/exhaustive-deps` warnings:
  - Include hook dependencies or safely memoize helpers.

## Env / Supabase
- Invalid URL errors:
  - Ensure `.env` variables have no quotes/semicolons; client strips but prefer clean values.
- `supabaseUrl is required` in tests:
  - Tests must mock the client; don't rely on env.

## GitHub / Branching
- `branch already exists`:
  - Use `git checkout branch-name` instead of creating.
- `no upstream branch`:
  - `git push --set-upstream origin <branch>`.

## Expo Go
- Slow HMR / recrawl warnings:
  - Follow Watchman suggestion: `watchman watch-del '<path>'; watchman watch-project '<path>'`.

Add new entries as issues recur.
