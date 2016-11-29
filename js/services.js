angular.module('tcw.services', [])

.factory('AuthService', function ($http, $q, USER_ROLES, BASE_URL, $rootScope, AUTH_EVENTS) {
 	var authService 	= {},
 		//user  			= '',
		role			= '',		
		isAuthenticated	= false;

	if (window.localStorage.getItem("session")) {
    	isAuthenticated = true;
    	role = USER_ROLES.user;
    }

	authService.login = function (credentials) {

		var deferred = $q.defer();

		$http({
		  method: 'POST',
		  url: BASE_URL + '/login',
		  data: credentials
		}).then(function(result) {
			console.log(result.data.responseMessage);
			if (result.data.responseMessage == "success") {
				console.log("Authenticated successfully with payload:", result.data);
				authService.setUser(result.data);
				deferred.resolve();
			} else {
				console.log("Login Failed!", result.data.errorMessage);
				deferred.reject(result.data.errorMessage);
			}
		}, function(response) {
			console.log("Login Failed!", response);
			deferred.reject(reponse);
		});

		return deferred.promise;
	};

	authService.logout = function () {
		isAuthenticated = false;
      	$rootScope.$broadcast(AUTH_EVENTS.updateUser);
      	window.localStorage.removeItem("session");
	};
 
	authService.getUser = function () {
		return JSON.parse(window.localStorage.getItem("session"));
  	}
	
	authService.setUser = function (res) {
		window.localStorage.setItem("session",JSON.stringify(res))
		isAuthenticated = true;
		role = USER_ROLES.user;

  	}

	authService.isAuthenticated = function () {
		return isAuthenticated;
	};

	authService.role = function () {
		return role;
	};
 
	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
		  authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() && authorizedRoles.indexOf(role) !== -1);
	};
 
  	return authService;

})

.factory('AuthInterceptor', function ($rootScope, $q) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if (window.localStorage.getItem("session")) {
        config.headers.Authorization = JSON.parse(window.localStorage.getItem("session")).basicAuth;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
      	$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
})

.factory('ReportService', function ($http, $q, BASE_URL, $rootScope) {

	var reportService = {};

	reportService.viewOrderProcessMetrics = function () {
		var deferred = $q.defer();

		$rootScope.$broadcast('loading:show', 'Loading Order Metrices...');

		$http({
		  method: 'GET',
		  url: BASE_URL + '/viewOrderProcessMetrics'
		  //url: '/js/order.json'
		}).then(function(result) {
			deferred.resolve(result);
			$rootScope.$broadcast('loading:hide');
		}, function(response) {
			deferred.reject(reponse);
			$rootScope.$broadcast('loading:hide');
		});

		return deferred.promise;
	};

	reportService.viewOrderSalesReportByChannel = function () {
		var deferred = $q.defer();

		$rootScope.$broadcast('loading:show', 'Loading Sales Report...');

		$http({
		  method: 'GET',
		  url: BASE_URL + '/viewOrderSalesReportByChannel'
		  //	url: 'js/sales.json'
		}).then(function(result) {
			deferred.resolve(result);
			$rootScope.$broadcast('loading:hide');
		}, function(response) {
			deferred.reject(reponse);
			$rootScope.$broadcast('loading:hide');
		});

		return deferred.promise;
	};
 
  	return reportService;

})