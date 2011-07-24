(function() {
  var compare, generatePriceInfoDiv, getMaterialValue;
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
  compare = function(item1, item2) {
    var matDifference;
    matDifference = getMaterialValue(item1.name) - getMaterialValue(item2.name);
    if (matDifference === 0) {
      return item1.id - item2.id;
    }
    return matDifference;
  };
  getMaterialValue = function(name) {
    name = name.toLowerCase();
    if (name.indexOf("wood") !== -1) {
      return 1;
    }
    if (name.indexOf("stone") !== -1 && name.indexOf("redstone") === -1) {
      return 2;
    }
    if (name.indexOf("rack") !== -1) {
      return 2;
    }
    if (name.indexOf("iron") !== -1) {
      return 3;
    }
    if (name.indexOf("diamond") !== -1) {
      return 4;
    }
    if (name.indexOf("gold") !== -1) {
      return 5;
    }
    return 0;
  };
  $.getJSON('price_json.php', function(data) {
    var item, items, type, _i, _len;
    for (type in data) {
      items = data[type];
      items.sort(compare);
      alert(type);
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        $("#" + type).append(generatePriceInfoDiv(item));
      }
    }
    $(document).trigger('itemsloaded');
    return null;
  });
}).call(this);
