var ctx = document.getElementById("canvas").getContext('2d');
ctx.font = '20px Arial'; 

socket.on('signed',function(data){
    gameDiv.style.display = 'inline-block';
    signDiv.style.display = 'none';

});

socket.on('locationUpdate',function(data){
    
        var playerList = "";
    
        for(var i = 0; i < data.length; i++)
            playerList += ' ' + data[i].id;
        
    
        playerListDiv.innerHTML = "Players: " + playerList;
    
        ctx.clearRect(0, 0, 800, 600);
    
        for(var i = 0; i < data.length; i++){
    
            ctx.fillStyle = "rgba(250,200,200,0.7)";
            ctx.fillRect(data[i].x, data[i].y, 40, 40);
            ctx.fillStyle = "#000000";
            ctx.fillText(data[i].id, data[i].x+10, data[i].y+27);
        }    
    
    });