class Board {
    constructor(canvas, color = 'red', playerSize = 20) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.playerColor = color;
        this.playerSize = playerSize;
    }

    draw(players, sweets) {
        this.ctx.fillStyle = '#F0F0F0'; // sets canvas background color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);  // fills the canvas
        for(const id in players) {
            let player = players[id];
            this.ctx.fillStyle = this.playerColor;
            this.ctx.fillRect(player.x, player.y, this.playerSize, this.playerSize);
        };
        sweets.forEach(sweet => {
            this.ctx.fillStyle = 'blue';
            this.ctx.beginPath();
            this.ctx.arc(sweet.x, sweet.y, sweet.radius, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
}