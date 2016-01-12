'use stricrt';

mainApp.controller('JoinController', function ($scope, $log) {
  console.log("This is JoinController");

  screenController.getCallerIDs(sessionStorage.username);
});