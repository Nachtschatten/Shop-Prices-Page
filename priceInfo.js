(function() {
  var calcShoppingList, generatePriceInfoDiv, pinnedBox, priceFormat, setViewport;
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
    var changeAmount, hideInfoBox, iconDiv, pinInfoBox, positionBox, price, priceLDiv, priceRDiv, showInfoBox;
    price = function(c, ch1, ch2) {
      return "<div class=" + c + ">" + (priceFormat(item.getPrice(ch1))) + "<br><span>" + (priceFormat(item.getPrice(ch2))) + "</span></div>";
    };
    priceLDiv = price('priceL', -1, -64);
    if (!item.imgurl) {
      item.imgurl = 'http://tools.michaelzinn.de/mc/shopadmin/itempics/unknown.png';
    }
    iconDiv = "<div class=icon><img src='" + item.imgurl + "' alt='" + item.name + "' title='" + item.name + "'></div>";
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
        box = $("<div class=infobox>\n	<h1>" + item.name + " (" + item.amount + ")</h1>\n	<div class='siminfo toggle'>Click to simulate</div>\n	<form class='sim toggle'>\n		<label><input type=radio name=bs value='-' checked>Kaufen</label>\n		<label><input type=radio name=bs value='+'>Verkaufen</label>\n		<br>\n		<input type=number value=0 min=0 max=1000>\n	</form>\n	<div class=price></div>\n</div>");
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
    pinInfoBox = function(event, hide) {
      var box, infobox, pinned, product;
      if (pinnedBox) {
        box = pinnedBox;
        if (pinnedBox !== this) {
          pinInfoBox.apply(box);
          hide = true;
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
      positionBox(product);
      if (hide) {
        return hideInfoBox.apply(box);
      }
    };
    changeAmount = function() {
      var amount, form, formatted, klass, listitem, mode, ninput, product, tr, _ref;
      form = $(this).closest('form');
      product = form.parent().data('product');
      ninput = $('input[type=number]', form);
      amount = ninput.val();
      mode = $('input:radio:checked', form).val();
      item = product.data('item');
      if (mode === '-' && item.amount < amount) {
        amount = item.amount;
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
      price = item.getPrice(+(mode + amount));
      formatted = priceFormat(price);
      form.siblings('.price').show().text(formatted);
      product.css('background-color', 'yellow');
      klass = mode === '-' ? 'buy' : 'sell';
      tr = $("<tr><td>" + amount + "</td><td>" + ($('img', product).attr('title')) + "</td><td>" + formatted + "</td></tr>").data('price', price);
      $('#shoppinglist .items .' + klass).append(tr);
      listitem = product.data('listitem');
      if (listitem) {
        listitem.remove();
      }
      product.data('listitem', tr);
      return calcShoppingList();
    };
    return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>').data('item', item).hover(showInfoBox, hideInfoBox).click(pinInfoBox);
  };
  $(document).click(function() {
    if (pinnedBox) {
      return $(pinnedBox).trigger('click', true);
    }
  });
  $('.relative').click(function(e) {
    return e.stopPropagation();
  });
  calcShoppingList = function() {
    var account, buy, calcSubtotal, sell, sub, total;
    calcSubtotal = function(klass) {
      var result, table;
      table = $('#shoppinglist .items .' + klass);
      result = 0;
      table.find('tr').not(':first').each(function() {
        return result += $(this).data('price');
      });
      $('#shoppinglist .subtotal .' + klass).text(priceFormat(result));
      return result;
    };
    sell = calcSubtotal('sell');
    buy = calcSubtotal('buy');
    if (sell === 0 && buy === 0) {
      return $('#shoppinglist .list').hide();
    } else {
      total = sell - buy;
      account = +$('#shoppinglist .account input').val();
      sub = $('#shoppinglist .account').prev();
      if (account === 0) {
        sub.hide();
      } else {
        sub.text(priceFormat(total)).show();
        total += account;
      }
      $('#shoppinglist .total').text(priceFormat(total));
      return $('#shoppinglist .list').show();
    }
  };
  $('#shoppinglist .account input').change(calcShoppingList);
  setViewport = function(wdt) {
    return $('meta[name=viewport]').attr('content', "width=" + wdt);
  };
  data.load(function() {
    var sizes;
    (function() {
      var div, divs, e, id, item, prices, wdt, _i, _len, _ref;
      wdt = 0;
      divs = $();
      _ref = data.items;
      for (id in _ref) {
        item = _ref[id];
        div = generatePriceInfoDiv(item);
        item.e = div;
        prices = div.children('.priceL, .priceR');
        divs = divs.add(prices);
        $("#items").append(div);
        for (_i = 0, _len = prices.length; _i < _len; _i++) {
          e = prices[_i];
          e = $(e);
          if (e.width() > wdt) {
            wdt = e.width();
          }
        }
      }
      divs.width(wdt);
      return $(document).trigger('itemsloaded');
    })();
    $('#amountspinner').change(function() {
      var amount;
      amount = $(this).val();
      if (isNaN(amount) || amount < 2 || amount === '64' && isNaN(localStorage['mcshop.amount2'])) {
        return;
      }
      localStorage['mcshop.amount2'] = amount;
      $('.amount2').text(amount);
      return $('.product').not('#example').each(function() {
        var e, item;
        e = $(this);
        item = e.data('item');
        $('.priceL span', e).text(priceFormat(item.getPrice(-amount)));
        return $('.priceR span', e).text(priceFormat(item.getPrice(+amount)));
      });
    }).val(+localStorage['mcshop.amount2'] || 64).change().parent().submit(function(event) {
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
    (function() {
      var center;
      center = function() {
        var s;
        s = sizes();
        return s.container.css('padding-left', (s.cwdt - s.row * s.itemwdt) / 2);
      };
      center();
      return $(window).resize(center);
    })();
    (function() {
      var e, key, selected, shop, shops, _fn, _ref;
      shops = $('#shops');
      _ref = data.shops;
      _fn = function(shop, e) {
        e.click(function() {
          var ch, item, _i, _len, _ref2;
          e.toggleClass('selected');
          ch = e.hasClass('selected') ? 1 : -1;
          _ref2 = shop.getItems();
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            item = _ref2[_i];
            item.shopSelected += ch;
            if (isNaN(item.shopSelected)) {
              item.shopSelected = 1;
            }
            item.e.toggleClass('selected', item.shopSelected > 0);
          }
          selected += ch;
          return $('#items').toggleClass('hideItems', selected > 0);
        });
        e.dblclick(function() {
          $('#shops .shop.selected').not(e).click();
          if (!e.hasClass('selected')) {
            return e.click();
          }
        });
        return e.mousedown(function() {
          return false;
        });
      };
      for (key in _ref) {
        shop = _ref[key];
        e = $("<div class=shop>" + shop.name + "</div>");
        shops.append(e);
        shop.e = e;
        selected = 0;
        _fn(shop, e);
      }
      return null;
    })();
    (function() {
      var min, s, winwdt;
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
          return setViewport(min);
        }
      }
    })();
    return null;
  });
}).call(this);
