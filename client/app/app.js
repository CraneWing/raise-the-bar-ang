angular.module('BarApp', ['ui.router', 'ngResource', 'angularSpinners',
	 'ui.router.title', 'ngFlash', 'ngMessages'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {

			$stateProvider
				.state('/home', {
					url: '/',
					templateUrl: 'app/main/home.html',
					resolve: {
						$title: function() { return 'Welcome'; }
					}
				 })
				.state('/about', {
					url: '/about',
					templateUrl: 'app/main/about.html',
					resolve: {
						$title: function() { return 'About'; }
					}
				})
				.state('/search', {
					url: '/search',
					templateUrl: 'app/bars/bars_search.html',
					controller: 'BarController',
					resolve: {
						$title: function() { return 'Search'; }
					}
				})
				.state('/login', { 
					url: '/login',
				 	templateUrl: 'app/auth/login.html',
				 	controller: 'AuthController',
				 	resolve: {
						$title: function() { return 'Login'; }
					}
				 })
				.state('/signup', { 
					url: '/signup',
				 	templateUrl: 'app/auth/signup.html',
				 	controller: 'AuthController',
				 	resolve: {
						$title: function() { return 'Sign Up'; }
					}
				});

				$urlRouterProvider.otherwise('/');
	}]);