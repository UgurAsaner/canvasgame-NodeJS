function printConsoleMessage(message, type) {

	if (typeof(type) === 'undefined')
		messageBoard.innerHTML += "<div>" + message + "</div>";
	else
		messageBoard.innerHTML += "<div class=\"" + type + "-message\"><span class=\"system-message\">System Message: </span>" + message + "</div>";

}

function keyEventSender(keyCode, state){

	let key;
	switch (keyCode) {

		case 37:
			key = 'left';
			break;
		case 38:
			key = 'up';
			break;
		case 39:
			key = 'right';
			break;
		case 40:
			key = 'down';
			break;
	}

	data = {
		key: key,
		state: state
	};

	socket.emit('keyEvent', data);
}