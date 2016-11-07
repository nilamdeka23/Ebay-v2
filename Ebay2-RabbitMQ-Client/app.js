var express = require('express')
, routes = require('./routes')
, http = require('http')
, home = require('./routes/home')
, signin = require('./routes/signin')
, profile = require('./routes/profile')
, products = require('./routes/products')
, records = require('./routes/records')
, order = require('./routes/order')
, bidding = require('./routes/bidding')
, paymentval = require('./routes/paymentval')
, path = require('path');

// URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/ebay";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./dbconfig/mongo");

var passport = require('passport');
require('./auth/passport')(passport);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressSession({
	secret : 'Godfather273',
	resave : false, // don't save session unless modified
	saveUninitialized : false, // don't create session unless something is
	// stored
	duration : 30 * 60 * 1000,
	activeDuration : 5 * 60 * 1000,
	store : new mongoStore({
		url : mongoSessionConnectURL
	})
}));

app.use(passport.initialize());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/* checks for an active user session */
function isAuthenticated(req, res, next) {
	console.log("Inside isAuthenticated:");
	if (req.session.user) {
		console
				.log("Inside isAuthenticated->Active Session:",
						req.session.user);
		return next();
	}
	console.log("Rerdirect called!");
	res.redirect('/');
}

/* GET Requests */
app.get('/', routes.index);
app.get('/signin', signin.signinPage);
app.get('/home', isAuthenticated, home.homePage);
app.get('/getProfile', isAuthenticated, profile.getUserProfile);
app.get('/getProducts', isAuthenticated, products.getProducts);
app.get('/signout', signin.signout);
app.get('/getPurchases', isAuthenticated, records.getPurchases);
app.get('/getSales', isAuthenticated, records.getSales);
app.get('/getBids', isAuthenticated, records.getBids);
app.get('/getCart', isAuthenticated, order.getCart);

app.post('/signin', function(req, res, next) {
	passport.authenticate('local-signin', {
		session : false,
	}, function(err, user, info) {

		if (err) {
			return next(err);
		}
		if (!user) {
			return res.json({
				"statusCode" : 401
			});
		}

		// Initializing session
		req.session.user = {
			"id" : user._id,
			"email" : user.email,
			"name" : user.firstName + " " + user.lastName,
			"lastLogin" : user.lastLogin
		};

		res.json({
			"statusCode" : 200
		});
	})(req, res, next);
});

app.post('/signup', function(req, res, next) {
	passport.authenticate('local-signup', {
		session : false,
	}, function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.json({
				"statusCode" : 401
			});
		}
		// Initializing session
		req.session.user = {
			"id" : user._id,
			"email" : user.email,
			"name" : user.firstName + " " + user.lastName,
			"lastLogin" : user.lastLogin
		};

		res.json({
			"statusCode" : 200
		});
	})(req, res, next);
});

app.post('/updateProfile', isAuthenticated, profile.updateUserProfile);
app.post('/createListing', isAuthenticated, products.createListing);
app.post('/createOrder', isAuthenticated, order.createOrder);
app.post('/removeCartItem', isAuthenticated, order.removeCartItem);
app.post('/updateCartItem', isAuthenticated, order.updateCartItem);
app.post('/makePayment', isAuthenticated, paymentval.validatePayment);
app.post('/placeOrder', isAuthenticated, order.placeOrder);
app.post('/placeBid', isAuthenticated, bidding.placeBid);

// connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function() {
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function() {
		console.log('Express server listening on port ' + app.get('port'));
	});
});
