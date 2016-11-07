/**
 * New node file
 */
var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.validatePayment = function(req, res) {

	var msg_payload = {
		"cardNum" : req.param("cardNum"),
		"cardCVV" : req.param("cardCVV")
	};

	console.log("In ValidatePayment Request Msg Payload = card Num and CVV: "
			+ req.param("cardNum") + "->" + req.param("cardCVV"));
	
	logger.info("USER ID: " + req.session.user.id + " MAKES A PAYMENT");

	mq_client.make_request('paymentValidationQ', msg_payload, function(err,
			results) {

		res.send(results);
	});

};
