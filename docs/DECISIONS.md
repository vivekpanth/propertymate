# Architectural Decisions (ADRs)

Record of key choices so future contributors can understand the "why".

- Video: Use `expo-video` (over expo-av) for performance and API stability.
- Testing: Mock `expo-video`, `ThemeProvider`, and `supabase` in Jest to avoid native/HTTP in tests.
- Env: Use `EXPO_PUBLIC_` prefix for Expo runtime variables.
- Supabase URL parsing: Trim, strip quotes/semicolons for robustness.
- Navigation: Tabs with children render to avoid inline component warning.
- Feed fallback: If Supabase data unavailable, use mock videos to keep UX smooth.
- Areas chips: Auto-scroll to keep active chip centered.

Update this file when making non-obvious choices.
