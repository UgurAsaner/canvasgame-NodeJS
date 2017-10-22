let ctx = document.getElementById("canvas").getContext('2d');
ctx.font = '20px Arial';


socket.on('dataUpdate', function (data) {

	let playerList = "";
	let playerData = data['playerData'];
	let areaData = data['areaData'];

	for (let i = 0; i < playerData.length; i++)
		playerList += ' ' + playerData[i].no;

	playerListDiv.innerHTML = "Players: " + playerList;

	ctx.clearRect(0, 0, 800, 600);

	for (let i = 0; i < areaData.length; i++) {
		ctx.beginPath();
		ctx.arc(areaData[i].x, areaData[i].y, areaData[i].range , 0, 2 * Math.PI, false);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		ctx.fillStyle = 'black';
		ctx.fillRect(areaData[i].x, areaData[i].y , 1, 1);
	}

	for (let i = 0; i < playerData.length; i++) {

		ctx.beginPath();
		ctx.arc(playerData[i].x, playerData[i].y, 30 , 0, 2 * Math.PI, false);
		if(playerData[i].id === socket.id)
			ctx.fillStyle = playerData[i].isInArea ? "red" : "rgba(250,200,200,0.7)";
		else
			ctx.fillStyle = playerData[i].isInArea ? "white" : "rgba(0,200,200,0.7)";
		ctx.fill();
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		ctx.fillStyle = 'black';
		ctx.fillRect(playerData[i].x, playerData[i].y , 1, 1);
		ctx.fillText(playerData[i].no, playerData[i].x-12, playerData[i].y+7);
		ctx.fillStyle = 'black';
		/*
		ctx.fillRect(playerData[i].x, playerData[i].y, 40, 40);
		ctx.fillStyle = "#000000";
		ctx.fillText(playerData[i].id, playerData[i].x + 10, playerData[i].y + 27);
		ctx.fillStyle = 'black';
		ctx.fillRect(playerData[i].x, playerData[i].y, 1, 1);*/
	}

});