# 🗂️ SQL Migration Deployment Guide

## ⚠️ CRITICAL PRIORITY
Without deploying these migrations, the database tables don't exist and all data hooks will fail. **This is the blocking step for MVP.**

---

## Option A: Deploy via Supabase Dashboard (Recommended for First-Time)

### Step 1: Access Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Sign in to your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Deploy Schema Migration
1. Open [`supabase/migrations/20251218_initial_schema.sql`](supabase/migrations/20251218_initial_schema.sql)
2. Copy the ENTIRE content
3. Paste into Supabase SQL Editor
4. Click **Run** (or Cmd+Enter)
5. ✅ Verify: You should see "Success" in the results panel

**What this creates:**
- `profiles` table (user data)
- `episodes` table (podcast episodes with audio_url)
- `chapters` table (episode chapters/sections)
- `axes` table (Lagrange map axes)
- `questions` table (Socratic questions)
- `map_nodes` table (map visualization nodes)
- `map_connections` table (node connections)
- `episode_questions` table (episode ↔ question relationships)
- `chapter_episodes` table (chapter ↔ episode relationships)
- `audio_files` table (audio metadata)
- `search_index` table (search optimization)
- RLS policies for all tables

### Step 3: Deploy Seed Data
1. Open [`supabase/migrations/20251218_seed_data.sql`](supabase/migrations/20251218_seed_data.sql)
2. Copy the ENTIRE content
3. Create a **new query** in SQL Editor
4. Paste the content
5. Click **Run**
6. ✅ Verify: You should see "Success" and row counts (18 episodes, 5 axes, etc.)

**What this populates:**
- 18 podcast episodes with metadata
- 5 map axes (Miedo, Rabia, Profundidad, Símbolo, Ritual)
- 18 Socratic questions
- Episode-question relationships
- Chapter-episode relationships

### Verification Checklist
After both migrations succeed:

```sql
-- Run these queries to verify data:
SELECT COUNT(*) as episode_count FROM episodes;
SELECT COUNT(*) as chapter_count FROM chapters;
SELECT COUNT(*) as question_count FROM questions;
SELECT COUNT(*) as axis_count FROM axes;
```

Expected results:
- `episode_count` = 18
- `chapter_count` = 5
- `question_count` = 18
- `axis_count` = 5

---

## Option B: Deploy via Supabase CLI (For CI/CD)

If you have Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations
supabase db push

# Or push specific migration
supabase migration up 20251218_initial_schema.sql
```

---

## Option C: Deploy via psql (Direct PostgreSQL Access)

If you have psql installed and want direct database access:

```bash
# Get connection string from Supabase dashboard:
# Settings → Database → Connection String (psql)

psql "postgresql://postgres:password@db.PROJECT_REF.supabase.co:5432/postgres" < supabase/migrations/20251218_initial_schema.sql

psql "postgresql://postgres:password@db.PROJECT_REF.supabase.co:5432/postgres" < supabase/migrations/20251218_seed_data.sql
```

---

## Troubleshooting

### ❌ "relation already exists" error
**Cause:** Migrations were already deployed
**Solution:** Either ignore the error (idempotent) or check Supabase Data Editor to see existing tables

### ❌ "permission denied" error
**Cause:** User doesn't have write access to database
**Solution:** 
1. Go to Supabase Settings → Users
2. Verify your user has "Admin" role
3. Or use service role key with more permissions

### ❌ "audio_url" column not found
**Cause:** Schema migration wasn't run
**Solution:** Go back to Step 1 and run the **initial_schema.sql** migration first

### ❌ No data appears after seed migration
**Cause:** Seed migration failed silently
**Solution:** 
1. Check SQL Editor results for error messages
2. Verify schema was created (check Data Editor)
3. Run seed migration again, watching for errors

---

## Next Steps After Successful Deploy

Once migrations are deployed:

1. ✅ Database tables exist
2. ✅ RLS policies active
3. ✅ Sample data loaded

Then you can:

1. **Test data fetching:** Run `npm run dev` and check Home.tsx (should show 18 episodes)
2. **Configure Supabase Auth:** Update `src/services/authService.ts` to use real Supabase Auth
3. **Upload audio files:** Use AudioUpload component to add audio files to Supabase Storage
4. **Test audio playback:** Verify AudioPlayer loads and plays audio

---

## Important Notes

⚠️ **RLS Policies Active:**
- Public can READ all content tables
- Only authenticated users can write to profiles
- Only editors/admins can write to episodes, chapters, questions
- No one can modify audio without special permissions

⚠️ **Data Consistency:**
- 18 episodes are linked to questions via `episode_questions`
- All episodes point to 1-5 chapters via `chapter_episodes`
- All questions reference one of 5 axes

⚠️ **Storage Bucket:**
- Create `episodes` bucket in Supabase Storage for audio files
- Set bucket to Public
- See AUDIO_SETUP.md for complete audio configuration

---

## Migration Files Reference

| File | Purpose | Tables Created | Sample Data |
|------|---------|-----------------|-------------|
| `20251218_initial_schema.sql` | Database structure | 13 tables, indexes, RLS | None |
| `20251218_seed_data.sql` | Initial data | None | 18 episodes, 5 axes, etc. |

---

## Rollback (If Needed)

To rollback migrations:

```bash
# Via Supabase dashboard:
# SQL Editor → New Query → DROP TABLE IF EXISTS [table_name]

# Or via CLI:
supabase migration down
```

---

Last Updated: 2024-12-18
Status: ⏳ Waiting for manual execution
Estimated Time: 5 minutes
