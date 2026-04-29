# SushiMate Frontend

Vite + React + TypeScript single-page app that powers the SushiMate ordering experience. It ships with a lacquer-red art direction, responsive layouts, and demo checkout logic that speaks to the local mock API.

## Highlights

- **Atomic design** components (cards, modals, forms) with TailwindCSS utility tokens
- **Stateful shopping journey** via dedicated Context providers (cart, loyalty, profile, orders)
- **Halal + Dubai flavor** baked into metadata, copy, and currency helpers
- **Mobile-first** navigation with Swiper-based hero + menu carousels
- **API service layer** (`src/services/api.ts`) that centralizes backend calls

## Commands

```bash
# run from repo root or inside apps/frontend
npm run dev --workspace apps/frontend   # start Vite dev server on 5173
npm run build --workspace apps/frontend # type-check + production build (dist/)
npm run preview --workspace apps/frontend
npm run lint --workspace apps/frontend  # ESLint + TypeScript
```

## Structure

```
src/
├─ components/     Reusable UI atoms/molecules
├─ context/        Cart, loyalty, order, profile providers
├─ data/           Product catalog + seeded content
├─ pages/          Routed screens (Home, Menu, Checkout, etc.)
├─ services/       Axios client + endpoints
├─ images/         Optimized hero/product assets
└─ config/         Promo codes + future feature flags
```

## Environment

No runtime env vars are required. Update `src/services/api.ts` if the backend URL changes.
