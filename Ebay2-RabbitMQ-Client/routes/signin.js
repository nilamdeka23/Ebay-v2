/**
 * New node file
 */
var mq_client = require('../rpc/client');
var ejs = require("ejs");
var logger = require('./logger');

exports.signinPage = function(req, res) {
	
	logger.info("SIGNIN PAGE is HIT");

	ejs.renderFile('./views/signin.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}

exports.signout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};
