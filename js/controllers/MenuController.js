mainApp.controller('MenuController', function ($rootScope, $scope, WebRTCService) {
  console.log("This is MenuController");
  $scope.username = '';
  $scope.isAdvisor = false;

  const DESKTOP_MEDIA = ['screen', 'window'];
  const url = 'wss://d40373764.dvuadmin.net:8443';
  //const url = 'wss://192.168.1.6:8443';

  $scope.signinFlag = false;

  $scope.signin = function (username, isAdvisor) {
    if (username === undefined || username.length === 0) {
      return;
    }
    $scope.isAdvisor = isAdvisor;
    $scope.signinFlag = true;
    $scope.username = username;
    sessionStorage.username = $scope.username;
    screenController = WebRTCService.getScreenController(url, myCallbacks);
    updateMessage("Welcome, " + username + "!");
    $scope.enableCamera();
  }

  $scope.muteFlag = false;
  $scope.muteMic = function () {
    $scope.muteFlag = !$scope.muteFlag;
    if ($scope.muteFlag) {
      document.querySelector('#localVideo').muted = true;
      $('.fa-microphone').removeClass('enable').addClass('disable');
    } else {
      document.querySelector('#localVideo').muted = false;
      $('.fa-microphone').removeClass('disable').addClass('enable');
    }
  }

  $scope.enableCamera = function () {
    screenController.enableCamera({
      audio: true,
      video: true
    }, document.querySelector('#localVideo'));
  }

  $scope.showCalls = function () {
    screenController.getCallerIDs(sessionStorage.username);
    $('.call-list').show().addClass('down-up');
    $('.call-list').get(0).addEventListener("animationend", function () {
      $('.call-list').removeClass('down-up')
    }, false);
  }

  $scope.makeCall = function () {
    $('#spinner').removeClass('hide');
    screenController.setRemoteVideo(document.querySelector('#remoteVideo'));
    screenController.setRemoteScreen(document.querySelector('#remoteScreen'));
    screenController.makeCall(sessionStorage.username);
    $('.call-button').prop('disabled', true);
    $('.leave-button').prop('disabled', false);
  }

  $scope.leaveCall = function () {
    screenController.leaveCall();
    document.querySelector('#remoteVideo').src = '';
    $('#remoteVideoBox').addClass('hide');
    $('#spinner').addClass('hide');
    reset();
    activeMenu(false);
  }

  // Chat Box
  $scope.chatFlag = false;
  $scope.triggerChatBox = function () {
    $scope.chatFlag = !$scope.chatFlag;
    if ($scope.chatFlag) {
      $('chat-box').css('width', '100%');
      $('.received > div').css('height', 'auto')
    } else {
      $('.received > div').css('height', '0')
      $('chat-box').css('width', '0');
    }
  }

  // File Box
  $scope.fileFlag = false;
  $scope.triggerFileBox = function () {
    console.log("File box trigger");
    $scope.fileFlag = !$scope.fileFlag;
    if ($scope.fileFlag) {
      $('file-box').css('right', '0');
    } else {
      $('file-box').css('right', '-100%');
    }
  }

  // Screen Box
  $scope.screenFlag = false;
  $scope.triggerScreenBox = function () {
    console.log("Screen box trigger");
    $scope.screenFlag = !$scope.screenFlag;
  }

  // Filter Box
  $scope.filterFlag = false;
  $scope.triggerFilterBox = function () {
    console.log("File box trigger");
    $scope.filterFlag = !$scope.filterFlag;
    if ($scope.filterFlag) {
      $('filter-box').css('width', '100%');
    } else {
      $('filter-box').css('width', '0');
    }
  }

});