let io = require('../app').io;
let listHelper = require('./listHelper');
let areaFunctions = require('../modelFunctions/areaFunctions');
let async = require('async');
let drawConfig = require('../config').draw;

let canvasWidth = drawConfig.canvas.width;
let canvasHeight = drawConfig.canvas.height;


module.exports = {
	sendDataToUsers: sendDataToUsers,
	removePlayer: removePlayer,
	mainLoop: mainLoop,
	generateArea: generateArea,
	checkConnections: checkConnections
};

function generateArea() {
	areaFunctions.generateArea();
}

function removePlayer(id) {
	listHelper.removePlayer(id);
}

function sendDataToUsers(event, data) {
	io.to('signed-players').emit(event, data);
}

function generateLocations(entities, cb) {

	async.autoInject({
		players: [async.constant(entities.players)],
		updatedPlayers: ['players', updateLocations],
		sendResults: ['updatedPlayers', function (updatedPlayers) {
			cb(null, updatedPlayers);
		}]
	});

	function updateLocations(players, cb) {

		let updatedPlayers = players.map(checkPlayerPositions);
		cb(null, updatedPlayers);

		function checkPlayerPositions(player) {
			if(player) {
				if(player.upKeyPressed && checkPosition(player, 'y', '+'))
					player.vY = -player.vMax;
				else if(player.downKeyPressed && checkPosition(player, 'y', '-'))
					player.vY = player.vMax;
				else
					player.vY = 0;

				if(player.leftKeyPressed && checkPosition(player, 'x', '-'))
					player.vX = -player.vMax;
				else if(player.rightKeyPressed && checkPosition(player, 'x', '+'))
					player.vX = player.vMax;
				else
					player.vX = 0;

				player.x += player.vX;
				player.y += player.vY;

				return player;
			}
		}

		function checkPosition(player, axis, direction) {
			if(axis === 'x') {
				if(direction === '+') {
					return player.x < canvasWidth - 20;
				}else if(direction === '-') {
					return player.x > 20;
				}
			}
			else if(axis === 'y') {
				if(direction === '+') {
					return player.y > 20;
				}else if(direction === '-') {
					return player.y < canvasHeight - 20;
				}
			}
		}

	}
}

function getAllData(players, areas, callback) {

	async.autoInject({
		players: [async.constant(players)],
		areas: [async.constant(areas)],
		playerData: ['players', getPlayerData],
		areaData: ['areas', getAreaData],
		allData: ['playerData', 'areaData', combineAllData],
		return: ['allData', function (allData) {
			callback(null, allData);
		}]
	});

	function getPlayerData(players, cb) {
		if(players) {
			async.map(players, setPlayerData, function (error, result) {
				cb(null, result);
			});
		}

		function setPlayerData(player, cb) {
			if(player) {
				cb(null, {
					id: player.id,
					no: player.no,
					name: player.name,
					x: player.x,
					y: player.y,
					isInArea: player.isInArea,
					score: player.score
				});
			}
		}
	}

	function getAreaData(areas, cb) {
		if(areas) {
			async.map(areas, setAreaData, function (error, result) {
				cb(null, result);
			});
		}

		function setAreaData(area, cb) {
			if(area) {
				cb(null, {
					id: area.id,
					x: area.x,
					y: area.y,
					range: area.range,
					lifeTime: area.lifeTime,
					totalLifeTime: area.totalLifeTime
				});
			}
		}
	}

	function combineAllData(playerData, areaData, cb) {

		cb(null, {
			playerData: playerData,
			areaData: areaData
		});
	}
}

function updateAllInfo(entities) {

	async.autoInject({
		players: [async.constant(entities.players)],
		areas: [async.constant(entities.areas)],
		allData: ['players', 'areas', getAllData],
		message: [async.constant('dataUpdate')],
		sendData: ['message', 'allData', sendDataToUsers]
	});
}

function checkArePlayersInAreas(cb) {

	async.autoInject({
		players: listHelper.getAllPlayers,
		areas: listHelper.getAllAreas,
		updatedEntities: ['players', 'areas', setPlayersStatus],
		sendResults: ['updatedEntities', function (updatedEntities) {
			cb(null, updatedEntities);
		}]
	});

	function setPlayersStatus(players, areas, cb) {
		let updatedPlayers = players.map(async.apply(isPlayerInAreas, areas));
		cb(null, {players: updatedPlayers, areas: areas});
	}

	function isPlayerInAreas(areas, player) {
		if(player) {
			let isInAreaList = areas.map(function (area) {
				return areaFunctions.isInRange(area, player);
			});

			player.isInArea = isValueInArray(isInAreaList, true);

			return player;
		}
	}

	function isValueInArray(array, search) {
		return array.indexOf(search) >= 0;
	}
}

function checkConnections() {
	let sockets = io.sockets.connected;
	listHelper.getAllPlayers(function (error, players) {
		if(players)
			async.map(players, checkPlayerConnection);
	});

	function checkPlayerConnection(player) {
		if(player && !sockets.hasOwnProperty(player.id)) {
			listHelper.removePlayer(player.id);
		}
	}
}

function saveChanges(entities) {
	entities.players.forEach(function (player) {
		listHelper.addPlayer(player);
	});
}

function runGameLogic(cb){
	async.autoInject({
		checkedEntities: checkArePlayersInAreas,
		playersWithNewLocations: ['checkedEntities', generateLocations],
		return: ['checkedEntities', 'playersWithNewLocations', function (entities, updatedPlayers) {
			entities.players = updatedPlayers;
			cb(null, entities);
		}]
	});

}

function mainLoop() {
	async.autoInject({
		entities: runGameLogic,
		saveChanges: ['entities', saveChanges],
		final: ['entities', updateAllInfo]
	});
}