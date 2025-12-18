# 🔐 Supabase Authentication Setup Guide

## Overview
This guide configures JWT authentication with Supabase for the Sistema Lagrange platform. Users can sign up, log in, and their access level determines their capabilities (read-only user or editor).

---

## Step 1: Enable Supabase Auth in Dashboard

### 1.1 Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click **Providers**

### 1.2 Enable Email/Password Authentication
- Ensure "Email" provider is **enabled**
- Copy your **API URL** and **Anon Key** (you'll need these later)

### 1.3 Configure Email Settings (Optional)
- Click **Email Templates**
- Customize confirmation and reset emails (default templates work fine)

---

## Step 2: Update Environment Variables

Create a `.env.local` file in the project root with your Supabase credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
- Supabase Dashboard → Settings → API → Project URL and Anon Key
- **⚠️ Never commit `.env.local` to Git!** It's in `.gitignore`

### Verify Environment File
```bash
# Check that .env.local exists and is NOT in git
ls -la .env.local
git status .env.local  # Should show "nothing to commit"
```

---

## Step 3: Verify Supabase Client Configuration

Check that the Supabase client is correctly configured:

**File:** `src/integrations/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Step 4: Create Profiles Table with RLS

The database needs a `profiles` table for user data. This should already exist from migrations, but verify:

### Via Supabase Dashboard:
1. **Table Editor** → Look for `profiles` table
2. Verify columns: `id`, `email`, `name`, `role` (created from initial_schema.sql migration)

### Via SQL Query:
```sql
-- Check if profiles table exists
SELECT * FROM profiles LIMIT 1;

-- If needed, create it:
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## Step 5: Test Authentication Locally

### 5.1 Start Development Server
```bash
npm run dev
```

### 5.2 Test Signup Flow
1. Navigate to http://localhost:5173/auth
2. Click "Crea una nueva cuenta"
3. Enter email, password (6+ chars), and name
4. Click "Registrarse"
5. Expected: Success toast message

### 5.3 Test Login Flow
1. Navigate back to http://localhost:5173/auth
2. Enter the email and password you just created
3. Click "Entrar"
4. Expected: Navigate to home page, "Acceder" button → "Salir" button

### 5.4 Test Protected Routes
1. Sign out (click "Salir")
2. Try accessing `/auth` → Should redirect to login
3. Log back in → Should navigate to home

---

## Step 6: Configure Admin Role

To grant editor/admin access to specific users:

### Via Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Find the user you want to promote
3. In the profile data, add role:

```json
{
  "role": "editor"
}
```

### Via SQL:
```sql
UPDATE profiles
SET role = 'editor'
WHERE email = 'editor@example.com';
```

---

## Step 7: Update RLS Policies for Editor Access

Editors should have write access to certain tables. Update RLS policies:

```sql
-- Episodes table: Editors can write
CREATE POLICY "Editors can insert episodes"
  ON episodes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('editor', 'admin')
    )
  );

CREATE POLICY "Editors can update episodes"
  ON episodes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('editor', 'admin')
    )
  );

-- Similar for chapters, questions, etc.
```

---

## Architecture: How Auth Works

### Flow Diagram
```
1. User enters email/password in Auth.tsx
   ↓
2. useAuth hook calls signIn() from authService
   ↓
3. authService calls supabase.auth.signInWithPassword()
   ↓
4. Supabase returns JWT token (stored in browser session)
   ↓
5. authService fetches user profile from profiles table
   ↓
6. User data cached in localStorage
   ↓
7. ProtectedRoute components check isAuthenticated
   ↓
8. Navigation shows "Salir" button for authenticated users
```

### Key Files
| File | Purpose |
|------|---------|
| `src/services/authService.ts` | Supabase Auth API calls (signIn, signUp, signOut) |
| `src/hooks/useAuth.tsx` | React context + hooks for auth state management |
| `src/pages/Auth.tsx` | Login/signup form UI |
| `src/components/ProtectedRoute.tsx` | Route guard component |
| `src/components/Navigation.tsx` | Login/logout buttons |

---

## JWT Token Management

### Automatic Token Handling
Supabase handles JWT tokens automatically:
- Stored in `localStorage` under `sb-<project-id>-auth-token`
- Included in all API requests automatically
- Refreshed when expired

### Access Token from Code
```typescript
import { supabase } from '@/integrations/supabase/client';

// Get current session
const { data: { session } } = await supabase.auth.getSession();

// Get access token
const token = session?.access_token;

// Token includes user ID, email, role (from profiles table via policies)
```

---

## Troubleshooting

### ❌ "Missing environment variables" error
**Cause:** `.env.local` not created or missing variables
**Solution:**
1. Create `.env.local` in project root
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart dev server: `npm run dev`

### ❌ "Password should be at least 6 characters" on signup
**Solution:** This is by design. Use 6+ character passwords.

### ❌ "Invalid login credentials"
**Cause:** Email doesn't exist or password is wrong
**Solution:** 
1. Create account first (signup flow)
2. Verify email in Supabase Auth dashboard
3. Try login again

### ❌ User can't see profile after signup
**Cause:** Profile creation failed during signup
**Solution:**
1. Check Supabase logs for profile insert errors
2. Manually create profile in profiles table:
   ```sql
   INSERT INTO profiles (id, email, name, role)
   VALUES ('user-id-here', 'email@example.com', 'User', 'user');
   ```

### ❌ Editor role not working
**Cause:** Role not set in profiles table
**Solution:**
1. Go to Supabase Dashboard → Table Editor → profiles
2. Find your user row
3. Set role column to 'editor' or 'admin'
4. Clear localStorage and refresh browser

### ❌ useAuth hook returns `user: null` after login
**Cause:** Browser localStorage cleared or session expired
**Solution:**
1. Delete localStorage: Press F12, Console, type `localStorage.clear()`
2. Refresh page and log in again
3. Check that session is stored: `localStorage` should have `sb-*-auth-token`

---

## Security Best Practices

✅ **Implemented:**
- Passwords hashed by Supabase (bcrypt)
- JWT tokens with expiration
- RLS policies enforced at database level
- No sensitive data in localStorage (only user ID, email, role)
- HTTPS enforced in production

✅ **To Add:**
- Email verification (check Supabase Email Templates)
- Two-factor authentication (2FA)
- Password reset flow
- Session timeout
- Audit logging

---

## Next Steps After Auth Setup

1. ✅ Deploy SQL migrations (if not done)
2. ✅ Enable Supabase Auth (this guide)
3. ✅ Test signup/login locally
4. ⏳ Create editor dashboard (upload episodes)
5. ⏳ Grant editor role to team members
6. ⏳ Test E2E flows with real users
7. ⏳ Deploy to production

---

## Environment Variable Checklist

- [ ] `.env.local` created in project root
- [ ] `VITE_SUPABASE_URL` set (e.g., `https://xyz.supabase.co`)
- [ ] `VITE_SUPABASE_ANON_KEY` set (not secret key!)
- [ ] `.env.local` in `.gitignore` (don't commit!)
- [ ] Dev server restarted after adding variables
- [ ] Can access http://localhost:5173/auth without errors

---

Last Updated: 2024-12-18
Status: ✅ Implementation Complete
Next: E2E Testing
