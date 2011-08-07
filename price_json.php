<?php
$mysqli = new mysqli("localhost", "mcshop", "MCSHOP", "mcshop");

// get components
$stmt = $mysqli->prepare("SELECT creates, requires, quantity FROM component");
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($creates, $requires, $quantity);
$components = array();
while($stmt->fetch()) {
	if($components[$creates])
		$components[$creates][] = array($requires, $quantity);
	else
		$components[$creates] = array(array($requires, $quantity));
}
$stmt->close();

// get items
$sql = <<<SQL
SELECT item.id, itemid, itemdata, item.name, imageurl, amount, percent 
FROM item 
JOIN taxcategory tax 
ON tax.id=item.taxcategory
SQL;
$stmt = $mysqli->prepare($sql);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id, $itemid, $itemdata, $name, $imgurl, $amount, $tax);
$items = array();
while($stmt->fetch()) {
	$item = array('id' => $itemdata == 0 ? $itemid : array($itemid, $itemdata),'name' => $name, 'imgurl' => $imgurl, 'shops' => array());
	// ZOMBINE
	if($c = $components[$id]) {
		$item['components'] = $c;
	}
	else {
		$item['amount'] = $amount;
		$item['tax'] = $tax;
	}
	$items[$id] = $item;
}
$stmt->close();

// get shops
$stmt = $mysqli->prepare("SELECT id, name FROM shopdefinition");
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id, $name);
$shops = array();
while($stmt->fetch()) {
	$shops[$id] = $name;
}
$stmt->close();

// match items to shops
$stmt = $mysqli->prepare("SELECT shopdefinitionid, itemtype, chestposition FROM shoplayout");
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($shopid, $itemid, $chestpos);
while($stmt->fetch()) {
	if(!in_array($shopid, $items[$itemid]['shops']))
		$items[$itemid]['shops'][] = $shopid;
}
$stmt->close();

$result = array('shops' => $shops, 'items' => $items);

// JSONP
$json = json_encode($result);
if(!empty($_GET['callback']))
	$json = $_GET['callback']."($json)";
echo $json;
?>
