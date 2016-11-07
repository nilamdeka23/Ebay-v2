var mongo = require("../db/mongo");
var mongodb = require("mongodb");
var mongoURL = "mongodb://localhost:27017/ebay";

function updateLastLogin(userId) {

	mongo.connect(mongoURL, function() {

		var coll = mongo.collection('users');
		var id = new mongodb.ObjectID(userId);

		coll.update({
			_id : id
		}, {
			$set : {
				lastLogin : new Date()
			}
		}, function(err, user) {

			if (user) {
				console.log("UpdateLastLogin: Success");

			} else {
				console.log("UpdateLastLogin: Failure");
			}
		});
	});

}

exports.handleSignin = function(msg, callback) {

	var res = {};
	console.log("In handle signin:" + msg.email);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');

		coll.findOne({
			email : msg.email
		}, function(err, user) {

			if (user) {

				res.code = 200;
				res.data = user;
				console.log("In handle signin: Success");

				updateLastLogin(user._id);

			} else {

				res.code = 401;
				console.log("In handle signin: Failure");
			}

			callback(null, res);
		});
	});

};

exports.handleSignup = function(msg, callback) {

	var res = {};
	console.log("In handle signup:" + msg.email);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');

		coll.insert({
			email : msg.email,
			password : msg.password,
			firstName : msg.firstName,
			lastName : msg.lastName,
			lastLogin : new Date()

		}, function(err, user) {

			if (user) {

				res.code = 200;
				res.data = user.ops[0];
				console.log("In handle signup: Success", user.ops[0]);

			} else {
				res.code = 401;
				console.log("In handle signup: Failure");
			}

			callback(null, res);
		});
	});

};
