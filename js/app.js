$(document).foundation();

var mainApp = angular.module('mainApp', ['ngRoute']);

mainApp.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider.
    when('/join', {
      templateUrl: '/foundation/templates/join.html',
      controller: 'JoinController'
    }).
    when('/leave', {
      templateUrl: '/foundation/templates/leave.html',
      controller: 'LeaveController'
    }).
    when('/user', {
      templateUrl: '/foundation/templates/user.html',
      controller: 'UserController'
    }).
    when('/video', {
      templateUrl: '/foundation/templates/video.html',
      controller: 'VideoController'
    }).
    otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
  }
]);

function updateMessage(message) {
  $('.messageBox').text(message);
}

document.addEventListener("webrtcMessageEvent", function (e) {
  console.log(e);
  switch (e.detail.type) {
  case "enableCamera":
    $('#localVideoBox').removeClass('hide');
    break;
  case "startVideoConnection":
    $('#remoteVideoBox').removeClass('hide');
    break;
  }
  updateMessage(e.detail.message);
}, false);