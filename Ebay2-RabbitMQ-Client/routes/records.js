/**
 * New node file
 */
var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.getPurchases = function(req, res) {

	var msg_payload = {
		"id" : req.session.user.id
	};

	console.log("In GetPurchases Request Msg Payload = id: "
			+ req.session.user.id);
	
	logger.info("USER ID: " + req.session.user.id + " VIEWED PURCHASE HISTORY");

	mq_client.make_request('getPurchasesQ', msg_payload,
			function(err, results) {
				res.send(results);
			});

};

exports.getSales = function(req, res) {

	var msg_payload = {
		"id" : req.session.user.id
	};

	console.log("In GetSales Request Msg Payload = id: " + req.session.user.id);
	
	logger.info("USER ID: " + req.session.user.id + " VIEWED SALES HISTORY");

	mq_client.make_request('getSalesQ', msg_payload, function(err, results) {

		res.send(results);
	});

};

exports.getBids = function(req, res) {

	var msg_payload = {
		"id" : req.session.user.id
	};

	console.log("In GetBids Request Msg Payload = id: " + req.session.user.id);
	
	logger.info("USER ID: " + req.session.user.id + " VIEWED BID STANDINGS");

	mq_client.make_request('getBidsQ', msg_payload, function(err, results) {
		if (results.statusCode == 200) {
			results.username = req.session.user.name;
		}
		res.send(results);
	});

};
