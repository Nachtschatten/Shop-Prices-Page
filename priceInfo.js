(function() {
  var generatePriceInfoDiv;
  generatePriceInfoDiv = function(item) {
    var iconDiv, price, priceLDiv, priceRDiv;
    price = function(c, p, p64) {
      return "<div class=" + c + ">" + p + "<br><span>" + p64 + "</span></div>";
    };
    priceLDiv = price('priceL', item.buy1, item.buy64);
    iconDiv = "<div class=icon><img src='" + item.picurl + "' alt='" + item.name + "' title='" + item.name + "'></div>";
    priceRDiv = price('priceR', item.sell1, item.sell64);
    return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>');
  };
  $.getJSON('price_json.php', function(data) {
    var item, items, type, _i, _len;
    for (type in data) {
      items = data[type];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        $("#" + type).append(generatePriceInfoDiv(item));
      }
    }
    $(document).trigger('itemsloaded');
    return null;
  });
}).call(this);
