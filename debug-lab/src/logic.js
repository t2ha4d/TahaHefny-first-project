export function searchProducts(list, query) {
  if (!query) return list;
  const q = query.trim().toLowerCase();
  return list.filter((p) => p.name.toLowerCase().includes(q));
}

export function filterByCategory(list, category) {
  if (!category || category === "all") return list;
  return list.filter((p) => p.category === category);
}

export function sortProducts(list, order) {
  const copy = [...list];
  if (order === "price-asc") copy.sort((a, b) => a.price - b.price);
  if (order === "price-desc") copy.sort((a, b) => b.price - a.price);
  return copy;
}

export function cartCount(cart) {
  return cart.reduce((n, item) => n + (item.qty || 1), 0);
}

export function cartTotal(cart, products) {
  return cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product ? product.price * (item.qty || 1) : 0);
  }, 0);
}
