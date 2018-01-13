let playerListDiv = document.getElementById("player-list");
let messageBoard = document.getElementById("message-board");
let messageForm = document.getElementById("message-form");
let messageInput = document.getElementById("message-input");
let desiredKeys = [37, 38, 39, 40];

messageForm.onsubmit = function (e) {
	e.preventDefault();
	socket.emit('messageFromPlayer', messageInput.value);
	messageInput.value = "";
	messageInput.blur();
};

socket.on('playerOnline', function (data) {

	printConsoleMessage(data, 'online');

});

socket.on('playerOffline', function (data) {

	printConsoleMessage(data, 'offline');

});

socket.on('consoleMessage', function (data) {

	printConsoleMessage(data);

});


document.onkeydown = function (e) {

	e = e || window.event;

	if (desiredKeys.includes(e.keyCode)) {
		keyEventSender(e.keyCode, true);
	}

	if(e.keyCode === 9 && isGameActive){
		e.preventDefault();
		messageInput.focus();
	}
};

document.onkeyup = function (e) {

	e = e || window.event;

	if (desiredKeys.includes(e.keyCode)) {
		keyEventSender(e.keyCode, false);
	}
};

    