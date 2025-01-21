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
        update: update
    }
};

var game = new Phaser.Game(config);
let testDeck;
let testPlayer;
// let hitButton;
// let standButton;

function preload () {
    // this.load.image('background', 'assets/7.png');
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

function create () {
    this.keyHeld = false;
    this.cursors = this.input.keyboard.createCursorKeys();

    
    this.add.image(450, 300, 'table').setScale(1.5);

    // hitButton = this.add.sprite(400, 300, 'buttons1').setScale(2);
    // hitButton.setInteractive();

    // standButton = this.add.sprite(475, 300, 'buttons1').setFrame(1).setScale(2);
    // standButton.setInteractive();

    testDeck = new Deck(this);
    testPlayer = new Player(this, 425);
    
    testPlayer2 = new Player(this, 175);
    
    
    
}

function update() {
    // hitButton.on('pointerdown', () => {
    //     if (!this.keyHeld) {
    //         hitButton.setTexture('buttons2');
    //         this.keyHeld = true;
    //         testPlayer.hit(testDeck.dealCard());
    //         this.time.delayedCall(1000, () => {
    //             this.keyHeld = false;
    //             hitButton.setTexture('buttons1');
    //             });
    //     }
    // });


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
        this.sprite = this.scene.add.sprite(750, 300, 'cards').setScale(1.5);
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
                        scaleX: { value: 1.5, duration: 500, yoyo: false },
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
        let x = 750;
        let y = 300;
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
        this.handx = 450;
        this.putx = 450;
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
                card.sprite.setDepth(this.hand.length);
                Phaser.Actions.GridAlign(this.sprites, {
                    width: this.sprites.length,
                    height: 1,
                    cellWidth: 32,
                    cellHeight: 47,
                    x: this.handx,
                    y: this.handy
                });
            }
        })
        this.handx -= 16;
        this.putx += 16;
        // card.flip();
    }

    getMaxScore() {
        let score = this.hand.reduce((acc, card) => acc + card.getValue(), 0);
        let aces = 0;
        for (let card of this.hand) {
            if (card.rank === 'Ace') {
                aces++;
            }
        }
        if (aces > 0) {
            aces--;
        }
        return score - aces * 10;
    }

    getMinScore() {
        if (this.hand.some(card => card.rank === 'Ace')) {
            return this.getMaxScore() - 10;
        } else {
            return this.getMaxScore();
        }
    }

    getScore() {
        if (this.hand.some(card => card.rank === 'Ace')) {
            if (this.getMaxScore() > 21) {
                return `${this.getMinScore()}`;
            } else {
                return `${this.getMinScore()} or ${this.getMaxScore()}`;
            }
        } else {
            return `${this.getMaxScore()}`;
        }
    }
}