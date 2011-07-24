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
    var div, divs, e, item, items, prices, type, wdt, _i, _j, _len, _len2;
    wdt = 0;
    divs = $();
    for (type in data) {
      items = data[type];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        div = generatePriceInfoDiv(item);
        prices = div.children('.priceL, .priceR');
        divs = divs.add(prices);
        $("#" + type).append(div);
        for (_j = 0, _len2 = prices.length; _j < _len2; _j++) {
          e = prices[_j];
          e = $(e);
          if (e.width() > wdt) {
            wdt = e.width();
          }
        }
      }
    }
    divs.width(wdt);
    $(document).trigger('itemsloaded');
    return null;
  });
}).call(this);
