angular.module('BarApp')
	.controller('BarController', ['$scope', '$rootScope', '$http', 
		'$location', 'spinnerService', '$auth', '$window',
	 	function($scope, $rootScope, $http, $location, spinnerService, $auth, $window) {
			$rootScope.viewTitle = 'Search';
			$scope.bars = {};
			$scope.message = '';
			$scope.location = '';
			$scope.areResults = false;
			$scope.guests = 0;
	
			var userId, signedIn;
			
			$scope.isAuthenticated = function() {
				return $auth.isAuthenticated();
			};
		
			$scope.formattedPhone = function(phone) {
				phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
				return phone;
			};

			$scope.searchBars = function() {
				if ($scope.isAuthenticated()) {
					var user = JSON.parse($window.localStorage.currentUser);
					userId = user.id;
					signedIn = true;
				}
				else {
					userId = 'none';
					signedIn = false;
				}
				
				spinnerService.show('resultSpinner');
			
				$location.path('/search');
					$http({
					method: 'POST',
					url: 'api/bars',
					params: {
						location: $scope.location,
						userId: userId,
						signedIn: signedIn
					}
				})
				.success(function(data) {
					$scope.areResults = true;
					$scope.guests = 0;
					$scope.bars = data.results;
					$scope.extraSearchData = data.extraSearchData;
				})
				.catch(function(error) {
					console.log(error);
				})
				.finally(function() {
					$scope.location = '';
					spinnerService.hide('resultSpinner');
				});
			};
			
			$scope.addGuest = function(bar) {
				$scope.guestBar = bar;
				$scope.guests = $scope.guests == 0 ? 1 : 0;
				console.log($scope.guests);
			};
}]);