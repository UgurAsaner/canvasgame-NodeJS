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
var ENTITYlIST = {};
var PLAYERLIST = {};

var Entity = function(id){
    
    id = (typeof id === 'undefined') ? Math.floor(Math.random*1000)+1 : id;

    var self = {

        id : id,
        x : 300,
        y : 400,
        Vx : 0,
        Vy : 0,
        Vmax : 5
    }
    
    return self;
}

var Player = function(id, name){

    var  self = Entity(id);

    self.name = name;

    self.upKeyPressed = false;
    self.downKeyPressed = false;
    self.leftKeyPressed = false;
    self.rightKeyPressed = false;

    PLAYERLIST[id] = self;

    self.checkPosition = function (axis, direction){
        
        if(axis == 'x'){
            if(direction == '+'){
                return self.x < 740;
            }else if(direction == '-'){
                return self.x > 20;
            }
        }
        else if(axis == 'y'){
            if(direction == '+'){
                return self.y > 20;    
            }else if(direction == '-'){
                return self.y < 540;
            }
        }
    } 

    self.welcomeMessage = function (){
        return "Welcome to the Game " + self.name + ", your id is: " + self.id;
    }

    self.setMessage = function (message){
        return self.name + " (" + self.id + "): " + message;
    }

    return self;
}

io.sockets.on('connection', function(socket){
    
    socket.on('sign', function(data){
        if(data.length < 15){
            
            socket.id = Math.floor(Math.random() * 90) + 10;
            SOCKETLIST[socket.id] = socket;
            socket.emit('signed',data);
            let name = data
            let player = Player(socket.id, name);
            
            playerStatusChange(player, 'Online');
            socket.emit('consoleMessage',player.welcomeMessage());

        }
    });

    //  KEY EVENTS

    socket.on('upKeyEvent',function(data){
        let player = PLAYERLIST[socket.id];
        player.upKeyPressed = data;
    });

    socket.on('downKeyEvent',function(data){
        let player = PLAYERLIST[socket.id];
        player.downKeyPressed = data;
    });

    socket.on('leftKeyEvent',function(data){
        let player = PLAYERLIST[socket.id];
        player.leftKeyPressed = data;
    });

    socket.on('rightKeyEvent',function(data){
        let player = PLAYERLIST[socket.id];
        player.rightKeyPressed = data;
    });

    socket.on('messageFromPlayer', function(data){
        
        let player = PLAYERLIST[socket.id];
        sendDataToUsers('consoleMessage', player.setMessage(data));
    });

    socket.on('disconnect',function(){

        let done = playerStatusChange(PLAYERLIST[socket.id], 'Offline');        
        
        setTimeout(function(){
            if(done){
                delete SOCKETLIST[socket.id];  
                delete PLAYERLIST[socket.id]; 
            }               
        },1000);        
    });

});

//  MAIN LOOP

setInterval(function(){
    
    updateLocations();
    updateUsers();    
            
},20);

//  FUNCTIONS   

function updateUsers(){
            
    var usersData = getAllUsersData();
                    
    sendDataToUsers('locationUpdate',usersData);
            
}
            
function updateLocations(){
    for(var i in PLAYERLIST){
                        
        var player = PLAYERLIST[i];
            
        if(player.upKeyPressed && player.checkPosition('y','+'))
            player.Vy = -player.Vmax;
        else if(player.downKeyPressed && player.checkPosition('y','-'))
            player.Vy = player.Vmax;
        else
            player.Vy = 0; 
        
        if(player.leftKeyPressed && player.checkPosition('x','-'))
            player.Vx = -player.Vmax;
        
        else if(player.rightKeyPressed && player.checkPosition('x','+'))
            player.Vx = player.Vmax;
        else
            player.Vx = 0;
            
        player.x += player.Vx;
        player.y += player.Vy; 
    }
}
    
function getAllUsersData(){
            
    var usersData = [];
            
    for(var i in PLAYERLIST){
                        
        player = PLAYERLIST[i];
                        
        usersData.push({
            id : i,
            x : player.x, 
            y : player.y 
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

function playerStatusChange(player, status){

    let message = player.name + " (" + player.id + ") is " + status ;

    sendDataToUsers('player' + status, message);

    return true;

}







