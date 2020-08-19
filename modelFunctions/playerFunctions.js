let listHelper = require('../common/listHelper');
let common = require('../common/commonFunctions');
let Player = require('../common/modelsExport').Player;
let async = require('async');
let drawConfig = require('../config').draw;

module.exports = {
	setMessage,
	sign,
	disconnect,
	onKeyEvent
};

function sign (socket, data) {
	socket.emit('drawConfig', drawConfig);
	socket.on('playerReady', function(){
		socket.emit('signed');
		let player = Player(socket.id, data);
		listHelper.addPlayer(player);
		statusChange(player, 'Online');
		socket.emit('consoleMessage', getWelcomeMessage(player));
		socket.join('signed-players');
		for(let i = 0 ; i < 10 ; i ++)
			common.generateArea();
	});
}

function disconnect (socket) {

	async.autoInject({
		id: [async.constant(socket.id)],
		player: ['id', listHelper.getPlayer],
		notify: ['player', notify],
		remove: ['id', common.removePlayer]
	});

	function notify(player) {
		if(player)
			statusChange(player, 'Offline');
	}

}

function statusChange (player, status) {
	let message = player.name + " (" + player.no + ") is " + status;
	common.sendDataToUsers('player' + status, message);
}

function getWelcomeMessage (player) {
	return "Welcome to the Game " + player.name + ", your no is: " + player.no;
}

function setMessage (player, message) {
	return player.name + " (" + player.no + "): " + message;
}

function onKeyEvent (data, id) {
	async.autoInject({
		id: [async.constant(id)],
		data: [async.constant(data)],
		player: ['id', listHelper.getPlayer],
		move: ['player', 'data', function (player, data) {
			if(player) {
				player[data.key + 'KeyPressed'] = data.state;
				listHelper.addPlayer(player);
			}
		}]
	});
}