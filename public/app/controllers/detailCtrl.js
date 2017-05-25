angular.module('detailCtrl', ['detailService'])

// controller applied to store view page
.controller('detailController', function($routeParams, Store) {

	var vm = this;

	vm.store_id = $routeParams.store_id;

	// get the store data for the store you want to edit
	// $routeParams is the way we grab data from the URL
	Store.get($routeParams.store_id)
		.success(function(data) {
			vm.detailData = data;
		});

/*		
		// call the storeService function to update 
		Store.update($routeParams.store_id, vm.storeData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.storeData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
*/

	};

});