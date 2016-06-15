angular.module('BarApp')
	.controller('AuthController', ['$scope', '$rootScope',
	 '$location', 'AuthService', 'Flash',
		function($scope, $rootScope, $location, AuthService, Flash) {
			$rootScope.currentUser = {};
			
      $scope.log = {
      	username: '',
      	password: ''
      };

       $scope.reg = {
       	display_name: '',
      	username: '',
      	password: ''
      };
			
			$scope.signup = function() {
	
				AuthService.signup(
					$scope.reg.username,
				 	$scope.reg.password, 
				 	$scope.reg.display_name)
					.then(function(data) {
						console.log(data);
						
						flashAlert('success', 'Welcome, ' + $scope.reg.display_name + '! You have successfully registered and may now login.');
						$location.path('/login');
						
						$scope.reg = {};
					})
					.catch(function(data) {

						flashAlert('danger', data);
						$scope.reg = {};
					});
			};

			$scope.login = function() {
				
				AuthService.login($scope.log.username, $scope.log.password)
					.then(function(data) {
						
						flashAlert('success', 'Welcome, ' + $scope.log.username + '. You are now logged in.');
						
						$location.path('/');
						$rootScope.currentUser = data.currentUser;
						console.log(currentUser);
						$scope.log = {};
					})
					.catch(function(data) {
						$scope.error = true;
						flashAlert('danger', data);
						$scope.log = {};
					});
			 };

			 $scope.logout = function() {
			 	 AuthService.logout()
			 	 	.then(function() {
			 	 		$location.path('/login');
			 	 	});
			 };

			 function flashAlert(type, message) {
      	Flash.create(type, message, 0, {}, true);
      }

	}]);