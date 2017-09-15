var socket = io();

var gameDiv = document.getElementById("game-div");
var signDiv = document.getElementById("sign-div");
var signButton = document.getElementById("sign-button");
var signText = document.getElementById("sign-text");

signButton.onclick = function(){
    socket.emit('sign', signText.value);
}