// UI rendering, DOM element queries, view updates, and template generation.

/**
 * Generates an HTML card string for a single product object.
 * @param {Object} item - Product item.
 * @returns {string} HTML markup.
 */
function createProductCardHTML(item) {
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
        <span class="apparel-color-label">${item.color || item.category}</span>
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
 * @param {HTMLElement} container - Grid container.
 * @param {Array} list - Array of products to render.
 */
export function renderProducts(container, list) {
  if (!container) return;

  if (!list || list.length === 0) {
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
 * @param {HTMLElement} badgeEl - Count badge element.
 * @param {number} count - Number of visible items.
 */
export function renderCatalogCount(badgeEl, count) {
  if (!badgeEl) return;
  badgeEl.textContent = `${count} ${count === 1 ? "PIECE" : "PIECES"} AVAILABLE`;
}

/**
 * Renders the cart drawer list, badge count, and subtotal.
 * Uses clean event delegation attributes for quantity and removal.
 * @param {Object} elements - UI elements map.
 * @param {Array} cart - Cart array [{ id, qty }].
 * @param {Array} products - Catalog products array.
 * @param {{ count: number, subtotal: number }} totals - Calculated totals.
 */
export function renderCart(elements, cart, products, totals) {
  const { badgeEl, listEl, subtotalEl } = elements;

  // 1. Update header badge count
  if (badgeEl) {
    badgeEl.textContent = totals.count;
  }

  // 2. Update subtotal amount
  if (subtotalEl) {
    subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  }

  // 3. Render items list
  if (listEl) {
    if (!cart || cart.length === 0) {
      listEl.innerHTML = `
        <p class="cart-empty-msg">Your wardrobe bag is currently empty.<br />Select pieces from the collection to proceed.</p>
      `;
      return;
    }

    listEl.innerHTML = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return "";
        const itemQty = item.qty || 1;
        const lineTotal = (product.price * itemQty).toFixed(2);

        return `
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
        `;
      })
      .join("");
  }
}

/**
 * Opens or closes the slide-over cart drawer.
 * @param {HTMLElement} backdrop - Backdrop container element.
 * @param {boolean} isOpen - Whether drawer is open.
 */
export function toggleCartDrawer(backdrop, isOpen) {
  if (!backdrop) return;
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
 * @param {HTMLElement} button - Target button.
 * @param {string} feedbackText - Temporary text.
 * @param {string} originalText - Reverted text.
 * @param {number} [duration=900] - Duration in ms.
 */
export function flashButtonSuccess(button, feedbackText, originalText, duration = 900) {
  if (!button) return;
  button.classList.add("success-flash");
  button.textContent = feedbackText;
  setTimeout(() => {
    button.classList.remove("success-flash");
    button.textContent = originalText;
  }, duration);
}

/**
 * Synchronizes active category CSS classes on filter buttons and circles.
 * @param {NodeList|Array} buttons - Filter buttons.
 * @param {NodeList|Array} circles - Circular category elements.
 * @param {string} activeCategory - Selected category.
 */
export function updateActiveCategoryUI(buttons, circles, activeCategory) {
  if (buttons) {
    buttons.forEach((btn) => {
      const match = (btn.dataset.category || "all").toLowerCase() === activeCategory.toLowerCase();
      btn.classList.toggle("active", match);
    });
  }

  if (circles) {
    circles.forEach((circle) => {
      const match = (circle.dataset.category || "").toLowerCase() === activeCategory.toLowerCase();
      circle.classList.toggle("active", match);
    });
  }
}

