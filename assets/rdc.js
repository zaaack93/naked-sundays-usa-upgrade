const body = document.querySelector("body")

if(body.classList.contains("template-cart")) {
const promoLineItems = document.querySelectorAll('[data-collection-id="403626721532"]')
const cartItems = document.querySelectorAll(".cart-item")

let count = 0;

cartItems.forEach(cartItem => {
let dataId = cartItem.getAttribute('data-id').split(':')
  
if(dataId[0] == promoLineItems[0].getAttribute("data-freeY-id")) {
count++;
}

if(Array.from(promoLineItems).length == 1 && count == 0) {
setTimeout(function() {
   let freeItem = {
 'items': [{
  'id': promoLineItems[0].getAttribute("data-freeY-id"),
  'quantity': 1
  }]
};

  fetch(window.Shopify.routes.root + 'cart/add.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(freeItem)
})
.then(response => { return response.json()})
.catch((error) => {
  console.error('Error:', error);
});
  console.log('added')
  setTimeout(function() {
window.location.reload();
  }, 1000)
    
  }, 1000)

}
})
}
