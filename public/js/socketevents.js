function socketEventsSetup(socket, board) {
    socket.on('connect', function () {
        socket.emit('join', 'hello from client');
    });
    
    socket.on('updatestate', function(gamestate) {
        board.draw(gamestate.players, gamestate.sweets);
        console.log(gamestate);
    });
    
    socket.on('new player', function(id) {
        console.log(id + ' joined');
    });
    
    socket.on('player leave', function(id) {
        console.log(id + ' left');
    });
}