# AGENTS.md

## Commands

- `npm run dev` — Next.js dev server on port 3000 (auto-opens `http://localhost:3000`)
- `npm run build` — production build; TypeScript errors are silently ignored via `ignoreBuildErrors: true`
- `npm run lint` — `next lint` using the legacy `.eslintrc` config
- `npx tsc --noEmit` — typecheck without emit
- No test suite exists

## Architecture

Two UI areas share `app/layout.tsx` as the root:

| Area | Route | UI | State |
|------|-------|----|-------|
| Storefront | `(home)/` | shadcn/ui (Radix + Tailwind v4 + animate plugin) | Zustand (persisted) + React Query |
| Admin dashboard | `dashboard/` | MUI v9 | Redux Toolkit |

`app/(home)/layout.tsx` wraps children in `ThemeProvider` (next-themes), `QueryProvider` (React Query), and `SessionProvider` (next-auth).

Dashboard route groups: `(ecommerce)`, `(crm)`, `(cms)`, `(auth)`, `(settings)`, `(filestorage)`.

## Imports

Path aliases from `tsconfig.json`:

```
@root/*      → ./*
@dashboard/* → ./app/dashboard/*
@(home)/*    → ./app/(home)/*
@api/*       → ./app/api/*
```

Always use `@root/` for cross-area imports. Never use relative `../../` chains.

## Auth

- **next-auth** `CredentialsProvider` + JWT strategy.
- Middleware is in `proxy.ts` and uses **`withAuth`** from `next-auth/middleware`, not the default export.
- Dashboard access requires `ADMIN` or `SUPERADMIN` role; then `AllRoutes.routes` permission is checked server-side against `/Auth/GetPermissionsOfCurrentUser`.
- Storefront uses `<SessionProvider>` from `app/(home)/_components/session-provider.tsx`.
- `useSession()` works in any client component under `(home)/`.

## Services

- **Storefront** (`HomePageService`, `ProfileService`, etc.): public endpoints. Calling `Fetch.SetDefaultHeader()` with **no arguments** already sets `Content-Type: application/json`, `Accept-Language: fa`, etc. Pass `jwt` only for authenticated calls.
- **Dashboard** service classes always take `jwt: string` in their constructor; they call `Fetch.SetDefaultHeader(jwt)`.
- All API responses use `Result<T>` = `{ succeeded, data, message }`.

## i18n

- Locales: `en`, `fa` (default), `ar` — RTL for `fa` and `ar`.
- `next-intl` v4 configured via `i18n/request.ts` which reads the `NEXT_LOCALE` cookie.
- Translation files live in `public/locales/{locale}/translation.json`.
- **Quirk:** `i18n/request.ts` contains a stray `debugger;` statement.
- Persian dates use `moment-jalaali` (`showDistanceToNow` helper).

## State

- **Zustand** in `app/(home)/_lib/store.ts`: cart, wishlist, compare, locale, stock alerts, UI. All persisted via `zustand/persist`.
- **Redux Toolkit** in `store/`. Dashboard only.

## Key Config

- `config.ts` — all paths (`API_BASEPATH`, `LOGIN_API_PATH`, etc.), storage keys, theme defaults, image paths.
- Env vars: `NEXT_PUBLIC_API_BASE_URL` (backend, default `https://localhost:7134`), `NEXT_PUBLIC_FRONT_URL` (frontend, default `http://localhost:3000`).

## Conventions

- Prettier: `bracketSpacing: false`, `singleQuote: true`, `bracketSameLine: true`, `printWidth: 80`, `trailingComma: 'all'`.
- ESLint: `react/no-unescaped-entities` off, `@next/next/no-img-element` off, `react-hooks/exhaustive-deps` off, `@next/next/no-page-custom-font` off.
- `_`-prefixed folders are private (not routes): `_components`, `_hooks`, `_lib`, `_service`, `_types`, `_layout`, `_theme`.
- Dashboard module route registration: each module has `_lib/routes.ts`, aggregated in `app/dashboard/_lib/routes.ts`.

## Important quirks

- `ReviewForm` (`app/(home)/products/[id]/_components/ReviewForm.tsx`) accepts optional `existingReview` (edit mode) and `onSuccess` callbacks. Older callers may still reload; do not add unconditional `window.location.reload()` in new flows.
- Shared reviews state lives in `app/(home)/_components/ecommerce/ProductReviews.tsx` (`variant="full"` on product pages, `variant="quick"` in Quick View). Both product detail and quick view should use this instead of local review lists.
- `(home)` client components import icons from `lucide-react`; do not add new icon libraries without confirming existing patterns.
- Images from the backend require explicit `remotePatterns` in `next.config.ts` for localhost dev.
- `app/dashboard/` uses MUI styling only; never introduce shadcn/tailwind classes there.
