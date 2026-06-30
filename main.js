var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    },
});


const cartIcon = document.querySelector(".cart-icon")
const cartTab = document.querySelector(".cart-tab")
const closetBtn = document.querySelector(".close-btn")
const cardList = document.querySelector(".card-list")
const cartList = document.querySelector('.cart-list')
const cartTotal = document.querySelector(".cart-total")
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger')
const mobileMenu = document.querySelector('.mobile-menu')
const checkoutBtn = document.getElementById('checkoutBtn')





cartIcon.addEventListener('click', () => cartTab.classList.add('cart-tab-active'))
closetBtn.addEventListener('click', () => cartTab.classList.remove('cart-tab-active'))
hamburger.addEventListener('click',()=>mobileMenu.classList.toggle('mobile-menu-active'));

let productList = []
let cartProduct = []

const updateTotals = () =>{
         let totalPrice = 0
         let totalQuantity = 0

         document.querySelectorAll('.item').forEach(item =>{
            const quantity =  parseInt(item.querySelector('.quantity-value').textContent);
             const price = parseFloat(item.querySelector('.item-total').textContent.replace('$',''))

             totalPrice += price
             totalQuantity += quantity;
         });
         cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
         cartValue.textContent = totalQuantity;

}


const showCards = () => {
    productList.forEach(product => {
        const orderCard = document.createElement("div");
        orderCard.classList.add('order-card')
        orderCard.innerHTML = `
        <div class="card-image">
        <img src="${product.image}">
        </div>
        <h4>${product.name}</h4>
        <h4 class="item-total">${product.price}</h4>
        <a href="#" class="btn card-btn">Add To Cart</a>
        `;
        cardList.appendChild(orderCard)

        const cardBtn = orderCard.querySelector('.card-btn')
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault()
            addToCart(product);
        })

    });
}

const addToCart = (product) => {
    const exsitingItem = cartProduct.find(item => item.id === product.id)

    if (exsitingItem) {
        alert("item already added")
        return;
    }

    cartProduct.push(product)
    let quantity = 1
    let price = parseFloat(product.price.replace('$', ''))

    const cartItem = document.createElement("div");

    cartItem.classList.add('item');

    cartItem.innerHTML = `
    <div class="item-image">
   <img src="${product.image}">
  </div>
  <div class="detail">
   <h4>${product.name}</h4>
   <h4 class="item-total">${product.price}</h4>
  </div>
  <div class="flex">
   <a href="#" class="quantity-btn minus">
       <i class="fa-solid fa-minus"></i>
   </a>
   <h4 class="quantity-value">${quantity}</h4>
   <a href="#" class="quantity-btn plus">
       <i class="fa-solid fa-plus"></i>
   </a>
  </div>
   `;

    cartList.appendChild(cartItem)
    updateTotals()

    const plusBtn = cartItem.querySelector('.plus')
    const quantityValue = cartItem.querySelector('.quantity-value')
    const itemTotal = cartItem.querySelector('.item-total');
    const minusBtn = cartItem.querySelector('.minus')

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `$${(price * quantity).toFixed(2)}`
        updateTotals()
    })
    minusBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
            updateTotals()
        }
        else{
            cartItem.classList.add("slide-out")
           setTimeout(() =>{
               cartItem.remove()
               cartProduct = cartProduct.filter(item => item.id !== product.id)
               updateTotals()
            },1000)


        }


    })


}

// ROZER PAY

checkoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let totalAmount = 0;

    document.querySelectorAll('.item-total').forEach(item => {
        totalAmount += parseFloat(item.textContent.replace('$',''));
    });

    if(totalAmount === 0){
        alert("Cart is empty");
        return;
    }

    // Fake loading effect
    checkoutBtn.textContent = "Processing...";
    checkoutBtn.style.opacity = "0.7";

    setTimeout(() => {
        alert(`Payment Successful!\nAmount Paid: $${totalAmount.toFixed(2)}`);

        cartList.innerHTML = "";
        cartProduct = [];

        updateTotals();

        checkoutBtn.textContent = "Pay Now";
        checkoutBtn.style.opacity = "1";

    }, 2000);
});

//   EMAIL VALIDATION

const subscribeBtn = document.querySelector('.input-container .btn');
const emailInput = document.getElementById('email');

subscribeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if(email === ""){
        alert("Please enter email first");
        return;
    }

    // simple email check
    if(!email.includes("@") || !email.includes(".")){
        alert("Please enter valid email");
        return;
    }

    alert("Subscribed successfully!");

    emailInput.value = "";
});

function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.replace("auth.html");
}


const initApp = () => {
    fetch('products.json').then
        (response => response.json()).then
        (data => {
            productList = data
            showCards()
        })
}

initApp()