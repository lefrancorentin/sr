function inputSetup(socket) {
    let movement = {
        left: false,
        up: false,
        right: false,
        down: false
    }
    
    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 37: // left
                movement.left = true;
                break;
            case 38: // up
                event.preventDefault();
                movement.up = true;
                break;
            case 39: // right
                movement.right = true;
                break;
            case 40: // down
                event.preventDefault();
                movement.down = true;
                break;
        }
    });
    
    document.addEventListener('keyup', function(event) {
        switch (event.keyCode) {
            case 37: // left
                movement.left = false;
                break;
            case 38: // up
                movement.up = false;
                break;
            case 39: // right
                movement.right = false;
                break;
            case 40: // down
                movement.down = false;
                break;
        }
    });

    // Stoppe tout mouvement si la l'onglet du jeu n'est plus en focus
    window.addEventListener('blur', function() {
        movement.left = false;
        movement.up = false;
        movement.right = false;
        movement.down = false;
    });
    
    setInterval(function() {
        if(movement.left || movement.up || movement.right || movement.down) {
            socket.emit('playerupdate', movement);
        }
    }, 1000 / 120 );
}