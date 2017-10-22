let Entity = require('./entity').Entity;

module.exports = {
	Area: function (id) {

		let self = Entity(id);

		self.x = (Math.floor(Math.random() * 650) + 80);
		self.y = (Math.floor(Math.random() * 450) + 80);

		self.range = (Math.floor(Math.random() * 50) + 30);

		self.isInRange = function (player) {
			let x = Math.pow(player.x - self.x, 2);
			let y = Math.pow(player.y - self.y, 2);
			let distance = Math.sqrt( x + y );
			return distance < self.range * 0.6;
		};

		return self;
	}
};