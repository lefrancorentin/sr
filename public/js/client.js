var req = new XMLHttpRequest();
req.addEventListener("load", function() {
    var canvas = document.getElementById('myCanvas');

    const Constants = JSON.parse(this.responseText);

    canvas.width = Constants.CANVAS_WIDTH;
    canvas.height = Constants.CANVAS_HEIGHT;

    let board = new Board(canvas, 'red', Constants.PLAYER_SIZE);
    let socket = io.connect('http://localhost:3000');

    socketEventsSetup(socket, board);
    inputSetup(socket);
});
req.open("GET", "http://localhost:3000/client/constants");
req.send();