# Supabase Setup for Mentoria Hub

## Status

Migrations applied via Supabase CLI: **2026-06-18**
- Project: `lczyxcleqedjvrodxlsm`
- Tables created: profiles, categories, opportunities, courses, lessons, enrollments, lesson_progress, saved_opportunities, achievements, user_achievements, certificates
- Seed data: 8 categories, 10 opportunities, 5 courses with lessons, 8 achievements

## If you need to re-run migrations

### Option 1: Supabase CLI (recommended if already linked)

```bash
cd D:/mentoria-hub
npx supabase db push
```

### Option 2: Supabase Dashboard SQL Editor

1. Go to https://supabase.com/dashboard
2. Select project: `lczyxcleqedjvrodxlsm`
3. Click **SQL Editor** → **New query**
4. Open `supabase/full_setup.sql` and copy all contents
5. Click **Run**

## Environment variables

Your `.env.local` must contain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lczyxcleqedjvrodxlsm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
OPENAI_API_KEY=sk-...
```

Get keys from:
- Supabase Dashboard → Project Settings → API

## Restart the app

```bash
cd D:/mentoria-hub
npm run build
npx next start -p 3000
```
