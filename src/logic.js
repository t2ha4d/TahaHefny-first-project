// Pure data manipulation functions for search, category filtering, and sorting.

/**
 * Searches products by name, category, or color (case-insensitive).
 * Pure function: does not mutate input or interact with DOM.
 * @param {Array} list - Array of product objects.
 * @param {string} query - Search term.
 * @returns {Array} Filtered products array.
 */
export function searchProducts(list, query) {
  if (!query || typeof query !== "string") return list;
  const q = query.trim().toLowerCase();
  if (!q) return list;

  return list.filter((p) => {
    const nameMatch = p.name ? p.name.toLowerCase().includes(q) : false;
    const catMatch = p.category ? p.category.toLowerCase().includes(q) : false;
    const colorMatch = p.color ? p.color.toLowerCase().includes(q) : false;
    return nameMatch || catMatch || colorMatch;
  });
}

/**
 * Filters products by exact category name (case-insensitive).
 * Pure function: returns original array if category is 'all' or empty.
 * @param {Array} list - Array of product objects.
 * @param {string} category - Category name.
 * @returns {Array} Filtered products array.
 */
export function filterByCategory(list, category) {
  if (!category || category === "all") return list;
  const target = category.trim().toLowerCase();
  return list.filter((p) => (p.category ? p.category.toLowerCase() === target : false));
}

/**
 * Sorts products without mutating the original array.
 * Preserves default original array order when order is not specified.
 * @param {Array} list - Array of product objects.
 * @param {string} order - 'price-asc', 'price-desc', or 'default'.
 * @returns {Array} New sorted shallow copy of the array.
 */
export function sortProducts(list, order) {
  const copy = [...list];
  if (order === "price-asc") {
    return copy.sort((a, b) => a.price - b.price);
  }
  if (order === "price-desc") {
    return copy.sort((a, b) => b.price - a.price);
  }
  // Default: preserve original order
  return copy;
}

