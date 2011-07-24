(function() {
  var generatePriceInfoDiv, setViewport;
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
  setViewport = function(wdt) {
    return $('meta[name=viewport]').attr('content', "width=" + wdt);
  };
  $.getJSON('price_json.php', function(data) {
    var center, div, divs, e, item, items, min, prices, s, sizes, type, wdt, winwdt, _i, _j, _len, _len2;
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
    sizes = function() {
      var container, cwdt, itemwdt;
      container = $('#blocks, #items');
      itemwdt = $('.product', container).outerWidth(true);
      cwdt = container.width();
      return {
        container: container,
        itemwdt: itemwdt,
        cwdt: cwdt,
        row: Math.floor(cwdt / itemwdt)
      };
    };
    center = function() {
      var s;
      s = sizes();
      return s.container.css('padding-left', (s.cwdt - s.row * s.itemwdt) / 2);
    };
    center();
    $(window).resize(center);
    winwdt = $(window).width();
    if (winwdt < 800) {
      s = sizes();
      if (s.row < 3) {
        min = 0;
        if (winwdt < 300) {
          min = 2 * s.itemwdt;
        } else {
          min = 3 * s.itemwdt;
        }
        $('body').css('min-width', min);
        s.container.css('padding-left', 0);
        setViewport(min);
      }
    }
    return null;
  });
}).call(this);
