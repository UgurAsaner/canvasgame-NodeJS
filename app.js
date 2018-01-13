let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
module.exports.io = io;
let config = require('./config').general;
let common = require('./common/commonFunctions');
let listHelper = require('./common/listHelper');
let playerFunctions = require('./modelFunctions/playerFunctions');


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(1919);

// Main socket actions

io.sockets.on('connection', function (socket) {

	socket.on('sign', function (data) {
		playerFunctions.sign(socket, data);
	});

	socket.on('keyEvent', function (data) {
		playerFunctions.onKeyEvent(data, socket.id);
	});

	socket.on('messageFromPlayer', function (data) {
		listHelper.getPlayer(socket.id, function (error, player) {
			if(player)
				common.sendDataToUsers('consoleMessage', playerFunctions.setMessage(player, data));
			else
				common.sendDataToUsers('consoleMessage', '-Anon-: ' + data);
		});
	});

	socket.on('disconnect', function () {
		playerFunctions.disconnect(socket);
	});

});


//  MAIN LOOP
setInterval(function () {
	common.mainLoop();
}, config.refreshInterval);

// remove Disconnected Players (Not For Regular Disconnection Case)
setInterval(function () {
	common.checkConnections();
}, config.checkConnectionInterval);







