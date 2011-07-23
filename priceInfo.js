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
	var buyText = document.createTextNode( buy );
	var buy64Text = document.createTextNode( buy64 );
	var buy64Span = document.createElement( "span" );
	buy64Span.appendChild( buy64Text );

	var priceLDiv = document.createElement( "div" );
	priceLDiv.className = "priceL";
	priceLDiv.appendChild( buyText );
	priceLDiv.appendChild( document.createElement( "br" ) );
	priceLDiv.appendChild( buy64Span );
	
	var iconImage = document.createElement( "img" );
	iconImage.src = icon;
	iconImage.alt = name;
	iconImage.title = name;
	var iconDiv = document.createElement( "div" );
	iconDiv.className = "icon";
	iconDiv.appendChild( iconImage );
	
	var sellText = document.createTextNode( sell );
	var sell64Text = document.createTextNode( sell64 );
	var sell64Span = document.createElement( "span" );
	sell64Span.appendChild( sell64Text );
	
	var priceRDiv = document.createElement( "div" );
	priceRDiv.className = "priceR";
	priceRDiv.appendChild( sellText );
	priceRDiv.appendChild( document.createElement( "br" ) );
	priceRDiv.appendChild( sell64Span );

	var productDiv = document.createElement( "div" );
	productDiv.className = "product";
	
	productDiv.appendChild( priceLDiv );
	productDiv.appendChild( iconDiv );
	productDiv.appendChild( priceRDiv );
	
	return productDiv;
}