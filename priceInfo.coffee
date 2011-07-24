
generatePriceInfoDiv = (item) ->
	price = (c, p, p64) ->
		"<div class=#{c}>#{p}<br><span>#{p64}</span></div>"
	priceLDiv = price 'priceL', item.buy1, item.buy64
	iconDiv = "<div class=icon><img src='#{item.picurl}' alt='#{item.name}' title='#{item.name}'></div>"
	priceRDiv = price 'priceR', item.sell1, item.sell64

	return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>');

# unfortunately, this has no effect except on iPhone, Android and Palm (according to QuirksMode)
setViewport = (wdt) ->
	$('meta[name=viewport]').attr 'content', "width=#{wdt}"

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