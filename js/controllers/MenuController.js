mainApp.controller('MenuController', function ($scope, WebRTCService) {
  console.log("This is MenuController");
  $scope.username = '';

  const DESKTOP_MEDIA = ['screen', 'window'];
  const url = 'wss://d40373764.dvuadmin.net:8443';
  //const url = 'wss://192.168.1.6:8443';

  $scope.signinFlag = false;

  $scope.signin = function (username) {
    $scope.signinFlag = true;
    $scope.username = username;
    sessionStorage.username = $scope.username;
    screenController = WebRTCService.getScreenController(url, myCallbacks);
    updateMessage("Welcome, " + username + "!");
  }

  $scope.enableCamera = function () {
    screenController.enableCamera({
      audio: false,
      video: true
    }, document.querySelector('#localVideo'));
  }

  $scope.showCalls = function () {
    screenController.getCallerIDs(sessionStorage.username);
    $('.call-list').show();
  }

  $scope.makeCall = function () {
    screenController.makeCall(sessionStorage.username);
    screenController.setRemoteVideo(document.querySelector('#remoteVideo'));
    updateMessage("Waiting...");
  }

  $scope.leaveCall = function () {
    screenController.leaveCall();
    document.querySelector('#remoteVideo').src = '';
    $('#remoteVideoBox').addClass('hide');
  }

  // Chat Box
  $scope.chatFlag = false;
  $scope.triggerChatBox = function () {
    $scope.chatFlag = !$scope.chatFlag;
    if ($scope.chatFlag) {
      $('chat-box').css('width', '60%');
    } else {
      $('chat-box').css('width', '0');
    }
  }

  // File Box
  $scope.fileFlag = false;
  $scope.triggerFileBox = function () {
    console.log("File box trigger");
    $scope.fileFlag = !$scope.fileFlag;
    if ($scope.fileFlag) {
      $('file-box').css('width', '60%');
    } else {
      $('file-box').css('width', '0');
    }
  }
});