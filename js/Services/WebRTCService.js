mainApp.factory('WebRTCService', function ($log) {
  var screenController = null;

  return {
    getScreenController: function (url, myCallbacks) {
      screenController = screenController || new DeVry.WebRTCController(url, myCallbacks);
      return screenController;
    }
  };
});