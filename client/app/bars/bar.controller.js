angular.module('BarApp')
	.controller('BarController', ['$scope', '$rootScope', '$http', 
		'$location', 'spinnerService', '$auth', '$window',
	 	function($scope, $rootScope, $http, $location, spinnerService, $auth, $window) {
			$rootScope.viewTitle = 'Search';
			$scope.bars = {};
			$scope.location = '';
			$scope.reservations = {};
			$scope.phone = '';
			$scope.areResults = false;
	
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
					$scope.bars = results.bars;
					$scope.reservations = results.reservations;
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
			
			$scope.setGuests = function(barId) {
				for (var key in $scope.reservations) {
					if (key === barId) {
						return $scope.reservations[key];
					}
				}
			};
			
			$scope.toggleGuests = function(event, barId) {
				$scope.reservations[barId] = $scope.reservations[barId] === 0 ? 1 : 0; 
				
				switch(parseInt($scope.reservations[barId], 10)) {
					case 0: 
						$scope.deleteReservation(barId, userId);
						break;
					case 1:
						$scope.createReservation(barId, userId);
						break;
				}
				
				return $scope.reservations[barId];
			};
			
			$scope.createReservation = function(barId, userId) {
				console.log('bar ID is ' + barId + ' and user ID is ' + userId);
				$http.post('/api/bars/create', {
					bar_id: barId,
					user_id: userId
				})
				.success(function(data) {
					console.log('data sent!');
				});
			};
			
			$scope.deleteReservation = function(barId, userId) {
				$http.post('/api/bars/delete', {
					bar_id: barId,
					user_id: userId
				})
				.success(function(data) {
					console.log('data sent!');
				});
			};
}]);