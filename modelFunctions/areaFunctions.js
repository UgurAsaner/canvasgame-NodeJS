let listHelper = require('../common/listHelper');
let Area = require('../common/modelsExport').Area;

module.exports = {
	generateArea: generateArea,
	isInRange: isInRange
};

function isInRange (area, player) {
	let x = Math.pow(player.x - area.x, 2);
	let y = Math.pow(player.y - area.y, 2);
	let distance = Math.sqrt(x + y);
	let isInRange = distance < area.range;
	if(isInRange)
		reduceLifeTimeAndSetScore(area, player);
	return isInRange;
}

function generateArea() {
	let area = Area();
	listHelper.addArea(area);
}

function reduceLifeTimeAndSetScore(area, player) {
		area.lifeTime -= 50;
		player.score += 0.1;
		if(area.lifeTime > 0)
			listHelper.addArea(area);
		else
			listHelper.removeArea(area);
}