// Cart state management and localStorage synchronization.
import type { CartItem, CartState, CartTotals, Product } from "./types";

const CART_STORAGE_KEY = "shopboard-cart";

/**
 * Runtime type guard to safely validate cart item shapes without assertions.
 */
function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value;
  const hasId =
    "id" in candidate &&
    typeof candidate.id === "number" &&
    Number.isFinite(candidate.id);
  const hasQty =
    "qty" in candidate &&
    typeof candidate.qty === "number" &&
    Number.isFinite(candidate.qty) &&
    candidate.qty > 0;

  return hasId && hasQty;
}

/**
 * Safely loads the cart from localStorage with type guard validation.
 */
export function loadCart(): readonly CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw === null || raw.length === 0) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const validItems: CartItem[] = [];
      for (const entry of parsed) {
        if (isCartItem(entry)) {
          validItems.push({ id: entry.id, qty: entry.qty });
        }
      }
      return validItems;
    }
    return [];
  } catch (error) {
    const message = error instanceof Error ? error.message : "Corrupt JSON";
    console.warn("Could not parse saved cart state, resetting:", message);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Storage unavailable
    }
    return [];
  }
}

/**
 * Safely persists the cart items array to localStorage.
 */
export function saveCart(cart: readonly CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Storage quota";
    console.error("Failed to persist cart to localStorage:", message);
  }
}

/**
 * Adds an item to the cart without duplicates, cleanly incrementing quantity.
 */
export function addToCart(
  cart: readonly CartItem[],
  id: number,
  qty = 1
): readonly CartItem[] {
  const numericId = Math.floor(id);
  const addition = Math.max(1, Math.floor(qty));
  const existingIndex = cart.findIndex((item) => item.id === numericId);

  if (existingIndex > -1) {
    return cart.map((item, idx) => {
      if (idx === existingIndex) {
        return { id: item.id, qty: item.qty + addition };
      }
      return item;
    });
  }

  return [...cart, { id: numericId, qty: addition }];
}

/**
 * Updates item quantity; automatically removes items when target quantity is <= 0.
 */
export function updateQuantity(
  cart: readonly CartItem[],
  id: number,
  newQty: number
): readonly CartItem[] {
  const numericId = Math.floor(id);
  const targetQty = Math.floor(newQty);
  if (targetQty <= 0) {
    return removeFromCart(cart, numericId);
  }

  return cart.map((item) => {
    if (item.id === numericId) {
      return { id: item.id, qty: targetQty };
    }
    return item;
  });
}

/**
 * Removes an item from the cart by its product ID.
 */
export function removeFromCart(
  cart: readonly CartItem[],
  id: number
): readonly CartItem[] {
  const numericId = Math.floor(id);
  return cart.filter((item) => item.id !== numericId);
}

/**
 * Clears all items from the cart and removes persisted state.
 */
export function clearCart(): readonly CartItem[] {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Storage error";
    console.warn("Could not clear cart storage:", message);
  }
  return [];
}

/**
 * Calculates total item count and monetary subtotal.
 */
export function calculateCartTotals(
  cart: readonly CartItem[],
  catalog: readonly Product[]
): CartTotals {
  let count = 0;
  let subtotal = 0;

  for (const item of cart) {
    count += item.qty;
    const product = catalog.find((p) => p.id === item.id);
    if (product !== undefined) {
      subtotal += product.price * item.qty;
    }
  }

  return { count, subtotal };
}

/**
 * Returns complete CartState combining items with calculated totals.
 */
export function getCartState(
  cart: readonly CartItem[],
  catalog: readonly Product[]
): CartState {
  const totals = calculateCartTotals(cart, catalog);
  return {
    items: cart,
    count: totals.count,
    subtotal: totals.subtotal,
  };
}
