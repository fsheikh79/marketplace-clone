# marketplace-clone

A full-feature e-commerce marketplace clone (Amazon/Flipkart style), built as
a portfolio project. Next.js App Router + TypeScript + Tailwind CSS.

This is being built incrementally, sub-phase by sub-phase, so the commit
history documents the build progression. No AWS integration exists yet —
everything is mocked or local, but structured so swapping mocks for real API
calls later is a drop-in change, not a rewrite.

## Sub-phase 1a — Project setup & auth UI

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- ESLint + Prettier
- Feature-based folder structure (`/features/auth`, ...)
- Base layout: responsive header (logo, search placeholder, cart icon,
  account menu) and footer
- Mocked auth: sign-up, log-in, and a forgot-password stub, backed by a
  `localStorage`-persisted mock user store behind a `useAuth()` context whose
  public interface (`signUp`, `logIn`, `logOut`, `currentUser`) is designed
  to be swapped for a real Cognito-backed implementation without touching
  any consuming component
- Guest checkout entry point on both auth pages

Every point where a mock stands in for a future real API call is marked with
a `// MOCK: ...` comment.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint    # ESLint
npm run build   # Production build + type check
```

## Project structure

```
/app                — routes (App Router)
/components/ui       — generic UI primitives (Button, Input)
/components/layout   — Header, Footer, AccountMenu
/features/auth       — auth context, forms, validation, mock user store
/types                — shared domain types (User, Product, CartItem, Order, Review)
/.env.example         — placeholder vars for future AWS config (Cognito, API Gateway, Stripe)
```

## Roadmap

- **1b** — product listing, cart, checkout (still mocked)
- **Phase 2** — wire up real AWS services (Cognito, API Gateway, Lambda,
  DynamoDB)
