// UI rendering, DOM manipulation, view updates, and template generation.
import type { CartItem, CartTotals, Product } from "./types";

export interface CartUIElements {
  readonly badgeEl: HTMLElement | null;
  readonly listEl: HTMLElement | null;
  readonly subtotalEl: HTMLElement | null;
}

/**
 * Generates an HTML card string for a single product object.
 */
function createProductCardHTML(item: Product): string {
  const displayColor = item.color !== undefined ? item.color : item.category;

  return `
    <article class="apparel-card" data-id="${item.id}">
      <div class="apparel-media-frame">
        <span class="apparel-tag-chip">${item.category}</span>
        <button type="button" class="wishlist-heart-btn" aria-label="Add ${item.name} to wishlist" data-action="wishlist" data-id="${item.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <img src="${item.image}" alt="${item.name}" class="apparel-img" loading="lazy" />
      </div>
      <div class="apparel-body-info">
        <h3 class="apparel-item-title">${item.name}</h3>
        <span class="apparel-color-label">${displayColor}</span>
        <div class="apparel-footer-action">
          <span class="apparel-price-val">$${item.price}</span>
          <button type="button" class="apparel-add-btn" data-action="add" data-add-id="${item.id}">
            Add to Bag
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renders products into the specified container element.
 */
export function renderProducts(
  container: HTMLElement | null,
  list: readonly Product[]
): void {
  if (container === null) {
    return;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:64px 20px;background:#fff;border:1px solid #EFE9E2;border-radius:4px;">
        <p style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;margin:0 0 8px;color:#211B1D;">No Pieces Found</p>
        <p style="font-size:0.85rem;color:#63575A;margin:0;">Try refining your search terms or selecting another category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(createProductCardHTML).join("");
}

/**
 * Updates the catalog count badge.
 */
export function renderCatalogCount(badgeEl: HTMLElement | null, count: number): void {
  if (badgeEl === null) {
    return;
  }
  const label = count === 1 ? "PIECE" : "PIECES";
  badgeEl.textContent = `${count} ${label} AVAILABLE`;
}

/**
 * Renders the cart drawer list, badge count, and subtotal.
 */
export function renderCart(
  elements: CartUIElements,
  cart: readonly CartItem[],
  catalog: readonly Product[],
  totals: CartTotals
): void {
  const { badgeEl, listEl, subtotalEl } = elements;

  if (badgeEl !== null) {
    badgeEl.textContent = String(totals.count);
  }

  if (subtotalEl !== null) {
    subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  }

  if (listEl !== null) {
    if (cart.length === 0) {
      listEl.innerHTML = `
        <p class="cart-empty-msg">Your wardrobe bag is currently empty.<br />Select pieces from the collection to proceed.</p>
      `;
      return;
    }

    const itemsHTML: string[] = [];
    for (const item of cart) {
      const product = catalog.find((p) => p.id === item.id);
      if (product !== undefined) {
        const itemQty = item.qty;
        const lineTotal = (product.price * itemQty).toFixed(2);
        itemsHTML.push(`
          <div class="cart-item-card" data-id="${item.id}">
            <img src="${product.image}" alt="${product.name}" class="cart-item-thumb" />
            <div class="cart-item-info">
              <h4 class="cart-item-name">${product.name}</h4>
              <span class="cart-item-meta">$${product.price} each &bull; $${lineTotal}</span>
              <div style="display:flex;align-items:center;gap:10px;margin-top:6px;">
                <button type="button" class="cart-qty-btn" data-action="decrement" data-id="${item.id}" aria-label="Decrease quantity" style="padding:2px 8px;border:1px solid #ddd;border-radius:2px;background:#fff;font-size:0.75rem;cursor:pointer;">&minus;</button>
                <span style="font-size:0.85rem;font-weight:600;min-width:18px;text-align:center;">${itemQty}</span>
                <button type="button" class="cart-qty-btn" data-action="increment" data-id="${item.id}" aria-label="Increase quantity" style="padding:2px 8px;border:1px solid #ddd;border-radius:2px;background:#fff;font-size:0.75rem;cursor:pointer;">&#43;</button>
              </div>
            </div>
            <button type="button" class="cart-item-remove-btn" data-action="remove" data-id="${item.id}" aria-label="Remove item">&times;</button>
          </div>
        `);
      }
    }

    listEl.innerHTML = itemsHTML.join("");
  }
}

/**
 * Opens or closes the slide-over cart drawer.
 */
export function toggleCartDrawer(backdrop: HTMLElement | null, isOpen: boolean): void {
  if (backdrop === null) {
    return;
  }
  if (isOpen) {
    backdrop.classList.add("active");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  } else {
    backdrop.classList.remove("active");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

/**
 * Provides temporary positive feedback on a button.
 */
export function flashButtonSuccess(
  button: HTMLElement | null,
  feedbackText: string,
  originalText: string,
  duration = 900
): void {
  if (button === null) {
    return;
  }
  button.classList.add("success-flash");
  button.textContent = feedbackText;
  window.setTimeout(() => {
    button.classList.remove("success-flash");
    button.textContent = originalText;
  }, duration);
}

/**
 * Synchronizes active category CSS classes on filter buttons and circles.
 */
export function updateActiveCategoryUI(
  buttons: Iterable<Element>,
  circles: Iterable<Element>,
  activeCategory: string
): void {
  const targetCategory = activeCategory.toLowerCase();

  for (const btn of buttons) {
    if (btn instanceof HTMLElement) {
      const cat = btn.getAttribute("data-category");
      const normalized = (cat !== null ? cat : "all").toLowerCase();
      btn.classList.toggle("active", normalized === targetCategory);
    }
  }

  for (const circle of circles) {
    if (circle instanceof HTMLElement) {
      const cat = circle.getAttribute("data-category");
      const normalized = (cat !== null ? cat : "").toLowerCase();
      circle.classList.toggle("active", normalized === targetCategory);
    }
  }
}
