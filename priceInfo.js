(function() {
  var compare, generatePriceInfoDiv, getMaterialValue, setViewport;
  generatePriceInfoDiv = function(item) {
    var hideInfoBox, iconDiv, price, priceLDiv, priceRDiv, showInfoBox;
    price = function(c, p, p64) {
      return "<div class=" + c + ">" + p + "<br><span>" + p64 + "</span></div>";
    };
    priceLDiv = price('priceL', item.buy1, item.buy64);
    if (item.name === "Yellow flower") {
      item.picurl = "http://www.minecraftwiki.net/images/4/49/Grid_Dandelion.png";
    } else {
      item.picurl = item.picurl.replace('www.kitania.de', 'tools.michaelzinn.de');
    }
    iconDiv = "<div class=icon><img src='" + item.picurl + "' alt='" + item.name + "' title='" + item.name + "'></div>";
    priceRDiv = price('priceR', item.sell1, item.sell64);
    showInfoBox = function() {
      var box, pos, product;
      product = $(this);
      box = product.data('infobox');
      if (!box) {
        box = $("<div class=infobox>\n	<h1>" + item.name + "</h1>\n</div>");
        box.hide().appendTo(product.offsetParent());
        product.data('infobox', box);
      }
      pos = product.position();
      box.css('left', pos.left + (product.width() - box.width()) / 2);
      box.css('top', pos.top + product.height());
      return box.fadeIn('fast');
    };
    hideInfoBox = function() {
      return $(this).data('infobox').fadeOut('fast');
    };
    return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>').hover(showInfoBox, hideInfoBox);
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
    var nameContains;
    name = name.toLowerCase();
    nameContains = function() {
      var word, _i, _len;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        word = arguments[_i];
        if (name.indexOf(word) !== -1) {
          return true;
        }
      }
      return false;
    };
    if (nameContains('sapling')) {
      return 1;
    }
    if (nameContains('leaves', 'birch tree', 'redwood tree')) {
      return 2;
    }
    if (nameContains('workbench', 'furnace', 'chest', 'dispenser' && !nameContains('plate'))) {
      return 3;
    }
    if (nameContains('jukebox', 'note block')) {
      return 4;
    }
    if (nameContains('rail')) {
      return 5;
    }
    if (nameContains('bucket')) {
      return 6;
    }
    if (nameContains('music disc')) {
      return 7;
    }
    if (nameContains('minecart')) {
      return 8;
    }
    if (nameContains('leather')) {
      return 15;
    }
    if (nameContains('wood' || name === 'birch')) {
      return 20;
    }
    if (nameContains('sand')) {
      return 25;
    }
    if (nameContains('stone' && !nameContains('redstone'))) {
      return 30;
    }
    if (nameContains('rack')) {
      return 30;
    }
    if (nameContains('iron')) {
      return 35;
    }
    if (nameContains('diamond')) {
      return 40;
    }
    if (nameContains('gold')) {
      return 45;
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
