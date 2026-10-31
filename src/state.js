// Cart state management and localStorage synchronization with pure state transitions.

const CART_STORAGE_KEY = "shopboard-cart";

/**
 * Safely loads the cart from localStorage.
 * Handles corrupt JSON gracefully without crashing.
 * @returns {Array} Array of cart item objects: [{ id, qty }].
 */
export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Could not parse saved cart state, resetting:", error);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (_) {
      // Ignore storage errors
    }
    return [];
  }
}

/**
 * Safely saves the cart array to localStorage as serialized JSON.
 * @param {Array} cart - Current cart array.
 */
export function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to persist cart to localStorage:", error);
  }
}

/**
 * Adds an item to the cart without creating duplicate entries.
 * Increments quantity if item already exists.
 * @param {Array} cart - Current cart array.
 * @param {number} id - Product ID.
 * @param {number} [qty=1] - Quantity to add.
 * @returns {Array} New cart array.
 */
export function addToCart(cart, id, qty = 1) {
  const numericId = Number(id);
  const existingIndex = cart.findIndex((item) => item.id === numericId);

  if (existingIndex > -1) {
    return cart.map((item, idx) =>
      idx === existingIndex ? { ...item, qty: (item.qty || 1) + qty } : item
    );
  }

  return [...cart, { id: numericId, qty }];
}

/**
 * Updates the quantity of a cart item.
 * Automatically removes items if the new quantity is 0 or less.
 * @param {Array} cart - Current cart array.
 * @param {number} id - Product ID.
 * @param {number} newQty - Target quantity.
 * @returns {Array} New cart array.
 */
export function updateQuantity(cart, id, newQty) {
  const numericId = Number(id);
  if (newQty <= 0) {
    return removeFromCart(cart, numericId);
  }

  return cart.map((item) =>
    item.id === numericId ? { ...item, qty: newQty } : item
  );
}

/**
 * Removes an item from the cart by product ID.
 * @param {Array} cart - Current cart array.
 * @param {number} id - Product ID.
 * @returns {Array} New cart array.
 */
export function removeFromCart(cart, id) {
  const numericId = Number(id);
  return cart.filter((item) => item.id !== numericId);
}

/**
 * Clears all items from the cart and clears localStorage.
 * @returns {Array} Empty array.
 */
export function clearCart() {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (_) {
    // Ignore storage errors
  }
  return [];
}

/**
 * Calculates total item count and monetary subtotal.
 * @param {Array} cart - Current cart array.
 * @param {Array} products - Catalog products array.
 * @returns {{ count: number, subtotal: number }}
 */
export function calculateCartTotals(cart, products) {
  const count = cart.reduce((total, item) => total + (item.qty || 1), 0);

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return sum;
    return sum + product.price * (item.qty || 1);
  }, 0);

  return { count, subtotal };
}

