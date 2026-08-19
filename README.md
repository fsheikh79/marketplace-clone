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

## Sub-phase 1b — core commerce UI

- Mock product catalog (30 products across 6 categories) with generated
  SVG placeholder art — no external image hosting dependency
- Async mock API layer (`features/products/api.ts`): every product read
  (`getProducts`, `getProductBySlug`, `getRelatedProducts`) returns a
  Promise with a small artificial latency, so call sites already look async
  and a later swap to real `fetch()` calls is a drop-in change
- Product listing (`/products`): responsive grid, category filter (sidebar
  and header nav, URL-synced), price range filter, sort (price asc/desc,
  newest), numbered pagination, loading skeletons, and an empty state
- Product detail (`/product/[slug]`): image, price, stock status, quantity
  selector, add-to-cart with toast feedback and a disabled/loading state
  during the action (not a silent no-op)
- Cart: `localStorage`-persisted `useCart()` context (`addItem`,
  `removeItem`, `updateQuantity`, `clearCart`, `totalItems`, `subtotal`),
  live badge count in the header
- Checkout: a 3-step flow (shipping → review → payment) with a step
  indicator; shipping form (name, phone, address, city, postal code) is
  validated separately from presentation; the payment step is a clearly
  marked UI shell for a future Stripe Elements embed — no real or fake
  payment logic. "Place order" mocks order creation, clears the cart, and
  redirects to a confirmation page. Both guest and signed-in checkout are
  supported.

## Sub-phase 1c — reviews, wishlist, search

- Reviews: `localStorage`-backed mock review store (seeded with a few
  starter reviews), read on every product page, write requires sign-in
  (guests see an inline sign-in prompt) and appears immediately on submit
- Wishlist: a standalone `useWishlist()` context (`productIds`, `toggle`,
  `isSaved`) that knows nothing about auth — gating is decided at the UI
  layer (`WishlistButton` composes `useAuth()` + `useWishlist()`) so the
  contexts stay decoupled. **Wishlist actions require sign-in** (consistent
  with reviews); guests get a toast prompting them to sign in instead of a
  silent no-op. Heart toggle on every product card and the detail page,
  plus a dedicated `/wishlist` page with a "Move to cart" action per item
- Search: the header search bar is now functional, submitting to
  `/search?q=...`; results reuse the same `ProductGrid` component as the
  listing page rather than a duplicate, with a graceful empty-results state
- Related products ("You might also like") already existed from 1b — same
  simple same-category logic, unchanged

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
/components/layout    — Header, Footer, AccountMenu, CartButton
/features/auth        — auth context, forms, validation, mock user store
/features/products    — mock catalog, async api.ts, listing/filter/sort/pagination UI
/features/cart        — cart context, cart UI
/features/checkout    — multi-step checkout, shipping form + validation, payment placeholder
/features/orders      — mock order store
/features/toast       — toast notification context
/features/reviews     — mock review store, review list/form
/features/wishlist    — wishlist context, wishlist button
/types                — shared domain types (User, Product, CartItem, Order, Review)
/.env.example          — placeholder vars for future AWS config (Cognito, API Gateway, Stripe)
```

## Roadmap

- **Phase 2** — wire up real AWS services (Cognito, API Gateway, Lambda,
  DynamoDB, Stripe)
