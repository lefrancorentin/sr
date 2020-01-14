const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Constants = require('./config/constants');
const Collision = require('./util/Collision');

app.use(express.static(__dirname + '/public'));

server.listen(Constants.PORT, () => {
    console.log(`Server started at port ${Constants.PORT}`);
});

app.get('/', (req, res) => {
    // Chargement du fichier index.html affiche au client
    res.status(200).sendFile(__dirname + '/index.html');
});

app.get('/client/constants', (req, res) => {
    res.send({
        CANVAS_HEIGHT: Constants.CANVAS_HEIGHT,
        CANVAS_WIDTH: Constants.CANVAS_WIDTH,
        PLAYER_SIZE: Constants.PLAYER_SIZE
    });
});


let players = {};
let sweets = [
    {
        x: 100,
        y: 100,
        radius: 10
    },
    {
        x: 10,
        y: 100,
        radius: 10
    }
];
let gamestate = { players, sweets };

io.on('connection', function(client) {
    // temporaire pour eviter le spawn au meme endroit
    switch(Object.keys(players).length) {
        case 0:
            players[client.id] = {
                x: 0,
                y: 0
            };
            break;
        case 1:
            players[client.id] = {
                x: Constants.CANVAS_WIDTH - Constants.PLAYER_SIZE,
                y: 0
            };
            break;
        case 2:
            players[client.id] = {
                x: 0,
                y: Constants.CANVAS_HEIGHT - Constants.PLAYER_SIZE
            };
            break;
        default:
            players[client.id] = {
                x: Constants.CANVAS_WIDTH - Constants.PLAYER_SIZE,
                y: Constants.CANVAS_HEIGHT - Constants.PLAYER_SIZE
            };
    }

    io.emit('new player', client.id);
    client.on('join', function(message) {
        console.log(message);
        io.emit('updatestate', gamestate);    // clients add this player to the board
    });

    let player = players[client.id];
    client.on('playerupdate', function(movement) {

        // passe les directions qui feraient depasser la bordure au joueur a false sur l'object movement
        Collision.borderCollisionCheck(player, movement);

        for(opponent in players) {
            if(players[opponent] !== player) {
                // passe les directions qui feraient se superposer le joueur a un autre joueur a false sur l'object movement
                Collision.opponentCollisionChecks(player, players[opponent], movement);
            }
        }

        // il ne reste que les directions valides sur l'objet movement
        // PLAYER_SHIFT: decalage du joueur sur le canvas en pixels
        if(movement.left)
            player.x -= Constants.PLAYER_SHIFT;
        if(movement.up)
            player.y -= Constants.PLAYER_SHIFT;
        if(movement.right)
            player.x += Constants.PLAYER_SHIFT;
        if(movement.down)
            player.y += Constants.PLAYER_SHIFT;

        // supprime les sweets qui ont ete touches suite au mouvement
        for(let i = 0; i < sweets.length; i++) {
            if(Collision.playerSweetCollisionCheck(player, sweets[i])) {
                sweets.splice(i, 1);
            }
        }

        io.emit('updatestate', gamestate);
    });

    client.on('disconnect', (reason) => {
        delete players[client.id];
        io.emit('player leave', client.id);
        io.emit('updatestate', gamestate);    // clients can delete the player from the board
    });
});