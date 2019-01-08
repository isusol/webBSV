'use strict';

var asyncTest = function () {
  // deactivate ui.router for these tests
  angular.module('uiRouterNoop', []).service('$state', function () { return { go: function() {} } });
  beforeEach(module('uiRouterNoop'));

  // deactivate $httpBackend
  angular.module('httpReal', ['ng']).config(['$provide', function ($provide) {
    $provide.decorator('$httpBackend', function () { return angular.injector(['ng']).get('$httpBackend'); });
  }]);
  beforeEach(module('httpReal'));

  var interval, jasmineTimeout;

  beforeEach(inject(function ($rootScope, $timeout) {
    var length = 10;
    interval = setInterval(function () {
      $timeout.flush(length);
      if (!$rootScope.$$phase && $rootScope.$$asyncQueue.length) {
        $rootScope.$digest();
      }
    }, length);
    jasmineTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
  }));

  afterEach(function () {
    clearInterval(interval);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineTimeout;
  });
};

var failure = function (err) {
  if (angular.isObject(err)) {
    var json = JSON.stringify(err);
    if (json !== '{}') {
      console.log('Failed:' + json);
    }
  }
  fail(err);
};

var logExceptions = function () {
  beforeEach(module(function($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));
};
