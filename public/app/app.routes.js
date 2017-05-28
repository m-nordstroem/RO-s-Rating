angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})
		
		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

		// show all stores
		.when('/stores', {
			templateUrl: 'app/views/pages/stores/all.html',
			controller: 'storeController',
			controllerAs: 'store'
		})

		// form to create a new store
		// same view as edit page
		.when('/stores/create', {
			templateUrl: 'app/views/pages/stores/single.html',
			controller: 'storeCreateController',
			controllerAs: 'store'
		})

		// page to edit a store
		.when('/stores/:store_id', {
			templateUrl: 'app/views/pages/stores/single.html',
			controller: 'storeEditController',
			controllerAs: 'store'
		})

		// page to view a store
		.when('/stores/:store_id/ratings', {
			templateUrl: 'app/views/pages/stores/detail.html',
			controller: 'detailController',
			controllerAs: 'detail' // Måske 'vm'
		});

	$locationProvider.html5Mode(true);

});
