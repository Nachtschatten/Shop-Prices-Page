
class Item
	constructor: (item) ->
		@[key] = val for key, val of item
	
	getPrice: (change) ->
		a = 0.0373495858135303
		b = 0.731944262776933
		# f(x) = log(x + a/x^b)
		f = (x) -> Math.log(x + a/Math.pow(x, b))
		
		return 0 if change is 0
		if change > 0 # sell
			price = f(@amount+change+0.5) - f(@amount+0.5)
		else # buy
			price = f(@amount+0.5) - f(@amount+change+0.5)
			price *= 1 + @tax/100
		price *= 10000
		Math.round price
	
class Shop
	constructor: (@id, @name) ->
		
	getItems: ->
		item for key, item of data.items when @id in item.shops

window.data = {
	load: (fn) ->
		$.getJSON 'http://localhost/price_json.php?callback=?', (data) -> # http://tools.michaelzinn.de/mc/shopadmin
			data.shops[key] = new Shop(key, val) for key, val of data.shops
			data.items[key] = new Item(val) for key, val of data.items
			window.data.shops = data.shops
			window.data.items = data.items
			fn()
}
