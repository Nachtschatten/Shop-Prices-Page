
generatePriceInfoDiv = (item) ->
	price = (c, p, p64) ->
		"<div class=#{c}>#{p}<br><span>#{p64}</span></div>"
	priceLDiv = price 'priceL', item.buy1, item.buy64
	# quick fix
	if item.name is "Yellow flower"
		item.picurl = "http://www.minecraftwiki.net/images/4/49/Grid_Dandelion.png"
	else
		item.picurl = item.picurl.replace 'www.kitania.de', 'tools.michaelzinn.de'
	iconDiv = "<div class=icon><img src='#{item.picurl}' alt='#{item.name}' title='#{item.name}'></div>"
	priceRDiv = price 'priceR', item.sell1, item.sell64

	return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>');

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
	return  3 if nameContains 'workbench', 'furnace', 'chest', 'dispenser' and not nameContains 'plate'
	return  4 if nameContains 'jukebox', 'note block'
	return  5 if nameContains 'rail'
	return  6 if nameContains 'bucket'
	return  7 if nameContains 'music disc'
	return  8 if nameContains 'minecart'
	return 15 if nameContains 'leather'
	return 20 if nameContains 'wood' or name is 'birch'
	return 25 if nameContains 'sand'
	return 30 if nameContains 'stone' and not nameContains 'redstone'
	return 30 if nameContains 'rack'
	return 35 if nameContains 'iron'
	return 40 if nameContains 'diamond'
	return 45 if nameContains 'gold'
	return  0

# unfortunately, this has no effect except on iPhone, Android and Palm (according to QuirksMode)
setViewport = (wdt) ->
	$('meta[name=viewport]').attr 'content', "width=#{wdt}"

$.getJSON 'price_json.php', (data) ->
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