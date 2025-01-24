let config ={
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1800,
        height: 1200
    },

    backgroundColor: '#17041f',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },

    scene: [
    {key: 'start', preload: startLoad, create: startScene},
    {key: 'game', preload: preload, create: create, update: update}
    ]
};

var game = new Phaser.Game(config);
game.scene.start('start');
let testDeck;
let testPlayer;
let hitButtonTop;
let hitButtonBottom;
let standButton;

function startLoad() {
    this.load.image('menu', 'assets/TableExample.png');
    this.load.spritesheet('buttons1', 'assets/Buttons2.png',
        {frameWidth: 16, frameHeight: 16}
    );
    this.load.spritesheet('buttons2', 'assets/Buttons1.png',
        {frameWidth: 16, frameHeight: 16}
    );
}
function preload () {
    this.load.image('table', 'assets/Tablex2.png');
    this.load.spritesheet('cards', 'assets/cards-sheet.png',
        {frameWidth: 32, frameHeight: 47}
    );
    this.load.spritesheet('buttons1', 'assets/Buttons2.png',
        {frameWidth: 16, frameHeight: 16}
    );
    this.load.spritesheet('buttons2', 'assets/Buttons1.png',
        {frameWidth: 16, frameHeight: 16}
    );
}

function startScene() {
    this.add.image(900, 600, 'menu').setScale(4);
    let startButton = this.add.sprite(900, 600, 'buttons1').setScale(4);
    startButton.setInteractive();

    startButton.on('pointerdown', () => {
        startButton.setTexture('buttons2');
        this.time.delayedCall(500, () => {
            this.scene.start('game');
        });

    });

    // startButton.on('pointerover', () => {
    //     startButton.setTexture('buttons2');
    // });

    // startButton.on('pointerout', () => {
    //     startButton.setTexture('buttons1');
    // });
}
function create () {
    this.keyHeld = false;
    this.cursors = this.input.keyboard.createCursorKeys();

    
    this.add.image(900, 600, 'table').setScale(3);

    hitButtonTop = this.add.sprite(800, 600, 'buttons1').setScale(4);
    hitButtonTop.setAngle(90);
    hitButtonTop.setInteractive();

    hitButtonBottom = this.add.sprite(950, 600, 'buttons1').setScale(4);
    hitButtonBottom.setAngle(270);
    hitButtonBottom.setInteractive();

    standButton = this.add.sprite(875, 600, 'buttons1').setFrame(1).setScale(4);
    standButton.setInteractive();

    testDeck = new Deck(this);
    testPlayer = new Player(this, 850);
    
    testPlayer2 = new Player(this, 350);
    
    this.time.delayedCall(1000, () => {
        testPlayer2.hit(testDeck.dealCard());
    });
    this.time.delayedCall(2000, () => {
        testPlayer2.hit(testDeck.dealCard());
        testPlayer2.hand[1].flip();
    });
    this.time.delayedCall(3000, () => {
        testPlayer.hit(testDeck.dealCard());
        testPlayer.hand[0].flip();
    });
    this.time.delayedCall(4000, () => {
        testPlayer.hit(testDeck.dealCard());
        testPlayer.hand[1].flip();
    });
    
}

function update() {
    hitButtonTop.on('pointerdown', () => {
        if (!this.keyHeld) {
            hitButtonTop.setTexture('buttons2');
            this.keyHeld = true;
            testPlayer.hit(testDeck.dealCard());
            testPlayer.hand[testPlayer.hand.length - 1].flip();
            this.time.delayedCall(1000, () => {
                this.keyHeld = false;
                hitButtonTop.setTexture('buttons1');
            });
        }
    });

    hitButtonBottom.on('pointerdown', () => {
        if (!this.keyHeld) {
            hitButtonBottom.setTexture('buttons2');
            this.keyHeld = true;
            testPlayer2.hit(testDeck.dealCard());
            testPlayer2.hand[testPlayer2.hand.length - 1].flip();
            this.time.delayedCall(1000, () => {
                this.keyHeld = false;
                hitButtonBottom.setTexture('buttons1');
            });
        }
    });

    standButton.on('pointerdown', () => {
        if (!this.keyHeld) {
            standButton.setTexture('buttons2').setFrame(1);
            this.keyHeld = true;
            for (card of testPlayer2.hand) {
                if (!card.flipped) {
                    card.flip();
                }
            }
            this.time.delayedCall(1000, () => {
                this.keyHeld = false;
                standButton.setTexture('buttons1').setFrame(1);
            });
        }
    });


    if (this.cursors.down.isDown && this.keyHeld === false) {
        this.keyHeld = true;
        testPlayer.hit(testDeck.dealCard());
        testPlayer.hand[testPlayer.hand.length - 1].flip();
        this.time.delayedCall(1000, () => {
            this.keyHeld = false;
        })
    }

    if (!this.cursors.shift.isDown && this.cursors.up.isDown && this.keyHeld === false) {
        this.keyHeld = true;
        testPlayer2.hit(testDeck.dealCard());
        testPlayer2.hand[testPlayer2.hand.length - 1].flip();
        this.time.delayedCall(1000, () => {
            this.keyHeld = false;
        })
    }

    if (this.cursors.shift.isDown && this.cursors.up.isDown && this.keyHeld === false) {
        this.keyHeld = true;
        testPlayer2.hit(testDeck.dealCard());
        this.time.delayedCall(1000, () => {
            this.keyHeld = false;
        });
    }

    if (this.cursors.space.isDown && this.keyHeld === false) {
        this.keyHeld = true;
        for (card of testPlayer2.hand) {
            if (!card.flipped) {
                card.flip();
            }
        }
        this.time.delayedCall(1000, () => {
            this.keyHeld = false;
        });
    }
    
}

class Card {
    constructor(scene, rank, suit) {
        this.scene = scene;
        this.rank = rank;
        this.suit = suit;
        this.flipped = false;
        this.sprite = this.scene.add.sprite(1500, 600, 'cards').setScale(3);
        this.front = 0;
        this.setFront();
    }

    setFront() {
        if (this.getValue() < 10) {
            this.front = 12 + (2 * (this.getValue() - 2));
        } else if (this.getValue() >= 10) {
            switch (this.rank) {
                case '10':
                    this.front = 12 + (2 * (this.getValue() - 2));
                    break;
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
                        scaleX: { value: 3, duration: 500, yoyo: false },
                    },
                    ease: 'Linear'
                });
            }
            
        });
        
        
        
    }

}

class Deck {
    constructor(scene) {
        this.scene = scene;
        this.cards = [];
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

        for (let suit of suits) {
            for (let rank of ranks) {
                this.cards.push(new Card(this.scene, rank, suit));
            }
        }

        this.shuffle();
        this.angle();
    }

    shuffle() {
        for (let i = 0; i < 52; i++) {
            const j = Math.floor(Math.random() * 52);
            const card1 = this.cards[i];
            const card2 = this.cards[j];
            this.cards[i] = card2;
            this.cards[j] = card1;
        }
    }

    angle() {
        let x = 1500;
        let y = 600;
        let layer = 1;
        for (let card of this.cards) {
            card.sprite.setPosition(x, y);
            card.sprite.setDepth(layer)
            x -= 0.25;
            y -= 0.25;
            layer += 1;
        }
    }

    dealCard() {
        return this.cards.pop();
    }
}

class Player {
    constructor(scene, handy) {
        this.scene = scene;
        this.handy = handy;
        this.handx = 900;
        this.putx = 900;
        this.hand = [];
        this.sprites = [];
    }

    
    hit(card) {
        this.hand.push(card);
        this.sprites.push(card.sprite);
        this.scene.tweens.add({
            targets: card.sprite,
            x: this.putx,
            y: this.handy,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                Phaser.Actions.GridAlign(this.sprites, {
                    width: this.sprites.length,
                    height: 1,
                    cellWidth: 48,
                    cellHeight: 47,
                    x: this.handx,
                    y: this.handy
                });
            }
        })
        card.sprite.setDepth(this.hand.length);
        this.handx -= 24;
        this.putx += 24;
        // card.flip();
    }

    // getMaxScore() {
    //     let score = this.hand.reduce((acc, card) => acc + card.getValue(), 0);
    //     let aces = 0;
    //     for (let card of this.hand) {
    //         if (card.rank === 'Ace') {
    //             aces++;
    //         }
    //     }
    //     if (aces > 0) {
    //         aces--;
    //     }
    //     return score - aces * 10;
    // }

    // getMinScore() {
    //     if (this.hand.some(card => card.rank === 'Ace')) {
    //         return this.getMaxScore() - 10;
    //     } else {
    //         return this.getMaxScore();
    //     }
    // }

    // getScore() {
    //     if (this.hand.some(card => card.rank === 'Ace')) {
    //         if (this.getMaxScore() > 21) {
    //             return `${this.getMinScore()}`;
    //         } else {
    //             return `${this.getMinScore()} or ${this.getMaxScore()}`;
    //         }
    //     } else {
    //         return `${this.getMaxScore()}`;
    //     }
    // }
}