var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(req,res){
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(1919);

var SOCKETLIST = {};

io.sockets.on('connection', function(socket){
    
    socket.id = Math.floor(Math.random() * 100);
    socket.x = 0;
    socket.y = 0;
    socket.Vx = 1;
    socket.Vy = 1;
    
    SOCKETLIST[socket.id] = socket;

    let message = "Player " + socket.id + " is online";

    sendMessageToUsers(message);

    socket.on("disconnect",function(){

        delete SOCKETLIST[socket.id];        
        let message = "Player " + socket.id + " is offline";
        sendMessageToUsers(message);

    });

});

setInterval(function(){
    
        updateLocations();
        updateUsers();    
            
},40);

function updateUsers(){
            
    var usersData = getAllUsersData();
                    
    sendDataToUsers('locationUpdate',usersData);
            
}
            
function updateLocations(){
    for(var i in SOCKETLIST){
                        
        socket = SOCKETLIST[i];
            
        if(isUserAtVerticalLimits(socket))
            socket.Vx = -socket.Vx;
        
        if(isUserAtHorizontalLimits(socket))
            socket.Vy = -socket.Vy;
            
            
        socket.x += socket.Vx;
        socket.y += socket.Vy; 
    }
}
            
function getAllUsersData(){
            
    var usersData = [];
            
    for(var i in SOCKETLIST){
                        
        socket = SOCKETLIST[i];
                        
        usersData.push({
            id : i,
            x : socket.x, 
            y : socket.y 
        });
            
    }
            
    return usersData; 
}
            
function sendDataToUsers(event, data){
            
    for(i in SOCKETLIST){
        var socket = SOCKETLIST[i];
        socket.emit(event,data);
    }
}

function sendMessageToUsers(message){

    sendDataToUsers('consoleMessage', message);

}

function isUserAtVerticalLimits(socket){

    if((socket.x > 700 && socket.Vx > 0) || (socket.x < 100 && socket.Vx < 0))
        return true;

    return false;
}

function isUserAtHorizontalLimits(socket){
    
        if((socket.y > 500 && socket.Vy > 0) || (socket.y < 100 && socket.Vy < 0))
            return true;
    
        return false;
    }




