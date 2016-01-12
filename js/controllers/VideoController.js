'use stricrt';

mainApp.controller('VideoController', function ($scope) {
  console.log("This is VideoController");

  $scope.reload = function () {
    $route.reload();
  }

  screenController.enableCamera({
    audio: false,
    video: true
  }, document.querySelector('#localVideo'));
});