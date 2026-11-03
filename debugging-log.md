# Debugging Log

## Bug 1

- **What I saw:** The product grid loaded completely empty, and the browser DevTools console displayed a red runtime exception: `Uncaught ReferenceError: upadte is not defined at HTMLInputElement.<anonymous> (main.js:27)`.
- **Type:** runtime
- **How I found it:** Opened Chrome DevTools Console tab (F12) on page load. The red error message pointed directly to `main.js` line 27 with a full stack trace.
- **Cause:** A typographical error in `main.js`: the event handler invoked `upadte()` instead of the declared `update()` function, which threw an unhandled ReferenceError and halted JavaScript execution before rendering completed.
- **Fix:** Corrected the typo from `upadte()` to `update()` in `src/main.js`.
- **Did I use AI? For what?** No. Found directly by inspecting the browser console error message and stack trace.

## Bug 2

- **What I saw:** Searching for uppercase queries (e.g. "BAG" or "Coat") returned 0 products, even though those items existed in the store. Additionally, sorting by price mutated the original products array in place, preventing users from restoring the default featured order.
- **Type:** logic
- **How I found it:** Tested the search input with lowercase "bag" (which worked) and uppercase "Bag" (which failed). Used `console.log()` inside `searchProducts` and set a breakpoint in the Chrome DevTools Sources tab to inspect the query and product name comparisons.
- **Cause:** In `src/logic.js`, `searchProducts` performed a direct `p.name.includes(query)` check without converting both strings to lowercase. In `sortProducts`, the function called `.sort()` directly on the input array, mutating the reference rather than sorting a shallow copy (`[...list]`).
- **Fix:** Normalized both the search query and the product name with `.toLowerCase().trim()` in `searchProducts`. In `sortProducts`, created a shallow copy with `const copy = [...list]` before sorting and added a fallback branch that returns the unmodified copy when default order is selected.
- **Did I use AI? For what?** No. Found by testing case sensitivity in the search input and inspecting array mutation in the debugger.

## Bug 3

- **What I saw:** After adding items to the shopping cart, the count updated, but refreshing the page reset the cart to 0 or caused products to disappear. Inspecting Local Storage in the DevTools Application tab showed `shopboard-cart: [object Object]`. Adding the same item multiple times also pushed duplicate objects into the cart array instead of updating quantity.
- **Type:** state
- **How I found it:** Opened Chrome DevTools Application tab > Storage > Local Storage, examined the value of `shopboard-cart`, and tested page reload behavior with items added.
- **Cause:** In `src/state.js`, `saveCart` attempted to write the cart array directly to `localStorage` without stringifying it (`localStorage.setItem(KEY, cart)`), which converted the array into the invalid string `"[object Object]"`. Upon page reload, `JSON.parse` crashed on this string. Furthermore, `addToCart` used `.push(item)` directly without checking if an item with that `id` already existed to increment its `qty`.
- **Fix:** Serialized data properly using `JSON.stringify(cart)` in `saveCart()`. Wrapped `loadCart()` in a `try...catch` block to handle corrupt data gracefully by resetting to `[]`. Refactored `addToCart()` to check if the product ID is already in the cart: if found, cleanly increment its `qty`; if not, append `{ id, qty: 1 }`.
- **Did I use AI? For what?** No. Discovered by verifying the serialized storage value in the Application tab and monitoring cart state changes across page reloads.
