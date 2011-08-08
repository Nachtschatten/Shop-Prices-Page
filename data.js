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
      if (this.components) {
        return this.getCompoundPrice(change);
      }
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
    Item.prototype.getCompoundPrice = function(change) {
      var component, id, item, num, price, _i, _len, _ref;
      if (!this.components) {
        return this.getPrice(change);
      }
      if (change === 0) {
        return 0;
      }
      price = 0;
      _ref = this.components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        id = component[0], num = component[1];
        item = data.items[id];
        if (!item) {
          return NaN;
        }
        price += item.getPrice(change * num);
        if (isNaN(price)) {
          return NaN;
        }
      }
      return price;
    };
    Item.prototype.calcAmount = function() {
      if (this.components) {
        this.amount = 0;
        while (this.getCompoundPrice(-++this.amount)) {
          null;
        }
        return --this.amount;
      }
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
        var compound, item, key, val, _i, _len, _ref, _ref2;
        _ref = data.shops;
        for (key in _ref) {
          val = _ref[key];
          data.shops[key] = new Shop(key, val);
        }
        compound = [];
        _ref2 = data.items;
        for (key in _ref2) {
          val = _ref2[key];
          item = new Item(val);
          data.items[key] = item;
          if (item.components) {
            compound.push(item);
          }
        }
        window.data.shops = data.shops;
        window.data.items = data.items;
        for (_i = 0, _len = compound.length; _i < _len; _i++) {
          item = compound[_i];
          item.calcAmount();
        }
        return fn();
      });
    }
  };
}).call(this);
