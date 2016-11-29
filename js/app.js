// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tcw', ['ionic', 'tcw.controllers', 'tcw.constants', 'tcw.services','tcw.constants'])

.run(function($ionicPlatform, $rootScope, $state, AuthService, AUTH_EVENTS) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });

  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
 
    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if($state.current.name.length == 0) {
          $state.go('login')
        } else {
          $state.go($state.current, {}, {reload: true});
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized); 
        }
      }
    }
 
    if (AuthService.isAuthenticated()) {
      if (next.name == 'login') {
        event.preventDefault();
        $state.go('app.dashboard');
      }
    }
  });

})

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})

.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html'
      }
    }
  })

  .state('app.web', {
    url: '/web',
    views: {
      'menuContent': {
        templateUrl: 'templates/web.html',
        controller: 'WebCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    }   
  })
  .state('app.amazon', {
    url: '/amazon',
    views: {
      'menuContent': {
        templateUrl: 'templates/amazon.html',
        controller: 'AmazonCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    } 
  })

  .state('app.ebay', {
    url: '/ebay',
    views: {
      'menuContent': {
        templateUrl: 'templates/ebay.html',
        controller: 'EbayCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    } 
  })

  .state('app.orderstats', {
    url: '/orderstats',
    views: {
      'menuContent': {
        templateUrl: 'templates/orderstats.html',
        controller: 'OrderStatsCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    } 
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});
