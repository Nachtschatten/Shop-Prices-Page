(function() {
  var Item, cache, form, input;
  form = '<form id=search>\n	<input type=text>\n</form>';
  $('#searchfield').append(form);
  form = $('#search');
  input = $('input', form);
  cache = [];
  Item = (function() {
    function Item(img) {
      this.title = img.attr('title');
      this.element = img.parent().parent();
    }
    Item.prototype.highlight = function(flag) {
      if (flag) {
        return this.element.removeClass('nohighlight').addClass('highlight');
      } else {
        return this.element.removeClass('highlight').addClass('nohighlight');
      }
    };
    Item.prototype.test = function(str) {
      if (str.length === 0) {
        return this.element.removeClass('nohighlight').removeClass('highlight');
      } else {
        return this.highlight(this.title.toLowerCase().indexOf(str.toLowerCase()) !== -1);
      }
    };
    return Item;
  })();
  $(document).bind('itemsloaded', function() {
    return $('.product img').not('#example img').each(function() {
      return cache.push(new Item($(this)));
    });
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
