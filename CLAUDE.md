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
