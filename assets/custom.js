/*
* Broadcast Theme
*
* Use this file to add custom Javascript to Broadcast.  Keeping your custom
* Javascript in this fill will make it easier to update Broadcast. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/


(function() {
  // Add custom code below this line

  if(window.theme.enable_freegift){
    document.addEventListener(
      'theme:cart:change',
      function (event) {
        //gift functionnaly
        if(window.cart.subtotal<window.theme.free_gift_limit){
          document
          .querySelector("[data-gift-item]")
          ?.querySelector(".cart__item__remove")
          .click();

          //we should update the cart now
          fetch(theme.routes.cart_url)
          .then(this.cartErrorsHandler)
          .then((response) => response.text())
          .then((response) => {
            const element = document.createElement('div');
            element.innerHTML = response;

            const cleanResponse = element.querySelector("div[content-gift-product]");
            if(cleanResponse){
              document.querySelector("div[content-gift-product]").innerHTML=cleanResponse.innerHTML;
            }
          })
          .catch((error) => console.log(error));
        }
        else if(event.detail.cartCount==1 && document.querySelector('[data-gift-item]')){
          $.ajax({
            type: 'POST',
            url: '/cart/clear.js',
            dataType: 'json',
            success: function(cart){location.reload();},
            error: function(err){location.reload();}
          });
        }
        else if(window.location.pathname=='/cart'){
          
          //we should update the cart now
            fetch(theme.routes.cart_url)
            .then(this.cartErrorsHandler)
            .then((response) => response.text())
            .then((response) => {
              const element = document.createElement('div');
              element.innerHTML = response;

              const cleanResponse = element.querySelector("div[content-gift-product]");
              if(cleanResponse){
                document.querySelector("div[content-gift-product]").innerHTML=cleanResponse.innerHTML;
              }
            })
            .catch((error) => console.log(error));
        }
    })
  }
  // ^^ Keep your scripts inside this IIFE function call to 
  // avoid leaking your variables into the global scope.
})();
