import { products } from "./data.js";
import { searchProducts, filterByCategory, sortProducts, cartCount, cartTotal } from "./logic.js";
import { loadCart, saveCart, addToCart } from "./state.js";
import { renderProducts, renderCart, onAddToCart } from "./ui.js";

const search = document.querySelector("#search");
const category = document.querySelector("#category");
const sort = document.querySelector("#sort");

let cart = loadCart();

function update() {
  const query = search ? search.value : "";
  const cat = category ? category.value : "all";
  const order = sort ? sort.value : "none";

  let list = searchProducts(products, query);
  list = filterByCategory(list, cat);
  list = sortProducts(list, order);
  renderProducts(list);
}

function updateCart() {
  renderCart(cartCount(cart), cartTotal(cart, products));
}

if (search) search.addEventListener("input", () => update());
if (category) category.addEventListener("change", () => update());
if (sort) sort.addEventListener("change", () => update());

onAddToCart((id) => {
  cart = addToCart(cart, id);
  saveCart(cart);
  updateCart();
});

update();
updateCart();
