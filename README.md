# SkillSwap web app

SkillSwap is a time-banked skill exchange. Members begin with two credits, earn one credit for each confirmed hour they teach, and spend one credit for each confirmed hour they learn. Money never changes hands.

## Run locally

1. Start the API in the sibling `skillswap-server` repository (see its README).
2. Copy `.env.example` to `.env.local` and change `NEXT_PUBLIC_API_URL` only if the API is not running at `http://localhost:4000/api`.
3. Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## What is included

- Responsive public landing page, explore filters, listing details, FAQ, terms, and about page.
- Email/password registration and login, plus a working demo-account entry point.
- Protected listing creation and management, session requests, dual completion confirmation, reviews, profile editing, dashboard, and time-credit ledger.
- Recharts dashboard views fed by the API rather than seeded marketplace content.

## Validate

```bash
npm run lint
npm run build
```
