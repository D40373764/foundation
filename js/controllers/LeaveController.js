'use stricrt';

mainApp.controller('LeaveController', function ($scope, $log) {
  console.log("This is LeaveController");
  delete localStorage.username;
  delete localStorage.isAdvisor;

  screenController.leaveCall(sessionStorage.username, sessionStorage.callerId);
  updateMessage("Ready to join a new call.");
});