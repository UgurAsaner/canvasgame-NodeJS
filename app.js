let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let common = require('./common/commonFunctions');
let Player = require('./models/player').Player;


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(1919);


io.sockets.on('connection', function (socket) {

	socket.on('sign', function (data) {
		common.sign(socket, data);
	});


	socket.on('keyEvent', function (data) {
		common.KeyEvent(data, socket.id);
	});


	socket.on('messageFromPlayer', function (data) {

		let player = PLAYERLIST[socket.id];
		common.sendDataToUsers('consoleMessage', player.setMessage(data));
	});

	socket.on('disconnect', function () {
		common.disconnect(socket);
	});

});

//  MAIN LOOP

setInterval(function () {
	common.mainloop();
}, 20);










