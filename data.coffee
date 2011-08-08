
class Item
	constructor: (item) ->
		@[key] = val for key, val of item
	
	getPrice: (change) ->
		return @getCompoundPrice(change) if @components
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
	
	getCompoundPrice: (change) ->
		return @getPrice(change) unless @components
		return 0 if change is 0
		price = 0
		for component in @components
			[id, num] = component
			item = data.items[id]
			return NaN unless item
			price += item.getPrice change*num
			return NaN if isNaN price
		price
	
	calcAmount: ->
		if @components
			@amount = 0
			null while @getCompoundPrice -++@amount
			--@amount
	
class Shop
	constructor: (id, @name) ->
		@id = +id
	getItems: ->
		item for key, item of data.items when @id in item.shops

window.data = {
	load: (fn) ->
		$.getJSON 'http://localhost/price_json.php?callback=?', (data) -> # http://tools.michaelzinn.de/mc/shopadmin
			data.shops[key] = new Shop(key, val) for key, val of data.shops
			compound = []
			for key, val of data.items
				item = new Item(val)
				data.items[key] = item
				compound.push item if item.components
			window.data.shops = data.shops
			window.data.items = data.items
			item.calcAmount() for item in compound
			fn()
}
