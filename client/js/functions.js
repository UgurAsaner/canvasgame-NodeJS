function printConsoleMessage(message, type){

    if( typeof(type) == 'undefined')
        messageBoard.innerHTML += "<div>" + message + "</div>"; 
    else
        messageBoard.innerHTML += "<div class=\"" + type + "-message\"><span class=\"system-message\">System Message: </span>" + message + "</div>"; 
    
}