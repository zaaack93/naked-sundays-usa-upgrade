/*
* Broadcast Theme
*
* Use this file to add custom Javascript to Broadcast.  Keeping your custom
* Javascript in this fill will make it easier to update Broadcast. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/


$(document).ready(function(){
    /* Custom Paypment Popup Product Page */
	$('.payment_popUpBtn').on('click', function(){
		$('#'+$(this).data('modal')).css('display','block');
	});

	$('span.payment_close').on('click', function(){
		$('.payment_modal').css('display','none');
	});

	$(window).on('click', function(event){
		if (jQuery.inArray( event.target, $('.payment_modal') ) != "-1") {
        	$('.payment_modal').css('display','none');
    	}
	});

  /* Custom Paypment Popup Product Page */
  $('.ing-toggle').click(function(){
    $('.ing-toggle-cont').toggleClass('active-toggle');
    $(this).toggleClass("ing-toggle-active");
     var val =$(this).next('span').text() == "-" ? "+" : "-";
    $(this).next('span').hide().text(val).show();
  });
  
  $(document).on("click",".ajax-add-to-cart",function() {
    var addFreeGiftId = $(this).data('variantid');
    
    if($('.cart-item.free-pdp').length > 0){
      var deleteFreeIdKey = $('.free-pdp.cart-item ').attr('data-id');
      
      $.ajax({
        type: "POST",
        url: "/cart/change.js",
        dataType: "json",
        data: {
          id: deleteFreeIdKey,
          quantity: 0,
        },
      }).then((data) => {
      	addToCartJS(1,addFreeGiftId);  
      });
    } else {
      addToCartJS(1,$(this).data('variantid')); 
    }
  });
  
//   $(document).on("click",".ajax-add-to-cart",function() {
//     $(this).closest('.product-item').toggleClass("active");
//     if ($(this).text() == "Add"){
//       $(this).text("Added")
//     } else {
//        $(this).text("Add");
//     }
    
//     var freeArray = [];
//     $('.product-item.active').each(function( index ) {
//       freeArray.push({id: $(this).attr('data-variantid'),quantity: 1});
//     });
//     if(freeArray.length > 0){
// 	  $('.imdone').removeClass('hide').attr('data-pdp-json',JSON.stringify(freeArray));
//     } else {
//       $('.imdone').addClass('hide').attr('data-pdp-json','');
//     }
    
//   });
  
//   $('.imdone').click(function(){  
//   	let formData = {'items': jQuery.parseJSON($(this).attr('data-pdp-json'))};
//     fetch('/cart/add.js', {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify(formData)
//     })
//     .then(response => {location.reload();})
//     .catch((error) => {location.reload();});

//   });
  
  $('.imdone').click(function(){ 
  	$('.congrates').click();  
  });
  
  $('.congrates').click(function(){
    $(this).toggleClass('open');
  	$(this).closest('.free_gift_product').find('.gift_product').slideToggle();
  });
  
});

if($('.cart__inner').length > 0){
  var freeGiftlimit = parseInt($('.cart').attr('data-giftcart-value'));
  var updateData = {};
  fetch(theme.routes.root + 'cart.js')
  .then(this.handleErrors)
  .then((response) => response.json())
  .then((response) => {
    if(response.total_price <= freeGiftlimit && $( ".free-pdp.cart-item").length > 0){
      $( ".free-pdp.cart-item").each(function( index,element ) {
        updateData[$(this).attr('data-id')] = 0;
      });

      $.ajax({
        type: 'POST',
        url: '/cart/update.js',
        data: {
          updates: updateData
        },
        dataType: 'json',
        success: function(cart){location.reload();},
        error: function(err){location.reload();}
      });
    }

  })
  .catch((error) => console.log(error));
}

function addToCartJS(qty,variantID) {   
  var xhr = new XMLHttpRequest();
  var url = "/cart/add.js";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var parsedState = JSON.parse(xhr.responseText);
      location.reload();
    }
  };
  var data = JSON.stringify({"quantity": qty, "id": variantID });
  xhr.send(data);
}



