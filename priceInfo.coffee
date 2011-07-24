
generatePriceInfoDiv = (item) ->
	price = (c, p, p64) ->
		"<div class=#{c}>#{p}<br><span>#{p64}</span></div>"
	priceLDiv = price 'priceL', item.buy1, item.buy64
	iconDiv = "<div class=icon><img src='#{item.picurl}' alt='#{item.name}' title='#{item.name}'></div>"
	priceRDiv = price 'priceR', item.sell1, item.sell64

	return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>');


compare = (item1, item2) ->
	matDifference = getMaterialValue(item1.name) - getMaterialValue(item2.name)
	if matDifference is 0
		return item1.id - item2.id
	return matDifference

getMaterialValue = (name) ->
	name = name.toLowerCase()
	if name.indexOf("wood") isnt -1
		return 1
	if name.indexOf("stone") isnt -1 and name.indexOf("redstone") is -1
		return 2
	if name.indexOf("rack") isnt -1
		return 2
	if name.indexOf("iron") isnt -1
		return 3
	if name.indexOf("diamond") isnt -1
		return 4
	if name.indexOf("gold") isnt -1
		return 5
	return 0

$.getJSON 'price_json.php', (data) ->
	for type, items of data
		items.sort(compare)
		for item in items
			$("##{type}").append generatePriceInfoDiv item
	$(document).trigger 'itemsloaded'
	null