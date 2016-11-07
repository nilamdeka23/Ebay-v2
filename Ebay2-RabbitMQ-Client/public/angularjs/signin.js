var signIn = angular.module('signIn', []);

signIn.controller('signInCtrl', function($scope, $http) {

	$scope.failureMsg = true;
	$scope.successMsg = true;

	$scope.signIn = function() {

		$http({
			method : "POST",
			url : '/signin',
			data : {
				"email" : $scope.email,
				"password" : $scope.password
			}
		}).success(function(response) {

			if (response.statusCode == 401) {
				$scope.failureMsg = false;
				$scope.successMsg = true;

			} else {
				$scope.failureMsg = true;
				$scope.successMsg = false;
				window.location.assign("/home");
			}

		}).error(function(error) {
			//
		});

	};

	$scope.signUp = function() {

		$http({
			method : "POST",
			url : '/signup',
			data : {
				"newEmail" : $scope.newEmail,
				"newPassword" : $scope.newPassword,
				"firstName" : $scope.firstName,
				"lastName" : $scope.lastName
			}
		}).success(function(response) {

			if (response.statusCode == 401) {
				$scope.failureMsg = false;
				$scope.successMsg = true;

			} else {
				$scope.failureMsg = true;
				$scope.successMsg = false;
				window.location.assign("/home");
			}

		}).error(function(error) {
			//
		});

	};

});