const cartBtn = document.querySelector(".cart-btn")
const cartBox = document.querySelector(".cart")
const searchBox = document.querySelector(".search-box")
const backDrop = document.querySelector(".back-drop")
const clearCartBtn = document.querySelector(".clear-cart")
const productContainer = document.querySelector(".products")
let cartItems = document.querySelector(".cart-items")
const cartContent = document.querySelector(".cart-content")
let totalPriceText = document.querySelector(".total-price")
const closeCartIcon = document.querySelector(".close-cart-icon")
const confirmCart = document.querySelector(".confirm-cart")
import {productsData} from "./products.js"

let cart = []
let productBtnDOM = []
let filter = {
  searchItem: "",
}
//Get Product
class Products {
  getProducts() {
    return productsData
  }
}
//Display Product
class Ui {
  searchProduct(products, filters) {
    const filterdProduct = products.filter((item) => {
      return item.title.toLowerCase().includes(filters.searchItem.toLowerCase())
    })
    this.showProduct(filterdProduct)
  }
  showProduct(products) {
    let result = ""
    products.forEach((item) => {
      result += `<section class="product">
      <figure>
        <img
          src="${item.imageUrl}"
          alt=""
        />
      </figure>
      <figcaption>
        <p>Title: ${item.title}</p>
        <p>Price: ${item.price}$</p>
      </figcaption>
      <div class = 'product-btn'>
      <i class="fas fa-share-alt"></i>
      <i class="fas fa-info"></i>
      <i class="far fa-heart"></i>
      <button class="add-to-cart" data-id=${item.id}><i class="fas fa-shopping-bag"></i></i></button>
    </div>
    </section>`
    })
    productContainer.innerHTML = result
  }

  getAddToCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")]
    productBtnDOM = addToCartBtns
    addToCartBtns.forEach((item) => {
      const id = item.dataset.id

      //check product is in cart or not:
      const isInCart = cart.find((item) => item.id == id)
      if (isInCart) {
        // item.quantity++
        item.innerText = "In Cart"
        item.disabled = true
        item.style.color = "#c7a065"
      } else {
        //is not:

        item.addEventListener("click", (e) => {
          e.target.innerText = "In Cart"
          e.target.style.color = "#c7a065"
          e.target.disabled = true

          //get from products:
          const addedProduct = {...Storage.getProduct(id), quantity: 1}

          //save product to cart:
          cart = [...cart, addedProduct]

          //save caart to local storage:
          Storage.saveCart(cart)
          this.updateCartValue(cart)

          //add product to cart
          this.addToCart(addedProduct)
        })
      }
    })
  }
  updateCartValue(cart) {
    let tempCartItem = 0
    const cartValue = cart.reduce((acc, curr) => {
      tempCartItem += curr.quantity
      return acc + curr.quantity * curr.price
    }, 0)

    cartItems.innerText = tempCartItem
    totalPriceText.innerText = `Total Price: ${cartValue.toFixed(2)}$`
  }
  addToCart(product) {
    const div = document.createElement("div")
    div.classList.add("cart-item")
    div.innerHTML = `
    <figure>
      <img src="${product.imageUrl}" alt="" />
    </figure>
    <figcaption>
      <h5>Title: ${product.title}</h5>
      <h5>Price: ${product.price}$ </h5>
    </figcaption>
    <div class="cart-contoroller">
      <i data-id=${product.id} class="fas fa-angle-up"></i>
      <p> ${product.quantity}</p>
     <i data-id=${product.id} class="fas fa-angle-down"></i>
    </div>
    <span class="remove-cart-item" ><i data-id=${product.id} class="far fa-trash-alt"></i></span>
   `
    cartContent.appendChild(div)
  }
  setUpApp() {
    cart = Storage.getCart() || []
    cart.forEach((item) => {
      this.addToCart(item)
    })
    this.updateCartValue(cart)
  }
  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart()
    })
    cartContent.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-angle-up")) {
        const id = e.target.dataset.id
        const addedProduct = cart.find((item) => item.id == id)
        addedProduct.quantity++
        this.updateCartValue(cart)
        Storage.saveCart(cart)
        e.target.nextElementSibling.innerText = addedProduct.quantity
      } else if (e.target.classList.contains("fa-angle-down")) {
        const id = e.target.dataset.id
        const addedProduct = cart.find((item) => item.id == id)
        if (addedProduct.quantity === 1) {
          this.removeCartItem(addedProduct.id)
          cartContent.removeChild(e.target.parentElement.parentElement)
        }
        addedProduct.quantity--
        e.target.previousElementSibling.innerText = addedProduct.quantity
        this.updateCartValue(cart)
        Storage.saveCart(cart)
        this.closeEmpteCart()
      } else if (e.target.classList.contains("fa-trash-alt")) {
        const id = e.target.dataset.id
        const removedItem = cart.find((item) => item.id == id)
        this.removeCartItem(removedItem.id)
        cartContent.removeChild(e.target.parentElement.parentElement)
        Storage.saveCart(cart)
        this.closeEmpteCart()
      }
    })
  }
  closeEmpteCart() {
    let total = 0
    cart.forEach((item) => {
      total += item.quantity
    })
    if (total === 0) {
      closeCart()
    }
  }
  clearCart() {
    cart.forEach((item) => this.removeCartItem(item.id))
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.childNodes[0])
    }
    closeCart()
  }
  removeCartItem(id) {
    cart = cart.filter((item) => item.id !== id)
    this.updateCartValue(cart)
    Storage.saveCart(cart)
    this.updateBtnText(id)
  }
  updateBtnText(id) {
    const btn = productBtnDOM.find(
      (item) => parseInt(item.dataset.id) === parseInt(id)
    )
    btn.innerHTML = `<i class="fas fa-shopping-bag"></i>`
    btn.style.color = "#646363"
    btn.disabled = false
  }
}

//Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products))
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"))
    return _products.find((item) => item.id === JSON.parse(id))
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"))
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products()
  const productsData = products.getProducts()
  const ui = new Ui()
  //set up Ui
  searchBox.addEventListener("input", (e) => {
    filter.searchItem = e.target.value
    ui.searchProduct(productsData, filter)
    ui.getAddToCartBtns()
  })
  ui.setUpApp()
  ui.cartLogic()
  ui.showProduct(productsData)
  ui.getAddToCartBtns()
  Storage.saveProducts(productsData)
})

const showCart = () => {
  cartBox.style.top = "-700px"
  cartBox.style.opacity = "1"
  backDrop.style.display = "block"
  backDrop.style.opacity = "1"
}

const closeCart = () => {
  cartBox.style.top = "-100%"
  cartBox.style.opacity = "0"
  backDrop.style.display = "none"
  backDrop.opacity = "0"
}

cartBtn.addEventListener("click", showCart)
closeCartIcon.addEventListener("click", closeCart)
backDrop.addEventListener("click", closeCart)
confirmCart.addEventListener("click", closeCart)
