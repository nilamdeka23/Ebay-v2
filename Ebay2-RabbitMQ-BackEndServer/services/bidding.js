/**
 * New node file
 */
var mongo = require("../db/mongo");
var mongodb = require("mongodb");
var mongoURL = "mongodb://localhost:27017/ebay";

exports.handlePlaceBid = function(msg, callback) {

	var res = {};
	console.log("In PlaceBid:" + msg.bidderName);

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('bids');

		var product = msg.bidProduct;
		var bidderId = new mongodb.ObjectID(msg.bidderId);
		var productId = new mongodb.ObjectID(product._id);

		var bidValidTill = new Date();
		bidValidTill.setDate(new Date(product.createdOn).getDate() + 4);

		coll.insert({

			// bidderId : bidderID,
			// bidderName : req.session.user.name,
			// productId : productID,
			// productName : product.name,
			// productDesc : product.description,
			// productCreatedOn : product.createdOn,
			// sellerName : product.sellerName,
			// bidAmount : req.param("bidAmount"),
			// bidTime : new Date()

			bidder : {
				id : bidderId,
				name : msg.bidderName
			},
			bidProduct : {
				id : productId,
				name : product.name,
				description : product.description,
				createdOn : product.createdOn,
				sellerName : product.sellerName,
				sellerId : product.sellerId
			},
			bidAmount : msg.bidAmount,
			bidTime : new Date(),
			bidValidDate : bidValidTill

		}, function(err, bid) {

			if (bid) {
				res.statusCode = 200;
				console.log("PlaceBid: Success");

			} else {
				res.statusCode = 401;
				console.log("PlaceBid: Failure");
			}

			callback(null, res);
		});
	});

};