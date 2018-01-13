module.exports = {

	entity:{
		initialXPos: 100,
		initialYPos: 400,
		initialXVelocity: 0,
		initialYVelocity: 0,
		vMax: 5,
	},

	player:{
		minNo:1,
		maxNo:9
	},

	area:{
		minRange: 30,
		maxRange: 40,
		lifeTimeCoefficient: 50
	},

	draw:{
		canvas:{
			width: 1000,
			height: 600
		},
		player:{
			radius:20
		}
	},



	general:{
		refreshInterval: 20,
		checkConnectionInterval: 3000
	}

};