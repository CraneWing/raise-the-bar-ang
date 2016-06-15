// authentication in this app based on tutorial 
// by Michael Herman at www.mherman.org
angular.module('BarApp')
	.factory('AuthService', ['$http', '$q', '$timeout',
			function($http, $q, $timeout) {
				
				var user = null;
				var authFactory = {};

				authFactory.isLoggedIn = function() {
					if (user) {
						console.log(user.username);
						return true;
					}
					else {
						return false;
					}
				};

				authFactory.getUserStatus = function() {
					return $http.get('/api/users/status')
						.success(function(data) {
							if (data.status) {
								user = true;
							}
							else {
								user = false;
							}
						})
						.error(function(data) {
							user = false;
						});
				};

			authFactory.login = function(username, password) {
				var deferred = $q.defer();

				$http.post('/api/users/login', {
					username: username,
					password: password
				})
				.success(function(data, status) {

					if (status == 200 && data.status) {
						user = true;
						deferred.resolve(data);
					}
					else {
						user = false;
						deferred.reject(data);
					}
				})
				.error(function(data) {
					console.log(data);
					user = false;
					deferred.reject(data);
				});

				return deferred.promise;
			};

			authFactory.signup = function(username, password, name) {
		
				var deferred = $q.defer();

				$http.post('/api/users/signup', {
				 	username: username,
				 	password: password,
				 	name: name
				 })
				.success(function(data, status) {
					if (status == 200 && data.status) {
						deferred.resolve(data);
					}
					else {
						deferred.reject(data);
					}
				})
				.error(function(data) {
					deferred.reject();
				});

				return deferred.promise;
			};

			authFactory.logout = function() {
				var deferred = $q.defer();

				$http.get('/api/users/logout')
					.success(function(data) {
						user = false;
						deferred.resolve();
					})
					.error(function(data) {
						user = false;
						deferred.reject();
					});
					
				return deferred.promise;
			};

			authFactory.currentUser = function() {
				return currentUser;
			};

			return authFactory;

}]);