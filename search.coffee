clearButton = '''
<div class="icon16" id="clearButton">
	<img src="Icons/cross-button-icon.png" alt="Clear" title="Sucheingabe l&ouml;schen">
</div>
'''

form = '''
<form id=search>
	<input type=text>
</form>
'''

# insert form
$('#searchfield').append clearButton
$('#searchfield').append form

form = $('#search')
clearButton = $('#clearButton')
clearButton.addClass('faded')
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

clearSearch = ->
	input.val('')
	clearButton.addClass('faded').removeClass('notfaded')

form.submit (event) ->
	event.preventDefault()

clearButton.click ->
	clearSearch()
	input.keyup()

input.keydown (event) ->
	if event.keyCode is 27
		clearSearch()
		event.preventDefault()

input.keyup ->
	needle = input.val()
	if needle isnt ''
		clearButton.removeClass('faded').addClass('notfaded')
	for item in cache
		item.test needle
	null
