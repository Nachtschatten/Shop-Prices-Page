form = '''
<form id=search>
	<input type=text>
</form>
'''

# insert form
$('#searchfield').append form

form = $('#search')
input = $('input', form)
cache = []

class Item
	constructor: (img) ->
		@title = img.attr 'title'
		@element = img.parent().parent()

	highlight: (flag) ->
		if flag
			@element.removeClass('nohighlight').addClass('highlight')
		else
			@element.removeClass('highlight').addClass('nohighlight')

	test: (str) ->
		if str.length is 0
			@element.removeClass('nohighlight').removeClass('highlight')
		else
			@highlight @title.toLowerCase().indexOf(str.toLowerCase()) isnt -1

# fill cache as soon as possible
$(document).bind 'itemsloaded', ->
	$('.product img').not('#example img').each ->
		cache.push new Item($(this))

form.submit (event) ->
	event.preventDefault()

input.keydown (event) ->
	if event.keyCode is 27
		input.val('')
		event.preventDefault()

input.keyup ->
	needle = input.val()
	for item in cache
		item.test needle
	null
