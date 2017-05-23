var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// rating sub-schema 
var RatingSchema = new Schema({
	author: String,
	ratingNum: {type: Number, required: true, min: 0, max: 5},
	ratingText: String,
	createdOn: {type: Date, default: Date.now}
});

// store schema 
var StoreSchema = new Schema({
	name: {type: String, required: true},
	address: String,
	ratingNum: {type: Number, "default": 0, min: 0, max: 5},
	facilities: String,
	openingHours: String,
	webAdr: String,
	mailAdr: String,
	storeImage: String,
	ratings: [RatingSchema]
});

module.exports = mongoose.model('Store', StoreSchema);