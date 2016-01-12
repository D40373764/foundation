'use strict';

var myCallbacks = {};

myCallbacks.onOpen = function () {}
myCallbacks.onCall = function (data) {
  console.log(data);
  screenController.setCallerID(data.callerId);
  updateMessage("Caller ID: " + data.callerId);
}

myCallbacks.onOffer = function (data) {
  screenController.onOffer(data);
}

myCallbacks.onLeave = function (data) {
  console.log(data);
  screenController.closePeerConnection();
  document.querySelector('#remoteVideo').src = '';
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
  }
}

myCallbacks.showCalls = function (data) {
  console.log(data);
  $('.call-list').empty();
  updateMessage(data.value.length + ' call');

  for (var i in data.value) {
    var item = $(".call-box > div").clone();
    item.find('button').attr("data-callerid", data.value[i]);
    item.find('span').text(data.value[i]);
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
      received.innerHTML += "recv: " + message.data + "<br/>";
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

window.fileInfo = {};
var receiveBuffer = [];
var receivedSize = 0;
var downloadAnchor = document.querySelector('a#download');
var sendProgress = undefined;

myCallbacks.onReceiveFileCallback = function (data) {
  if (sendProgress === undefined) {
    sendProgress = document.querySelector('progress#sendProgress');
    sendProgress.max = fileInfo.size;
  }

  // trace('Received Message ' + event.data.byteLength);
  receiveBuffer.push(data);
  receivedSize += data.byteLength;

  sendProgress.value = receivedSize;

  // we are assuming that our signaling protocol told
  // about the expected file size (and name, hash, etc).
  if (receivedSize === fileInfo.size) {
    var received = new window.Blob(receiveBuffer);
    receiveBuffer = [];

    var downloadAnchor = document.querySelector('a#download');
    downloadAnchor.href = URL.createObjectURL(received);
    downloadAnchor.download = fileInfo.name;
    downloadAnchor.textContent =
      'Click to download \'' + fileInfo.name + '\' (' + fileInfo.size + ' bytes)';
    downloadAnchor.style.display = 'block';

    receivedSize = 0;
    window.fileInfo = {};
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