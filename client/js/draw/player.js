

let tableHtml = generateTableHeadings();

socket.on('playerUpdate', function (data) {

	/* Decide data type:

		x and y only ?

	 */
	playerCtx.clearRect(0, 0, canvas.width, canvas.height);
	playerCtx.lineWidth = 1;
	for(let i = 0; i < playersLength; i++) {

		//  DRAW
		let player = data[i];
		let playerX = player.x;
		let playerY = player.y;

		playerCtx.beginPath();
		playerCtx.arc(playerX, playerY, playerRadius, 0, 2 * Math.PI, false);
		if(player.id === socket.id){
			tableHtml += generatePlayerRow(player, true);
			playerCtx.fillStyle = player.isInArea ? "red" : "rgba(250,200,200,0.7)";
		}
		else{
			tableHtml += generatePlayerRow(player);
			playerCtx.fillStyle = player.isInArea ? "white" : "rgba(0,200,200,0.7)";
		}
		playerCtx.fill();
		playerCtx.strokeStyle = '#003300';
		playerCtx.stroke();
		playerCtx.fillStyle = 'black';

		playerCtx.font = "20px Arial";
		playerCtx.fillText(player.no, playerX - 5, playerY + 5);
		playerCtx.fillStyle = 'black';
	}

	scoreTable.innerHTML = tableHtml;
});