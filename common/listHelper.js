let redisHelper = require('./redisHelper');
let async = require('async');

module.exports = {
	getAllPlayers: getAllPlayers,
	getAllAreas: getAllAreas,

	getPlayer: getPlayer,
	getArea: getArea,

	addPlayer: addPlayer,
	addArea: addArea,

	removePlayer: removePlayer,
	removeArea: removeArea
};

function getAllPlayers(callback){
	async.autoInject({
		listName : [async.constant('players')],
		players: ['listName', getAllCommon],
		return: ['players', function (players) {
			callback(null, players);
		}]
	});
}

function getAllAreas(callback){
	async.autoInject({
		listName : [async.constant('areas')],
		areas: ['listName', getAllCommon],
		return: ['areas', function (areas) {
			callback(null, areas);
		}]
	});
}

function getPlayer(id, callback) {
	async.autoInject({
		listName: [async.constant('players')],
		id: [async.constant(id)],
		player: ['listName', 'id', getCommon],
		return: ['player', function (player) {
			callback(null, player);
		}]
	});
}

function getArea(id, callback) {
	async.autoInject({
		listName: [async.constant('area')],
		id: [async.constant(id)],
		area: ['listName', 'id', getCommon],
		return: ['area', function (area) {
			callback(null, area);
		}]
	});
}

function addPlayer(player) {
	redisHelper.addTo('players', player);
}

function addArea(area) {
	redisHelper.addTo('areas', area);
}

function removePlayer(id) {
	redisHelper.removeFrom('players', id);
}

function removeArea(area) {
	redisHelper.removeFrom('areas', area.id);
}

function getCommon(listName, id, callback) {
	async.autoInject({
		id: [async.constant(id)],
		listName : [async.constant(listName)],
		object: ['listName', 'id', redisHelper.getFrom],
		return: ['object', function (object) {
			callback(null, object);
		}]
	});
}

function getAllCommon(listName, callback) {
	async.autoInject({
		listName : [async.constant(listName)],
		objects: ['listName', redisHelper.getAll],
		return: ['objects', function (objects) {
			callback(null, objects);
		}]
	});
}