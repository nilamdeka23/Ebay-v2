/**
 * New node file
 */
var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.createOrder = function(req, res) {

	var cartItem = req.param("cartItem");
	
	var msg_payload = {
		"buyerId" : req.session.user.id,
		"buyerName" : req.session.user.name,
		"productId" : cartItem._id,
		"productName" : cartItem.name,
		"productPrice" : cartItem.price,
		"productDesc" : cartItem.description,
		"sellerInfo" : cartItem.sellerInfo,
		"sellerId" : cartItem.sellerId,
		"inStockQty" : cartItem.qty
	};

	console.log("In CreateOrder Request Msg Payload = cartItem: ",cartItem);
	
	logger.info("USER ID: " + req.session.user.id
			+ "  ADDED ITEM with PRODUCT ID: " + cartItem._id
			+ " to the CART");

	mq_client.make_request('createOrderQ', msg_payload, function(err, results) {

		res.send(results);
	});

};

exports.getCart = function(req, res) {

	var msg_payload = {
		"id" : req.session.user.id
	};

	console.log("In GetCart Request Msg Payload = userId: "
			+ req.session.user.id);

	logger.info("USER ID: " + req.session.user.id + " VIEWED CART ITEMS");

	mq_client.make_request('getCartQ', msg_payload, function(err, results) {

		res.send(results);
	});

};

exports.placeOrder = function(req, res) {

	var msg_payload = {
		"id" : req.session.user.id,
		"cart" : req.param("cart")
	};

	console.log("In PlaceOrder Request Msg Payload = id: "
			+ req.session.user.id);
	
	logger.info("USER ID: " + req.session.user.id + "  PLACED an ORDER");

	mq_client.make_request('placeOrderQ', msg_payload, function(err, results) {

		res.send(results);
	});

};

exports.updateCartItem = function(req, res) {

	var msg_payload = {
		"id" : req.param("id"),
		"qty" : req.param("qty")
	};

	console.log("In UpdateCartItem Request Msg Payload = orderId: "
			+ req.param("id"));
	
	logger.info("USER ID: " + req.session.user.id
			+ " tried UPDATING an ITEM  with ORDER ID: "
			+ req.param("id") + " from the CART");

	mq_client.make_request('updateCartItemQ', msg_payload, function(err,
			results) {

		res.send(results);
	});

};

exports.removeCartItem = function(req, res) {

	var msg_payload = {
		"id" : req.param("id")
	};

	console.log("In RemoveCartItem Request Msg Payload = orderId: "
			+ req.param("id"));
	
	logger.info("USER ID: " + req.session.user.id
			+ " tried REMOVING an ITEM  with ORDER ID: "
			+ req.param("id") + " from the CART");

	mq_client.make_request('removeCartItemQ', msg_payload, function(err,
			results) {

		res.send(results);
	});

};
