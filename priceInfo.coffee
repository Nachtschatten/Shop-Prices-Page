
priceFormat = (p) ->
	return '' if isNaN p
	p = ''+p
	return p if p.length <= 3
	# negative numbers
	if p[0] is '-'
		sign = '-'
		p = p.slice 1
	else
		sign = ''
	result = ''
	pos = p.length
	for i in [pos-3..-(pos%3)-1] by -3
		b = i
		b = 0 if b < 0
		result = p[b...pos] + ' ' + result
		pos = b
	sign + result.slice 0, -1

pinnedBox = null
generatePriceInfoDiv = (item) ->
	price = (c, ch1, ch2) ->
		"<div class=#{c}>#{priceFormat item.getPrice ch1}<br><span>#{priceFormat item.getPrice ch2}</span></div>"
	priceLDiv = price 'priceL', -1, -64
	item.imgurl = 'http://tools.michaelzinn.de/mc/shopadmin/itempics/unknown.png' unless item.imgurl
	iconDiv = "<div class=icon><img src='#{item.imgurl}' alt='#{item.name}' title='#{item.name}'></div>"
	priceRDiv = price 'priceR', 1, 64
	
	# horizontally centers the box according to its content relative to the product
	positionBox = (product) ->
		box = product.data 'infobox'
		pos = product.position()
		box.css 'left', pos.left + (product.width() - box.width())/2
		box.css 'top', pos.top + product.height()
		box.fadeIn 'fast'
	# shows the box. Called as event handler on mouseover
	showInfoBox = ->
		product = $(this)
		box = product.data 'infobox'
		unless box
			box = $ """
<div class=infobox>
	<h1>#{item.name} (#{item.amount})</h1>
	<div class='siminfo toggle'>Click to simulate</div>
	<form class='sim toggle'>
		<label><input type=radio name=bs value='-' checked>Kaufen</label>
		<label><input type=radio name=bs value='+'>Verkaufen</label>
		<br>
		<input type=number value=0 min=0 max=1000>
	</form>
	<div class=price></div>
</div>"""
			box.hide().data('product', product).appendTo product.offsetParent()
			$('form input', box).change changeAmount
			$('form', box).submit (event) ->
				event.preventDefault()
			product.data 'infobox', box
		positionBox product
	# hides the box. Called as event handler on mouseout
	hideInfoBox = ->
		product = $(this)
		product.data('infobox').fadeOut 'fast' unless product.data 'pinned'
	# pin the box when the user clicks the product
	pinInfoBox = (event, hide) ->
		# only one box can be pinned simultaneously
		if pinnedBox
			box = pinnedBox
			if pinnedBox isnt this
				# close the currently opened box
				pinInfoBox.apply box
				hide = true
				pinnedBox = this
			else
				# the last box will be unpinned
				pinnedBox = null
		else
			# there's no other box opened right now
			pinnedBox = this
		product = $(this)
		# invert pinned-state
		pinned = not product.data 'pinned'
		product.data('pinned', pinned)
		infobox = product.data 'infobox'
		# show more information while the box is pinned, hide a placeholder
		$('.toggle', infobox).toggle()
		# there's more content, so the position needs to be adjusted
		positionBox product
		# hide the box if asked by caller
		hideInfoBox.apply box if hide
	# the user changed something in the form. Called as event handler by the radio buttons and the number box
	changeAmount = ->
		form = $(this).closest 'form'
		product = form.parent().data('product')
		ninput = $('input[type=number]', form)
		amount = ninput.val()
		# either + for sell or - for buy
		mode = $('input:radio:checked', form).val()
		# contains amount and tax needed for price calculations
		item = product.data('item')
		# enough in stock?
		if mode is '-' and item.amount < amount
			# set to the highest possible value
			amount = item.amount
			ninput.val amount
		# hide the results when the user sets 0
		unless +amount
			# add the "click me"-hint
			form.siblings('.siminfo').addClass 'toggle'
			# hide result
			form.siblings('.price').hide()
			# reset highlight
			product.css 'background-color', 'transparent'
			# remove from shopping list (if existent)
			product.data('listitem')?.remove()
			calcShoppingList()
			# we don't need to calculate anything then
			return
		# hide the "click me"-hint
		form.siblings('.siminfo').removeClass 'toggle'
		# calculate price by combining the sign with the amount (both strings) and casting to a number
		price = item.getPrice +(mode+amount)
		# output below the form
		formatted = priceFormat price
		form.siblings('.price').show().text formatted
		# highlight the product
		product.css 'background-color', 'yellow'
		# add to the shopping list
		klass = if mode is '-' then 'buy' else 'sell'
		tr = $("<tr><td>#{amount}</td><td>#{$('img', product).attr 'title'}</td><td>#{formatted}</td></tr>").data('price', price)
		$('#shoppinglist .items .' + klass).append tr
		listitem = product.data 'listitem'
		listitem.remove() if listitem
		product.data 'listitem', tr
		calcShoppingList()
	
	return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>')
		.data('item', item)
		.hover(showInfoBox, hideInfoBox)
		.click(pinInfoBox)

# click anywhere to hide the box
$(document).click ->
	$(pinnedBox).trigger 'click', true if pinnedBox
$('.relative').click (e) -> e.stopPropagation()

calcShoppingList = ->
	calcSubtotal = (klass) ->
		table = $('#shoppinglist .items .' + klass)
		result = 0
		# each table row saves the price
		table.find('tr').not(':first').each ->
			result += $(this).data 'price'
		# set subtotal visually
		$('#shoppinglist .subtotal .' + klass).text(priceFormat result)
		result
	sell = calcSubtotal('sell')
	buy = calcSubtotal('buy')
	if sell is 0 and buy is 0
		$('#shoppinglist .list').hide()
	else
		total = sell - buy
		account = +$('#shoppinglist .account input').val()
		sub = $('#shoppinglist .account').prev()
		if account is 0
			sub.hide()
		else
			sub.text(priceFormat total).show()
			total += account
		$('#shoppinglist .total').text priceFormat total
		$('#shoppinglist .list').show()

$('#shoppinglist .account input').change calcShoppingList

# unfortunately, this has no effect except on iPhone, Android and Palm (according to QuirksMode)
setViewport = (wdt) ->
	$('meta[name=viewport]').attr 'content', "width=#{wdt}"

# JSONP request
data.load ->
	wdt = 0
	divs = $()
	for id, item of data.items
		div = generatePriceInfoDiv item
		prices = div.children '.priceL, .priceR'
		divs = divs.add prices
		$("#items").append div
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
			item = e.data 'item'
			$('.priceL span', e).text priceFormat item.getPrice -amount
			$('.priceR span', e).text priceFormat item.getPrice +amount
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