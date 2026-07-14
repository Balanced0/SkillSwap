# 🔄 SkillSwap — Time-Banked Skill Exchange

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-database-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

**SkillSwap** is a peer-to-peer time-banking network where members barter their skills 1:1. Time is the currency: when you teach someone for an hour, you earn **1 credit**, which you can then spend to learn from another member for an hour. Money never changes hands, and every skill is valued equally.

---

## 🎨 Visual Preview

```
┌────────────────────────────────────────────────────────┐
│                        SKILLSWAP                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│             Trade your hours, not your money.          │
│                                                        │
│             [ Start swapping ]   [ How it works ]      │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│    Teach: [ Python ] ↔ Learn: [ Guitar ]               │
│    1 credit transfers after both confirm completion    │
│                                                        │
├────────────────────────────────────────────────────────┤
│  [Explore Marketplace]   [Community Wishlist]  [Ledger]│
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Core Features

- **Interactive Hero & Swap Simulator**: Dynamic skill trade visualizer carousel and drop-down calculator simulator on the landing page for quick trade exploration.
- **Two-Sided Booking Flow**:
  - **Learners** can browse active listings on the explore page and request sessions.
  - **Teachers** can browse the *Community Learning Board* ("wants") and directly **Offer to Teach** using their existing active listings.
- **Credit-Time Ledger**: Real-time ledger showing running balance history of credits earned (taught) and spent (learned).
- **Two-Sided Confirmation Security**: Sessions only complete and transfer credits when *both* members confirm completion, ensuring security and fair exchange.
- **Reputation System**: Peer review scoring and written feedback visible on member profiles after completed sessions.
- **Secure Authentication**: Integrated JWT/cookie session handling via Better Auth with support for Google SSO and email/password accounts.
- **Role & Path Protection**: Secure React `AuthGuard` client protection coupled with backend route authorization policies ensuring users can only mutate resources they own.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI & Logic**: React 19, TypeScript 5
- **Icons**: Gravity UI Icons
- **Visuals & Charts**: Recharts (for dashboard data display)
- **Styling**: TailwindCSS 4 & Vanilla CSS

### Backend
- **Framework**: Express 5 (Node.js)
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: Better Auth (with MongoDB Adapter)
- **Validation**: Zod schema validation

---

## 📦 Dependencies

### Client
- `better-auth`: Auth client integration
- `@gravity-ui/icons`: Modern flat line icons
- `recharts`: Interactive SVG charts
- `tailwindcss` & `@tailwindcss/postcss`: Utility-first CSS pipeline

### Server
- `mongoose`: MongoDB Object Modeling
- `better-auth` & `@better-auth/mongo-adapter`: Database-backed sessions
- `zod`: Server-side schema runtime checks
- `cors` & `express`: API middleware and routing
- `tsx`: Development daemon running Typescript files directly

---

## 💻 Local Setup Guide

Follow this guide to run both the API server and frontend locally.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or on Atlas

---

### Step 1: Start the API Server
1. Navigate to the `skillswap-server` directory:
   ```bash
   cd ../skillswap-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables by copying `.env.example` to `.env`:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/skillswap
   BETTER_AUTH_SECRET=your_super_secret_better_auth_key
   BETTER_AUTH_URL=http://localhost:4000
   CLIENT_ORIGINS=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The backend server will run at `http://localhost:4000`. You can test connection with `GET http://localhost:4000/api/health`.*

---

### Step 2: Start the Next.js Frontend
1. Navigate to the `skillswap` client directory:
   ```bash
   cd ../skillswap
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## 🛡️ Verification & Build Commands

Before pushing any changes, you can validate the codebases using the following scripts.

#### Client-side linting & build:
```bash
# Inside the skillswap client directory
npm run lint
npm run build
```

#### Server-side type-checking & compile:
```bash
# Inside the skillswap-server directory
npm run typecheck
npm run build
```
