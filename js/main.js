document.addEventListener("DOMContentLoaded", () => {
  fetchdata();
  updatecart();
  showcart();
});

//get the data from the API
async function fetchdata() {
  const response = await fetch("../backend/products.json");
  const data = await response.json();
  showallproducts(data);
  filteredproducts(data);
}

//show all products
function showallproducts(data) {
  renderdata(data);
}

//render the data to the DOM
function renderdata(data) {
  const html = data
    .map((item) => {
      return `<div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${item.image}">
        </div>

        <div class="product-id limit-text-to-2-lines">
        ${item.id}
        </div>

        <div class="product-name limit-text-to-2-lines">
        ${item.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${item.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
           ${item.rating.count}
          </div>
        </div>

        <div class="product-price">
         $ <span class = "product-price-cents">${(
           item.priceCents / 100
         ).toFixed(2)}</span>
        </div>

        <div class="product-quantity-container">
          <select>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button id="add-to-cart" class="add-to-cart-button button-primary">
          Add to Cart
        </button>
      </div>`;
    })
    .join("");
  const grid = document.querySelector(".products-grid");
  grid.innerHTML = html;

  //to make sure html is generated before adding eventlisnters
  createcartitems();
}

let cart = [];

//generate cart items
function createcartitems() {
  const buttons = document.querySelectorAll(".add-to-cart-button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const selecteditem = event.target.closest(".product-container");
      // display added to cart message
      selecteditem.querySelector(".added-to-cart").style.opacity = 1;

      const img = selecteditem.querySelector(".product-image").src;
      const id = selecteditem.querySelector(".product-id").innerHTML.trim();
      const name = selecteditem.querySelector(".product-name").innerHTML.trim();
      const price = selecteditem
        .querySelector(".product-price-cents")
        .innerHTML.trim();
      const quantity = selecteditem.querySelector(
        ".product-quantity-container select"
      ).value;

      const item = {
        img: img,
        id: id,
        name: name,
        price: Number(price) * quantity,
        quantity: Number(quantity),
      };
      addtocart(item);
    });
  });
}

//adding the item to cart array
function addtocart(item) {
  const cartItem = cart.find((cartItem) => cartItem.id === item.id);
  if (cartItem) {
    cartItem.quantity += item.quantity;
    cartItem.price =
      (cartItem.price / (cartItem.quantity - item.quantity)) *
      cartItem.quantity;
  } else {
    cart.push(item);
  }
  updatecart(cart.length);
  rendercart();
  const minicart = document.querySelector(".mini-cart");
  minicart.classList.add("mini-cart-display");
}

/*----------------------------------------------Script for mini-cart....................................................................*/

function rendercart() {
  const renderitems = cart
    .map((item, index) => {
      return `
     <div class="mini-cart-item">
     <div class="mini-cart-img">
     <img  src=${item.img} alt="mini-cart-item">
      </div>
      <div class="mini-cart-item-details">
        <p>${item.name}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
        <p> Qty: ${item.quantity}</p> 
        </div>
        <button class="mini-cart-remove" value = "${index}">X</button>
      </div>
       `;
    })
    .join("");
  document.querySelector(".cart-items").innerHTML = renderitems;
  removecartitems();
}

// update cart items amount
function updatecart(cart = 0) {
  document.querySelector(".cart-quantity").textContent = cart;
}

//toggle mini cart
function showcart() {
  document.querySelector("#cart-mini").addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelector(".mini-cart").classList.toggle("mini-cart-display");
  });
}

//remove items from cart
function removecartitems() {
  const removebuttons = document.querySelectorAll(".mini-cart-remove");
  removebuttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.value;
      cart.splice(index, 1);
      rendercart();
      updatecart(cart.length);
    });
  });
}

/*-------------------------------------script for filter  by name -------------------------------------------------------------------------*/

//search filter
function filteredproducts(data) {
  const searchbar = document.querySelector(".search-bar");
  searchbar.addEventListener("keydown", (event) => {
    let filtername = "";
    filtername = searchbar.value;
    const filteredlist = data.filter((item) =>
      item.name.toLowerCase().includes(filtername.toLowerCase())
    );
    renderdata(filteredlist);
  });
}
