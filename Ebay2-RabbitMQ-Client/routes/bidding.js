/**
 * New node file
 */
var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.placeBid = function(req, res) {

	var msg_payload = {
		"bidderId" : req.session.user.id,
		"bidderName" : req.session.user.name,
		"bidAmount" : req.param("bidAmount"),
		"bidProduct" : req.param("product")
	};

	console.log("In PlaceBid Request Msg Payload = product: ", req
			.param("product"));

	logger.info("USER ID: " + req.session.user.id + " tried placing a BID ID");

	mq_client.make_request('biddingQ', msg_payload, function(err, results) {
		res.send(results);
	});

};
