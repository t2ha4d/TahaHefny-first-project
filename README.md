# NAVE · Autumn Essentials & Capsule Wardrobe

A high-performance, modular e-commerce web application inspired by high-end fashion editorial layouts. Engineered with strict TypeScript, Vite, responsive mobile-first CSS, and defensive state architecture.

![NAVE Autumn Essentials](public/favicon.svg)

---

## Key Features

- **Editorial Fashion Experience:** Curated autumn capsule collection featuring coats, knitwear, dresses, tailored trousers, boots, and leather bags.
- **Dynamic Catalog Filtering:**
  - Fast case-insensitive search matching title, category, and color palette.
  - Multi-category filtering via toolbar buttons and visual circular thumbnail selectors.
  - Sorting by Price (Ascending / Descending) and Default editorial arrangement.
- **Defensive Cart & Bag State:**
  - Slide-over wardrobe bag drawer with real-time totals and item counts.
  - Incremental quantity controls with automatic item purging when quantity reaches zero.
  - Duplicate prevention and robust `localStorage` synchronization with runtime type guards.
- **Strict Accessibility & Mobile-First Standards:**
  - Zero horizontal scroll verified down to `360px` mobile viewport width.
  - Exactly one `<h1>` landmark, structured semantic HTML5, and accessible `<label>` elements for all inputs.
  - `aria-live="polite"` region for dynamic catalog updates and keyboard-accessible drawer navigation (`Escape` key support).

---

## Architecture & Codebase Structure

The project strictly decouples presentation, business logic, and state management:

```text
├── .husky/                  # Git pre-commit hooks (typecheck + lint-staged)
├── public/                  # Compressed assets (favicon.svg, brand-crest.svg)
├── src/
│   ├── types.ts             # Domain interfaces (Product, CartItem, CartState, CartTotals)
│   ├── products.ts          # Strongly typed product catalog data
│   ├── logic.ts             # Pure computation: search, filter, and sort (zero DOM access)
│   ├── state.ts             # State transitions, quantity controls & localStorage sync
│   ├── ui.ts                # Template generation and DOM element manipulators
│   └── main.ts              # Event delegation, UI synchronization, and lifecycle init
├── index.html               # Semantic HTML entry point linking to src/main.ts
├── style.css                # Design system variables, mobile-first responsive styles
├── DESIGN.md                # System design tokens, color palette, typography, layout rules
├── CLAUDE.md                # Engineering constraints, strict AI rules, and architecture specs
├── tsconfig.json            # Strict TypeScript configuration ("strict": true)
├── eslint.config.js         # ESLint flat config enforcing zero `any` and zero non-null assertions
└── package.json             # NPM package scripts and dev tooling
```

---

## Strict TypeScript Implementation

The TypeScript setup is configured with `"strict": true` and enforces strict quality constraints:

- **Zero `any`:** All types are cleanly modeled with custom TypeScript interfaces.
- **Zero Type Assertions (`as`):** No type casting used. Runtime narrowing is achieved via `instanceof HTMLElement`, `instanceof HTMLInputElement`, and user-defined type predicates.
- **Zero Non-Null Assertions (`!`):** No forced non-null operators. All DOM queries and optional properties check nullability defensively.

---

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or pnpm

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development Server

Start the local Vite development server with instant HMR:

```bash
npm run dev
```

### Type Checking

Run the TypeScript compiler in check mode (zero emissions):

```bash
npm run typecheck
```

### Linting & Formatting

Validate code formatting and ESLint rules:

```bash
# Run ESLint across TypeScript modules
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Verify formatting without writing
npm run format:check
```

### Production Build

Bundle and optimize assets for production deployment:

```bash
npm run build
```

The compiled output will be generated inside the `dist/` directory.

---

## Quality Tooling & Pre-Commit Hooks

Pre-commit checks are powered by **Husky** and **lint-staged**. Every Git commit automatically triggers:

1. `npm run typecheck` (`tsc --noEmit`) to ensure 0 TypeScript compilation errors.
2. `lint-staged` running ESLint `--fix` and Prettier formatting on staged files.

---

## License

MIT © 2026 NAVE Autumn Essentials
