let redis = require('redis');
let redisClient = redis.createClient();

module.exports = {
	getList : function (list) {
		redisClient.lrange(list, 0, -1, function (error, result) {
			if (error === null)
				return result;
			throw error;
		})
	},
	append : function (list, id) {
		redisClient.lpush(list, id, function (error, result) {
			if (error === null)
				return result;
			throw error;
		});
	},
	remove : function(list, id){
		redisClient.lrem(list, 1, id, function (error, result) {
			if (error === null)
				return result;
			throw error;
		});
	}
};