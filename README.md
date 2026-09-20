# TAED-TUM
This is the website for the Tech and Engineering Days event at Technical University of Mombasa from dates 9th November to 12th
# TUM Tech & Engineering Days — Event Hub Platform

A simple, lightweight event listing hub for **TUM Tech & Engineering Days**, a week-long event running **9th–12th November 2026**, ending with a **mega closing gathering in Diani**.

Students, mentors, and companies can create a light account and browse live events. Only admins can add, edit, or remove what shows up on the landing page.

Hosted by **TUM TIS**, **ESA-TUM**, and **Web3 Clubs-TUM**.

---

## Overview

The site is a public event feed with a protected admin panel behind it. There are no tickets, no QR codes, no in-app payments, no public submissions, and no personal profile pages. Every event card links out to wherever registration or payment actually happens (Luma, an external form, etc.).

## Pages

The site is built around three core pages:

1. **Landing Page** — Public, read-only feed of all live events. Each event card shows its title, description, date, category, and an "External Link" button pointing to registration/payment/details elsewhere. The page also lists the event dates, the Diani Day closing gathering, and the organizing clubs at the bottom along with their logos.
2. **Sign-Up / Login Pages** — One lightweight create-account form each for Student, Mentor, and Company, plus a shared login page (email + password via Supabase Auth). No profile pages, accounts only identify who is signed in.
3. **Admin Dashboard** — The only account type with event controls. Admins can add, edit, or remove events, and view all registered student/mentor/company accounts in one place.

## User Roles

| Role | Access |
|---|---|
| Student | Simple account, browse events |
| Mentor | Simple account, browse events |
| Company | Simple account, browse events |
| Admin | Only role that can add/edit/remove events |

## Admin Event Management Flow

1. Admin logs into the Admin Dashboard, the only account type with event controls.
2. Admin adds an event: title, description, date/time, category, and external link (Luma/payment/any outside page).
3. Event saves straight to MongoDB and appears on the landing page immediately, no approval step needed.
4. Admin can edit or remove any event at any time from the same dashboard.

## Architecture

```
React (Vite) frontend
  → public landing page (read-only event feed)
  → protected admin panel
        ↓
Express + Node.js REST API
  → account creation/login
  → admin-only event CRUD (add / edit / remove)
        ↓
MongoDB
  → all event data: title, description, date, category, external_link
        ↓
Supabase (Postgres + Auth)
  → only holds student/mentor/company account records for login
  → nothing event-related lives here
        ↓
Supabase Realtime
  → refreshes the Admin Dashboard the moment a new account signs up
```

## Database Split

**Supabase — accounts only**

| Table | Key Fields |
|---|---|
| students | id, name, email, password_hash |
| mentors | id, name, email, password_hash |
| companies | id, name, contact_email, password_hash |

**MongoDB — event content**

| Collection | Key Fields |
|---|---|
| events | id, title, description, date, category, external_link, added_by (admin) |

Supabase never stores an event, a link, or a status, it only knows who a student/mentor/company is. Only admins write to the events collection; there is no queue and no public submissions.

## Tech Stack

- **MongoDB** — holds every event admins publish: title, description, date, category, and external link (Luma/payment/other)
- **Express / Node.js** — single JS backend handling account creation/login and admin-only event CRUD in one simple API
- **React (Vite)** — one small read-only public landing page plus one small protected admin panel, nothing more
- **Supabase** — just 3 tables, purely for identity: students, mentors, companies. Built-in Auth + row-level security. No events, no submissions, no payments, no storage buckets live here

## Explicitly Out of Scope

- No tickets
- No QR codes
- No in-app payments
- No profile pages
- No public submissions

## Event Details

- **Dates:** 9th–12th November 2026
- **Closing event:** Diani Day, a mega gathering listed like any other event on the landing page, with its own external link handling registration/payment
- **Organizers (shown at the bottom of the landing page, with club logos):** TUM TIS, ESA-TUM, Web3 Clubs-TUM

## Next Steps

- Confirm hosting (Vercel + Render/Railway)
- Lock domain
- Finalize the Admin "Add Event" form fields
- Assign dev leads
