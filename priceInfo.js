(function() {
  var JsonData, calcShoppingList, category, compare, contents, generateMenuEntry, generatePriceInfoDiv, getMaterialValue, getPrice, pinnedBox, priceFormat, setViewport;
  JsonData = {
    "Bakery": [
      {
        "mcId": 297,
        "name": "Bread",
        "iconUrl": "http:\/\/www.minecraftwiki.net\/images\/5\/54\/Crafting_square_Bread.png",
        "stock": 1,
        "tax": 0,
        "components": []
      }, {
        "mcId": 296,
        "name": "Wheat",
        "iconUrl": "http:\/\/www.minecraftwiki.net\/images\/6\/6c\/Crafting_square_Wheat.png",
        "stock": 97,
        "tax": 0,
        "components": []
      }
    ],
    "Butcher": [
      {
        "mcId": 319,
        "name": "Raw Porkchop",
        "iconUrl": "http:\/\/www.minecraftwiki.net\/images\/f\/f5\/Crafting_square_Raw_Porkchop.png",
        "stock": 1,
        "tax": 0,
        "components": []
      }, {
        "mcId": 320,
        "name": "Cooked Porkchop",
        "iconUrl": "http:\/\/www.minecraftwiki.net\/images\/3\/32\/Crafting_square_Cooked_Porkchop.png",
        "stock": 1,
        "tax": 0,
        "components": []
      }
    ],
    "Smith": [
      {
        "mcId": 292,
        "name": "Iron Hoe",
        "iconUrl": "http://www.minecraftwiki.net/images/f/f8/Grid_Iron_Hoe.png",
        "stock": 2,
        "tax": 0,
        "components": []
      }, {
        "mcId": 258,
        "name": "Iron Axe",
        "iconUrl": "http://www.minecraftwiki.net/images/1/1d/Grid_Iron_Axe.png",
        "stock": 5,
        "tax": 0,
        "components": []
      }, {
        "mcId": 256,
        "name": "Iron Shovel",
        "iconUrl": "http://www.minecraftwiki.net/images/0/01/Grid_Iron_Shovel.png",
        "stock": 1,
        "tax": 0,
        "components": []
      }, {
        "mcId": 257,
        "name": "Iron Pickaxe",
        "iconUrl": "http://www.minecraftwiki.net/images/1/1d/Grid_Iron_Pickaxe.png",
        "stock": 10,
        "tax": 0,
        "components": []
      }, {
        "mcId": 267,
        "name": "Iron Sword",
        "iconUrl": "http://www.minecraftwiki.net/images/d/d5/Grid_Iron_Sword.png",
        "stock": 2,
        "tax": 0,
        "components": []
      }
    ],
    "Jeweller": [
      {
        "mcId": 264,
        "name": "Diamond",
        "iconUrl": "http://www.minecraftwiki.net/images/c/cf/Grid_Diamond_(Gem).png",
        "stock": 99,
        "tax": 0,
        "components": []
      }
    ]
  };
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
      $('#shoppinglist .items .' + klass).append(tr);
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
  generateMenuEntry = function() {
    return false;
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
  compare = function(items, item1, item2) {
    var matDifference;
    matDifference = getMaterialValue(item1.name) - getMaterialValue(item2.name);
    if (matDifference === 0) {
      return item1.id - item2.id;
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
  for (category in JsonData) {
    contents = JsonData[category];
    $('#categories').append($('<li />').text(category).click(function() {
      return $('#shopViews > div').eq($(this).index()).slideToggle();
    }));
    $('#shopViews').append($('<hr class="spacer" />')).append($('<div id="' + category + 'View" class="shopView" />').text('div for ' + category));
  }
  /*	
  	
  # JSONP request
  $.getJSON 'http://tools.michaelzinn.de/mc/shopadmin/price_json.php?callback=?', (data) ->
  	wdt = 0
  	divs = $()
  	for type, items of data
  		items.sort (x, y) -> compare items, x, y
  		for item in items
  			div = generatePriceInfoDiv item
  			prices = div.children '.priceL, .priceR'
  			divs = divs.add prices
  			$("##{type}").append div
  			for e in prices
  				e = $(e)
  				wdt = e.width() if e.width() > wdt
  	divs.width wdt
  	$(document).trigger 'itemsloaded'
  	
  	# spinner for second price
  	$('#amountspinner').change ->
  		amount = $(this).val()
  		return if isNaN(amount) or amount < 2
  		$('.amount2').text amount
  		$('.product').not('#example').each ->
  			e = $(this)
  			pdata = e.data 'pdata'
  			$('.priceL span', e).text priceFormat getPrice -amount, pdata.amount, pdata.tax
  			$('.priceR span', e).text priceFormat getPrice +amount, pdata.amount, pdata.tax
  	.parent().submit (event) ->
  		event.preventDefault()
  	sizes = ->
  		container = $('#blocks, #items')
  		itemwdt = $('.product', container).outerWidth(true)
  		cwdt = container.width()
  		container: container
  		itemwdt: itemwdt
  		cwdt: cwdt
  		row: Math.floor(cwdt/itemwdt)
  	center = ->
  		s = sizes()
  		s.container.css 'padding-left', (s.cwdt - s.row*s.itemwdt)/2
  	center()
  	$(window).resize center
  	
  	# viewport for mobile browsers
  	winwdt = $(window).width()
  	if winwdt < 800
  		s = sizes()
  		if s.row < 3
  			min = 0
  			if winwdt < 300
  				min = 2*s.itemwdt
  			else
  				min = 3*s.itemwdt
  			$('body').css 'min-width', min
  			s.container.css 'padding-left', 0
  			setViewport min
  	null
  
  */
}).call(this);
