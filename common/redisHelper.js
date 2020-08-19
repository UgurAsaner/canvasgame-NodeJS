let redis = require('redis');
let redisClient = redis.createClient();
let async = require('async');

module.exports = {
	getAll,
	addTo,
	removeFrom,
	getFrom
};

function getAll(prefix, callback) {

	async.autoInject({
		prefix: [async.constant(prefix)],
		keys: ['prefix', getKeys],
		objects: ['keys', getObjects],
		return: ['objects', function (objects) {
			callback(null, objects);
		}]
	});

	function getKeys(prefix, cb){
		redisClient.keys(prefix + '*', function (error, result) {
			cb(null, result);
		});
	}

	function getObjects(keys, cb) {

		async.map(keys, getObject, function(err, results){
			cb(null, results);
		});

		function getObject(key, cb) {
			redisClient.get(key, function (error, result) {
				if(error === null)
					cb(null, JSON.parse(result));
				else
					throw error;
			});
		}

	}
}

function addTo (prefix, object) {
	let jsonElement = JSON.stringify(object);
	redisClient.set(prefix + ':' + object.id, jsonElement);
}

function removeFrom (prefix, id) {
	redisClient.del(prefix + ':' + id);
}

function getFrom (prefix, id, cb) {
	redisClient.get(prefix + ':' + id, function (error, result) {
		if(result)
			cb(error, JSON.parse(result));
		else
			cb(error, result);
	});
}