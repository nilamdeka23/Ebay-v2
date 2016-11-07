/**
 * New node file
 */
var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.getProducts = function(req, res) {

	var msg_payload = {
		"id" : req.session.user.id
	};

	console.log("In GetProducts Request Msg Payload = id: "
			+ req.session.user.id);
	
	logger.info("USER ID: " + req.session.user.id + " BROWSED PRODUCTS PAGE");
	
	mq_client.make_request('getProductsQ', msg_payload, function(err, results) {

		res.send(results);
	});

};

exports.createListing = function(req, res) {

	var msg_payload = {
		"id" : req.session.user.id,
		"name" : req.param("name"),
		"description" : req.param("desc"),
		"price" : req.param("price"),
		"qty" : req.param("qty"),
		"isBiddable" : req.param("isBiddable"),
		"sellerName" : req.session.user.name,
		"sellerInfo" : req.param("sellerInfo")
	};

	console.log("In CreateListing Request Msg Payload = Product: "
			+ req.param("name") + "->" + req.param("desc"));
	
	logger.info("USER ID: " + req.session.user.id
			+ " LISTED PRODUCT for SALE of PRODUCT:" + req.param("name"));

	mq_client.make_request('createListingQ', msg_payload,
			function(err, results) {

				res.send(results);
			});

};
