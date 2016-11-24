// Create our 'main' state that will contain the game
var mainState = {
    preload: function () {
        // This function will be executed at the beginning
        // That's where we load the images and sounds
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.audio('jump', 'assets/jump.wav');

    },

    create: function () {
        this.jumpSound = game.add.audio('jump');

        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        // Change the background color of the game to blue
        game.stage.backgroundColor = '#71c5cf';
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //BIRD
        // Display the bird at the position x=100 and y=245
        bird = game.add.sprite(100, 245, 'bird');

        //add physic to the bird //move,gravity,collision
        game.physics.arcade.enable(bird);

        //gravity
        bird.body.gravity.y = 1000;

        //call jump function when press space
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        bird.anchor.setTo(-0.2, 0.5);

        //PIPE
        pipes = game.add.group();
        timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        //SCORE
        score = 0;
        labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#ffffff"});
    },

    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic
        if (bird.angle < 20) {
            bird.angle += 1;
        }
        game.physics.arcade.overlap(bird, pipes, this.hitPipe, null, this);

    },
    jump: function () {
        if (bird.alive == false) {
            return;
        }
        this.jumpSound.play();

        bird.body.velocity.y = -350;

        //create an animation on the bird
        var animation = game.add.tween(bird);
        animation.to({angle: -20}, 100);
        animation.start();

    },
    addOnePipe: function (x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        pipes.add(pipe);

        //enable physic
        game.physics.arcade.enable(pipe);
        //add velocity to move left
        pipe.body.velocity.x = -200;

        //auto kill when no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function () {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);
        }
        score += 1;
        labelScore.text = score;

    },
    hitPipe: function () {
        if (bird.alive == false) {
            return;
        }
        bird.alive = false;
        //prevent new pipes from appearing
        game.time.events.remove(timer);
        //go through all the pipes,stop their move
        pipes.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);

    }
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');