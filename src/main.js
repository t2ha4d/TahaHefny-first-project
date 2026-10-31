// Application orchestrator: wires logic, state, UI, and event delegation.

import { products } from "./products.js";
import { searchProducts, filterByCategory, sortProducts } from "./logic.js";
import {
  loadCart,
  saveCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  calculateCartTotals,
} from "./state.js";
import {
  renderProducts,
  renderCatalogCount,
  renderCart,
  toggleCartDrawer,
  flashButtonSuccess,
  updateActiveCategoryUI,
} from "./ui.js";

// Application State
let cart = loadCart();
let activeCategory = "all";
let searchQuery = "";
let sortOrder = "default";

// Static DOM Container Elements
const productsGrid = document.querySelector("#products-grid");
const catalogCountBadge = document.querySelector("#catalog-count-badge");
const searchInput = document.querySelector("#search-input");
const categoryFilterBtns = document.querySelectorAll(".cat-filter-btn");
const categoryCircles = document.querySelectorAll(".category-circle-item");
const sortSelect = document.querySelector("#sort-select");

// Cart Elements
const headerCartBadge = document.querySelector("#header-cart-badge");
const openCartBtn = document.querySelector("#open-cart-btn");
const closeCartBtn = document.querySelector("#close-cart-btn");
const cartBackdrop = document.querySelector("#cart-drawer-backdrop");
const drawerItemsList = document.querySelector("#drawer-items-list");
const drawerSubtotalVal = document.querySelector("#drawer-subtotal-val");
const checkoutActionBtn = document.querySelector("#checkout-action-btn");
const quickSearchTrigger = document.querySelector("#quick-search-trigger");

/**
 * Updates the catalog display through the pure logic pipeline.
 */
function updateCatalog() {
  let list = searchProducts(products, searchQuery);
  list = filterByCategory(list, activeCategory);
  list = sortProducts(list, sortOrder);

  renderProducts(productsGrid, list);
  renderCatalogCount(catalogCountBadge, list.length);
}

/**
 * Recalculates cart totals, updates UI, and persists to localStorage.
 */
function updateCart() {
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
 * @param {string} category - Selected category.
 */
function handleCategoryChange(category) {
  activeCategory = category || "all";
  updateActiveCategoryUI(categoryFilterBtns, categoryCircles, activeCategory);
  updateCatalog();
}

/**
 * Sets up event listeners with event delegation on static parent elements.
 */
function setupEventDelegation() {
  // 1. Event Delegation on Products Grid (Add to Bag & Wishlist toggles)
  if (productsGrid) {
    productsGrid.addEventListener("click", (e) => {
      // Add to Bag action
      const addBtn = e.target.closest('[data-action="add"]');
      if (addBtn) {
        const id = Number(addBtn.dataset.addId);
        if (id) {
          cart = addToCart(cart, id, 1);
          updateCart();
          flashButtonSuccess(addBtn, "Added ✓", "Add to Bag", 900);
        }
        return;
      }

      // Wishlist Heart action
      const wishBtn = e.target.closest('[data-action="wishlist"]');
      if (wishBtn) {
        wishBtn.classList.toggle("active");
      }
    });
  }

  // 2. Event Delegation on Cart Drawer (Quantity adjustments and Item removal)
  if (drawerItemsList) {
    drawerItemsList.addEventListener("click", (e) => {
      const actionBtn = e.target.closest("[data-action]");
      if (!actionBtn) return;

      const action = actionBtn.dataset.action;
      const id = Number(actionBtn.dataset.id);
      if (!id) return;

      const currentItem = cart.find((i) => i.id === id);
      const currentQty = currentItem ? currentItem.qty || 1 : 1;

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
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      updateCatalog();
    });
  }

  // 4. Category Filter Buttons (Toolbar pills)
  categoryFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      handleCategoryChange(btn.dataset.category || "all");
    });
  });

  // 5. Circular Category Thumbnails
  categoryCircles.forEach((circle) => {
    circle.addEventListener("click", () => {
      const cat = circle.dataset.category;
      if (cat) {
        handleCategoryChange(cat);
        const catalogEl = document.querySelector("#catalog");
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // 6. Sort Select Dropdown
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortOrder = e.target.value;
      updateCatalog();
    });
  }

  // 7. Cart Drawer Open / Close Controls
  if (openCartBtn) {
    openCartBtn.addEventListener("click", () => toggleCartDrawer(cartBackdrop, true));
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => toggleCartDrawer(cartBackdrop, false));
  }
  if (cartBackdrop) {
    cartBackdrop.addEventListener("click", (e) => {
      if (e.target === cartBackdrop) {
        toggleCartDrawer(cartBackdrop, false);
      }
    });
  }

  // 8. Checkout Button Simulation
  if (checkoutActionBtn) {
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
  if (quickSearchTrigger && searchInput) {
    quickSearchTrigger.addEventListener("click", () => {
      const catalogEl = document.querySelector("#catalog");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
      setTimeout(() => searchInput.focus(), 350);
    });
  }

  // 10. Escape key closes drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartBackdrop?.classList.contains("active")) {
      toggleCartDrawer(cartBackdrop, false);
    }
  });
}

/**
 * Initializes the application.
 */
function init() {
  setupEventDelegation();
  updateCatalog();
  updateCart();
}

// Boot application
init();

