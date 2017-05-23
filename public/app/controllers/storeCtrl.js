angular.module('storeCtrl', ['storeService'])

.controller('storeController', function(Store) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the stores at page load
	Store.all()
		.success(function(data) {

			// when all the stores come back, remove the processing variable
			vm.processing = false;

			// bind the stores that come back to vm.stores
			vm.stores = data;
		});

	// function to delete a store
	vm.deleteStore = function(id) {
		vm.processing = true;

		Store.delete(id)
			.success(function(data) {

				// get all stores to update the table
				// you can also set up your api 
				// to return the list of stores with the delete call
				Store.all()
					.success(function(data) {
						vm.processing = false;
						vm.stores = data;
					});

			});
	};

})

// controller applied to store creation page
.controller('storeCreateController', function(Store) {
	
	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a store
	vm.saveStore = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the storeService
		Store.create(vm.storeData)
			.success(function(data) {
				vm.processing = false;
				vm.storeData = {};
				vm.message = data.message;
			});
			
	};	

})

// controller applied to store edit page
.controller('storeEditController', function($routeParams, Store) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the store data for the store you want to edit
	// $routeParams is the way we grab data from the URL
	Store.get($routeParams.store_id)
		.success(function(data) {
			vm.storeData = data;
		});

	// function to save the store
	vm.saveStore = function() {
		vm.processing = true;
		vm.message = '';

		// call the storeService function to update 
		Store.update($routeParams.store_id, vm.storeData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.storeData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});