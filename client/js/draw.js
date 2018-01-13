let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let playerRadius;

socket.on('drawConfig', function (data) {
	canvas.width = data.canvas.width;
	canvas.height = data.canvas.height;
	playerRadius = data.player.radius;
	socket.emit('playerReady');
});

socket.on('dataUpdate', function (data) {

	let playerData = data['playerData'];
	let areaData = data['areaData'];
	let playersLength = playerData.length;
	let tableHtml = generateTableHeadings();

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = 3;
	for(let i = 0; i < areaData.length; i++) {
		let area = areaData[i];
		let lifeTimeRate = area.lifeTime / area.totalLifeTime;
		ctx.beginPath();
		ctx.arc(area.x, area.y, area.range, 0, 2 * Math.PI, false);
		ctx.fillStyle = getColorFromLifeTime(lifeTimeRate);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(area.x, area.y, area.range, 1.5 * Math.PI, (lifeTimeRate * 2 + 1.5) * Math.PI, false);
		ctx.strokeStyle = 'red';
		ctx.stroke();
	}

	ctx.lineWidth = 1;
	for(let i = 0; i < playersLength; i++) {

		//  DRAW
		let player = playerData[i];
		let playerX = player.x;
		let playerY = player.y;

		ctx.beginPath();
		ctx.arc(playerX, playerY, playerRadius, 0, 2 * Math.PI, false);
		if(player.id === socket.id){
			tableHtml += generatePlayerRow(player, true);
			ctx.fillStyle = player.isInArea ? "red" : "rgba(250,200,200,0.7)";
		}
		else{
			tableHtml += generatePlayerRow(player);
			ctx.fillStyle = player.isInArea ? "white" : "rgba(0,200,200,0.7)";
		}
		ctx.fill();
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		ctx.fillStyle = 'black';

		ctx.font = "20px Arial";
		ctx.fillText(player.no, playerX - 5, playerY + 5);
		ctx.fillStyle = 'black';
	}
	scoreTable.innerHTML = tableHtml;
});