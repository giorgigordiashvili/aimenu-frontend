# Restaurant Frontend - Project Documentation

This is a Next.js 16 restaurant menu and ordering platform with multi-language
support.

## CRITICAL: API Client Usage

**Always use the auto-generated API client in `src/api/generated/`** for all
backend interactions (types, interfaces, and API functions). Do NOT hand-write
request code or redefine these types elsewhere.

- **Never edit files inside `src/api/generated/`** — they are fully overwritten
  on regeneration.
- API types and functions are produced by the `@gordela/api-generator` npm
  package.
- To regenerate after backend/OpenAPI changes, run:

  ```bash
  npm run generate:api
  ```

- If an endpoint or field appears missing, regenerate first before writing
  workarounds.

## Project Overview

A digital restaurant menu system that allows customers to browse menus, view
product details, and manage their cart. Designed for QR code scanning at
restaurant tables.

## Technology Stack

- **Framework:** Next.js 16 with App Router and TypeScript
- **React:** Version 19.2.0
- **State Management:** React Context (Cart, Table, Locale)
- **Data Fetching:** SWR for API calls
- **Styling:** CSS Modules
- **Analytics:** Microsoft Clarity
- **API:** Auto-generated API client using @gordela/api-generator

## Project Structure

```
src/
├── api/                    # API layer
│   ├── axios.ts            # Axios configuration
│   └── generated/          # Auto-generated API client (DO NOT EDIT)
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   └── [locale]/           # Localized routes
│       ├── page.tsx        # Homepage (restaurant list)
│       ├── register/       # Restaurant registration
│       └── restaurant/     # Restaurant pages
│           └── [slug]/     # Dynamic restaurant routes
├── components/             # Reusable UI components
│   ├── BackButton/
│   ├── CartButton/
│   ├── CategoryList/
│   ├── CategoryTabs/
│   ├── ClarityProvider/
│   ├── Header/
│   ├── LanguageSwitcher/
│   ├── ProductCard/
│   ├── ProductDetailModal/
│   ├── RegisterForm/
│   ├── RestaurantCard/
│   ├── RestaurantInfo/
│   ├── SearchBar/
│   ├── Skeleton/
│   └── TableIndicator/
├── context/                # React Context providers
│   ├── CartContext.tsx     # Shopping cart state
│   ├── LocaleContext.tsx   # Language/locale state
│   └── TableContext.tsx    # Table number state
├── hooks/                  # Custom React hooks
│   ├── useDebounce.ts
│   ├── useMenuData.ts
│   └── useRestaurants.ts
├── i18n/                   # Internationalization
│   ├── config.ts           # Language configuration
│   └── getDictionary.ts    # Translation loader
├── middleware.ts           # Next.js middleware (locale routing)
└── utils/                  # Utility functions
    └── translations.ts
```

## Multi-Language Support

Supported languages:

- **Georgian (ka)** - Default
- **English (en)**
- **Russian (ru)**

Translation files are located in the i18n directory.

## Development Guidelines

### Component Structure

Each component should follow this structure:

```
ComponentName/
├── ComponentName.tsx       # Main component file
├── ComponentName.module.css # Component styles (if needed)
└── index.ts                # Export barrel
```

### Code Quality Standards

**IMPORTANT:** Before committing ANY code, always run:

```bash
npm run validate
```

This runs all quality checks: TypeScript type checking, ESLint, and Prettier
formatting.

### Available Scripts

| Script                 | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Start development server                         |
| `npm run build`        | Production build                                 |
| `npm run start`        | Start production server                          |
| `npm run lint`         | Run ESLint                                       |
| `npm run lint:fix`     | Run ESLint with auto-fix                         |
| `npm run type-check`   | TypeScript type checking                         |
| `npm run format`       | Format code with Prettier                        |
| `npm run format:check` | Check code formatting                            |
| `npm run validate`     | Run all quality checks (REQUIRED before pushing) |
| `npm run generate:api` | Regenerate API client                            |

### Coding Conventions

1. **TypeScript:** Use strict typing, avoid `any` where possible
2. **Components:** Use functional components with hooks
3. **Styling:** Use CSS Modules for component-specific styles
4. **State:** Use SWR for server state, Context for UI state
5. **Imports:** Follow import ordering (external, internal, relative)

### ESLint Rules

The project enforces:

- No `console.log` in production code (use `console.warn` or `console.error` if
  needed)
- No unused variables (prefix with `_` if intentionally unused)
- Consistent import ordering
- React hooks rules (exhaustive deps)
- TypeScript best practices
- No `any` types (warning)
- Self-closing components

### Prettier Configuration

Code formatting settings:

- **Semicolons:** Yes
- **Quotes:** Single quotes
- **Print Width:** 100 characters
- **Tab Width:** 2 spaces
- **Trailing Comma:** ES5 style
- **JSX Quotes:** Single quotes

---

## Git Workflow & Push Rules

### CRITICAL: Before Pushing Code

**NEVER push code without running validation first:**

```bash
# Run this BEFORE every commit
npm run validate
```

If validation fails:

1. Fix TypeScript errors: Check the error output and fix type issues
2. Fix ESLint errors: Run `npm run lint:fix` for auto-fixable issues
3. Fix formatting: Run `npm run format` to auto-format

### Branch Naming Convention

Use descriptive branch names following this pattern:

- `feature/short-description` - For new features
- `fix/short-description` - For bug fixes
- `refactor/short-description` - For code refactoring
- `docs/short-description` - For documentation updates

Examples:

- `feature/add-cart-checkout`
- `fix/product-modal-scroll`
- `refactor/category-tabs`

### Commit Message Format

Use clear, descriptive commit messages:

```
<type>: <short description>

[optional body with more details]
```

Types:

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `style` - Formatting changes
- `docs` - Documentation
- `test` - Tests
- `chore` - Maintenance tasks

Examples:

- `feat: Add product search functionality`
- `fix: Resolve cart quantity update issue`
- `refactor: Simplify category navigation logic`

### Pull Request Guidelines

1. **Create from feature branch** - Never commit directly to `main`
2. **Include description** - Explain what changes were made and why
3. **Reference issues** - Link to related issues or tickets
4. **Request review** - Get at least one code review before merging
5. **Ensure CI passes** - All checks must be green

**Claude Code working preference:** once the user has approved a change (asked
for it directly, said "merge it", or similar), push straight to `main` instead
of branch → PR → merge. The branch/PR dance exists for review, and when the user
has already signed off there's no review gained. Reserve branches for large or
risky changes that the user explicitly wants to inspect before shipping.

### Pre-Push Checklist

Before pushing code, verify:

- [ ] `npm run validate` passes with no errors
- [ ] `npm run build` completes successfully
- [ ] New components follow the component structure pattern
- [ ] No hardcoded strings (use translations)
- [ ] No `console.log` statements (use `console.warn` or `console.error` if
      needed)
- [ ] No commented-out code
- [ ] No TODO comments without associated issues

---

## API Integration

API client is auto-generated. To regenerate after API changes:

```bash
npm run generate:api
```

**IMPORTANT:** Never manually edit files in `src/api/generated/`

## Route Structure

| Route                                               | Description                   |
| --------------------------------------------------- | ----------------------------- |
| `/[locale]`                                         | Homepage with restaurant list |
| `/[locale]/register`                                | Restaurant registration page  |
| `/[locale]/restaurant/[slug]`                       | Restaurant menu page          |
| `/[locale]/restaurant/[slug]/category/[categoryId]` | Category-specific view        |

## Environment Variables

Required environment variables (see `.env.example`):

- API endpoint configuration
- Microsoft Clarity ID

**NEVER commit `.env` files or expose secrets in code.**

---

## Security Guidelines

1. **No secrets in code** - Use environment variables
2. **Validate inputs** - Especially user-provided data
3. **Sanitize outputs** - Prevent XSS attacks
4. **Use HTTPS** - All API calls should use secure connections
5. **No eval()** - Never use eval or similar unsafe functions

---

## Performance Guidelines

1. **Lazy load components** - Use dynamic imports for large components
2. **Optimize images** - Use Next.js Image component
3. **Minimize bundle size** - Check imports, avoid large dependencies
4. **Use SWR caching** - Leverage stale-while-revalidate pattern

---

## Troubleshooting

### Common Issues

**ESLint errors on generated files:** Generated API files are excluded from
linting. If you see errors, check that `src/api/generated/**` is in the ignore
list.

**Type errors after API regeneration:** Run `npm run type-check` to identify
issues. You may need to update component types to match new API interfaces.

**Formatting conflicts:** Run `npm run format` to auto-fix formatting issues. If
conflicts persist, check your editor's Prettier settings match the project
configuration.

---

## Working across the Telos apps (the three siblings)

This frontend is one of three apps that share the `restaurant_platform` backend:

| App              | Path                                              | Purpose                                                             | DO app id                              | Deploy trigger                                                                                               |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Customer web     | `~/Telos/restaurant-frontend` → `aimenu.ge`       | Guests browse menus, book, order, see loyalty                       | `757f027d-ad10-4dd3-be1b-a955842ebc87` | Auto on push to main (GitHub integration)                                                                    |
| POS (Expo web)   | `~/Telos/aimenu-pos` → `pos.aimenu.ge`            | Staff accept reservations, run kitchen kanban, redeem loyalty codes | `00d9f4f3-73c1-4d32-bff9-158f3cda290f` | **Manual** — `doctl apps create-deployment <id>` (spec uses `git:` source, not `github:`, so no auto-deploy) |
| Backend (Django) | `~/Telos/restaurant_platform` → `admin.aimenu.ge` | DRF API, Django admin                                               | `3076a3a7-33de-4587-949c-1cf87ac5fbed` | Auto on push to main                                                                                         |

The **`telos` doctl context** (created via `DIGITALOCEAN_ACCESS_TOKEN` env var
in `.env`) has the aimenu-_ apps. The default `doctl` profile on this machine
only has `echodesk-_`; check with `doctl account get`before running any`doctl
apps ...` command to avoid hitting the wrong account.

## Multi-tenant API: `X-Restaurant` header

Dashboard endpoints (`/api/v1/dashboard/**`) are tenant-scoped by
`apps/core/middleware/tenant.py`. The middleware reads **`X-Restaurant`** from
request headers (or falls back to subdomain); without it, views raise 404 via
`@require_restaurant`.

- The POS injects the slug on every request via axios interceptor in
  `src/api/client.ts`. Slug is stored alongside tokens on login and editable
  from Settings.
- Backend's `CORS_ALLOW_HEADERS` in `config/settings/base.py` must include
  `x-restaurant` or the browser preflight will block POS requests with a
  misleading CORS error.
- The allowlist regex `^https://.*\.aimenu\.ge$` in `config/settings/prod.py`
  already covers `pos.aimenu.ge`; the DO default URL
  (`aimenu-pos-*.ondigitalocean.app`) is **not** covered — tell users to use the
  custom domain.

## Auth endpoints: login is `/login/` not `/token/`

`apps/accounts/urls.py` exposes:

- `POST /api/v1/auth/login/` — obtain JWT pair
- `POST /api/v1/auth/token/refresh/` — refresh access token
- `POST /api/v1/auth/register/` — new customer signup

There's no `/api/v1/auth/token/` endpoint. If you hit 404, check the path.

## Django migration gotcha — check deps before pushing

`manage.py makemigrations <app>` scans **all** installed apps and silently
generates migrations for any model whose Meta / field definitions drifted since
the last migration. This is the case with the translation-model Meta options on
`menu`, `tenants`, `staff` — there is always drift.

Your new `<app>/migrations/0001_initial.py` will reference those
freshly-generated parents in its `dependencies = [...]` list. If you delete the
unrelated migrations (because they're not yours to merge), the dep becomes
**dangling** and `python manage.py migrate` fails on DO with
`NodeNotFoundError`. DO then auto-rolls-back.

Workflow when adding a new app:

1. `source .venv/bin/activate && python manage.py makemigrations <newapp>`
2. `git status` — note any other apps' migrations that showed up.
3. Open your new migration and **change `dependencies`** to point at the
   already-merged parents on `main` (e.g. `menu.0002_...`, `tenants.0009_...`)
   instead of the freshly-generated noise.
4. Delete the unrelated migrations that `makemigrations` produced.
5. **Verify** with `DATABASE_URL=sqlite:///t.db python manage.py migrate --plan`
   (sqlite has quirks with postgres-specific schema so full `migrate` may fail
   on unrelated apps — `--plan` is enough to confirm the graph is consistent).
6. Or, better:
   `docker compose -f ~/Telos/restaurant_platform/docker-compose.yml up -d db`
   (pick a non-5432 port if other postgres instances are running) then
   `DATABASE_URL=postgres://...@localhost:<port>/db python manage.py migrate`.

`manage.py check` does **not** catch this — it only validates Python imports and
model field definitions.

## API regeneration flow

The backend exposes the OpenAPI spec at `https://admin.aimenu.ge/api/schema/`
via drf-spectacular. Both the customer frontend and POS use
`@gordela/api-generator` (script: `npm run generate:api`). Env vars come from
`.env`:

```
API_URL=https://admin.aimenu.ge
SWAGGER_PATH=/api/schema
API_NAMESPACE=Api
OUTPUT_DIR=./src/api/generated
```

**After backend schema changes:**

1. Deploy backend (auto on push to main).
2. Wait for `ACTIVE` on DO before regenerating (the spec endpoint serves the new
   deploy's schema).
3. `cd ~/Telos/restaurant-frontend && npm run generate:api`
4. `cd ~/Telos/aimenu-pos && npm run generate:api`
5. Both `src/api/generated/*` checked in.

**Always regenerate when a backend PR lands.** Don't leave the frontend on a
hand-written axios stub and the generated client drifting behind — this is the
single biggest source of "why does this endpoint not exist in TypeScript"
surprises. The workflow is:

1. Merge the backend PR, wait for DO `ACTIVE`.
2. `npm run generate:api` immediately — commit the regenerated
   `src/api/generated/*` even if no frontend code needs it yet.
3. Swap any temporary hand-written axios calls to the typed helper in the same
   commit or the next one.

Skipping step 2 makes every follow-up PR re-discover the drift.

**Gotcha:** if a DRF APIView uses `request.data` without an explicit
`@extend_schema(request=<Serializer>)`, the generator emits a no-arg function
(e.g. `dashboardLoyaltyRedeemConfirmCreate(): Promise<any>`). Add a
`@extend_schema(request=<Serializer>)` decorator to the view so the generator
can type the body, or keep a thin hand-written wrapper in `src/api/<thing>.ts`
(POS uses `src/api/loyalty.ts` for exactly this reason).

## TanStack Query freshness (POS)

The POS is tuned for continuous freshness (defaults in `app/_layout.tsx`):

- `refetchOnWindowFocus: 'always'` + `refetchOnReconnect: 'always'`.
- React Native AppState is bridged into `focusManager.setFocused(...)` so the
  iPad refetches when the app regains focus (React Native alone doesn't wire
  this up).
- Polling per-screen: 5 s orders board, 10 s order detail / reservations today,
  15 s reservation detail, 30 s reservations upcoming / orders history. All with
  `refetchIntervalInBackground: false` to pause on hidden tabs.
- **Cross-invalidation** matters: reservation accept/reject/seat → invalidate
  `orders-board` (backend's kitchen-filter gates on reservation status). Order
  status changes → invalidate `reservations-today/upcoming` (their
  `pre_order_summary` is derived from Order.total).

## Drag-and-drop kanban

POS orders board uses **`@hello-pangea/dnd`** (same library echodesk uses) on
the web path. React-native-gesture-handler Pan + Reanimated was the first
attempt; dropped because `measureInWindow` gave unreliable bounds for
cross-column drop detection on react-native-web. On native (iPad)
`@hello-pangea/dnd` isn't supported — the kanban falls back to non-DnD columns
and users advance status via the order detail screen.

## Pigment CSS styled with dynamic props

Don't do this (type-checks fail):

```ts
const Dot = styled('span')<{ filled: boolean }>(({ filled }) => ({
  backgroundColor: filled ? primary : '#F3F4F6',
}));
```

Do this instead — attribute selectors:

```ts
const Dot = styled('span')({
  backgroundColor: '#F3F4F6',
  '&[data-filled="true"]': { backgroundColor: primary },
});
// <Dot data-filled={isFilled ? 'true' : undefined} />
```

## Sandbox authorization quirks (Claude Code)

For this project the harness:

- Blocks direct `git push` to backend `main` until you explicitly say "merge it"
  or similar. Same for opening PRs via `gh`.
- Blocks `gh repo edit --visibility public` unless the user types a clear
  consent phrase quoting the repo name.
- Blocks direct production DB queries (`psql`) even with credentials — use the
  Django shell via `docker compose exec web` or the admin UI instead.

When in doubt, push as a branch + let the user merge. Never amend published
commits.
