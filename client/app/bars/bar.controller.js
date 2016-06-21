angular.module('BarApp')
	.controller('BarController', ['$scope', '$rootScope', '$http', 
		'$location', 'spinnerService', '$auth', '$window',
	 	function($scope, $rootScope, $http, $location, spinnerService, $auth, $window) {
			$rootScope.viewTitle = 'Search';
			$scope.bars = {};
			$scope.location = '';
			$scope.tempSearchSave = {};
			$scope.phone = '';
			$scope.areResults = false;
			$scope.guest = 0;
	
			var userId, signedIn;
			
			$scope.isAuthenticated = function() {
				return $auth.isAuthenticated();
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
				.success(function(results) {
					$scope.areResults = true;
					$scope.bars = results;
					//console.log($scope.bars);
					if ($auth.isAuthenticated()) {
						$scope.tempSearchSave = {
							location: $scope.location.replace(/,/g, '').toLowerCase(),
							user_id: $rootScope.currentUser.id,
							bars: $scope.bars
						};
					}
				})
				.catch(function(error) {
					console.log(error);
				})
				.finally(function() {
					$scope.location = '';
					spinnerService.hide('resultSpinner');
				});
			};
		
			$scope.formattedPhone = function(phone) {
			  var phoneFormatted = phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
				return phoneFormatted;
			};
			
			$scope.addGuest = function(barId, savedLocation) {
				$scope.guest = $scope.guest === 0 ? 1 : 0;
				console.log($scope.tempSearchSave.bars.barId);
			};
}]);