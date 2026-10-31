# CLAUDE.md

## Project
ShopBoard: An architectural, modular e-commerce web application built with vanilla HTML5, modern CSS, and ES Modules (ESM) bundled and served with Vite.

## Strict AI Assistance & Architecture Rules
1. **Separation of Concerns & Pure Logic Modules**:
   - Do not query or manipulate DOM elements inside `logic.js` or `state.js` modules. All `document.querySelector`, class manipulations, and DOM element writes must live strictly in `ui.js` and `main.js`.
   - All functions in `src/logic.js` must be pure functions: deterministic, returning new arrays or values without mutating input parameters or relying on outside state.

2. **Cart State Integrity & Local Storage Persistence**:
   - Maintain cart state integrity in local storage without duplicate product entries.
   - When adding an existing item to the cart, cleanly increment its quantity (`qty`).
   - When updating quantities, ensure items with 0 or negative quantity are immediately removed from the cart.
   - Always wrap `localStorage.getItem` and `localStorage.setItem` in `try...catch` blocks with safe JSON parsing and fallback defaults to prevent state corruption.

3. **Event Delegation on Static Parent Containers**:
   - Use event delegation on static parent elements (e.g. the products grid and cart drawer containers) instead of adding inline event listeners repeatedly inside render loops.
   - Avoid creating multiple duplicate event listeners on re-render cycles to prevent memory leaks and erratic UI behavior.

4. **Semantic HTML & Clean CSS Standards**:
   - Follow strict semantic HTML: use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`. Exactly one `<h1>` per page.
   - Every input element must have an accessible `<label>`.
   - Write mobile-first CSS with `min-width` media queries only. Never use `!important`.
   - Explain any new file created in one line at the top of the file.

