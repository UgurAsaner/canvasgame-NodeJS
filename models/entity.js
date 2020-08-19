let config = require('../config').entity;
module.exports = {

	Entity: function (id) {

		id = (typeof id === 'undefined') ? Math.floor(Math.random() * 1000) + 1 : id;

		return {
			id: id,
			x: config.initialXPos,
			y: config.initialYPos,
			vX: config.initialXVelocity,
			vY: config.initialYVelocity,
			vMax: config.vMax
		};
	}
};
