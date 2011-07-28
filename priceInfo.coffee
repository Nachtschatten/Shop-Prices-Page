
generatePriceInfoDiv = (item) ->
	price = (c, p, p64) ->
		"<div class=#{c}>#{p}<br><span>#{p64}</span></div>"
	priceLDiv = price 'priceL', item.buy1, item.buy64
	if item.name is "Yellow flower"
		item.picurl = "http://www.minecraftwiki.net/images/4/49/Grid_Dandelion.png"
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
	if name.indexOf("sapling") isnt -1
		return 1
	if nameContainsOneOf(name, ["leaves", "birch tree", "redwood tree"])
		return 2
	if nameContainsOneOf(name, ["workbench", "furnace", "chest", "dispenser"]) and name.indexOf("plate") is -1
		return 3
	if nameContainsOneOf(name, ["jukebox", "note block"])
		return 4
	if name.indexOf("rail") isnt -1
		return 5
	if name.indexOf("bucket") isnt -1
		return 6
	if name.indexOf("music disc") isnt -1
		return 7
	if name.indexOf("minecart") isnt -1
		return 8
	if name.indexOf("leather") isnt -1
		return 15
	if name.indexOf("wood") isnt -1 or name is "birch"
		return 20
	if name.indexOf("sand") isnt -1
		return 25
	if name.indexOf("stone") isnt -1 and name.indexOf("redstone") is -1
		return 30
	if name.indexOf("rack") isnt -1
		return 30
	if name.indexOf("iron") isnt -1
		return 35
	if name.indexOf("diamond") isnt -1
		return 40
	if name.indexOf("gold") isnt -1
		return 45
	return 0

nameContainsOneOf = (name, listOfWords) ->
	for wordIndex of listOfWords
		if name.indexOf(listOfWords[wordIndex]) isnt -1
			return true
	return false

# unfortunately, this has no effect except on iPhone, Android and Palm (according to QuirksMode)
setViewport = (wdt) ->
	$('meta[name=viewport]').attr 'content', "width=#{wdt}"

$.getJSON 'price_json.php', (data) ->
	wdt = 0
	divs = $()
	for type, items of data
		items.sort((x, y) -> compare(items, x, y))
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