var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Store       = require('../models/store');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to generate sample user
	apiRouter.post('/sample', function(req, res) {

		// look for the user named chris
		User.findOne({ 'username': 'chris' }, function(err, user) {

			// if there is no chris user, create one
			if (!user) {
				var sampleUser = new User();

				sampleUser.name = 'Chris';  
				sampleUser.username = 'chris'; 
				sampleUser.password = 'supersecret';

				sampleUser.save();
			} else {
				console.log(user);

				// if there is a chris, update his password
				user.password = 'supersecret';
				user.save();
			}
		});
	});

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

		// find the user
		User.findOne({
		username: req.body.username
		}).select('name username password').exec(function(err, user) {

	    if (err) throw err;

			// no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
			  	} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
				  //expiresInMinutes: 1440 // expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
				  success: true,
				  message: 'Enjoy your token!',
				  token: token
				});
			  }
			}
		});
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      

	    	if (err) {
	        	res.status(403).send({
	        		success: false,
	        		message: 'Failed to authenticate token.'
	    		});
	    	} else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	            
	        next(); // make sure we go to the next routes and don't stop here
	    	}
	    });

	  	} else {

	  		// if there is no token
	  		// return an HTTP response of 403 (access forbidden) and an error message
			res.status(403).send({
   	 			success: false,
   	 			message: 'No token provided.'
   	 		});
	  	}
	});

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	// ----------------------------------------------------
	// THE ROUTES FOR USERS
	// ----------------------------------------------------
	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	// ----------------------------------------------------
	// THE ROUTES FOR STORES
	// ----------------------------------------------------
	// on routes that end in /stores
	// ----------------------------------------------------
	apiRouter.route('/stores')

		// create a store (accessed at POST http://localhost:8080/stores)
		.post(function(req, res) {
			
			var store = new Store();		// create a new instance of the Store model
			store.name = req.body.name;  // set the users name (comes from the request)
			store.address = req.body.address; 
			store.ratingNum = req.body.ratingNum; 
			store.facilities = req.body.facilities; 
			store.openingHours = req.body.openingHours; 
			store.webAdr = req.body.webAdr; 
			store.storeImage = req.body.storeImage; 
			//store.rating = [{
				//author: req.body.author;
				//ratingNum: req.body.ratingNum;
				//ratingText: req.body.ratingText;
				//createdOn: req.body.createdOn;
			//}];

			store.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A store with that name already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'Store created!' });
			});

		})

		// get all the stores (accessed at GET http://localhost:8080/api/stores)
		.get(function(req, res) {

			Store.find({}, function(err, stores) {
				if (err) res.send(err);

				// return the stores
				res.json(stores);
			});
		});

	// on routes that end in /stores/:store_id
	apiRouter.route('/stores/:store_id')

		// get the store with that id
		.get(function(req, res) {
			Store.findById(req.params.store_id, function(err, store) {
				if (err) res.send(err);

				// return that store
				res.json(store);
			});
		})

		// update the store with this id
		.put(function(req, res) {
			Store.findById(req.params.store_id, function(err, store) {

				if (err) res.send(err);

				// set the new store information if it exists in the request
				if (req.body.name) store.name = req.body.name;
				if (req.body.address) store.address = req.body.address;
				if (req.body.ratingNum) store.ratingNum = req.body.ratingNum;
				if (req.body.facilities) store.facilities = req.body.facilities;
				if (req.body.openingHours) store.openingHours = req.body.openingHours;
				if (req.body.webAdr) store.webAdr = req.body.webAdr;
				if (req.body.storeImage) store.storeImage = req.body.storeImage;
				//if (req.body.rating) store.rating = req.body.rating;
				//if (req.body.rating.author) store.rating.author = req.body.rating.author; // ?????
				//if (req.body.rating.ratingNum) store.rating.ratingNum = req.body.rating.ratingNum; // ?????
				//if (req.body.rating.ratingText) store.rating.ratingText = req.body.rating.ratingText; // ?????
				//if (req.body.rating.createdOn) store.rating.createdOn = req.body.rating.createdOn; // ?????

				// save the store
				store.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Store updated!' });
				});

			});
		})

		// delete the store with this id
		.delete(function(req, res) {
			Store.remove({
				_id: req.params.store_id
			}, function(err, store) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// ----------------------------------------------------
	// THE ROUTES FOR RATINGS
	// ----------------------------------------------------
	// on routes that end in /stores/:store_id/ratings
	// ----------------------------------------------------
	apiRouter.route('/stores/:store_id/ratings')

		// create a new rating (accessed at POST http://localhost:8080/stores/:store_id/ratings)
		.post(function(req, res) {
			
			var storeid = req.params.store_id;

			if (storeid) {
				Store
				.findById(storeid)
				.select('ratings')
					.exec(function(err, store) {
						if (err) {
							sendJsonResponse(res, 400, err);

						} else { // Like doAddRating
	
							if (!store) {
								sendJsonResponse(res, 404, {
									"message": "store_id not found"
								});

							} else {
								store.ratings.push({
									author: req.body.author,
									ratingNum: req.body.ratingNum,
									ratingText: req.body.ratingText,
									createdOn: req.body.createdOn
								});

								// save the rating
								store.save(function(err) {
									if (err) res.send(err);

									// return a message
									res.json({ message: 'Rating updated!' });
								});
							}

						}
					}
				);

			} else {
				sendJsonResponse(res, 404, {
					"message": "Not found, store_id required"
				});
			}			
		});

		// on routes that end in /stores/:store_id/ratings/:rating_id'
		apiRouter.route('/stores/:store_id/ratings/:rating_id') // TODO : Hedder det "stors" eller "stores"?

		// get the rating with that id
		.get(function(req, res) {

			if (req.params && req.params.store_id && req.params.rating_id) {
				Store.findById(req.params.store_id).select('name ratings').exec(function(err, store) {
					
					var response, rating;
					
					if (!store) {
						sendJsonResponse(res, 404, {
							"message": "storeid not found"
						});
						return;
						} else if (err) {
							sendJsonResponse(res, 400, err);
							return;
						}
						if (store.ratings && store.ratings.length > 0) {
							rating = store.ratings.id(req.params.rating_id);
							if (!rating) {
								sendJsonResponse(res, 404, {
									"message": "rating_id not found"
								});
							} else {
								response = {
									store : {
										name : store.name,
										id : req.params.store_id
									},
										rating : rating
								};
								sendJsonResponse(res, 200, response);
							}
						} else {
							sendJsonResponse(res, 404, {
								"message": "No ratings found"
							});
						}
					}
				);
				} else {
					sendJsonResponse(res, 404, {
						"message": "Not found, stor_id and rating_id are both required"
					});
				}
			});

		// on routes that end in /stores/:store_id/ratings/:rating_id'
		apiRouter.route('/stores/:store_id/ratings/:rating_id') // TODO : Hedder det "stors" eller "stores"?

		// put the rating with that id
		.put(function(req, res) {
			if (!req.params.store_id || !req.params.rating_id) {
				sendJsonResponse(res, 404, {
					"message": "Not found, store_id and rating_id are both required"
				});
			return;
			}

			Store.findById(req.params.store_id).select('ratings').exec(function(err, store) {

				var thisRating;

					if (!store) {
						sendJsonResponse(res, 404, {
							"message": "store_id not found"
						});
						return;
					} else if (err) {
						sendJsonResponse(res, 400, err);
						return;
					}
					if (store.ratings && store.ratings.length > 0) {
						thisRating = store.ratings.id(req.params.rating_id);
						if (!thisRating) {
							sendJsonResponse(res, 404, {
								"message": "rating_id not found"
							});
						} else {
							thisRating.author = req.body.author;
							thisRating.rating = req.body.ratingNum;
							thisRating.ratingText = req.body.ratingText;
							store.save(function(err, store) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								sendJsonResponse(res, 200, thisRating);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No rating to update"
					});
				}
			});
		});

		// on routes that end in /stores/:store_id/ratings/:rating_id'
		apiRouter.route('/stores/:store_id/ratings/:rating_id') // TODO : Hedder det "stors" eller "stores"?

		// delete the rating with that id
		.delete(function(req, res) {

			if (!req.params.store_id || !req.params.rating_id) {
				sendJsonResponse(res, 404, {
					"message": "Not found, store_id and rating_id are both required"
				});
				return;
			}
			Store.findById(req.params.store_id).select('ratings').exec(function(err, store) {
				if (!store) {
					sendJsonResponse(res, 404, {
						"message": "store_id not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}
			if (store.ratings && store.ratings.length > 0) {
				if (!store.ratings.id(req.params.rating_id)) {
					sendJsonResponse(res, 404, {
						"message": "rating_id not found"
					});
				} else {
					store.ratings.id(req.params.rating_id).remove();
						store.save(function(err) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								sendJsonResponse(res, 204, null);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No rating to delete"
					});
				}
			}
		);
	});

	return apiRouter;

};