const Constants = require('../config/constants');

// movement est l'objet passe par le client qui indique quelles fleches ont ete pressees de la forme:
// {
//     left: Boolean,
//     up: Boolean,
//     right: Boolean,
//     down: Boolean
// }

// met a false les directions qui mettraient le joueur dans une position invalide (depasse la bordure)
function borderCollisionCheck(player, movement) {
    if(player.x <= 0)
        movement.left = false;
    if(player.y <= 0)
        movement.up = false;
    if(player.x >= Constants.CANVAS_WIDTH - Constants.PLAYER_SIZE)
        movement.right = false;
    if(player.y >= Constants.CANVAS_HEIGHT - Constants.PLAYER_SIZE)
        movement.down = false;
}

// met a false les directions qui mettraient le joueur dans une position invalide (2 joueurs se superposent)
function opponentCollisionChecks(player, opponent, movement) {
    if(movement.left) {
        if(squareCollisionCheck(player.x - Constants.PLAYER_SHIFT, player.y, opponent.x, opponent.y))
            movement.left = false;
    }

    if(movement.up) {
        if(squareCollisionCheck(player.x, player.y - Constants.PLAYER_SHIFT, opponent.x, opponent.y))
            movement.up = false;
    }
        
    if(movement.right) {
        if(squareCollisionCheck(player.x + Constants.PLAYER_SHIFT, player.y, opponent.x, opponent.y))
            movement.right = false;
    }
    
    if(movement.down) {
        if(squareCollisionCheck(player.x, player.y + Constants.PLAYER_SHIFT, opponent.x, opponent.y))
            movement.down = false;
    }
}

function squareCollisionCheck(xa, ya, xb, yb) {
    return (xa + Constants.PLAYER_SIZE > xb)
        &&  (xa < xb + Constants.PLAYER_SIZE)
        &&  (ya + Constants.PLAYER_SIZE > yb)
        &&  (ya < yb + Constants.PLAYER_SIZE);
}

function playerSweetCollisionCheck(player, sweet){
    let x, y; // les x & y les plus proches du cercle
    if(sweet.x < player.x) {
        // le centre du cercle est à gauche du rectangle
        x = player.x;
    } else if(sweet.x > player.x + Constants.PLAYER_SIZE) {
        // le centre du cercle est à droite du rectangle
        x = player.x + Constants.PLAYER_SIZE;
    } else {
        // le centre du cercle est entre player.x et player.x + PLAYER_SIZE
        x = sweet.x;
    }
    // meme chose pour y
    if(sweet.y < player.y) {
        y = player.y;
    } else if(sweet.y > player.y + Constants.PLAYER_SIZE) {
        y = player.y + Constants.PLAYER_SIZE;
    } else {
        y = sweet.y;
    }

    // si la distance entre le centre du cercle et le plus proche point
    return (dist(sweet.x, sweet.y, x, y) < sweet.radius);
}

function dist(xa, ya, xb, yb) {
    return Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
}

module.exports = {
    borderCollisionCheck: borderCollisionCheck,
    opponentCollisionChecks: opponentCollisionChecks,
    playerSweetCollisionCheck: playerSweetCollisionCheck
}