var blocks = {
	"1_0"  : ["Stone", "item_1_0.png"],
	"3_0"  : ["Dirt", "item_3_0.png"],
	"4_0"  : ["Cobblestone", "item_4_0.png"],
	"5_0"  : ["Wooden Plank", "item_5_0.png"],
	"6_0"  : ["Sapling", "Grid_Sapling.png"],
	"6_1"  : ["Spruce Sapling", "Grid_Sapling_Spruce.png"],
	"6_2"  : ["Birch Sapling", "Grid_Sapling_Birch.png"],
	"10_0" : ["Lava", "Lava.png"],
	"12_0" : ["Sand", "item_12_0.png"],
	"13_0" : ["Gravel", "item_13_0.png"],
	"14_0" : ["Gold Ore", "item_14_0.png"],
	"15_0" : ["Iron Ore", "item_15_0.png"],
	"17_0" : ["Wood", "Grid_Wood.png"],
	"17_1" : ["Redwood", "Grid_Wood_(Pine).png"],
	"17_2" : ["Birch Wood", "Grid_Wood_(Birch).png"],
	"22_0" : ["Lapis Lazuli Block", "Lapis_Lazuli_(Block).png"],
	"23_0" : ["Dispenser", "Dispenser.png"]
};

var items = {
	"256_0"  : ["Iron Shovel", "item_256_0.png"],
	"257_0"  : ["Iron Pickaxe", "item_257_0.png"],
	"258_0"  : ["Iron Axe", "item_258_0.png"],
	"259_0"  : ["Flint and Steel", "Flint_and_Steel.png"],
	"260_0"  : ["Apple", "Apple2.png"],
	"261_0"  : ["Bow", "item_261_0.png"],
	"262_0"  : ["Arrow", "item_262_0.png"],
	"268_0"  : ["Wooden Sword", "item_268_0.png"]
};

function getBlockName( idAndValue ) {
	return blocks[ idAndValue ][ 0 ];
}

function getBlockIcon( idAndValue ) {
	return "Icons/" + blocks[ idAndValue ][ 1 ];
}

function getItemName( idAndValue ) {
	return items[ idAndValue ][ 0 ];
}

function getItemIcon( idAndValue ) {
	return "Icons/" + items[ idAndValue ][ 1 ];
}

function generatePriceInfoDiv( name, icon, buy, buy64, sell, sell64 ) {
	var price = function(c, p, p64) {
		return '<div class=' + c + '>' + p + '<br><span>' + p64 + '</span></div>';
	};
	var priceLDiv = price('priceL', buy, buy64);
	var iconDiv = '<div class=icon><img src="' + icon + '" alt="' + name + '" title="' + name + '"></div>';
	var priceRDiv = price('priceR', sell, sell64);

	return $('<div class=product>' + priceLDiv + iconDiv + priceRDiv + '</div>');
}

var blockPrices = $('#blockPrices');
for( var block in blocks ) {
	var buy = Math.floor(Math.random()*1000);
	var buy64 = Math.floor(Math.random()*10001);
	var sell = Math.floor(Math.random()*1000);
	var sell64 = Math.floor(Math.random()*10000);
	var blockDiv = generatePriceInfoDiv( getBlockName( block ), getBlockIcon( block ), buy, buy64, sell, sell64 );
	blockPrices.append( blockDiv );
}

var itemPrices = $( "#itemPrices" );
for( var item in items ) {
	var buy = Math.floor(Math.random()*1000);
	var buy64 = Math.floor(Math.random()*10001);
	var sell = Math.floor(Math.random()*1000);
	var sell64 = Math.floor(Math.random()*10000);
	var itemDiv = generatePriceInfoDiv( getItemName( item ), getItemIcon( item ), buy, buy64, sell, sell64 );
	itemPrices.append( itemDiv );
}