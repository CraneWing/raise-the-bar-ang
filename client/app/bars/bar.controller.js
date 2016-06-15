angular.module('BarApp')
	.controller('BarController', ['$scope', '$rootScope', '$http', 
		'$location', 'spinnerService',
	 	function($scope, $rootScope, $http, $location, spinnerService) {
			$rootScope.viewTitle = 'Search';
			$scope.bars = {};
			$scope.message = '';
			$scope.location = '';
			$scope.areResults = false;
		
			$scope.formattedPhone = function(phone) {
				phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
				return phone;
			};

			$scope.searchBars = function() {
				spinnerService.show('resultSpinner');
				
				$location.path('/search');
					$http({
					method: 'POST',
					url: 'api/bars',
					params: {
						location: $scope.location
					}
				})
				.success(function(results) {
					$scope.areResults = true;
					$scope.bars = results;
					// console.log($scope.bars);
				})
				.catch(function(error) {
					console.log(error);
				})
				.finally(function() {
					$scope.location = '';
					spinnerService.hide('resultSpinner');
				});
			};
}]);