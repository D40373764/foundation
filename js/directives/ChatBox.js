mainApp.directive('chatBox', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'templates/chat-box.html',
    link: function (scope, element) {

      scope.send = function () {
        console.log('send chat message: ' + scope.chatMessage);

        var received = element.find('.received')[0];
        var message = {
          type: 'message',
          data: scope.chatMessage
        };
        received.innerHTML += "send: " + scope.chatMessage + "<br/>";
        received.scrollTop = received.scrollHeight;
        screenController.sendDataChannel.send(JSON.stringify(message));

      }
    }
  };
});