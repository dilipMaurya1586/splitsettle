# SplitSettle — Frontend

A React (JavaScript, Vite) frontend for **SplitSettle**, a group expense-splitting and settlement app. Talks to your API Gateway at `http://localhost:8080` (configurable).

Built with: **React 18 · React Router 6 · Axios · Tailwind CSS · Vite** — plain JavaScript (JSX), no TypeScript.

---

## 1. Setup

```bash
cd splitsettle-frontend
npm install
```

Copy the environment file and point it at your gateway:

```bash
cp .env.example .env
# .env
# VITE_API_URL=http://localhost:8080
```

## 2. Run (development)

```bash
npm run dev
```

Opens at **http://localhost:3000**.

## 3. Build for production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host. On Vercel: connect the repo, set the **Environment Variable** `VITE_API_URL` in project settings, and it auto-deploys.

---

## Project structure

```
src/
  main.jsx              # app entry — mounts React, Router, AuthProvider
  App.jsx                # route definitions
  index.css              # Tailwind + design tokens (colors, buttons, cards, pills)
  context/
    AuthContext.jsx      # JWT session state — login, register, logout
  services/
    api.js                # Axios instance — attaches JWT, handles 401 auto-logout
    authService.js
    groupService.js
    expenseService.js
    settlementService.js
  components/
    Header.jsx, Sidebar.jsx, MobileNav.jsx, ProtectedRoute.jsx
    Avatar.jsx, BalancePill.jsx, StatCard.jsx, Loader.jsx, EmptyState.jsx, Modal.jsx
    GroupCard.jsx, ExpenseForm.jsx, ExpenseItem.jsx, SettlementCard.jsx
  pages/
    Login.jsx, Register.jsx
    Dashboard.jsx          # profile summary, stat cards, groups, pending settlements
    Groups.jsx              # list + create group
    GroupDetail.jsx         # tabs: Expenses / Settlements / Members
    Settlements.jsx         # cross-group settlement view
    NotFound.jsx
  utils/
    format.js               # currency/date formatting, avatar colors
```

## API endpoints consumed

All requests go through the Axios instance in `src/services/api.js`, which reads
`VITE_API_URL` and automatically attaches `Authorization: Bearer <token>`.

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/groups
POST   /api/groups/{groupId}/members
GET    /api/groups/{groupId}
GET    /api/groups/my
POST   /api/expenses
GET    /api/expenses/group/{groupId}
PUT    /api/expenses/{expenseId}
DELETE /api/expenses/{expenseId}
GET    /api/settlements/group/{groupId}/balances
POST   /api/settlements/group/{groupId}/calculate
GET    /api/settlements/group/{groupId}/pending
POST   /api/settlements/{transactionId}/settle
POST   /api/ai/parse-expense        (optional — natural-language expense entry)
```

If your backend's response shapes differ slightly (e.g. `{ token }` vs `{ accessToken }`,
or a bare array vs `{ groups: [...] }`), the code already defensively checks both —
see `AuthContext.jsx` and the page components. Adjust field names in `services/*.js`
to match your actual DTOs if needed.

## Design notes

- **Palette:** deep teal/ink for structure and trust, warm amber for primary actions and
  highlights, moss green for "you're owed", coral for "you owe" — a deliberate financial
  semantic system, not decoration.
- **Type:** Sora (display/headings), Inter (body), IBM Plex Mono (all monetary amounts —
  tabular figures so numbers align and read as precise, financial data).
- **Auth pages** use a split layout (dark brand panel + form) so the product feels
  considered from the first screen, not a bare form.
- Fully responsive: collapses to a bottom tab bar on mobile, sidebar on desktop.

## Notes for your teammate

- This project uses **plain JavaScript with JSX** (`.jsx` files) — not TypeScript. Vite's
  React template just conventionally uses the `.jsx` extension for files containing JSX;
  there's no type-checking step and nothing here requires TypeScript.
- Backend runs independently — the frontend only needs `VITE_API_URL` pointed at the
  gateway. Both of you can work in parallel.
- JWT is stored in `localStorage` under `splitsettle_token` / `splitsettle_user`, cleared
  automatically on a 401 response from the API.
