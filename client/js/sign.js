let socket = io();

let gameDiv = document.getElementById("game-div");
let signDiv = document.getElementById("sign-div");
let signButton = document.getElementById("sign-button");
let signText = document.getElementById("sign-text");
let isGameActive = false;

signButton.onclick = function () {
	if (signText.value.length < 15)
		socket.emit('sign', signText.value);
	else
		window.alert('Username should be less than 15 characters!');
};

socket.on('signed', function () {
	gameDiv.style.display = 'inline-block';
	signDiv.style.display = 'none';
	isGameActive = true;
});