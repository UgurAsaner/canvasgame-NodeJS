let Entity = require('./entity').Entity;
let areaConfig = require('../config').area;
let canvasConfig = require('../config').draw.canvas;

let canvasWidth = canvasConfig.width;
let canvasHeight = canvasConfig.height;

let minRange = areaConfig.minRange;
let maxRange = areaConfig.maxRange;
let lifeTimeCoefficient = areaConfig.lifeTimeCoefficient;

module.exports = {
	Area: function (id) {

		let self = Entity(id);
		let maxXPos, maxYPos, minXpos, minYpos;

		self.range = minXpos = minYpos = (Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange);

		maxXPos = canvasWidth - minXpos;
		maxYPos = canvasHeight - minYpos;

		self.x = (Math.floor(Math.random() * (maxXPos - minXpos + 1)) + minXpos);
		self.y = (Math.floor(Math.random() * (maxYPos - minYpos + 1)) + minYpos);

		self.lifeTime = self.totalLifeTime = self.range * lifeTimeCoefficient;

		return self;
	}
};