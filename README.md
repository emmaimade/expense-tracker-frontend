<div align="center">

# SpendWise – Expense Tracker

Modern React frontend for personal finance tracking with budgets, analytics, multi-currency support and dark mode.

[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-blueviolet)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

<br />

Modern React (Vite) frontend for an expense tracking app with authentication, budgets, analytics, notifications, and user preferences (including dark mode).

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Backend/API expectations](#backendapi-expectations)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- Authentication: email/password, Google OAuth callback, logout, session persistence
- Password recovery: forgot password + reset password flows
- Expenses: add/edit/delete, date ranges (weekly/monthly/yearly/custom), export
- Budgets: per-category budgets, overview, trends, budget alerts
- Analytics: charts/insights for spending patterns
- Multi-currency: currency selection + currency detection
- UX: responsive layout, toast notifications, dark mode via preferences

## Tech stack

- React 19 + React Router
- Vite
- TanStack React Query
- Tailwind CSS
- MUI (Material UI) + Emotion
- React Hook Form + Yup
- Recharts, date-fns, react-toastify, lucide-react

## Requirements

- Node.js: `^20.19.0` or `>=22.12.0` (required by Vite 7)
- npm

## Getting started

1. Install dependencies:

   ```bash
   npm i
   ```

2. Configure environment variables (see below).
3. Start the dev server:

   ```bash
   npm run dev
   ```

Vite prints the local URL (commonly `http://localhost:5173`).

## Environment variables

Create a `.env` file at the repo root:

```bash
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` is used for Google OAuth redirects and fetching the current user in `src/components/auth/AuthCallback.jsx`.

Note: some API calls are currently hard-coded to `https://expense-tracker-api-hvss.onrender.com` (for example in `src/services/apiService.js` and a few auth pages). If you run a local backend, search for that hostname and replace it (or refactor to consistently use `VITE_API_URL`).

## Available scripts

- `npm run dev` - start Vite dev server
- `npm run build` - production build to `dist/`
- `npm run preview` - serve the production build locally
- `npm run lint` - run ESLint

## Project structure

High-level layout:

```text
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── analytics/
│   ├── auth/
│   ├── budgets/
│   ├── common/
│   ├── dashboard/
│   ├── expenses/
│   ├── layout/
│   ├── notification/
│   ├── pages/
│   └── settings/
├── context/
├── hooks/
├── providers/
├── services/
└── utils/
```

Key entry points:

- `src/main.jsx` - React root
- `src/App.jsx` - routing + providers (Auth, React Query, Preferences)
- `src/services/*` - API wrappers (expenses, budgets, categories, profiles, users)

## Backend/API expectations

This frontend expects a compatible backend that provides (at minimum):

- Auth & user:
  - `POST /user/register`
  - `POST /user/login`
  - `POST /user/forgot-password`
  - `POST /user/reset-password?token=...`
  - `GET /user/me` (used by Google OAuth callback)
  - `GET /user/detect-currency`
  - `GET /auth/google` (OAuth entrypoint; backend redirects back to `/auth/callback?token=...`)
- Domain:
  - Expenses: `/expense/*` (CRUD, date ranges, export)
  - Budgets: `/budget/*` (overview, alerts, trends, totals)
  - Categories: `/category/*` (CRUD)

Authentication uses a Bearer token stored in `localStorage` (key: `authToken`).

## Deployment

1. Build:

   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to a static host (Netlify, Vercel, Render static, S3/CloudFront, etc.).
3. Configure your host for SPA routing (all routes should rewrite to `index.html`).
4. Set `VITE_API_URL` in your hosting environment to your backend URL.

For OAuth to work in production, ensure your backend:

- Allows your deployed origin via CORS
- Redirects back to your frontend route `/auth/callback`
- Issues tokens that are valid for your API calls

## Troubleshooting

- `401 Authentication token not found`: clear site storage and log in again (token is stored as `authToken`).
- Refreshing `/dashboard/*` returns 404 in production: your host needs a SPA rewrite rule to `/index.html`.
- OAuth fails locally: confirm `VITE_API_URL` points to the backend origin and the backend is configured to redirect to `http://localhost:5173/auth/callback`.

## Contributing

1. Create a feature branch
2. Keep changes focused and run `npm run lint`
3. Open a PR with a clear description and screenshots for UI changes
