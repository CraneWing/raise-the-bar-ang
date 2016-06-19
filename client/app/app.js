angular.module('BarApp', ['ui.router', 'ngResource', 'angularSpinners',
	 'ui.router.title', 'ngFlash', 'ngMessages', 'satellizer'])
	.config(['$stateProvider', '$urlRouterProvider', '$authProvider',
		function($stateProvider, $urlRouterProvider, $authProvider) {

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
				 	controller: 'LoginController',
				 	resolve: {
						$title: function() { return 'Login'; }
					}
				 })
				.state('/signup', { 
					url: '/signup',
				 	templateUrl: 'app/auth/signup.html',
				 	controller: 'SignupController',
				 	resolve: {
						$title: function() { return 'Sign Up'; }
					}
				});

				$urlRouterProvider.otherwise('/');
				
				// config for Satellizer authentication
				$authProvider.loginUrl = 'https://raise-the-bar-ang-cranewing.c9users.io/api/users/login';
				$authProvider.signupUrl = 'https://raise-the-bar-ang-cranewing.c9users.io/api/users/signup';
				
				$authProvider.twitter({
				  url: '/api/users/twitter',
				  responseType: 'token',
				  popupOptions: {
				  	width: 495, height: 600
				  }
				});
	}])
	
	// will keep the user info in the app so data persists
	.run(['$rootScope', '$window', '$auth', function($rootScope, $window, $auth) {
		if ($auth.isAuthenticated()) {
			$rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
		}
	}]);