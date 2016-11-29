angular.module('tcw.controllers', [])

.controller('AppCtrl', function($scope, $state, AuthService, AUTH_EVENTS, $rootScope, $ionicLoading, $ionicHistory, $ionicPopup, $ionicSideMenuDelegate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.isAuthenticated = AuthService.isAuthenticated();
  $scope.currentUser = AuthService.getUser();
  
  // if($scope.currentUser) {
  //   $scope.user = $firebaseObject(fbase.child('users').child($scope.currentUser.uid));
  // }

  $scope.logout = function() {
    AuthService.logout();
    //$ionicHistory.clearCache();
    //$ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
    $state.go('app.dashboard');
    $ionicSideMenuDelegate.toggleLeft(false);
  }

  $rootScope.$on(AUTH_EVENTS.notAuthorized, function(event) {
      var alertPopup = $ionicPopup.alert({
        title: 'Unauthorized!',
        template: 'Please login to access this resource.'
      });
  });
   
  $rootScope.$on(AUTH_EVENTS.updateUser, function(event) {
      $scope.isAuthenticated = AuthService.isAuthenticated();
      $scope.currentUser = AuthService.getUser();
  });

  $rootScope.$on("ERROR_HANDLER", function(event, err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error Message',
        template: err
      });
  });

  $rootScope.$on('loading:show', function(event, message) {
      $ionicLoading.show({template: message})
  })

  $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide()
  })

})

.controller('LoginCtrl', function($scope, AuthService, $rootScope, $state, AUTH_EVENTS) {
  $scope.loginData = {};
  
  $scope.loginEmail = function(){
    $rootScope.$broadcast('loading:show', 'Signing...');
    AuthService.login($scope.loginData).then(function (user) {
      $rootScope.$broadcast('loading:hide');
      $rootScope.$broadcast(AUTH_EVENTS.updateUser);
      $state.go('app.web');
    }, function (err) {
      $rootScope.$broadcast("ERROR_HANDLER", err);
      $rootScope.$broadcast('loading:hide');
    });
  };

  $scope.backTo = function () {
    $state.go('app.dashboard');
  }
})

.controller('WebCtrl', function($scope, ReportService) {
  ReportService.viewOrderSalesReportByChannel().then(function (data) {
    $scope.webstats = data; 
  });

  $scope.doRefresh = function() {
    ReportService.viewOrderSalesReportByChannel().then(function (data) {
      $scope.webstats = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

})

.controller('AmazonCtrl', function($scope, ReportService) {
  ReportService.viewOrderSalesReportByChannel().then(function (data) {
    $scope.amazonstats = data; 
  });

  $scope.doRefresh = function() {
    ReportService.viewOrderSalesReportByChannel().then(function (data) {
      $scope.amazonstats = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
})
.controller('EbayCtrl', function($scope, ReportService) {
  ReportService.viewOrderSalesReportByChannel().then(function (data) {
    $scope.ebaystats = data; 
  });
  $scope.doRefresh = function() {
    ReportService.viewOrderSalesReportByChannel().then(function (data) {
      $scope.ebaystats = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
})
.controller('OrderStatsCtrl', function($scope, ReportService) {
  ReportService.viewOrderProcessMetrics().then(function (data) {
    $scope.orderStats = data; 
  });

  $scope.doRefresh = function() {
    ReportService.viewOrderProcessMetrics().then(function (data) {
      $scope.orderStats = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

});
