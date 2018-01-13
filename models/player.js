let Entity = require('./entity').Entity;
let config = require('../config').player;

let minNo = config.minNo;
let maxNo = config.maxNo;

module.exports = {

	Player: function (id, name) {

		let self = Entity(id);

		self.name = name;
		self.no = Math.floor(Math.random() * (maxNo - minNo + 1)) + minNo;
		self.score = 0;
		self.upKeyPressed = false;
		self.downKeyPressed = false;
		self.leftKeyPressed = false;
		self.rightKeyPressed = false;
		self.isInArea = false;

		return self;
	}
};