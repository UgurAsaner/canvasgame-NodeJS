let Entity = require('./entity').Entity;

module.exports = {

	Player: function (id, name) {

		let self = Entity(id);

		self.name = name;
		self.no = Math.floor(Math.random() * 90) + 10;
		self.upKeyPressed = false;
		self.downKeyPressed = false;
		self.leftKeyPressed = false;
		self.rightKeyPressed = false;
		self.isInArea = false;

		self.checkPosition = function (axis, direction) {

			if (axis === 'x') {
				if (direction === '+') {
					return self.x < 740;
				} else if (direction === '-') {
					return self.x > 20;
				}
			}
			else if (axis === 'y') {
				if (direction === '+') {
					return self.y > 20;
				} else if (direction === '-') {
					return self.y < 540;
				}
			}
		};

		self.welcomeMessage = function () {
			return "Welcome to the Game " + self.name + ", your no is: " + self.no;
		};

		self.setMessage = function (message) {
			return self.name + " (" + self.no + "): " + message;
		};

		return self;
	}
};