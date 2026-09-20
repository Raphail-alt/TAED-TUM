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
- **Planned backend:** Express + Node.js API, MongoDB for events, Supabase (Auth + Postgres) for student/mentor/company accounts

## Current status

The frontend is complete. Accounts and events are currently kept in the browser's `localStorage` as a stand-in for the backend:

- `src/context/AuthContext.jsx` is the stand-in for Supabase Auth.
- `src/context/EventsContext.jsx` is the stand-in for the Express + MongoDB events API.

Swap those two files for real API calls when the backend is ready. The rest of the UI does not need to change.

The demo admin login shown on `/login` in development is a placeholder. Remove it before going live.

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
