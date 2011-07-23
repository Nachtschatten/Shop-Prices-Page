(function() {
  var Item, cache, form, input;
  form = '<form id=search>\n	<input type=text autofocus=autofocus><button type=submit>Suchen</button>\n</form>';
  $('body > div:first').append(form);
  form = $('#search');
  input = $('input', form);
  cache = [];
  Item = (function() {
    function Item(img) {
      this.title = img.attr('title');
      this.element = img.parent().parent();
    }
    Item.prototype.highlight = function(flag) {
      var color;
      color = flag ? '#B0E0E6' : 'transparent';
      return this.element.css('background-color', color);
    };
    Item.prototype.test = function(str) {
      return this.highlight(str.length !== 0 && this.title.toLowerCase().indexOf(str.toLowerCase()) !== -1);
    };
    return Item;
  })();
  $('.product img').not('#example img').each(function() {
    return cache.push(new Item($(this)));
  });
  form.submit(function(event) {
    return event.preventDefault();
  });
  input.keyup(function() {
    var item, needle, _i, _len;
    needle = input.val();
    for (_i = 0, _len = cache.length; _i < _len; _i++) {
      item = cache[_i];
      item.test(needle);
    }
    return null;
  });
}).call(this);
