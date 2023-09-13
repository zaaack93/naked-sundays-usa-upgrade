$(document).on("click", ".ajax-add-to-cart", function () {
    if (!$(this).hasClass("isTheCurrentProduct")) {
      var addFreeGiftId = $(this).data("variantid");
  
      if ($(".cart-item.free-pdp").length > 0) {
        var deleteFreeIdKey = $(".free-pdp.cart-item ").attr("data-id");
  
        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          dataType: "json",
          data: {
            id: deleteFreeIdKey,
            quantity: 0,
          },
        }).then((data) => {
          addToCartJS(1, addFreeGiftId);
        });
      } else {
        addToCartJS(1, $(this).data("variantid"));
      }
    }
  });
  $(document).on("click", ".isTheCurrentProduct", function () {
    document
      .querySelector("[data-gift-item]")
      ?.querySelector(".cart__item__remove")
      .click();
  });
  $(document).on("click", ".imdone", function () {
    $(".congrates").click();
  });
  
  $(document).on("click", ".congrates", function () {
    $(this).toggleClass("open");
    $(this).closest(".free_gift_product").find(".gift_product").slideToggle();
  });
  
  if ($(".cart__inner").length > 0) {
    var freeGiftlimit = parseInt($(".cart").attr("data-giftcart-value"));
    var updateData = {};
    fetch(theme.routes.root + "cart.js")
      .then(this.handleErrors)
      .then((response) => response.json())
      .then((response) => {
        if (
          response.total_price <= freeGiftlimit &&
          $(".free-pdp.cart-item").length > 0
        ) {
          $(".free-pdp.cart-item").each(function (index, element) {
            updateData[$(this).attr("data-id")] = 0;
          });
  
          $.ajax({
            type: "POST",
            url: "/cart/update.js",
            data: {
              updates: updateData,
            },
            dataType: "json",
            success: function (cart) {
              location.reload();
            },
            error: function (err) {
              location.reload();
            },
          });
        }
      })
      .catch((error) => console.log(error));
  }
  
  function addToCartJS(qty, variantID) {
    var data = { quantity: qty, id: variantID,properties: {
      'isGiftProduct': 'true'
    } };

    $.ajax({
      type: "POST",
      url: "/cart/add.js",
      data,
      dataType: "json",
      success: function (cart) {
        location.reload();
      },
      error: function (err) {
        console.log(err)
      },
    });
  }