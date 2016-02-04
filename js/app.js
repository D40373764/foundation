$(document).foundation();

var mainApp = angular.module('mainApp', ['ngRoute']);

//mainApp.config(['$routeProvider', '$locationProvider',
//  function ($routeProvider, $locationProvider) {
//    $routeProvider.
//    when('/join', {
//      templateUrl: '/foundation/templates/join.html',
//      controller: 'JoinController'
//    }).
//    when('/leave', {
//      templateUrl: '/foundation/templates/leave.html',
//      controller: 'LeaveController'
//    }).
//    when('/user', {
//      templateUrl: '/foundation/templates/user.html',
//      controller: 'UserController'
//    }).
//    when('/video', {
//      templateUrl: '/foundation/templates/video.html',
//      controller: 'VideoController'
//    }).
//    otherwise({
//      redirectTo: '/'
//    });
//
//    $locationProvider.html5Mode(true);
//  }
//]);

function updateMessage(message) {
  if (message && message.length > 0) {
    console.log("message=" + message);
    $('.message-body').html(message);
    $('message-box').css('height', '50%');
    setTimeout(function () {
      $('message-box').css('height', '0');
    }, 2000);
  }
}

var dispatchEvent = function (type, success, message) {
  var event = new CustomEvent(
    "WEBRTC_EVENT", {
      detail: {
        type: type,
        success: success,
        message: message
      },
      bubbles: true,
      cancelable: true
    }
  );
  document.dispatchEvent(event);
}

document.addEventListener("WEBRTC_EVENT", function (e) {
  console.log("WEBRTC_EVENT e = ");
  console.log(e);
  switch (e.detail.type) {
  case "CONNECTION_READY":
    $('.menu>div').removeClass('hide');
    break;
  case "enableCamera":
    $('#localVideoBox').removeClass('hide');
    break;
  case "startVideoConnection":
    $('#remoteVideoBox').removeClass('hide');
    break;
  }
  updateMessage(e.detail.message);
}, false);

window.addEventListener('message', function (event) {
  console.log('received response:  ', event.data);
}, false);

var activeMenu = function (active) {
  $('.call-button').prop('disabled', active);
  $('.join-button').prop('disabled', active);
  $('.leave-button').prop('disabled', !active);
  $('.chat-button').prop('disabled', !active);
  $('.file-button').prop('disabled', !active);
  $('.screen-button').prop('disabled', !active);
  $('.mic-button').prop('disabled', !active);
  $('.filter-button').prop('disabled', !active);

  if (active) {
    $('.chat-button').parent().removeClass('hide');
    $('.file-button').parent().removeClass('hide');
    $('.screen-button').parent().removeClass('hide');
    $('.mic-button').parent().removeClass('hide');
    $('.filter-button').parent().removeClass('hide');
  } else {
    $('.chat-button').parent().addClass('hide');
    $('.file-button').parent().addClass('hide');
    $('.screen-button').parent().addClass('hide');
    $('.mic-button').parent().addClass('hide');
    $('.filter-button').parent().addClass('hide');
  }
}

var reset = function () {
  $('.received').empty();
  $('chat-box').css('width', '0');
}