const KEY = "shopboard-cart";

export function loadCart() {
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Could not parse saved cart, resetting:", e);
    localStorage.removeItem(KEY);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Failed to save cart to localStorage:", e);
  }
}

export function addToCart(cart, id) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    return cart.map((i) => (i.id === id ? { ...i, qty: (i.qty || 1) + 1 } : i));
  }
  return [...cart, { id, qty: 1 }];
}
