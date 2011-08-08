(function() {
  var Item, Shop;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  Item = (function() {
    function Item(item) {
      var key, val;
      for (key in item) {
        val = item[key];
        this[key] = val;
      }
    }
    Item.prototype.getPrice = function(change) {
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
        price = f(this.amount + change + 0.5) - f(this.amount + 0.5);
      } else {
        price = f(this.amount + 0.5) - f(this.amount + change + 0.5);
        price *= 1 + this.tax / 100;
      }
      price *= 10000;
      return Math.round(price);
    };
    return Item;
  })();
  Shop = (function() {
    function Shop(id, name) {
      this.id = id;
      this.name = name;
    }
    Shop.prototype.getItems = function() {
      var item, key, _ref, _ref2, _results;
      _ref = data.items;
      _results = [];
      for (key in _ref) {
        item = _ref[key];
        if (_ref2 = this.id, __indexOf.call(item.shops, _ref2) >= 0) {
          _results.push(item);
        }
      }
      return _results;
    };
    return Shop;
  })();
  window.data = {
    load: function(fn) {
      return $.getJSON('http://localhost/price_json.php?callback=?', function(data) {
        var key, val, _ref, _ref2;
        _ref = data.shops;
        for (key in _ref) {
          val = _ref[key];
          data.shops[key] = new Shop(key, val);
        }
        _ref2 = data.items;
        for (key in _ref2) {
          val = _ref2[key];
          data.items[key] = new Item(val);
        }
        window.data.shops = data.shops;
        window.data.items = data.items;
        return fn();
      });
    }
  };
}).call(this);
