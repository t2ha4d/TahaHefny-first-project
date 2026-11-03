// Pure data manipulation functions for search, category filtering, and sorting.
import type { Product, SortOrder } from "./types";

/**
 * Searches products by name, category, or color (case-insensitive).
 * Pure function: does not mutate input or interact with DOM.
 */
export function searchProducts(
  list: readonly Product[],
  query: string
): readonly Product[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return list;
  }

  return list.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(q);
    const catMatch = p.category.toLowerCase().includes(q);
    const color = p.color;
    const colorMatch = color !== undefined && color.toLowerCase().includes(q);
    return nameMatch || catMatch || colorMatch;
  });
}

/**
 * Filters products by category name (case-insensitive).
 * Pure function: returns original array if category is 'all' or empty.
 */
export function filterByCategory(
  list: readonly Product[],
  category: string
): readonly Product[] {
  const target = category.trim().toLowerCase();
  if (target.length === 0 || target === "all") {
    return list;
  }
  return list.filter((p) => p.category.toLowerCase() === target);
}

/**
 * Sorts products by price ascending, descending, or preserves original order.
 * Pure function: creates a new array copy without mutating the input.
 */
export function sortProducts(
  list: readonly Product[],
  order: SortOrder | string
): readonly Product[] {
  const copy: Product[] = [...list];
  if (order === "price-asc") {
    return copy.sort((a, b) => a.price - b.price);
  }
  if (order === "price-desc") {
    return copy.sort((a, b) => b.price - a.price);
  }
  return copy;
}
