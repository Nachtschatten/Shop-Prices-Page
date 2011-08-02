(function() {
  var calcShoppingList, compare, generatePriceInfoDiv, getMaterialValue, getPrice, pinnedBox, priceFormat, setViewport;
  getPrice = function(change, amount, tax) {
    var a, b, f, price;
    a = 0.0373495858135303;
    b = 0.731944262776933;
    f = function(x) {
      return Math.log(x + a / Math.pow(x, b));
    };
    if (change === 0) {
      return 0;
    }
    if (change > 0) {
      price = f(amount + change + 0.5) - f(amount + 0.5);
    } else {
      price = f(amount + 0.5) - f(amount + change + 0.5);
      price *= 1 + tax / 100;
    }
    price *= 10000;
    return Math.round(price);
  };
  priceFormat = function(p) {
    var b, i, pos, result, sign, _ref, _ref2, _step;
    if (isNaN(p)) {
      return '';
    }
    p = '' + p;
    if (p.length <= 3) {
      return p;
    }
    if (p[0] === '-') {
      sign = '-';
      p = p.slice(1);
    } else {
      sign = '';
    }
    result = '';
    pos = p.length;
    for (i = _ref = pos - 3, _ref2 = -(pos % 3) - 1, _step = -3; _ref <= _ref2 ? i <= _ref2 : i >= _ref2; i += _step) {
      b = i;
      if (b < 0) {
        b = 0;
      }
      result = p.slice(b, pos) + ' ' + result;
      pos = b;
    }
    return sign + result.slice(0, -1);
  };
  pinnedBox = null;
  generatePriceInfoDiv = function(item) {
    var a, changeAmount, hideInfoBox, iconDiv, pinInfoBox, positionBox, price, priceLDiv, priceRDiv, showInfoBox, t;
    a = item.amount;
    t = item.tax || 16;
    price = function(c, ch1, ch2) {
      return "<div class=" + c + ">" + (priceFormat(getPrice(ch1, a, t))) + "<br><span>" + (priceFormat(getPrice(ch2, a, t))) + "</span></div>";
    };
    priceLDiv = price('priceL', -1, -64);
    if (item.name === "Yellow flower") {
      item.picurl = "http://www.minecraftwiki.net/images/4/49/Grid_Dandelion.png";
    }
    if (!item.picurl) {
      item.picurl = 'http://tools.michaelzinn.de/mc/shopadmin/itempics/unknown.png';
    }
    iconDiv = "<div class=icon><img src='" + item.picurl + "' alt='" + item.name + "' title='" + item.name + "'></div>";
    priceRDiv = price('priceR', 1, 64);
    positionBox = function(product) {
      var box, pos;
      box = product.data('infobox');
      pos = product.position();
      box.css('left', pos.left + (product.width() - box.width()) / 2);
      box.css('top', pos.top + product.height());
      return box.fadeIn('fast');
    };
    showInfoBox = function() {
      var box, product;
      product = $(this);
      box = product.data('infobox');
      if (!box) {
        box = $("<div class=infobox>\n	<h1>" + item.name + "</h1>\n	<div class='siminfo toggle'>Click to simulate</div>\n	<form class='sim toggle'>\n		<label><input type=radio name=bs value='-' checked>Kaufen</label>\n		<label><input type=radio name=bs value='+'>Verkaufen</label>\n		<br>\n		<input type=number value=0 min=0 max=1000>\n	</form>\n	<div class=price></div>\n</div>");
        box.hide().data('product', product).appendTo(product.offsetParent());
        $('form input', box).change(changeAmount);
        $('form', box).submit(function(event) {
          return event.preventDefault();
        });
        product.data('infobox', box);
      }
      return positionBox(product);
    };
    hideInfoBox = function() {
      var product;
      product = $(this);
      if (!product.data('pinned')) {
        return product.data('infobox').fadeOut('fast');
      }
    };
    pinInfoBox = function() {
      var box, infobox, pinned, product;
      if (pinnedBox) {
        if (pinnedBox !== this) {
          box = pinnedBox;
          pinInfoBox.apply(box);
          hideInfoBox.apply(box);
          pinnedBox = this;
        } else {
          pinnedBox = null;
        }
      } else {
        pinnedBox = this;
      }
      product = $(this);
      pinned = !product.data('pinned');
      product.data('pinned', pinned);
      infobox = product.data('infobox');
      $('.toggle', infobox).toggle();
      return positionBox(product);
    };
    changeAmount = function() {
      var amount, form, formatted, klass, listitem, mode, ninput, pdata, product, tr, _ref;
      form = $(this).closest('form');
      product = form.parent().data('product');
      ninput = $('input[type=number]', form);
      amount = ninput.val();
      mode = $('input:radio:checked', form).val();
      pdata = product.data('pdata');
      if (mode === '-' && pdata.amount < amount) {
        amount = pdata.amount;
        ninput.val(amount);
      }
      if (!+amount) {
        form.siblings('.siminfo').addClass('toggle');
        form.siblings('.price').hide();
        product.css('background-color', 'transparent');
        if ((_ref = product.data('listitem')) != null) {
          _ref.remove();
        }
        calcShoppingList();
        return;
      }
      form.siblings('.siminfo').removeClass('toggle');
      price = getPrice(+(mode + amount), pdata.amount, pdata.tax);
      formatted = priceFormat(price);
      form.siblings('.price').show().text(formatted);
      product.css('background-color', 'yellow');
      klass = mode === '-' ? 'buy' : 'sell';
      tr = $("<tr><td>" + amount + "</td><td>" + ($('img', product).attr('title')) + "</td><td>" + formatted + "</td></tr>").data('price', price);
      $('#shoppinglist .' + klass).append(tr);
      listitem = product.data('listitem');
      if (listitem) {
        listitem.remove();
      }
      product.data('listitem', tr);
      return calcShoppingList();
    };
    return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>').data('pdata', {
      amount: a,
      tax: t
    }).hover(showInfoBox, hideInfoBox).click(pinInfoBox);
  };
  calcShoppingList = function() {
    var calcSubtotal, total;
    calcSubtotal = function(klass) {
      var result, table;
      table = $('#shoppinglist .' + klass);
      result = 0;
      table.find('tr').not(':first').each(function() {
        return result += $(this).data('price');
      });
      table.next().text(priceFormat(result));
      return result;
    };
    total = calcSubtotal('sell') - calcSubtotal('buy');
    return $('#shoppinglist .total').text(priceFormat(total));
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
    if (nameContains('workbench', 'furnace', 'chest', 'dispenser') && !nameContains('plate')) {
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
    if (nameContains('wood') || name === 'birch') {
      return 20;
    }
    if (nameContains('sand')) {
      return 25;
    }
    if (nameContains('stone') && !nameContains('redstone')) {
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
  $.getJSON('http://tools.michaelzinn.de/mc/shopadmin/price_json.php?callback=?', function(data) {
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
    $('#amountspinner').change(function() {
      var amount;
      amount = $(this).val();
      if (isNaN(amount) || amount < 2) {
        return;
      }
      $('.amount2').text(amount);
      return $('.product').not('#example').each(function() {
        var pdata;
        e = $(this);
        pdata = e.data('pdata');
        $('.priceL span', e).text(priceFormat(getPrice(-amount, pdata.amount, pdata.tax)));
        return $('.priceR span', e).text(priceFormat(getPrice(+amount, pdata.amount, pdata.tax)));
      });
    }).parent().submit(function(event) {
      return event.preventDefault();
    });
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
