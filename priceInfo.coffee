
generatePriceInfoDiv = (item) ->
	price = (c, p, p64) ->
		"<div class=#{c}>#{p}<br><span>#{p64}</span></div>"
	priceLDiv = price 'priceL', item.buy1, item.buy64
	iconDiv = "<div class=icon><img src='#{item.picurl}' alt='#{item.name}' title='#{item.name}'></div>"
	priceRDiv = price 'priceR', item.sell1, item.sell64

	return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>');

$.getJSON 'price_json.php', (data) ->
	wdt = 0
	divs = $()
	for type, items of data
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
	
	center = ->
		container = $('#blocks, #items')
		itemwdt = $('.product', container).outerWidth(true)
		cwdt = container.width()
		row = Math.floor(cwdt/itemwdt)
		container.css 'padding-left', (cwdt - row*itemwdt)/2
	center()
	$(window).resize center
	null