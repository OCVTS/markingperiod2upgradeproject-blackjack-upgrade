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

    let testCard = new Card(this, 'Queen', 'h');
    // testCard.setInteractive();
    // testCard.input.on('pointerdown', testCard.flip());
    testCard.flip();
    
    
    // cards = this.add.group({
    //     key: 'cards',
    //     repeat: 51,
    //     setXY: {x: 750, y: 300, stepX: -0.25, stepY: -0.25}
    // });
    
    // cards.children.iterate(function (child) {
    //     child.setScale(1.5);
    // })
}

class Card {
    constructor(scene, rank, suit) {
        this.scene = scene;
        this.rank = rank;
        this.suit = suit;
        this.flipped = false;
        this.sprite = this.scene.add.sprite(750, 300, 'cards').setScale(1.5);
        this.front = 0;
        this.setFront();
    }

    setFront() {
        if (this.getValue() < 10) {
            this.front = 12 + (2 * (this.getValue() - 2));
        } else if (this.getValue() >= 10) {
            switch (this.rank) {
                case 'Jack':
                    this.front = 30;
                    break;
                case 'Queen':
                    this.front = 32;
                    break;
                case 'King':
                    this.front = 34;
                    break;
                case 'Ace':
                    this.front = 9;
                    break;

            }
        }

        switch (this.suit) {
            case 'Diamonds':
                this.front += 1;
                if (this.rank === 'Ace') {
                    this.front += 1;
                }
                break;
            case 'Spades':
                this.front += 28;
                break;
            case 'Clubs':
                this.front += 29;
                if (this.rank === 'Ace') {
                    this.front += 1;
                }
                break;
            default:
                break;

        }
    }

    getValue() {
        if (['2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(this.rank)) {
            return parseInt(this.rank);
        } else if (['Jack', 'Queen', 'King'].includes(this.rank)) {
            return 10;
        } else if (this.rank === 'Ace') {
            return 11;
        }
    }

    flip() {
        this.scene.tweens.add({
            targets: this.sprite,
            props: {
                scaleX: { value: 0, duration: 500, yoyo: false },
            },
            ease: 'Linear',
            onComplete: () => {
                if (this.flipped) {
                    this.sprite.setFrame(0);
                    this.flipped = false;
                } else {
                    this.sprite.setFrame(this.front);
                    this.flipped = true;
                }

                this.scene.tweens.add({
                    targets: this.sprite,
                    props: {
                        scaleX: { value: 1.5, duration: 500, yoyo: false },
                    },
                    ease: 'Linear'
                });
            }
            
        });
        
        
        
    }
}