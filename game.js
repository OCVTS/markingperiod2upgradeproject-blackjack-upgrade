let config ={
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        // update: update
    }
};

var game = new Phaser.Game(config);

function preload () {
    this.load.image('background', 'assets/1.png');
//     this.load.image('table', 'assets/1.png');
}

function create () {
    // this.add.image(400, 300, 'table').refreshBody();
    this.add.image(400, 300, 'background').setScale(1.05, 1.08).refreshBody();

    
    
}