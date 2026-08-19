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

## Sub-phase 1b — product catalog, cart, checkout

- Mock product catalog (30 products across 6 categories) with generated
  SVG placeholder art — no external image hosting dependency
- Product listing (`/category/[slug]`) and detail (`/product/[slug]`) pages,
  statically generated
- Cart: `localStorage`-persisted `useCart()` context (`addItem`,
  `removeItem`, `updateQuantity`, `clearCart`, `totalItems`, `subtotal`),
  live badge count in the header
- Checkout: validated shipping-address form, guest or signed-in, creates a
  mock order and redirects to an order confirmation page
- Homepage and header category links now point at real listing pages

## Sub-phase 1c — search, account area, reviews

- Working client-side search: header search bar submits to `/search?q=...`,
  matching against title, brand, category, and description
- Account area (sign-in required): `/account` profile overview,
  `/account/orders` order history (`getOrdersByUserId`), linked from the
  account dropdown and footer
- Product reviews: `localStorage`-backed mock review store (seeded with a
  few starter reviews), read on every product page, write requires sign-in
- Order confirmation page now doubles as an order detail view when reached
  from order history, not just fresh checkout

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
/app                  — routes (App Router)
/components/ui        — generic UI primitives (Button, Input)
/components/layout    — Header, Footer, AccountMenu, CartButton, SearchBar
/features/auth        — auth context, forms, validation, mock user store
/features/products    — categories, mock catalog, search, product cards/grid
/features/cart         — cart context, cart UI
/features/checkout    — shipping form + validation
/features/orders      — mock order store, order status badge
/features/account     — sign-in gate, account nav
/features/reviews     — mock review store, review list/form
/types                 — shared domain types (User, Product, CartItem, Order, Review)
/.env.example          — placeholder vars for future AWS config (Cognito, API Gateway, Stripe)
```

## Roadmap

- **Phase 2** — wire up real AWS services (Cognito, API Gateway, Lambda,
  DynamoDB, Stripe)
