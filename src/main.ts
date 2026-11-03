// Application orchestrator: wires logic, state, UI, and event delegation.

import { products } from "./products";
import { searchProducts, filterByCategory, sortProducts } from "./logic";
import {
  loadCart,
  saveCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  calculateCartTotals,
} from "./state";
import {
  renderProducts,
  renderCatalogCount,
  renderCart,
  toggleCartDrawer,
  flashButtonSuccess,
  updateActiveCategoryUI,
} from "./ui";
import type { CartItem, SortOrder } from "./types";

// Application State
let cart: readonly CartItem[] = loadCart();
let activeCategory = "all";
let searchQuery = "";
let sortOrder: SortOrder | string = "default";

// Static DOM Container Elements (Resolved via safe runtime type guards)
const rawProductsGrid = document.getElementById("products-grid");
const productsGrid = rawProductsGrid instanceof HTMLElement ? rawProductsGrid : null;

const rawCatalogBadge = document.getElementById("catalog-count-badge");
const catalogCountBadge = rawCatalogBadge instanceof HTMLElement ? rawCatalogBadge : null;

const rawSearchInput = document.getElementById("search-input");
const searchInput = rawSearchInput instanceof HTMLInputElement ? rawSearchInput : null;

const categoryFilterBtns = document.querySelectorAll(".cat-filter-btn");
const categoryCircles = document.querySelectorAll(".category-circle-item");

const rawSortSelect = document.getElementById("sort-select");
const sortSelect = rawSortSelect instanceof HTMLSelectElement ? rawSortSelect : null;

// Cart Elements
const rawHeaderCartBadge = document.getElementById("header-cart-badge");
const headerCartBadge =
  rawHeaderCartBadge instanceof HTMLElement ? rawHeaderCartBadge : null;

const rawOpenCartBtn = document.getElementById("open-cart-btn");
const openCartBtn = rawOpenCartBtn instanceof HTMLElement ? rawOpenCartBtn : null;

const rawCloseCartBtn = document.getElementById("close-cart-btn");
const closeCartBtn = rawCloseCartBtn instanceof HTMLElement ? rawCloseCartBtn : null;

const rawCartBackdrop = document.getElementById("cart-drawer-backdrop");
const cartBackdrop = rawCartBackdrop instanceof HTMLElement ? rawCartBackdrop : null;

const rawDrawerItemsList = document.getElementById("drawer-items-list");
const drawerItemsList =
  rawDrawerItemsList instanceof HTMLElement ? rawDrawerItemsList : null;

const rawDrawerSubtotalVal = document.getElementById("drawer-subtotal-val");
const drawerSubtotalVal =
  rawDrawerSubtotalVal instanceof HTMLElement ? rawDrawerSubtotalVal : null;

const rawCheckoutActionBtn = document.getElementById("checkout-action-btn");
const checkoutActionBtn =
  rawCheckoutActionBtn instanceof HTMLElement ? rawCheckoutActionBtn : null;

const rawQuickSearchTrigger = document.getElementById("quick-search-trigger");
const quickSearchTrigger =
  rawQuickSearchTrigger instanceof HTMLElement ? rawQuickSearchTrigger : null;

/**
 * Updates the catalog display through the pure logic pipeline.
 */
function updateCatalog(): void {
  let list = searchProducts(products, searchQuery);
  list = filterByCategory(list, activeCategory);
  list = sortProducts(list, sortOrder);

  renderProducts(productsGrid, list);
  renderCatalogCount(catalogCountBadge, list.length);
}

/**
 * Recalculates cart totals, updates UI, and persists to localStorage.
 */
function updateCart(): void {
  const totals = calculateCartTotals(cart, products);
  renderCart(
    {
      badgeEl: headerCartBadge,
      listEl: drawerItemsList,
      subtotalEl: drawerSubtotalVal,
    },
    cart,
    products,
    totals
  );
  saveCart(cart);
}

/**
 * Changes active category across buttons and triggers catalog re-render.
 */
function handleCategoryChange(category: string): void {
  activeCategory = category.length > 0 ? category : "all";
  updateActiveCategoryUI(categoryFilterBtns, categoryCircles, activeCategory);
  updateCatalog();
}

/**
 * Sets up event listeners with event delegation on static parent elements.
 */
function setupEventDelegation(): void {
  // 1. Event Delegation on Products Grid (Add to Bag & Wishlist toggles)
  if (productsGrid !== null) {
    productsGrid.addEventListener("click", (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) {
        return;
      }

      // Add to Bag action
      const addBtn = target.closest('[data-action="add"]');
      if (addBtn instanceof HTMLElement) {
        const idAttr = addBtn.getAttribute("data-add-id");
        if (idAttr !== null) {
          const id = Number(idAttr);
          if (Number.isFinite(id) && id > 0) {
            cart = addToCart(cart, id, 1);
            updateCart();
            flashButtonSuccess(addBtn, "Added ✓", "Add to Bag", 900);
          }
        }
        return;
      }

      // Wishlist Heart action
      const wishBtn = target.closest('[data-action="wishlist"]');
      if (wishBtn instanceof HTMLElement) {
        wishBtn.classList.toggle("active");
      }
    });
  }

  // 2. Event Delegation on Cart Drawer (Quantity adjustments and Item removal)
  if (drawerItemsList !== null) {
    drawerItemsList.addEventListener("click", (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) {
        return;
      }

      const actionBtn = target.closest("[data-action]");
      if (!(actionBtn instanceof HTMLElement)) {
        return;
      }

      const action = actionBtn.getAttribute("data-action");
      const idAttr = actionBtn.getAttribute("data-id");
      if (action === null || idAttr === null) {
        return;
      }

      const id = Number(idAttr);
      if (!Number.isFinite(id) || id <= 0) {
        return;
      }

      const currentItem = cart.find((i) => i.id === id);
      const currentQty = currentItem !== undefined ? currentItem.qty : 1;

      if (action === "increment") {
        cart = updateQuantity(cart, id, currentQty + 1);
        updateCart();
      } else if (action === "decrement") {
        cart = updateQuantity(cart, id, currentQty - 1);
        updateCart();
      } else if (action === "remove") {
        cart = removeFromCart(cart, id);
        updateCart();
      }
    });
  }

  // 3. Search Input Listener
  if (searchInput !== null) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value;
      updateCatalog();
    });
  }

  // 4. Category Filter Buttons (Toolbar pills)
  for (const btn of categoryFilterBtns) {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-category");
      handleCategoryChange(cat !== null ? cat : "all");
    });
  }

  // 5. Circular Category Thumbnails
  for (const circle of categoryCircles) {
    circle.addEventListener("click", () => {
      const cat = circle.getAttribute("data-category");
      if (cat !== null) {
        handleCategoryChange(cat);
        const catalogEl = document.getElementById("catalog");
        if (catalogEl !== null) {
          catalogEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  // 6. Sort Select Dropdown
  if (sortSelect !== null) {
    sortSelect.addEventListener("change", () => {
      sortOrder = sortSelect.value;
      updateCatalog();
    });
  }

  // 7. Cart Drawer Open / Close Controls
  if (openCartBtn !== null) {
    openCartBtn.addEventListener("click", () => toggleCartDrawer(cartBackdrop, true));
  }
  if (closeCartBtn !== null) {
    closeCartBtn.addEventListener("click", () => toggleCartDrawer(cartBackdrop, false));
  }
  if (cartBackdrop !== null) {
    cartBackdrop.addEventListener("click", (e: MouseEvent) => {
      if (e.target === cartBackdrop) {
        toggleCartDrawer(cartBackdrop, false);
      }
    });
  }

  // 8. Checkout Button Simulation
  if (checkoutActionBtn !== null) {
    checkoutActionBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your wardrobe bag is currently empty. Please select pieces first.");
        return;
      }
      const totals = calculateCartTotals(cart, products);
      alert(
        `Order Confirmed!\nTotal: $${totals.subtotal.toFixed(2)} for ${totals.count} item(s).\nThank you for choosing NAVE Autumn Essentials!`
      );
      cart = clearCart();
      updateCart();
      toggleCartDrawer(cartBackdrop, false);
    });
  }

  // 9. Quick Search Trigger in Header
  if (quickSearchTrigger !== null && searchInput !== null) {
    quickSearchTrigger.addEventListener("click", () => {
      const catalogEl = document.getElementById("catalog");
      if (catalogEl !== null) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
      window.setTimeout(() => searchInput.focus(), 350);
    });
  }

  // 10. Escape key closes drawer
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (
      e.key === "Escape" &&
      cartBackdrop !== null &&
      cartBackdrop.classList.contains("active")
    ) {
      toggleCartDrawer(cartBackdrop, false);
    }
  });
}

/**
 * Initializes the application.
 */
function init(): void {
  setupEventDelegation();
  updateCatalog();
  updateCart();
}

// Boot application
init();
