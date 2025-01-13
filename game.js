let config ={
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    backgroundColor: '#17041f',
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
    // this.load.image('background', 'assets/7.png');
    this.load.image('table', 'assets/Tablex2.png');
    this.load.spritesheet('cards', 'assets/cards-sheet.png',
        {frameWidth: 32, frameHeight: 47}
    )
}

function create () {
    // this.add.image(450, 300, 'background').setScale(1.3, 1.08)
    this.add.image(450, 300, 'table').setScale(1.5);
    
    
    cards = this.add.group({
        key: 'cards',
        repeat: 51,
        setXY: {x: 750, y: 300, stepX: -0.25, stepY: -0.25}
    });
    
    cards.children.iterate(function (child) {
        child.setScale(1.5);
    })
}