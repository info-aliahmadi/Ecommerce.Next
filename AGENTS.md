# AGENTS.md

## Commands

- `npm run dev` — starts dev server on port 3000
- `npm run build` — production build (TypeScript errors are ignored via `ignoreBuildErrors: true`)
- `npm run lint` — ESLint (next config)
- No test suite exists

## Architecture

This is a **Next.js 16 App Router** e-commerce app with two distinct UI areas sharing the same root layout:

| Area | Route | UI library | State |
|------|-------|-----------|-------|
| Storefront | `(home)/` | shadcn/ui (Radix + Tailwind) | Zustand |
| Admin dashboard | `dashboard/` | MUI (Material UI v9) | Redux Toolkit |

**Root layout** (`app/layout.tsx`) handles i18n (next-intl), RTL direction, and locale-aware fonts. The `(home)` layout adds ThemeProvider + React Query. The `dashboard` layout adds SessionProvider, ReduxProvider, and AuthorizationProvider.

### Path aliases (tsconfig.json)

```
@root/*   → ./*
@dashboard/* → ./app/dashboard/*
@(home)/*    → ./app/(home)/*
@api/*       → ./app/api/*
```

Always use `@root/` for cross-area imports (e.g., `@root/config`, `@root/utils/Fetch`). Never use relative `../../` chains.

### Auth flow

- **next-auth** with `CredentialsProvider` (username/password via backend API)
- JWT strategy; tokens stored in session callbacks
- Route protection in `proxy.ts` — checks `AllRoutes.routes` permission map against backend `/Auth/GetPermissionsOfCurrentUser`
- Dashboard pages wrap children in `AuthorizationProvider` which exposes a `permissions` context
- Guard components: use `<Authorize permission="PERMISSION_NAME">` from `app/dashboard/_components/Authorization/`
- All permission constants live in `app/dashboard/_lib/Permissions.ts`

### Service pattern

Every dashboard service class follows this exact pattern:

```typescript
import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';

export default class SomeService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }
  // methods use Fetch.Get / Fetch.Post with CONFIG.API_BASEPATH + '/Endpoint'
}
```

- `Fetch.SetDefaultHeader(jwt)` sets `Authorization: Bearer <jwt>`, `Content-Type: application/json`, `Accept-Language: fa`
- All API responses use the `Result<T>` type (`app/types/Result.ts`): `{ succeeded, data, message }`
- Homepage services (e.g., `HomePageService`) are public (no JWT required)

### i18n

- Locales: `en`, `fa` (default), `ar` — defined in `locales/languageList.ts`
- RTL locales: `fa`, `ar` — handled by `DirectionProvider` and `HTML dir` attribute
- Translation files: `public/locales/{locale}/translation.json`
- `next-intl` configured via `i18n/request.ts` (reads `NEXT_LOCALE` cookie)
- Persian calendar (`moment-jalaali`) used for `fa` locale

### State management

- **Zustand** stores in `app/(home)/_lib/store.ts`: cart, wishlist, compare, locale, stock alerts, UI state. All persisted via `zustand/persist`.
- **Redux Toolkit** in `store/` for dashboard state only (menu, etc.)

### Key config

- `config.ts` (root) — all API paths, storage keys, theme defaults, image paths
- `NEXT_PUBLIC_API_BASE_URL` — backend API base (default `https://localhost:7134`)
- `NEXT_PUBLIC_FRONT_URL` — frontend URL (default `http://localhost:3000`)

## Conventions

- **Prettier**: no bracket spacing, single quotes, trailing commas, 80 char width (`prettierrc.js`)
- **ESLint**: relaxed rules — no unescaped entities warnings, no img-element warnings, exhaustive-deps off
- Dashboard modules follow a consistent structure under each route group: `_components/`, `_hooks/`, `_lib/`, `_service/`, `_types/`, then page directories
- `_` prefix directories are private/infrastructure (not routes): `_components`, `_hooks`, `_lib`, `_service`, `_types`, `_layout`, `_theme`
- Dashboard route groups use parentheses: `(ecommerce)`, `(crm)`, `(cms)`, `(auth)`, `(settings)`, `(filestorage)`
- New dashboard pages register routes in their module's `_lib/routes.ts`, then aggregate in `app/dashboard/_lib/routes.ts`
