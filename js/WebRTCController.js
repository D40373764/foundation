'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;

function hasUserMedia() {
  return !!(navigator.getUserMedia);
}

function hasRTCPeerConnection() {
  return !!(window.RTCPeerConnection);
}

DeVry.WebRTCController = function (url, myCallbacks) {
  if (!(this instanceof DeVry.WebRTCController)) {
    return new DeVry.WebRTCController();
  }
  this.video = undefined;
  this.remoteVideo = undefined;
  this.username = undefined;
  this.callerId = undefined;
  this.stream = undefined;
  this.peerConnection = undefined;
  this.sendDataChannel = undefined;
  this.receiveDataChannel = undefined;
  this.iceServers = [{
    "url": "stun:127.0.0.1:9876"
  }];
  this.configuration = {
    "iceServers": this.iceServers
  };
  this.socket = new DeVry.SocketManager();

  this.socket.connect(url, this, myCallbacks);
  this.callbacks = myCallbacks;
}

DeVry.WebRTCController.prototype.enableCamera = function (screenConstraints, video) {
  this.video = video;

  if (hasUserMedia() && hasRTCPeerConnection()) {
    navigator.getUserMedia(screenConstraints, this.successCameraCallback.bind(this), this.errorCallback.bind(this));
  } else {
    this.dispatchEvent("enableCamera", false, "Your browser does not support WebRTC.");
  }
}

DeVry.WebRTCController.prototype.startVideoConnection = function (remoteVideo) {
  var self = this;

  this.setupPeerConnection(remoteVideo, function () {});

  self.peerConnection.createOffer(function (sessionDescription) {
    self.socket.send({
      type: "offer",
      channel: "video",
      offer: sessionDescription
    });
    self.peerConnection.setLocalDescription(sessionDescription);
  }, function (error) {
    self.dispatchEvent("createOffer", false, "Failed to create offer.");
  });

}

DeVry.WebRTCController.prototype.setRemoteVideo = function (remoteVideo) {
  this.remoteVideo = remoteVideo;
}

DeVry.WebRTCController.prototype.setupPeerConnection = function (remoteVideo, callback) {
  var self = this;

  self.remoteVideo = remoteVideo;

  self.peerConnection = new RTCPeerConnection(self.configuration);
  self.peerConnection.addStream(this.stream);

  self.peerConnection.onaddstream = function (e) {
    self.remoteVideo.src = window.URL.createObjectURL(e.stream);
  }

  self.peerConnection.onicecandidate = function (event) {
    if (event.candidate) {
      self.socket.send({
        type: "candidate",
        channel: "video",
        candidate: event.candidate
      });
      self.dispatchEvent("startVideoConnection", true, "");
    }
  }

  self.peerConnection.ondatachannel = function (event) {
    console.log('Receive Channel Callback');
    var receiveDataChannel = event.channel;
    receiveDataChannel.onmessage = self.callbacks.onReceiveMessageCallback;
    receiveDataChannel.onopen = self.callbacks.onReceiveDataChannelStateChange;
    receiveDataChannel.onclose = self.callbacks.onReceiveDataChannelStateChange;
    self.receiveDataChannel = receiveDataChannel;
  }

  self.createDataChannel(document.querySelector('.received'));

  callback();
}

DeVry.WebRTCController.prototype.startScreenConnection = function (screenConstraints, video) {
  this.video = video;

  if (hasUserMedia() && hasRTCPeerConnection()) {
    navigator.getUserMedia(screenConstraints, this.successScreenCallback.bind(this), this.errorCallback.bind(this));
  } else {
    this.dispatchEvent("startScreenConnection", false, "Your browser does not support WebRTC.");
  }
}

DeVry.WebRTCController.prototype.successCameraCallback = function (stream) {
  var self = this;
  self.stream = stream;
  self.video.src = URL.createObjectURL(stream);
  stream.onended = function () {
    self.dispatchEvent("enableCamera", true, "Video ended.");
  };

  self.dispatchEvent("enableCamera", true, "Camera enabled.");
}

DeVry.WebRTCController.prototype.successScreenCallback = function (stream) {
  var self = this;
  self.stream = stream;
  self.video.src = URL.createObjectURL(stream);
  stream.onended = function () {
    self.dispatchEvent("startScreenConnection", true, "Share screen ended.");
  };

  self.peerConnection = new RTCPeerConnection(self.configuration);

  self.peerConnection.onicecandidate = function (event) {
    if (event.candidate) {
      self.socket.send({
        type: "candidate",
        channel: "screen",
        candidate: event.candidate
      });
      self.dispatchEvent("startScreenConnection", true, "Sharing...");
    }
  }

  self.peerConnection.addStream(stream);

  self.peerConnection.createOffer(function (sessionDescription) {
    self.socket.send({
      type: "offer",
      channel: "screen",
      offer: sessionDescription
    });
    self.peerConnection.setLocalDescription(sessionDescription);
  }, function (error) {
    self.dispatchEvent("startScreenConnection", false, "Failed to create offer.");
  });
}

DeVry.WebRTCController.prototype.errorCallback = function (error) {
  this.dispatchEvent("error", false, "getUserMedia error: ", error);
}

DeVry.WebRTCController.prototype.closePeerConnection = function () {
  if (this.peerConnection != null) {
    this.peerConnection.close();
    this.peerConnection.onicecandidate = null;
    this.peerConnection.onaddstream = null;
  }
}

DeVry.WebRTCController.prototype.dispatchEvent = function (type, success, message) {
  var event = new CustomEvent(
    "webrtcMessageEvent", {
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

DeVry.WebRTCController.prototype.getCallerIDs = function (username) {
  this.socket.getCallerIDs(username);
}

DeVry.WebRTCController.prototype.setCallerID = function (callerId) {
  this.socket.callerId = callerId;
}

DeVry.WebRTCController.prototype.makeCall = function (username) {
  this.socket.makeCall(username);
}

DeVry.WebRTCController.prototype.joinCall = function (username, callerId) {
  this.username = username;
  this.callerId = callerId;
  this.socket.joinCall(username, callerId);
}

DeVry.WebRTCController.prototype.leaveCall = function () {
  screenController.closePeerConnection();
  this.socket.leaveCall(this.username, this.callerId);
}

DeVry.WebRTCController.prototype.onOffer = function (response) {
  var self = this;
  self.setupPeerConnection(this.remoteVideo, function () {
    self.peerConnection.setRemoteDescription(new RTCSessionDescription(response.offer));

    self.peerConnection.createAnswer(function (answer) {
      self.peerConnection.setLocalDescription(answer);
      self.socket.send({
        type: "answer",
        channel: "video",
        answer: answer
      });
    }, function (error) {
      self.dispatchEvent("onOffer", false, "Failed to create answer: " + error);
    });
  });
}


DeVry.WebRTCController.prototype.createDataChannel = function (received) {
  var dataChannelOptions = [{
    RtpDataChannels: true
  }];

  var sendDataChannel = this.peerConnection.createDataChannel("sendDataChannel", dataChannelOptions);

  sendDataChannel.onerror = function (error) {
    console.log("Data Channel Error: " + error);
  }

  sendDataChannel.onmessage = function (event) {
    console.log("Data Channel message: " + event.data);
    received.innerHTML += "recv: " + event.data + "<br/>";
    received.scrollTop = received.scrollHeight;
  }

  sendDataChannel.onopen = function () {
    console.log('sendDataChannel state is: ' + sendDataChannel.readyState);
  }

  sendDataChannel.onclose = function () {
    console.log('sendDataChannel state is: ' + sendDataChannel.readyState);
  }

  this.sendDataChannel = sendDataChannel;

  console.log("Send Data Channel is ready");
}