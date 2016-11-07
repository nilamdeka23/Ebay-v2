/**
 * New node file
 */
var mongo = require("../db/mongo");
var mongodb = require("mongodb");
var mongoURL = "mongodb://localhost:27017/ebay";

exports.handleGetUserProfile = function(msg, callback) {

	var res = {};
	console.log("In GetUserProfile:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');
		
		var id = new mongodb.ObjectID(msg.id);

		coll.findOne({
			_id : id
		}, function(err, user) {

			if (user) {

				res.statusCode = 200;
				res.data = user;
				console.log("getProfile: Success");

			} else {

				res.statusCode = 401;
				console.log("getProfile: Failure");
			}

			callback(null, res);
		});
	});

};

exports.handleUpdateUserProfile = function(msg, callback) {

	var res = {};
	console.log("In UpdateUserProfile:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');

		var id = new mongodb.ObjectID(msg.id);
		
		coll.update({
			_id : id
		}, {
			$set : {
				email : msg.email,
				password : msg.password,
				firstName : msg.firstName,
				lastName : msg.lastName,
				dob : msg.dob,
				contact : msg.contact,
				about : msg.about,
				address : msg.address
			}
		}, function(err, user) {

			if (user) {
				res.statusCode = 200;
				console.log("updateProfile: Success");

			} else {
				res.statusCode = 401;
				console.log("updateProfile: Failure");
			}

			callback(null, res);
		});
	});

};