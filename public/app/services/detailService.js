angular.module('detailService', [])

.factory('Store', function($http) {

	// create a new object
	var detailFactory = {};

	// get a single store
	detailFactory.get = function(id, detailData) {
		return $http.get('/api/stores/' + id '/ratings/', detailData);
	};

	/*
	// get all stores
	storeFactory.all = function() {
		return $http.get('/api/stores/');
	};

	// create a store
	storeFactory.create = function(storeData) {
		return $http.post('/api/stores/', storeData);
	};

	// update a store
	storeFactory.update = function(id, storeData) {
		return $http.put('/api/stores/' + id, storeData);
	};

	// delete a store
	storeFactory.delete = function(id) {
		return $http.delete('/api/stores/' + id);
	};
	*/

	// return our entire storeFactory object
	return detailFactory;

});