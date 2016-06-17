angular.module('BarApp')
	.controller('SignupController', ['$scope', '$auth', function($scope, $auth) {
		
		$scope.signup = function() {
	 		var user = {
	 			email: $scope.email,
	 			password: $scope.password,
	 			display_name: $scope.display_name
	 		};

	 		$auth.signup(user)
	 			.then(function(response) {
	 				console.log(response.data);
	 			})
	 			.catch(function(response) {
  	 			angular.forEach(response.data.message, function(message, field) {
   					$scope.loginForm[field].$setValidity('server', false);
   					$scope.errorMessage[field] = response.data.message[field];
   				});
	 		 });
	 			
	 		$scope.email = '';
		  $scope.password = '';
		  $scope.display_name = '';
   };
}]);


	