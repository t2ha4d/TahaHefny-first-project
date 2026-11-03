# CLAUDE.md — Architecture & Engineering Rules

## 1. Project Overview & Tech Stack

**ShopBoard (NAVE)** is a modular, high-performance e-commerce catalog application built with strict enterprise engineering practices:

- **Language & Runtime:** TypeScript 5.6+ with `"strict": true` (zero `any`, zero `as`, zero `!`).
- **Build & Dev Server:** Vite 5 (instant HMR and production bundle optimization).
- **Styling:** Semantic HTML5 & Modern CSS3 Design Tokens (mobile-first, zero `!important`).
- **Code Quality:** ESLint 9 (Flat Config), Prettier 3, Husky 9, and Lint-Staged 15.

---

## 2. Project Directory Structure & Feature Placement

All codebase additions and refactoring must adhere to this explicit modular structure:

```text
├── .husky/                  # Git pre-commit hooks (typecheck + lint-staged)
├── public/                  # Compressed static assets (favicons, SVGs, logos)
├── src/
│   ├── types.ts             # Custom domain interfaces (Product, CartItem, CartState)
│   ├── products.ts          # Static product catalog definitions
│   ├── logic.ts             # Pure functions: search, category filter, sorting
│   ├── state.ts             # Cart state operations & safe localStorage persistence
│   ├── ui.ts                # DOM queries, HTML template builders, rendering helpers
│   └── main.ts              # App orchestrator, event delegation, lifecycle init
├── index.html               # Semantic HTML entry point linking to src/main.ts
├── style.css                # CSS variables, responsive typography, layout tokens
├── DESIGN.md                # System design tokens, color palette, responsive rules
├── tsconfig.json            # Strict TypeScript compiler configuration
├── eslint.config.js         # ESLint flat config disallowing any/assertions
├── package.json             # Scripts and dependencies
└── README.md                # Project documentation and developer commands
```

### Guidelines on Where New Features Go:

- **New Data Models / Types:** Declare clean interfaces in [`src/types.ts`](src/types.ts). Never define ad-hoc interfaces inside components.
- **Pure Algorithms & Data Transformations:** Place in [`src/logic.ts`](src/logic.ts). No DOM references or side effects allowed.
- **Cart & Persistence Operations:** Place in [`src/state.ts`](src/state.ts). Must be defensive against corrupted storage.
- **Visual Rendering & Templates:** Place in [`src/ui.ts`](src/ui.ts).
- **User Interactions & Event Wiring:** Wire up in [`src/main.ts`](src/main.ts) using static event delegation.

---

## 3. Strict AI Rules (Based on Common AI Mistakes)

### Rule 1: Zero `any`, Zero Type Assertions (`as`), Zero Non-Null Assertions (`!`)

- **Mistake Avoided:** AI models frequently bypass TypeScript's type checker using `as HTMLElement`, `!`, or `any` when querying the DOM or deserializing JSON.
- **Strict Rule:**
  - Never use `any` under any circumstance.
  - Never cast with `as` (e.g. `el as HTMLInputElement` or `data as Product[]`).
  - Never use the non-null assertion operator `!` (e.g. `document.querySelector(...)!`).
  - **Required Pattern:** Use runtime type guards (`instanceof HTMLElement`, `instanceof HTMLInputElement`), explicit null checks (`if (el !== null)`), and user-defined type predicates (`isCartItem(value: unknown): value is CartItem`).

### Rule 2: Strict Separation of Concerns — Zero DOM Access in Logic or State

- **Mistake Avoided:** AI models often mix DOM queries (`document.querySelector`) or alert dialogs inside mathematical logic and state modules.
- **Strict Rule:**
  - Modules [`src/logic.ts`](src/logic.ts) and [`src/state.ts`](src/state.ts) must be 100% decoupled from the browser DOM.
  - No `document`, `window`, `Element`, `HTMLElement`, or UI events may be referenced in `logic.ts` or `state.ts`.
  - All DOM querying and HTML generation belongs exclusively in [`src/ui.ts`](src/ui.ts), with handlers orchestrated in [`src/main.ts`](src/main.ts).

### Rule 3: Defensive State Persistence & Cart Integrity

- **Mistake Avoided:** AI models frequently overwrite cart items, produce duplicate IDs, allow zero or negative item quantities to remain in storage, or crash on invalid JSON in `localStorage`.
- **Strict Rule:**
  - Adding an existing item must cleanly increment `qty` rather than appending a duplicate entry.
  - Decreasing an item's quantity to `<= 0` must automatically purge the item from the state array.
  - All `localStorage` read and write calls must be wrapped in `try...catch` blocks with defensive runtime validation. Corrupt JSON must reset gracefully without crashing the UI.

### Rule 4: Event Delegation on Static Parents Over Inline Listeners

- **Mistake Avoided:** AI models frequently attach `addEventListener` to dynamically generated HTML elements inside loop functions, causing memory leaks and duplicated handlers on every filter or sort.
- **Strict Rule:**
  - Attach persistent event listeners to static parent containers (`#products-grid`, `#drawer-items-list`) only once during initialization in [`src/main.ts`](src/main.ts).
  - Use `event.target.closest('[data-action="..."]')` to intercept user clicks dynamically.

---

## 4. Verification & Quality Gates

Every contribution must cleanly pass:

1. `npm run typecheck` (`tsc --noEmit`) with 0 errors.
2. `npm run lint` (`eslint src`) with 0 warnings/errors.
3. `npm run build` (`vite build`) producing a clean distribution bundle.
