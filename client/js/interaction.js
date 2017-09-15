var playerListDiv = document.getElementById("player-list");
var messageBoard = document.getElementById("message-board");
var messageForm = document.getElementById("message-form");
var messageInput = document.getElementById("message-input");


messageForm.onsubmit = function(e){
    e.preventDefault();

    socket.emit('messageFromPlayer',messageInput.value);

    messageInput.value = "";
}

socket.on('playerOnline',function(data){
    
        printConsoleMessage(data,'online');
    
});
    
socket.on('playerOffline',function(data){
    
    printConsoleMessage(data,'offline');
    
});
    
socket.on('consoleMessage',function(data){
    
    printConsoleMessage(data);
    
});
    

document.onkeydown = function(e) {

    e = e || window.event;
    
    if (e.keyCode == '38')
        socket.emit('upKeyEvent',true);
        
    else if (e.keyCode == '40') 
        socket.emit('downKeyEvent',true);
        
    else if (e.keyCode == '37') 
        socket.emit('leftKeyEvent',true);
        
    else if (e.keyCode == '39') 
        socket.emit('rightKeyEvent',true);
        
    
}
    
document.onkeyup = function(e) {
    
    e = e || window.event;
    
    if (e.keyCode == '38') 
        socket.emit('upKeyEvent',false);
    
    else if (e.keyCode == '40') 
        socket.emit('downKeyEvent',false);
    
    else if (e.keyCode == '37') 
        socket.emit('leftKeyEvent',false);
    
    else if (e.keyCode == '39') 
        socket.emit('rightKeyEvent',false);
    
    
}

    