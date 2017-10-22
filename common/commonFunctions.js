let Player = require('../models/player').Player;
let Area = require('../models/area').Area;
PLAYERLIST = [];
SOCKETLIST = [];
AREALIST = [];

module.exports = {

	sign: function (socket, data) {
		SOCKETLIST[socket.id] = socket;
		socket.emit('signed');

		let player = Player(socket.id, data);
		PLAYERLIST[player.id] = player;

		this.playerStatusChange(player, 'Online');
		socket.emit('consoleMessage', player.welcomeMessage());

		this.generateArea();
	},

	disconnect: function (socket) {
		let done = this.playerStatusChange(PLAYERLIST[socket.id], 'Offline');

		setTimeout(function () {
			if (done) {
				delete SOCKETLIST[socket.id];
				delete PLAYERLIST[socket.id];
			}
		}, 1000);
	},

	KeyEvent: function (data, id) {
		let player = PLAYERLIST[id];
		player[data.key + 'KeyPressed'] = data.state;
	},

	sendDataToUsers: function (event, data) {
		for (i in SOCKETLIST) {
			let socket = SOCKETLIST[i];
			socket.emit(event, data);
		}
		return true;
	},

	generateArea: function () {
		let area = Area();
		AREALIST[area.id] = area;
		console.log(area.range);
	},

	getAllData: function () {
		let allData = {};
		allData.playerData = [];
		allData.areaData = [];
		for (let i in PLAYERLIST) {
			let player = PLAYERLIST[i];
			allData.playerData.push({
				id: i,
				no: player.no,
				x: player.x,
				y: player.y,
				isInArea: player.isInArea
			});
		}
		for (let i in AREALIST) {
			let area = AREALIST[i];
			allData.areaData.push({
				id: i,
				x: area.x,
				y: area.y,
				range: area.range
			});
		}
		return allData;
	},

	playerStatusChange: function (player, status) {
		let message = player.name + " (" + player.no + ") is " + status;
		this.sendDataToUsers('player' + status, message);
		return true;
	},

	checkCollusions: function () {
		for (let j in PLAYERLIST) {
			for (let i in AREALIST) {
				PLAYERLIST[j].isInArea = AREALIST[i].isInRange(PLAYERLIST[j]);
			}
		}
	},

	generateLocations: function () {
		for (let i in PLAYERLIST) {
			let player = PLAYERLIST[i];
			if (player.upKeyPressed && player.checkPosition('y', '+'))
				player.vY = -player.vMax;
			else if (player.downKeyPressed && player.checkPosition('y', '-'))
				player.vY = player.vMax;
			else
				player.vY = 0;

			if (player.leftKeyPressed && player.checkPosition('x', '-'))
				player.vX = -player.vMax;
			else if (player.rightKeyPressed && player.checkPosition('x', '+'))
				player.vX = player.vMax;
			else
				player.vX = 0;

			player.x += player.vX;
			player.y += player.vY;
		}
		return true;
	},

	updateAllInfo: function () {
		let allData = this.getAllData();
		this.sendDataToUsers('dataUpdate', allData);
		return true;
	},

	mainloop: function () {
		this.checkCollusions();
		this.generateLocations();
		this.updateAllInfo();
	}

};

