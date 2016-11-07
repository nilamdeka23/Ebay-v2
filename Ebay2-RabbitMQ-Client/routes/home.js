var ejs = require("ejs");

exports.homePage = function(req, res) {
	/*
	 * Set these headers to notify the browser not to maintain any cache for the
	 * page being loaded
	 */
	res.header('Cache-Control',
					'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render("home", {
		"user" : req.session.user
	});
};
