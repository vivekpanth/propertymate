# Project Roadmap

Single source of truth for phases, scope, and acceptance criteria.

## Phase 0 — Foundation (Demo-First)
- Objective: Expo SDK 52 app shell, navigation (Stack + Tabs), ThemeProvider, UI kit.
- Deliverables: App runs on iOS/Android/Web; basic tabs; Theme toggling.
- Acceptance: lint/type/tests pass; PR merged.

## Phase 1 — Visual System & PropertyCard
- Objective: Design tokens, icons, haptics, polished `PropertyCard`.
- Deliverables: Tokens (colors/spacing/radius/shadows/typography); snapshot tests.
- Acceptance: 3 UI snapshots; lint/type/tests pass.

## Phase 2 — Database (Supabase)
- Objective: Schema, RLS, seed data.
- Deliverables: infra/sql/schema.sql, seed.sql; docs/DB_SETUP.md.
- Acceptance: Negative RLS tests documented; seed loads; env wired.

## Phase 3 — Auth & RBAC
- Objective: Email magic link sign-in; session persistence; role-aware tabs.
- Deliverables: SignIn screen; URL scheme; `.env.example`.
- Acceptance: Sign-in flow works in dev; tests green.

## Phase 4 — Feed (Mock)
- Objective: TikTok-style vertical feed with mock videos; performance instrumentation.
- Deliverables: `VideoPlayer` (expo-video), `FeedScreen` with paging and autoplay.
- Acceptance: Smooth scroll (55–60 FPS); first-frame ≤1.2s P50 (logged).

## Phase 5 — Areas Gallery (Mock)
- Objective: Areas modal with 4–6 room clips and chip navigation.
- Deliverables: `AreasGallery`, `AreasChip`; first clip auto-plays.
- Acceptance: UX parity; tests/lint/type pass.

## Phase 6 — Wire Feed/Areas to Supabase
- Objective: Replace mocks with real data using React Query.
- Deliverables: API layer (`src/services/api`), hooks (`src/hooks/useProperties.ts`).
- Acceptance: Real published properties/media load; mock fallback if empty.
- Next Items (current):
  - Signed URLs for media
  - Caching/prefetch for next hero

## Phase 7 — Search & Saved (Real)
- Objective: Debounced search, filters, pagination; favourites.
- Deliverables: Query builders; `SavedScreen`; RLS-protected mutations.
- Acceptance: E2E flow: search → open → save; tests ≥ 80%.

## Phase 8 — Agent Tools (Draft → Review)
- Objective: Create/edit property; upload media with retries; submit for review.
- Deliverables: Resumable uploads; validation with zod; drafts persisted.
- Acceptance: Agent can create listing and move to review state.

## Phase 9 — Admin Review & Publish
- Objective: Review queue; approve/reject/flag; RPCs.
- Deliverables: `rpc_publish_property`, `rpc_reject_property`; audit logs.
- Acceptance: Draft → Published pipeline enforced with RLS.

## Phase 10 — Messaging & Push
- Objective: Threads & chat; push notifications; deep links to thread.
- Deliverables: Edge Functions (create_thread, send_message); Expo Push.
- Acceptance: User can message agent; receives push; deep link opens thread.

## Phase 11 — Quality, Offline, Analytics, Sentry
- Objective: Skeletons, caching, retry queues, offline banners, analytics, error tracking.
- Deliverables: Sentry wrapper; analytics events; accessibility pass.
- Acceptance: Offline UX works; error reporting live; 90% test target optional.

## Phase 12 — Deployment Prep (EAS + CI/CD)
- Objective: EAS profiles, app metadata, store assets; CI for lint/type/test, EAS preview on PRs.
- Deliverables: `docs/DEPLOYMENT.md`; icons/splash; privacy labels checklists.
- Acceptance: Preview builds green; store-ready.

---

## Protocol (every phase)
- Branch: `phase-{N}-{short-name}`
- Checks: `npm run lint && npm run typecheck && npm test`
- PR: Use `.github/PULL_REQUEST_TEMPLATE.md`; attach screenshots and status
- Gate: Merge only if zero errors and app runs

## Status Sources
- Timeline: `docs/PHASE_LOG.md`
- Decisions: `docs/DECISIONS.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`
