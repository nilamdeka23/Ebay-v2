/**
 * New node file
 */
var mongo = require("../db/mongo");
var mongodb = require("mongodb");
var mongoURL = "mongodb://localhost:27017/ebay";

exports.handleCreateOrder = function(msg, callback) {

	var res = {};
	console.log("In CreateOrder:" + msg.productName + " " + msg.productDesc);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('orders');

		var buyerID = new mongodb.ObjectID(msg.buyerId);
		var productID = new mongodb.ObjectID(msg.productId);
		var sellerID = new mongodb.ObjectID(msg.sellerId);

		coll.update({
			buyerId : {
				$eq : buyerID
			},
			productId : {
				$eq : productID
			},
			isPaidFor : {
				$eq : 0
			}
		}, {
			$inc : {
				qty : 1
			},
			$setOnInsert : {
				buyerId : buyerID,
				buyerName : msg.buyerName,
				productId : productID,
				productName : msg.productName,
				productPrice : msg.productPrice,
				productDesc : msg.productDesc,
				sellerInfo : msg.sellerInfo,
				sellerId : sellerID,
				inStockQty : msg.inStockQty,
				isPaidFor : 0
			}
		}, {
			upsert : true
		}, function(err, order) {

			if (order) {
				res.statusCode = 200;
				console.log("CreateOrder: Success");

			} else {
				res.statusCode = 401;
				console.log("CreateOrder: Failure");
			}

			callback(null, res);
		});
	});

};

exports.handleGetCart = function(msg, callback) {

	var res = {};
	console.log("In GetCart:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('orders');

		var id = new mongodb.ObjectID(msg.id);

		coll.find({
			buyerId : id,
			isPaidFor : 0
		}).toArray(function(err, orders) {

			if (orders) {
				res.statusCode = 200;
				res.data = orders;
				console.log("GetCart: Success");

			} else {
				res.statusCode = 401;
				console.log("GetCart: Failure");
			}

			callback(null, res);
		});
	});

};

exports.handleRemoveCartItem = function(msg, callback) {

	var res = {};
	console.log("In RemoveCartItem:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('orders');

		var id = new mongodb.ObjectID(msg.id);

		coll.remove({
			_id : id,
		}, function(err, order) {

			if (order) {
				res.statusCode = 200;
				console.log("RemoveCartItem: Success");

			} else {
				res.statusCode = 401;
				console.log("RemoveCartItem: Failure");
			}

			callback(null, res);
		});
	});

};

exports.handleUpdateCartItem = function(msg, callback) {

	var res = {};
	console.log("In UpdateCartItem:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('orders');

		var id = new mongodb.ObjectID(msg.id);

		coll.update({
			_id : id
		}, {
			$set : {
				qty : msg.qty
			}
		}, function(err, order) {

			if (order) {
				res.statusCode = 200;
				console.log("UpdateCartItem: Success");

			} else {
				res.statusCode = 401;
				console.log("UpdateCartItem: Failure");
			}

			callback(null, res);
		});
	});
};

exports.handlePlaceOrder = function(msg, callback) {

	var res = {};
	console.log("In PlaceOrder:"+ msg.id);
	// update product in inventory
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('products');

		for (var i = 0; i < msg.cart.length; i++) {

			var productId = new mongodb.ObjectID(msg.cart[i].productId);

			coll.update({
				_id : productId
			}, {
				$inc : {
					qty : -msg.cart[i].qty
				}
			}, function(err, product) {

				if (product) {
					console.log("UpdateQty: Success");

				} else {
					console.log("UpdateQty: Failure");
				}
			});

		}
	});

	// update orders
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('orders');
		var id = new mongodb.ObjectID(msg.id);

		coll.update({
			buyerId : id,
			isPaidFor : 0
		}, {
			$set : {
				isPaidFor : 1,
				orderTime : new Date()
			}
		}, {
			multi : true
		}, function(err, orders) {

			if (orders) {
				res.statusCode = 200;
				console.log("PlaceOrder: Success");

			} else {
				res.statusCode = 401;
				console.log("PlaceOrder: Failure");
			}

			callback(null, res);
		});
	});

};
