(function() {
  var Item, cache, clearButton, clearSearch, form, input;
  clearButton = '<div class="icon16" id="clearButton">\n	<img src="Icons/cross-button-icon.png" alt="Clear" title="Sucheingabe l&ouml;schen">\n</div>';
  form = '<form id=search>\n	<input type=text>\n</form>';
  $('#searchfield').append(clearButton);
  $('#searchfield').append(form);
  form = $('#search');
  clearButton = $('#clearButton');
  clearButton.addClass('faded');
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
  clearSearch = function() {
    input.val('');
    return clearButton.addClass('faded').removeClass('notfaded');
  };
  form.submit(function(event) {
    return event.preventDefault();
  });
  clearButton.click(function() {
    clearSearch();
    return input.keyup();
  });
  input.keydown(function(event) {
    if (event.keyCode === 27) {
      clearSearch();
      return event.preventDefault();
    }
  });
  input.keyup(function() {
    var item, needle, _i, _len;
    needle = input.val();
    if (needle !== '') {
      clearButton.removeClass('faded').addClass('notfaded');
    }
    for (_i = 0, _len = cache.length; _i < _len; _i++) {
      item = cache[_i];
      item.test(needle);
    }
    return null;
  });
}).call(this);
