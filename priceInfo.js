(function() {
  var compare, generatePriceInfoDiv, getMaterialValue, setViewport;
  generatePriceInfoDiv = function(item) {
    var iconDiv, price, priceLDiv, priceRDiv;
    price = function(c, p, p64) {
      return "<div class=" + c + ">" + p + "<br><span>" + p64 + "</span></div>";
    };
    priceLDiv = price('priceL', item.buy1, item.buy64);
    if (item.name === "Yellow flower") {
      item.picurl = "http://www.minecraftwiki.net/images/4/49/Grid_Dandelion.png";
    }
    iconDiv = "<div class=icon><img src='" + item.picurl + "' alt='" + item.name + "' title='" + item.name + "'></div>";
    priceRDiv = price('priceR', item.sell1, item.sell64);
    return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>');
  };
  compare = function(items, item1, item2) {
    var matDifference;
    matDifference = getMaterialValue(item1.name) - getMaterialValue(item2.name);
    if (matDifference === 0) {
      return items.indexOf(item1) - items.indexOf(item2);
    }
    return matDifference;
  };
  getMaterialValue = function(name) {
    name = name.toLowerCase();
    if (name.indexOf("leather") !== -1) {
      return 1;
    }
    if (name.indexOf("wood") !== -1) {
      return 2;
    }
    if (name.indexOf("sand") !== -1) {
      return 3;
    }
    if (name.indexOf("stone") !== -1 && name.indexOf("redstone") === -1) {
      return 4;
    }
    if (name.indexOf("rack") !== -1) {
      return 4;
    }
    if (name.indexOf("iron") !== -1) {
      return 5;
    }
    if (name.indexOf("diamond") !== -1) {
      return 6;
    }
    if (name.indexOf("gold") !== -1) {
      return 7;
    }
    return 0;
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
      items.sort(function(x, y) {
        return compare(items, x, y);
      });
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
