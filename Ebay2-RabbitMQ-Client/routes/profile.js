/**
 * New node file
 */
var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.getUserProfile = function(req, res) {

	var msg_payload = {
		"id" : req.session.user.id
	};

	console.log("In getUserProfile Request Msg Payload = userId: "
			+ req.session.user.id);
	
	logger.info("USER ID: " + req.session.user.id + " VIEWED PROFILE PAGE");

	mq_client.make_request('getProfileQ', msg_payload, function(err, results) {

		res.send(results);
	});

};

exports.updateUserProfile = function(req, res) {

	var msg_payload = {
		"id" : req.session.user.id,
		"email" : req.param("email"),
		"password" : req.param("password"),
		"firstName" : req.param("firstName"),
		"lastName" : req.param("lastName"),
		"dob" : req.param("dob"),
		"contact" : req.param("contact"),
		"about" : req.param("about"),
		"address" : req.param("address")
	};

	console.log("In updateProfile Request Msg Payload = userId: "
			+ req.session.user.id);
	
	logger.info("USER ID: " + req.session.user.id
			+ " tried UPDATING PRFOILE PAGE");

	mq_client.make_request('updateProfileQ', msg_payload,
			function(err, results) {

				res.send(results);
			});

};
