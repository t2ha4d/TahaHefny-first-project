const grid = document.querySelector("#products");

export function renderProducts(list) {
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">No products found</p>
        <p class="empty-desc">Try adjusting your search or filter to find what you are looking for.</p>
        <button type="button" class="nord-btn-reset" id="reset-filters-btn">Reset Filters</button>
      </div>`;

    const resetBtn = grid.querySelector("#reset-filters-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const searchInput = document.querySelector("#search");
        const categorySelect = document.querySelector("#category");
        if (searchInput) searchInput.value = "";
        if (categorySelect) categorySelect.value = "all";
        const event = new Event("input", { bubbles: true });
        if (searchInput) searchInput.dispatchEvent(event);
        const changeEvent = new Event("change", { bubbles: true });
        if (categorySelect) categorySelect.dispatchEvent(changeEvent);
      });
    }
    return;
  }

  grid.innerHTML = list
    .map(
      (p) => `
      <article class="product-card">
        <div class="card-media">
          <button type="button" class="wishlist-btn" aria-label="Save to wishlist" onclick="this.classList.toggle('active')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
        </div>
        <div class="card-body">
          <div class="card-header-info">
            <span class="product-category">${p.category}</span>
            <h3 class="product-name">${p.name}</h3>
          </div>
          <div class="card-footer-info">
            <span class="product-price">$${p.price}</span>
            <button type="button" class="add-cart-action" data-id="${p.id}" aria-label="Add ${p.name} to cart">
              <span>Add to cart</span>
            </button>
          </div>
        </div>
      </article>`,
    )
    .join("");
}

export function renderCart(count, total) {
  const counter = document.querySelector("#cart-counter");
  if (counter) counter.textContent = count;
  const countAlt = document.querySelector("#cart-count");
  if (countAlt) countAlt.textContent = count;
  const totalEl = document.querySelector("#cart-total");
  if (totalEl) totalEl.textContent = `$${total}`;
}

export function onAddToCart(handler) {
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (button) handler(Number(button.dataset.id));
  });
}
