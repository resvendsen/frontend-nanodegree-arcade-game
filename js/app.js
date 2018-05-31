
// pick a random block to put a bonus icon in
function randomStoneBlock() {
    const x = Math.floor(Math.random() * 404);
    let y = Math.floor(Math.random() * 83);
    if (y <= 60) {y += 56;};
    return [x, y];
}

// Enemies our player must avoid
let Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // time delta is set in engine
    this.x = this.x + (this.speed * dt);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    // this if statement determines whether a collision has occurrred
    // if it has the game is reloaded/restarted
    if (this.x >= (player.x-70) && this.x <= (player.x+70) &&
        this.y >= (player.y-30) && this.y <= (player.y+30)) {
        location.reload();
    };

    // bot is off the screen on the right, so...
    // start this bot over just off screen left and give it a new speed
    if (this.x > 505) {
        this.x = -101;
        let del = Math.random();
        // speeds are kep from being too slow, otherwise the game deteriorates into all
        // slow bots because it takes so long for them to cross the screen
        this.speed = Math.floor((del <= .1 ? del+.3 :del) * 250);
    };

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
};

// nothing to update for the player
// player's position is updated based of arrow key events
Player.prototype.update = function() {};

Player.prototype.render = function() {
        for (let i=0;i<allBonuses.length;i++) {
            if (this.x >= (allBonuses[i].x-70) && this.x <= (allBonuses[i].x+70) &&
                this.y >= (allBonuses[i].y-30) && this.y <= (allBonuses[i].y+30)) {
                allBonuses.splice(i, 1);
                gemCount++;
            }
        };


    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    // one arrow key press moves the player bot one tile in the appropriate direction
    switch (key) {
        case 'left':
            if (this.x > 0) {this.x = this.x - 101;};
            break;
        case 'up':
            if (this.y > 0) {this.y = this.y - 83;};
            break;
        case 'right':
            if (this.x < 404) {this.x = this.x + 101;};
            break;
        case 'down':
            if (this.y < 404) {this.y = this.y + 83;};
            break;
        default:
            alert("Invalid switch case:  " + key);
    };
    // when the player reaches the water, the first "y" direction row, game over
    if (this.y <= 0) {
        // stop the game loop
        // remove all the enemies - this results in the engine cancelling the animation frame
        allEnemies.length = 0;
        // ditch the event listener in order to prevent moving the game character around
        document.removeEventListener('keyup', keyUpProcessor);
        this.gameOver("Congratulations!  You won!\n\nYou won " + gemCount + " gem(s)");};
};

// this generates a message when the player makes it safely to the water
Player.prototype.gameOver = function(msg) {
    // this timeout allows some things to finish before the confirm executes
    setTimeout(function () {
        // if user clicks "ok", start another game, else just done (do nothing)
        if (confirm(msg)) {
            location.reload();
        };
    }, 100);
};

// bonus tokens
let BonusToken = function(x, y, sprite, btName) {
    this.btName = btName;
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};

BonusToken.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// game cells are 101px wide by 83px tall
// each enemy icon starts off screen left and moves right until it's off screen right and
// then starts over

let block = randomStoneBlock();
const greenGem = new BonusToken(block[0], block[1], 'images/Gem Green.png', 'gg');
block = randomStoneBlock();
const blueGem = new BonusToken(block[0], block[1], 'images/Gem Blue.png', 'bg');
block = randomStoneBlock();
const orangeGem = new BonusToken(block[0], block[1], 'images/Gem Orange.png', 'og');
const allEnemies = [new Enemy(-101, 56, 180), new Enemy(-195, 56, 180), new Enemy(-346, 56, 180), new Enemy(-101, 139, 145), new Enemy(-303, 139, 145), new Enemy(-101, 222, 135), new Enemy(-404, 222, 135)];
const allBonuses = [greenGem, blueGem, orangeGem];
const player = new Player(202, 322);

let gemCount = 0;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

// lifted this from anonymity to a named function so the event listener could be removed
// at the end of the game - prevents the user from moving the game character around after
// the game ends (you can't remove an event listener if the function is anonymous)
let keyUpProcessor = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (e.keyCode in allowedKeys) {
        player.handleInput(allowedKeys[e.keyCode]);
    };
}

document.addEventListener('keyup', keyUpProcessor);
