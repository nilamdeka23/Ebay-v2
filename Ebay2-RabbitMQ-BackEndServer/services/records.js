/**
 * New node file
 */
var mongo = require("../db/mongo");
var mongodb = require("mongodb");
var mongoURL = "mongodb://localhost:27017/ebay";

exports.handleGetPurchases = function(msg, callback) {

	var res = {};
	console.log("In GetPurchases:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('orders');
		var id = new mongodb.ObjectID(msg.id);

		coll.aggregate([ {
			$match : {
				isPaidFor : 1,
				buyerId : id
			}
		}, {
			$project : {
				"_id" : 0,
				"productDesc" : 1,
				"productId" : 1,
				"productName" : 1,
				"productPrice" : 1,
				"qty" : 1
			}
		}, {
			$group : {
				_id : '$productId',
				productName : {
					$first : '$productName'
				},
				productDesc : {
					$first : "$productDesc"
				},
				qtyPurchased : {
					$sum : "$qty"
				},
				productPrice : {
					$first : "$productPrice"
				}
			}
		} ]).toArray(function(err, orders) {

			if (orders) {

				res.statusCode = 200;
				res.data = orders;
				console.log("getPurchases: Success");
			} else {

				res.statusCode = 401;
				console.log("getPurchases: Failure");
			}

			callback(null, res);
		});
	});

};

exports.handleGetSales = function(msg, callback) {

	var res = {};
	console.log("In GetSales:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('orders');
		var id = new mongodb.ObjectID(msg.id);

		coll.aggregate([ {
			$match : {
				isPaidFor : 1,
				sellerId : id
			}
		}, {
			$project : {
				"_id" : 0,
				"productDesc" : 1,
				"productId" : 1,
				"productName" : 1,
				"productPrice" : 1,
				"qty" : 1
			}
		}, {
			$group : {
				_id : '$productId',
				productName : {
					$first : '$productName'
				},
				productDesc : {
					$first : "$productDesc"
				},
				qtySold : {
					$sum : "$qty"
				},
				productPrice : {
					$first : "$productPrice"
				}
			}
		}, {
			$sort : {
				orderTime : 1,
			}
		} ]).toArray(function(err, orders) {

			if (orders) {

				res.statusCode = 200;
				res.data = orders;
				console.log("getSales: Success");

			} else {

				res.statusCode = 401;
				console.log("getSales: Failure");
			}

			callback(null, res);
		});
	});

};

exports.handleGetBids = function(msg, callback) {

	var res = {};
	console.log("In GetBids:" + msg.id);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('bids');
		// var id = new mongodb.ObjectID(msg.id);

		coll.aggregate([
		// {
		// $match : {
		// "bidder.id" : id
		// }
		// },
		{
			$project : {
				"bidProduct.id" : 1,
				"bidProduct.name" : 1,
				"bidProduct.description" : 1,
				"bidProduct.sellerName" : 1,
				"bidProduct.sellerId" : 1,
				"bidder.name" : 1,
				"bidder.id" : 1,
				"_id" : 0,
				"bidTime" : 1,
				"bidAmount" : 1,
				"bidValidDate" : 1
			}
		}, {
			$group : {
				_id : '$bidProduct.id',
				productName : {
					$first : '$bidProduct.name'
				},
				productDesc : {
					$first : '$bidProduct.description'
				},
				sellerName : {
					$last : '$bidProduct.sellerName'
				},
				sellerId : {
					$last : '$bidProduct.sellerId'
				},
				maxBidderName : {
					$last : '$bidder.name'
				},
				maxBidderId : {
					$last : '$bidder.id'
				},
				maxBidAmount : {
					$max : '$bidAmount'
				},
				bidTime : {
					$last : '$bidTime'
				},
				bidValidTime : {
					$last : '$bidValidDate'
				}
			}
		} ]).toArray(function(err, bids) {

			if (bids) {

				res.statusCode = 200;
				res.data = bids;
				console.log("getBids: Success");
			} else {

				res.statusCode = 401;
				console.log("getBids: Failure");
			}

			callback(null, res);
		});
	});

};
