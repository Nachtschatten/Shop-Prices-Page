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
		@element.css 'opacity', if flag then '1.0' else '0.1'

	test: (str) ->
		@highlight str.length is 0 or @title.toLowerCase().indexOf(str.toLowerCase()) isnt -1

# fill cache as soon as possible
$(document).bind 'itemsloaded', ->
	$('.product img').not('#example img').each ->
		cache.push new Item($(this))

form.submit (event) ->
	event.preventDefault()

input.keyup ->
	needle = input.val()
	for item in cache
		item.test needle
	null
