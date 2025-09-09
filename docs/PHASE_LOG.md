# Phase Log

Lightweight running log so any new session can resume instantly.

## Phase 0 – Foundation (Demo-First)

- Status: merged
- Branch/PR: phase-0 (merged into main)
- Summary: Expo 52 app init, navigation (Stack+Tabs), ThemeProvider, basic UI kit.
- Checks: lint/type/tests ✅

## Phase 1 – Visual System & PropertyCard

- Status: merged
- Summary: Design tokens, haptics, `PropertyCard`, snapshot tests.
- Checks: lint/type/tests ✅

## Phase 2 – Database (Supabase)

- Status: merged
- Summary: Schema + RLS + seed, docs/DB_SETUP.md
- Checks: lint/type/tests ✅

## Phase 3 – Auth & RBAC

- Status: merged
- Summary: Magic link sign-in screen, env handling, URL scheme.
- Checks: lint/type/tests ✅

## Phase 4 – Feed (Mock)

- Status: merged
- Branch/PR: perf/expo-video (merged)
- Summary: TikTok-style feed using expo-video; tests stabilized with mocks.
- Checks: lint/type/tests ✅

## Phase 5 – Areas Gallery (Mock)

- Status: merged
- Branch/PR: phase-5-areas-gallery (merged)
- Summary: Full-screen Areas modal, room chips, auto-scroll active chip.
- Checks: lint/type/tests ✅

## Phase 6 – Supabase Wiring (Complete)

- Branch: phase-6-supabase-integration (merged)
- Summary: React Query + API layer; feed uses Supabase with mock fallback.
- Addendum (6b): Signed URLs for media; prefetch next hero (ranged GET) for faster first-frame; UI unchanged.
- Decisions: support `storage://bucket/path` and `bucket:path` for Storage URLs.
- Checks: lint/type/tests ✅

## Phase 7 – Search & Saved (Real)

- Status: in progress
- Branch: phase-7-search-saved
- Summary: Search API with filters/pagination, Favorites API with optimistic updates, Saved screen.
- Features:
  - Search: debounced query, price/bedroom/bathroom/type filters, mock data integration
  - Favorites: add/remove with RLS, optimistic UI updates, error rollback
  - Saved: displays favorited properties, empty state, loading states
- Checks: lint/type/tests ✅

## Phase 8 – Agent Tools (Draft → Review)

- Status: in progress
- Branch: phase-8-agent-tools
- Summary: Scaffold Agent Tools: create property (draft), zod-validated API, wire Manage tab.
- Features (this slice):
  - API: `createProperty`, `updateProperty`, `submitForReview` with zod validation
  - UI: `CreatePropertyScreen` minimal form (title, suburb, type)
  - Navigation: Manage tab shows Create form
- Checks: lint/type/tests ✅
