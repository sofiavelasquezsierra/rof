# ROF — Student Club Management Platform

**Replace the Excel sheets and Word docs that die with every graduating exec board.**

🔗 [Live App](https://rof-zyb9.vercel.app/) &nbsp;|&nbsp; Built with T3 Stack · Deployed on Vercel

---

## The Problem

Every university club runs on informal knowledge: membership lists in Excel, event schedules in Word docs, registration forms in Google Forms that no one can find. When the executive board graduates, that institutional knowledge disappears. The next cohort starts from scratch.

Club admins needed a single, persistent platform — one that survives leadership transitions.

---

## The Solution

ROF is a full-stack club management web app built for university club administrators. It lets them create their organization, register and verify student members, track analytics, and schedule events — all in one place, with role-based access that transfers cleanly when leadership changes.

**Built for:** University clubs with rotating leadership who need persistent, structured member management.

---

## What It Does

| Feature | Description |
|---|---|
| **Club Creation** | Founders register their club and set up their admin account |
| **Student Registration** | Admins register members with an in-house verification flow using student IDs |
| **Dashboard** | Central view of club membership, status, and activity |
| **Analytics** | Member data visualized — enrollment trends, demographics, engagement |
| **Scheduler** | Plan and track club events in one place |
| **Auth System** | Sign-up, sign-in, email verification, and a guard to prevent double-registration |

**9 pages shipped** — 5 private pages with full database integration, 4 auth/public pages.

---

## Product Decisions Made

**Why build our own verification flow instead of using a third-party auth library for student identity?**
Third-party auth handles login, not identity. We needed to verify that a registering user is actually a student at our institution — which required a custom flow using student ID upload. Off-the-shelf solutions don't solve that problem.

**Why a popup to prevent signed-in users from re-registering?**
During beta testing we found that logged-in users would navigate back to the registration page and accidentally create duplicate entries. Rather than a backend deduplication patch, a UI-level guard catches the problem before it happens — cheaper to implement and better UX.

**Why include Analytics as a core feature, not a v2 addition?**
Club executives pitch to universities and sponsors for funding. They need data. Building analytics in from the start — rather than as an afterthought — meant the data model was designed to support it, not retrofitted onto it.

---

## What We'd Build Next

1. **Leadership transfer flow** — A formal handoff process where outgoing admins transfer permissions to incoming execs, with audit trail
2. **Email digest** — Weekly summary sent to club admins: new registrations, upcoming events, member engagement
3. **Multi-club support** — Students can belong to multiple clubs; admins can see cross-club membership overlap

---

## Contributions

Sofia Velasquez Sierra owned: Dashboard, Verify, Club and Student data models, database schema design

Full-stack ownership per feature: each contributor built the front-end, back-end, and API routes for their assigned pages.

**Team:** Sofia Velasquez Sierra · Saiyid Kazmi · Aditya Makhija

---

## Technical Details

**Stack:** T3 (Next.js · TypeScript · React · Prisma · tRPC · Tailwind CSS · NextAuth.js)
**Database:** PostgreSQL via Neon
**Deployment:** Vercel
**File uploads:** UploadThing

---

## Setup

```bash
git clone https://github.com/sofiavelasquezsierra/rof
cd rof
npm install
cp .env.example .env
# Add your DATABASE_URL and NEXTAUTH_SECRET to .env
npx prisma db push
npm run dev
```

---

## About

Team Table
- Saiyid Kazmi [register, create-club, club, sign-in/sign-up, student, topnav, sidebar, authentication]
- Sofia Velasquez-Sierra [dashbaord, verify, club, student, db]
- Aditya Makhija [analytics, scheduler]

[LinkedIn](https://linkedin.com/in/sofia-velasquez) · [GitHub](https://github.com/sofiavelasquezsierra)
