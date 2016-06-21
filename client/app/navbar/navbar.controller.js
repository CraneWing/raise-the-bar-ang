angular.module('BarApp')
	.controller('NavbarController', ['$scope', '$rootScope',
	  '$window', '$auth', '$location',
		function($scope, $rootScope, $window, $auth, $location) {
		  
		  $scope.getClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
      };

			$scope.isAuthenticated = function() {
				return $auth.isAuthenticated();
			};

			$scope.logout = function() {
				$auth.logout();
				
				delete $window.localStorage.currentUser;
			};
}]);