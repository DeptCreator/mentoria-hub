# Supabase Setup for Mentoria Hub

## Quick Start

You need to run **one SQL file** in Supabase Dashboard to create tables and seed data.

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Sign in with your account
3. Select project: `lczyxcleqedjvrodxlsm`
4. Click **SQL Editor** in the left sidebar
5. Click **New query**

### Step 2: Run the migration

Open `supabase/migrations/003_full_setup.sql` in this project and copy **all** its contents into the SQL Editor. Then click **Run**.

This creates all tables, RLS policies, triggers, and demo data.

### Step 3: Verify env variables

Your `.env.local` must contain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lczyxcleqedjvrodxlsm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...      # MUST start with eyJhbGci
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...           # MUST start with eyJhbGci
OPENAI_API_KEY=sk-...
```

**Important:** The anon key must be a JWT starting with `eyJhbGci`. If you see `sb_publishable_...`, that is the wrong key. Get the correct one from:

Supabase Dashboard → Project Settings → API → Project API keys → `anon public`

### Step 4: Restart the app

After running SQL and fixing `.env.local`:

```bash
cd D:/mentoria-hub
npm run build
npx next start -p 3000
```

## Alternative: Apply via Supabase CLI

If you have a Supabase access token, the agent can apply migrations automatically:

```bash
npx supabase login
npx supabase link --project-ref lczyxcleqedjvrodxlsm
npx supabase db push
```

To let the agent do this for you, provide the access token starting with `sbp_`.

## What the migration creates

- `profiles` — user profiles linked to auth.users
- `categories` — opportunity categories
- `opportunities` — competitions, scholarships, programs
- `courses` / `lessons` — async courses
- `enrollments` / `lesson_progress` — student progress
- `saved_opportunities` — favorites
- `achievements` / `user_achievements` — gamification
- `certificates` — course completion certificates
- Row Level Security (RLS) policies
- Triggers for new user signup
