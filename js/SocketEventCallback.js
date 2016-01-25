'use strict';

var myCallbacks = {};

myCallbacks.onOpen = function () {}

myCallbacks.onCall = function (data) {
  console.log(data);
  screenController.setCallerID(data.callerId);
  updateMessage("Caller ID: " + data.callerId);
  $('.call-button').prop('disabled', true);
  $('.leave-button').prop('disabled', false);
}

myCallbacks.onOffer = function () {
  $('#spinner').addClass('hide');
  dispatchEvent("CONNECTION_READY", true, "Connection...");

  activeMenu(true);
}

myCallbacks.onScreenOffer = function (data) {
  screenController.onScreenOffer(data);
}

myCallbacks.onAnswer = function () {
  dispatchEvent("CONNECTION_READY", true, "Hello!");

  activeMenu(true);
}

myCallbacks.onLeave = function (data) {
  updateMessage(data.username + " left the call");
  console.log(data);
  screenController.closePeerConnection();
  screenController.closePeerScreenConnection();
  document.querySelector('#remoteVideo').src = '';
  document.querySelector('#remoteScreen').src = '';
  activeMenu(false);
}

myCallbacks.onError = function (error) {
  updateMessage(error);
}

myCallbacks.onJoin = function (data) {
  if (data.success === false) {
    updateMessage("Login unsuccessful, please try a different name.");
  } else {
    $('.call-list').hide();
    screenController.startVideoConnection(document.querySelector('#remoteVideo'));
    updateMessage("Join successful.");
    activeMenu(true);
  }
}

myCallbacks.showCalls = function (data) {
  console.log(data);
  $('.call-list').empty();
  updateMessage(data.value.length + ' call');

  for (var i in data.value) {
    var callerId = data.value[i];
    var hostname = callerId.split('-')[1];
    var item = $(".call-box > div").clone();
    item.find('button').attr("data-callerid", callerId);
    item.find('span').text(hostname);
    item.appendTo(".call-list");
  }

  $('.call-list button').on('click', function () {
    var callerId = $(this).data('callerid');
    var username = sessionStorage.username;

    sessionStorage.callerId = callerId;
    screenController.joinCall(username, callerId);
  });
}

myCallbacks.onDefault = function (data) {
  console.log(data);
}

myCallbacks.onReceiveMessageCallback = function (event) {
  if (Object.keys(window.fileInfo).length === 0) {
    console.log("Received message: " + event.data);
    var message = JSON.parse(event.data);
    switch (message.type) {
    case 'message':
      var received = document.querySelector('.received');
      received.innerHTML = "<div class='incomingmessage'>" + message.data + "</div>" + received.innerHTML;
      received.scrollTop = received.scrollHeight;
      break;
    case 'file':
      window.fileInfo = message.data;
      break;
    default:
    }
  } else {
    onReceiveFileCallback(event.data);
  }
}

myCallbacks.onReceiveDataChannelStateChange = function () {
  //  var readyState = webRTC.receiveDataChannel.readyState;
  //  console.log('Data channel state is: ' + readyState);
}

myCallbacks.onSendDataChannelStateChange = function () {
  //  var readyState = webRTC.sendDataChannel.readyState;
  //  console.log('Data channel state is: ' + readyState);
}