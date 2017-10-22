module.exports = {

	Entity: function (id) {

		id = (typeof id === 'undefined') ? Math.floor(Math.random() * 1000) + 1 : id;

		return {
			id: id,
			x: 100,
			y: 400,
			vX: 0,
			vY: 0,
			vMax: 5
		};
	}
};
