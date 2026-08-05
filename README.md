# Hydra Shop — Ecommerce.Next

> A full-stack ecommerce platform built with Next.js 16, React 19, and TypeScript.  
> It ships two UI surfaces: a shadcn/ui storefront (`(home)/`) and a MUI v9 admin dashboard (`dashboard/`).

---

## 🖼️ Preview

![Homepage](public/images/Preview/homepage.png)
> **Homepage (Dark)** — Featured products, categories, articles, and promotional slideshows.

![Homepage Light](public/images/Preview/homepage-light.png)
> **Homepage (Light)** — Same layout rendered with the light theme.

![Product List](public/images/Preview/products-list.png)
> **Product Listing** — Paginated, filterable product grid with category/manufacturer/tag filters and search.

![Product List Light](public/images/Preview/products-list-light.png)
> **Product Listing (Light)** — Catalog page in light mode.

![Product Detail](public/images/Preview/products.png)
> **Product Detail** — Full product page with image gallery, specifications, add-to-cart, and reviews.

![Cart Items](public/images/Preview/CartItems.png)
> **Shopping Cart** — Persistent cart with quantity controls and free-shipping threshold indicator.

![Profile](public/images/Preview/profile.png)
> **User Profile** — Account settings, order history, addresses, and wishlist management.

![Login](public/images/Preview/login.png)
> **Login** — Credentials-based authentication with next-auth.

![Mobile View](public/images/Preview/mobile%20view.png)
> **Mobile View** — Responsive layout for the storefront on small screens.

---

## ✨ Features

- **Dual UI architecture**: shadcn/ui + Tailwind v4 + Radix on the storefront; MUI v9 on the dashboard.
- **Authentication & Authorization**: next-auth (CredentialsProvider + JWT), middleware-protected dashboard routes with role-based access (`ADMIN`, `SUPERADMIN`).
- **State Management**: Zustand (persisted via `zustand/persist`) on the storefront; Redux Toolkit on the dashboard; React Query for server state.
- **Theming**: Dark/light mode via `next-themes` on the storefront; customizable MUI theme on the dashboard.
- **i18n**: Persian (`fa`), English (`en`), Arabic (`ar`) via `next-intl` v4. RTL for `fa` and `ar`. Persian dates via `moment-jalaali`.
- **Rich text editing**: Lexical + LexKit editor for CMS pages and product descriptions.
- **Charts**: ApexCharts, Recharts, MUI X Charts in the dashboard.
- **File uploads**: FilePond with image preview, validation, and poster plugins.
- **Drag & drop**: `@dnd-kit` for sortable lists and panels.
- **Video**: HLS.js streaming support.

---

## 🛠️ Tech Stack

| Area | Stack |
|------|-------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 6 |
| **UI — Storefront** | shadcn/ui, Radix, Tailwind v4, Framer Motion |
| **UI — Dashboard** | MUI v9, MUI X |
| **Auth** | next-auth v4 (Credentials + JWT) |
| **Client State** | Zustand (storefront), Redux Toolkit (dashboard) |
| **Server State** | TanStack React Query |
| **i18n** | next-intl v4 |
| **Forms** | React Hook Form + Formik + Yup + Zod |
| **HTTP** | Custom `Fetch` utility with `NEXT_PUBLIC_API_BASE_URL` |
| **Charts** | ApexCharts, Recharts, MUI X Charts |
| **Linting** | ESLint (legacy `.eslintrc`), Prettier |
| **Package Manager** | npm |

---

## 📁 Project Structure

```
app/
├── (home)/                     # Storefront routes
│   ├── _components/            # Private shared UI
│   ├── _hooks/                 # Custom React hooks
│   ├── _lib/                   # Store (Zustand), utilities
│   ├── _services/              # Service classes (HomePageService, etc.)
│   ├── _types/                 # TypeScript models
│   ├── _layout/                # Private layout components
│   ├── _theme/                 # shadcn/ui theme tokens
│   └── products/[id]/          # Product detail page
├── dashboard/                  # Admin dashboard
│   ├── (ecommerce)/            # Orders, products, categories, etc.
│   ├── (crm)/                  # Customers, communications
│   ├── (cms)/                  # Articles, pages, slideshows
│   ├── (auth)/                 # Login, permissions
│   ├── (settings)/             # App configuration
│   ├── (filestorage)/          # File manager
│   ├── _components/            # Dashboard-specific UI
│   ├── _lib/                   # Routes, utilities
│   └── store/                  # Redux store
├── api/                        # Next.js API routes
├── i18n/                       # next-intl configuration
├── layout.tsx                  # Root layout
└── page.tsx                    # Home page entry
config.ts                       # Global config (paths, defaults, storage keys)
kilo.json                       # Kilo agent configuration
AGENTS.md                       # Project agent instructions
```

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/info-aliahmadi/Ecommerce.Next

# 2. Enter the project directory
cd Ecommerce.Next

# 3. Install dependencies
npm install
```

## ⚙️ Environment Variables

Create a `.env.local` file (gitignored) or edit the committed `.env.development` / `.env.production`:

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:7134
NEXT_PUBLIC_FRONT_URL=http://localhost:3000
```

> **Note**: The dev backend uses a self-signed certificate. `NODE_TLS_REJECT_UNAUTHORIZED=0` is already set in development.

## ▶️ Development

```bash
npm run dev      # Next.js dev server → http://localhost:3000
```

## 🏗️ Production Build

```bash
npm run build    # Build for production
npm run start    # Start production server
```

## 🔍 Lint & Type Check

```bash
npm run lint               # ESLint (legacy .eslintrc config)
npx tsc --noEmit           # TypeScript check without emit
```

> **Warning**: `next build` silently ignores TypeScript errors (`ignoreBuildErrors: true` in `next.config.ts`).  
> Always run `npx tsc --noEmit` locally before pushing.

---

## 📖 Usage

### Adding a New Storefront Feature

1. Create a new folder under `app/(home)/` following existing patterns.
2. Add service methods in `app/(home)/_services/` using `HomePageService` or a new service class.
3. Add types in `app/(home)/_types/`.
4. For public data, call `Fetch.SetDefaultHeader()` with no arguments. For authenticated data, pass `jwt`.
5. Use `useSession()` for client-side auth checks.

### Adding a New Dashboard Module

1. Create a route group under `app/dashboard/` (e.g., `(reports)/`).
2. Add module-specific routes in `app/dashboard/_lib/routes.ts`.
3. Create a service class in `app/dashboard/_services/` that accepts `jwt: string` in the constructor and calls `Fetch.SetDefaultHeader(jwt)`.
4. Use MUI components only — do not introduce shadcn/tailwind classes in `app/dashboard/`.

### Adding a New API Route

1. Create a new file under `app/api/` following the existing route handler pattern.
2. All responses should use `Result<T> = { succeeded, data, message }`.

---

## 🔐 Auth & Permissions

- **Storefront**: Uses `SessionProvider` from `app/(home)/_components/session-provider.tsx`. `useSession()` is available in any client component under `(home)/`.
- **Dashboard**: Middleware (`proxy.ts`) requires `ADMIN` or `SUPERADMIN` role. Permissions are checked server-side against `/Auth/GetPermissionsOfCurrentUser`.

---

## 🌍 Internationalization

- Supported locales: `en`, `fa` (default), `ar`.
- Translations live in `public/locales/{locale}/translation.json`.
- RTL layout for `fa` and `ar`.
- **Note**: `i18n/request.ts` contains a stray `debugger;` statement — remove it before committing.

---

## 🔧 Key Configuration (`config.ts`)

| Key | Purpose |
|-----|---------|
| `API_BASEPATH` | Backend API base URL |
| `LOGIN_API_PATH` | `/Auth/Login` |
| `ADMIN_ROLES` | `['ADMIN', 'SUPERADMIN']` |
| `DEFAULT_LANGUAGE` | `LanguageType.English` |
| `DEFAULT_CURRENCY` | `CurrencyTypes.Dollar` |
| `PRODUCTS_PER_PAGE` | `10` |
| `FREE_SHIPPING_THRESHOLD` | `500` |

---

## 🤝 Contributing

Contributions are welcome. Please follow the existing code conventions:

- Use path aliases (`@root/`, `@dashboard/`, `@(home)/`, `@api/`) — never relative `../../` chains.
- Storefront uses Prettier (`bracketSpacing: false`, `singleQuote: true`, `bracketSameLine: true`).
- Dashboard uses MUI styling only.
- Do not commit `debugger;` statements or secrets.

---

## 📧 Contact

Ali Ahmadi — [info.aliahmadi@gmail.com](mailto: info.aliahmadi@gmail.com)
