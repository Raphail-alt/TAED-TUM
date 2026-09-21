# TAED-TUM

Website for **TUM Tech & Engineering Days**, running **9th to 12th November 2026** at the Technical University of Mombasa, ending with a mega closing gathering in Diani. Hosted by TUM TIS, ESA-TUM and Web3 Clubs-TUM.

A public event feed with a protected admin panel. Students, mentors and companies can create a light account and browse events. Only admins add, edit or remove events. Every event links out to where registration or payment happens (Luma, an external form, etc.).

## Pages

| Route | What it is |
|---|---|
| `/` | Public landing page: hero, main event, about, event feed with category filters, audience, partners, organizers |
| `/signup` | Account creation for Student, Mentor or Company |
| `/login` | Shared login |
| `/admin` | Admin-only dashboard: event CRUD and the list of registered accounts |

## Tech stack

- **Frontend (this repo):** React 19, Vite, Tailwind CSS 4, React Router, lucide-react
- **Backend:** Supabase (Auth + Postgres) for accounts and events, with row level security. No separate server is needed.

## Current status

- **Accounts and events (Supabase):** Sign-up, login, the admin accounts list and event management all use Supabase as soon as the two environment variables below are set. Everyone can read events; only admins can add, edit or remove them. Changes appear live for every visitor. Without the variables the app runs in **demo mode** (browser `localStorage`, plus a demo admin login) so it still works for previews.
- The original plan put events in MongoDB behind an Express API. Events now live in Supabase instead, which removes the need for a second backend. To move them later, replace `src/context/SupabaseEventsProvider.jsx`; the UI does not need to change.

## Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**. This creates the `students`, `mentors`, `companies` and `admins` tables, security rules, the signup trigger and realtime.
3. In the same way, run [`supabase/events.sql`](supabase/events.sql). This creates the `events` table with its security rules and adds placeholder events you can edit or delete.
4. Copy `.env.example` to `.env.local` and fill in the **Project URL** and **anon / publishable key** from **Project Settings > API**. Never use the `service_role` / secret key in this app.
5. For deployment, the same two public values are in `.env.production`, which Vite bundles at build time (Vercel picks it up on every push). If you change Supabase project, update that file.
6. Make yourself an admin: sign up on the site with your admin email, then run this in the SQL Editor:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com'
   on conflict do nothing;
   ```

Optional: in **Authentication > Providers > Email**, turn off "Confirm email" while testing so new accounts can log in immediately. Leave it on for production.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Deployed on Vercel. `vercel.json` rewrites all routes to `index.html` so client-side routes like `/admin` work on refresh.

## Out of scope

No tickets, no QR codes, no in-app payments, no profile pages, no public event submissions.
