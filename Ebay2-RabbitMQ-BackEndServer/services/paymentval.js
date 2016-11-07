/**
 * New node file
 */
exports.handlePaymentValidation = function(msg, callback) {

	function isValidCardNum(cardNum) {
		var pattern = /^\d{16}$/;
		return pattern.test(cardNum);
	}

	function isValidCardCVV(cardCVV) {
		var pattern = /^\d{3}$/;
		return pattern.test(cardCVV);
	}

	var res = {};
	console.log("In PaymentValidation:" + msg.cardNum);

	if (isValidCardNum(msg.cardNum) && isValidCardCVV(msg.cardCVV)) {

		res.statusCode = 200;
		console.log("PaymentValidation: Success");
	} else {

		res.statusCode = 401;
		console.log("PaymentValidation: Failure");
	}

	callback(null, res);
};
