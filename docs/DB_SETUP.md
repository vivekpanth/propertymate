# Supabase Database Setup

This guide sets up the database schema, RLS policies, and seed data for PropertyMate.

## Prerequisites

- Supabase project created: https://app.supabase.com
- Supabase CLI installed: `npm i -g supabase`
- Logged in: `supabase login`

# Supabase Database Setup

Prereqs

- Supabase project: https://app.supabase.com
- Supabase CLI: npm i -g supabase
- Login: supabase login

## 1) Initialize local config (optional)

```
supabase init
```

## 2) Apply schema and RLS

supabase db push --file infra/sql/schema.sql

```
# Run in project root
supabase db push --file infra/sql/schema.sql
```

If using SQL editor in dashboard, copy the contents of `infra/sql/schema.sql` and run it.

## 3) Seed data

```
supabase db push --file infra/sql/seed.sql
```

## 4) Verify policies (negative tests manual)

- Profiles: users can only read/update themselves; admin can read all
- Properties: only published visible publicly
- Media: readable when parent property is published
- Favorites: only owner can read/write
- Threads/Messages: participants only

## 5) Environment variables

Copy `.env.example` to `.env` and set values:

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## 6) Client usage (placeholder)

See `src/services/supabase.ts` for client initialization.

## Troubleshooting

- Ensure RLS is enabled on tables
- Use the SQL editor to inspect policies if queries fail (403)
