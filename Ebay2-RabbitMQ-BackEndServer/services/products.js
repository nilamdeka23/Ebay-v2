/**
 * New node file
 */
var mongo = require("../db/mongo");
var mongodb = require("mongodb");
var mongoURL = "mongodb://localhost:27017/ebay";

exports.handleCreateListing = function(msg, callback) {

	var res = {};
	console.log("In CreateListing:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('products');

		var id = new mongodb.ObjectID(msg.id);

		coll.insert({

			name : msg.name,
			description : msg.description,
			price : msg.price,
			qty : msg.qty,
			isBiddable : msg.isBiddable,
			sellerId : id,
			sellerName : msg.sellerName,
			sellerInfo : msg.sellerInfo,
			createdOn : new Date()

		}, function(err, product) {

			if (product) {
				res.statusCode = 200;
				console.log("CreateListing: Success");

			} else {
				res.statusCode = 401;
				console.log("CreateListing: Failure");
			}

			callback(null, res);
		});
	});

};

exports.handleGetProducts = function(msg, callback) {

	var res = {};
	console.log("In GetProducts:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('products');

		var id = new mongodb.ObjectID(msg.id);

		coll.find({
			sellerId : {
				$ne : id
			}
		}).toArray(function(err, products) {

			if (products) {
				res.statusCode = 200;
				res.data = products;
				console.log("GetProducts: Success");

			} else {
				res.statusCode = 401;
				console.log("GetProducts: Failure");
			}

			callback(null, res);
		});
	});

};