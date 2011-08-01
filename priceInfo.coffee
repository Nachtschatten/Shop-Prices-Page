
getPrice = (change, amount, tax) ->
	a = 0.0373495858135303
	b = 0.731944262776933
	# f(x) = log(x + a/x^b)
	f = (x) -> Math.log(x + a/Math.pow(x, b))
	
	return 0 if change is 0
	if change > 0 # sell
		price = f(amount+change+0.5) - f(amount+0.5)
	else # buy
		price = f(amount+0.5) - f(amount+change+0.5)
		price *= 1 + tax/100
	price *= 10000
	Math.round price

priceFormat = (p) ->
	return '' if isNaN p
	p = ''+p
	return p if p.length <= 3
	result = ''
	pos = p.length
	for i in [pos-3..-(pos%3)-1] by -3
		b = i
		b = 0 if b < 0
		result = p[b...pos] + ' ' + result
		pos = b
	result.slice 0, -1

generatePriceInfoDiv = (item) ->
	a = item.amount
	# tax isn't currently included
	t = item.tax or 16
	price = (c, ch1, ch2) ->
		"<div class=#{c}>#{priceFormat getPrice ch1, a, t}<br><span>#{priceFormat getPrice ch2, a, t}</span></div>"
	priceLDiv = price 'priceL', -1, -64
	if item.name is "Yellow flower"
		item.picurl = "http://www.minecraftwiki.net/images/4/49/Grid_Dandelion.png"
	item.picurl = 'http://tools.michaelzinn.de/mc/shopadmin/itempics/unknown.png' unless item.picurl
	iconDiv = "<div class=icon><img src='#{item.picurl}' alt='#{item.name}' title='#{item.name}'></div>"
	priceRDiv = price 'priceR', 1, 64

	return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>').data('pdata', amount: a, tax: t);

compare = (items, item1, item2) ->
	matDifference = getMaterialValue(item1.name) - getMaterialValue(item2.name)
	if matDifference is 0
		return items.indexOf(item1) - items.indexOf(item2)
	return matDifference

getMaterialValue = (name) ->
	name = name.toLowerCase()
	nameContains = ->
		for word in arguments
			return true if name.indexOf(word) isnt -1
		false
	
	return  1 if nameContains 'sapling'
	return  2 if nameContains 'leaves', 'birch tree', 'redwood tree'
	return  3 if nameContains('workbench', 'furnace', 'chest', 'dispenser') and not nameContains 'plate'
	return  4 if nameContains 'jukebox', 'note block'
	return  5 if nameContains 'rail'
	return  6 if nameContains 'bucket'
	return  7 if nameContains 'music disc'
	return  8 if nameContains 'minecart'
	return 15 if nameContains 'leather'
	return 20 if nameContains('wood') or name is 'birch'
	return 25 if nameContains 'sand'
	return 30 if nameContains('stone') and not nameContains 'redstone'
	return 30 if nameContains 'rack'
	return 35 if nameContains 'iron'
	return 40 if nameContains 'diamond'
	return 45 if nameContains 'gold'
	return  0

# unfortunately, this has no effect except on iPhone, Android and Palm (according to QuirksMode)
setViewport = (wdt) ->
	$('meta[name=viewport]').attr 'content', "width=#{wdt}"

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