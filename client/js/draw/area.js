

socket.on('areaUpdate', function (data) {

	areaCtx.clearRect(0, 0, canvas.width, canvas.height);

// Decide data type

	let areaData = data;

	areaCtx.lineWidth = 3;
	for(let i = 0; i < areaData.length; i++) {
		let area = areaData[i];
		let lifeTimeRate = area.lifeTime / area.totalLifeTime;
		areaCtx.beginPath();
		areaCtx.arc(area.x, area.y, area.range, 0, 2 * Math.PI, false);
		areaCtx.fillStyle = getColorFromLifeTime(lifeTimeRate);
		areaCtx.fill();
		areaCtx.beginPath();
		areaCtx.arc(area.x, area.y, area.range, 1.5 * Math.PI, (lifeTimeRate * 2 + 1.5) * Math.PI, false);
		areaCtx.strokeStyle = 'red';
		areaCtx.stroke();
	}

});