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

## Sub-phase 1d — admin dashboard

- Route tree split: `app/(shop)` (storefront chrome — header, footer,
  cart/wishlist/toast providers) and `app/admin` (a separate dense
  internal-tool shell — dark sidebar nav, no storefront chrome), both
  nested under one minimal shared root layout so `<html>/<body>` and
  global CSS aren't duplicated
- Admin access gating: a `role: "admin" | "customer"` field on `User`;
  `/admin/*` redirects guests to `/login` and signed-in non-admins to `/`.
  A seeded demo admin account (`admin@marketplace.com` / `admin123`) is
  created in the mock user store on first read so the flow can be
  exercised without building account-role-assignment UI (out of scope)
- Shared mutable product data layer (`features/products/lib/productStore.ts`):
  full CRUD (`listProducts`, `findProductById`, `createProduct`,
  `updateProduct`, `deleteProduct`) backed by the same `localStorage` store
  the storefront reads from — admin edits are visible on `/products` and
  `/product/[slug]` immediately, in the same browser session, proving a
  real shared data layer rather than disconnected mocks. This required
  converting the product detail page from static generation to a
  client-rendered page so it can read the same `localStorage`-backed store
  (documented tradeoff: loses `generateStaticParams`/per-product
  `generateMetadata`)
- Admin product management: searchable/filterable table, add/edit forms
  (reusing the existing form-validation hook and `Input`/`Button`
  primitives), delete with a confirmation dialog
- Admin order management: table of all orders (checkout-created plus
  seeded historical orders), status filter, inline and detail-page status
  updates (pending → processing → shipped → delivered / cancelled)
  reflected immediately
- Dashboard overview: stat cards (total products, total orders, orders by
  status) computed from the same stores — no charting library

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
/features/admin       — admin shell (sidebar, page header), product form, confirm dialog
/types                — shared domain types (User, Product, CartItem, Order, Review)
/.env.example          — placeholder vars for future AWS config (Cognito, API Gateway, Stripe)
```

## Roadmap

- **Phase 2** — wire up real AWS services (Cognito, API Gateway, Lambda,
  DynamoDB, Stripe)

## Phase 2 checklist — every mock that needs a real AWS call

Phase 1 is entirely mocked/local (`localStorage` + in-memory, with
artificial latency so call sites already look async). Every mock is marked
with a `// MOCK: ...` comment at its call site. This is the consolidated
list of what each one becomes in Phase 2.

**Auth — `features/auth/lib/mockAuthStore.ts`, `AuthContext`**

- `mockSignUp` / `mockLogIn` / `mockLogOut` → Cognito `SignUp` /
  `InitiateAuth` / `GlobalSignOut` (via Amplify Auth or direct SDK calls)
- Session persisted via a `localStorage` user id → Cognito-managed tokens
  (id/access/refresh), refreshed automatically
- `User.role` (`"customer" | "admin"`) → a Cognito user-group claim
  (`cognito:groups`) read from the decoded ID token, not a plain field
- Seeded demo admin account → a real Cognito user manually placed in an
  `admin` group (or provisioned via an admin API) — the seed step is
  deleted entirely, not ported

**Products — `features/products/lib/productStore.ts`, `features/products/api.ts`**

- `listProducts` / `findProductBySlug` / `findProductById` /
  `getRelatedProducts` / `searchProducts` → API Gateway + Lambda reading
  from DynamoDB (with a real search/filter query, not client-side `.filter`)
- `createProduct` / `updateProduct` / `deleteProduct` → API Gateway +
  Lambda `POST` / `PATCH` / `DELETE` against DynamoDB, gated server-side by
  the admin group claim (client-side role gating in `app/admin/layout.tsx`
  is UX only, never a real permission boundary)
- Generated SVG placeholder images (`placeholderProductImage`) → real
  product images uploaded to S3, served through CloudFront
- Product detail page's client-rendered fetch → likely reverts to a
  server component / SSG or ISR once product reads hit a real API, undoing
  the SSG-to-CSR tradeoff taken in 1d specifically to share `localStorage`
  state with the admin mutations

**Cart — `features/cart/context/CartContext.tsx`**

- `localStorage`-persisted cart → either stays client-only (fine for a
  cart) or, for a signed-in user, syncs to a DynamoDB cart table so it
  persists across devices

**Orders — `features/orders/lib/mockOrderStore.ts`**

- `getAllOrders` / `getOrderById` / `updateOrderStatus` / order creation at
  checkout → API Gateway + Lambda reading/writing a DynamoDB orders table
- Seeded historical orders → deleted; real order history comes from actual
  checkouts
- Order status transitions → likely driven by real events (payment
  webhook, shipping-provider webhook) instead of an admin button for every
  step, though a manual admin override probably still makes sense

**Checkout / payment — `features/checkout/components/PaymentPlaceholder.tsx`**

- Payment step UI shell → real Stripe Elements embed; "Place order" →
  a Lambda that creates a Stripe PaymentIntent, confirms it, then writes
  the order only on confirmed payment (not optimistically, as the mock
  does)

**Reviews — `features/reviews/lib/mockReviewStore.ts`**

- `localStorage`-backed review store → DynamoDB reviews table via API
  Gateway + Lambda, write path still gated behind a real Cognito session

**Wishlist — `features/wishlist/context/WishlistContext.tsx`**

- `localStorage`-persisted wishlist → DynamoDB, keyed by Cognito user id,
  so it persists across devices instead of per-browser

**Search — `features/products/api.ts` `searchProducts`**

- Client-side substring match over the full mock catalog → a real search
  backend (OpenSearch, or a DynamoDB query/GSI for small catalogs) once
  the catalog is too large to filter client-side

**Admin dashboard stats — `app/admin/page.tsx`**

- Stat cards computed client-side from `listProducts()` / `getAllOrders()`
  → either a dedicated aggregation Lambda/endpoint, or DynamoDB count
  queries, once catalog/order volume makes client-side counting impractical

**Config** — `.env.example` already lists the real env vars this all
plugs into: `NEXT_PUBLIC_COGNITO_USER_POOL_ID`,
`NEXT_PUBLIC_COGNITO_CLIENT_ID`, `NEXT_PUBLIC_COGNITO_REGION`,
`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
