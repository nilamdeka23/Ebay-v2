/**
 * 
 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mq_client = require('../rpc/client');
var bcrypt = require('bcrypt-nodejs');
var logger = require('../routes/logger');

module.exports = function(passport) {

	// signin strategy
	passport.use('local-signin', new LocalStrategy({
		
		usernameField : 'email',
		passwordField : 'password'
			
	}, function(username, password, done) {
		
		var msg_payload = {
			"email" : username
		};

		process.nextTick(function() {
			
			console.log("Singin Request Msg Payload in Passport = email & pwd: "
					+ username + " " + password);
			
			logger.info("USER with EMAIL: " + username + " tries SIGNING IN");

			mq_client.make_request('signinQ', msg_payload, function(err,
					results) {
				
				if (err) {
					return done(err);
				}

				if (results.code != 200) {
					return done(null, false);
				}
				
				if (!bcrypt.compareSync(password, results.data.password)){
	                return done(null, false); 
	            }

				return done(null, results.data);
			});

		});

	}));
	
	// signup strategy
	passport.use('local-signup', new LocalStrategy({
		
		usernameField : 'newEmail',
		passwordField : 'newPassword',
		passReqToCallback : true
		
	}, function(req, username, password, done) {
	
		// salt and hash password
		var encrytedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
		
		var msg_payload = {
			"email" : username,
			"password" : encrytedPassword, 
			"firstName" : req.param("firstName"),
			"lastName" : req.param("lastName")
		};

		process.nextTick(function() {
			
			console.log("Singup Msg Payload in Passport = email, pwd, name : "
					+ username + " " + password + " " + req.param("firstName") + req.param("lastName"));
			
			logger.info("USER with EMAIL: " + username + " tries SIGNING UP");

			mq_client.make_request('signupQ', msg_payload, function(err,
					results) {
				
				if (err) {
					return done(err);
				}

				if (results.code != 200) {
					return done(null, false);
				}

				return done(null, results.data);
			});

		});

	}));

};
