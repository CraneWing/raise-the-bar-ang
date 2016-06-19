angular.module('BarApp')
	.controller('LoginController', ['$scope', '$auth', '$window', '$rootScope',
	 function($scope, $auth, $window, $rootScope) {
		
	$scope.emailLogin = function() {
 		$auth.login({
 			email: $scope.email, 
 			password: $scope.password 
 		})
 		.then(function(response) {
 			$window.localStorage.currentUser = JSON.stringify({
 			  email: response.data.user.email,
 			  display_name: response.data.user.display_name,
 				profile_img: response.data.user.profile_img
 			});
 			$rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
 		})
 		.catch(function(response) {
 			$scope.errorMessage = {};
 			angular.forEach(response.data.message, function(message, field) {
 				$scope.loginForm[field].$setValidity('server', false);
 				$scope.errorMessage[field] = response.data.message[field];
 			});
 		});
 		
 		$scope.email = '';
 		$scope.password = '';
};

	$scope.twitterLogin = function() {
 		$auth.authenticate('twitter')
 			.then(function(response) {
 				$window.localStorage.currentUser = JSON.stringify(response.data.user);
 				$rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
 			})
 			.catch(function(response) {
 				console.log(response.data);
 			});
 	};

}]);


	