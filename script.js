class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    toString() {
        return `${this.rank} of ${this.suit}`;
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
}

class Deck {
    constructor() {
        this.cards = [];
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

        for (let suit of suits) {
            for (let rank of ranks) {
                this.cards.push(new Card(rank, suit));
            }
        }

        this.shuffle();
    }

    shuffle() {
        for (let i = 0; i < 52; i++) {
            const j = Math.floor(Math.random()) * 52;
            const card1 = Deck[i];
            const card2 = Deck[j];
            Deck[i] = card2;
            Deck[j] = card1;
        }
    }

    dealCard() {
        return this.cards.pop();
    }
}

class Player {
    constructor() {
        this.hand = [];
    }

    hit(card) {
        this.hand.push(card);
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

class Blackjack {
    constructor() {
        this.player = new Player();
        this.dealer = new Player();
        this.deck = new Deck();
        this.turn = 0;
    }

    deal() {
        this.player.hit(this.deck.dealCard());
        document.write("The dealer deals you a card face down");
        this.dealer.hit(this.deck.dealCard());
        document.write("The dealer deals himself one card face up, it's the " + this.dealer.hand[0]);
        this.player.hit(this.deck.dealCard());
        document.write("The dealer deals you a card face down");
        this.dealer.hit(this.deck.dealCard());
        document.write("The dealer takes another card, this time face down");
        document.write(`You check your cards, you have the ${this.player.hand[0]} and the ${this.player.hand[1]}`);
    }

    playerTurn() {
        this.turn++;
        let choice;
        if (this.turn === 1) {
            choice = prompt(`Your score is ${this.player.getScore()}, would you like to (1)hit or (2)stand or (3)double down?`);
            if (["hit", "Hit", "HIT", "H", "h", "1"].includes(choice)) {
                this.player.hit(this.deck.dealCard());
                document.write(`You got the ${this.player.hand[this.player.hand.length - 1]}, your score is now ${this.player.getScore()}`);
                if (this.player.getMinScore() > 21) {
                    return 0;
                } else if (this.player.getMinScore() < 21) {
                    return 1;
                }
            } else if (["stand", "Stand", "STAND", "S", "s", "stay", "Stay", "STAY", "2"].includes(choice)) {
                document.write(`You stand with a score of ${this.player.getScore()}`);
                return 2;
            } else if (["double down", "Double down", "DOUBLE DOWN", "DD", "dd", "d", "D", "3"].includes(choice)) {
                this.player.hit(this.deck.dealCard());
                document.write(`You got the ${this.player.hand[this.player.hand.length - 1]}, your score is now ${this.player.getScore()}`);
                if (this.player.getMinScore() > 21) {
                    return 3;
                } else if (this.player.getMinScore() <= 21) {
                    return 4;
                }
            }
        } else {
            choice = prompt(`Your score is ${this.player.getScore()}, would you like to (1)hit or (2)stand?`);
            if (["hit", "Hit", "HIT", "H", "h", "1"].includes(choice)) {
                this.player.hit(this.deck.dealCard());
                document.write(`You got the ${this.player.hand[this.player.hand.length - 1]}, your score is now ${this.player.getScore()}`);
                if (this.player.getMinScore() > 21) {
                    return 0;
                } else if (this.player.getMinScore() < 21) {
                    return 1;
                }
            } else if (["stand", "Stand", "STAND", "S", "s", "stay", "Stay", "STAY", "2"].includes(choice)) {
                document.write(`You stand with a score of ${this.player.getScore()}`);
                return 2;
            }
        }
    }

    dealerTurn() {
        if (this.dealer.getMaxScore() < 17) {
            this.dealer.hit(this.deck.dealCard());
            document.write("The dealer takes another card, face down");
            if (this.dealer.getMinScore() > 21) {
                return 0;
            } else if (this.dealer.getMinScore() < 21) {
                return 1;
            }
        } else if (this.dealer.getMaxScore() > 17 && this.dealer.getMaxScore() <= 21 || this.dealer.getMinScore() > 17 && this.dealer.getMinScore() <= 21) {
            document.write("The dealer stands");
            return 2;
        } else if (this.dealer.getMinScore() < 17 && (this.dealer.getMaxScore() === this.dealer.getMinScore() || this.dealer.getMaxScore() > 21)) {
            this.dealer.hit(this.deck.dealCard());
            document.write("The dealer takes another card, face down");
            if (this.dealer.getMinScore() > 21) {
                return 0;
            } else if (this.dealer.getMinScore() < 21) {
                return 1;
            }
        } else {
            if (this.dealer.hand.some(card => card.rank === 'Ace')) {
                const move = ["hit", "stand"][Math.floor(Math.random() * 2)];
                if (move === "hit") {
                    this.dealer.hit(this.deck.dealCard());
                    document.write("The dealer takes another card, face down");
                    if (this.player.getMinScore() > 21) {
                        return 0;
                    } else if (this.player.getMinScore() < 21) {
                        return 1;
                    }
                } else {
                    document.write("The dealer stands");
                    return 2;
                }
            } else {
                document.write("The dealer stands");
                return 2;
            }
        }
    }

    play() {
        this.deal();
        let playerResult = 1;
        let dealerResult = 1;
    
        while (true) {
            playerResult = this.playerTurn();
            if (playerResult === 0) {
                document.write("You went bust, you lose ):, but let's see the dealer's cards anyway:");
                for (let card of this.dealer.hand) {
                    if (card === this.dealer.hand[this.dealer.hand.length - 1]) {
                        process.stdout.write("and ");
                    }
                    document.write("the " + card);
                }
                return 0;
            } else if (playerResult === 2) {
                break;
            } else if (playerResult === 3) {
                document.write("You doubled down and went bust, you lose double your bet D:, but let's see the dealer's cards anyway:");
                for (let card of this.dealer.hand) {
                    if (card === this.dealer.hand[this.dealer.hand.length - 1]) {
                        process.stdout.write("and ");
                    }
                    document.write("the " + card);
                }
                return 3;
            } else if (playerResult === 4) {
                break;
            }
    
            // dealerResult = this.dealerTurn();
            // if (dealerResult === 0) {
            //     document.write("The dealer went bust, you win! Let's see the dealer's cards:");
            //     for (let card of this.dealer.hand) {
            //         if (card === this.dealer.hand[this.dealer.hand.length - 1]) {
            //             process.stdout.write("and ");
            //         }
            //         document.write("the " + card);
            //     }
            //     return;
            // } else if (dealerResult === 2) {
            //     break;
            // }
        }
    
        if (playerResult === 2 && dealerResult === 1) {
            while (dealerResult !== 2) {
                dealerResult = this.dealerTurn();
                if (dealerResult === 0) {
                    document.write("The dealer went bust, you win! Let's see the dealer's cards:");
                    for (let card of this.dealer.hand) {
                        if (card === this.dealer.hand[this.dealer.hand.length - 1]) {
                            process.stdout.write("and ");
                        }
                        document.write("the " + card);
                    }
                    return 1;
                }
            }
        } else if (playerResult === 1 && dealerResult === 2) {
            while (playerResult !== 2) {
                playerResult = this.playerTurn();
                if (playerResult === 0) {
                    document.write("You went bust, you lose :(, but let's see the dealer's cards anyway:");
                    for (let card of this.dealer.hand) {
                        if (card === this.dealer.hand[this.dealer.hand.length - 1]) {
                            process.stdout.write("and ");
                        }
                        document.write("the " + card);
                    }
                    return 0;
                }
            }
        } else if (playerResult === 4 && dealerResult === 1) {
            while (dealerResult !== 2) {
                dealerResult = this.dealerTurn();
                if (dealerResult === 0) {
                    document.write("You doubled down and the dealer went bust, you win :D! Let's see the dealer's cards:");
                    for (let card of this.dealer.hand) {
                        if (card === this.dealer.hand[this.dealer.hand.length - 1]) {
                            process.stdout.write("and ");
                        }
                        document.write("the " + card);
                    }
                    return 4;
                }
            }
        }
    
        document.write("You both stood, time for the reveal! The dealer's cards were: ");
        for (let card of this.dealer.hand) {
            if (card === this.dealer.hand[this.dealer.hand.length - 1]) {
                process.stdout.write("and ");
            }
            document.write("the " + card);
        }
    
        let dealerTotal = -1;
        if (this.dealer.getMaxScore() > 21) {
            dealerTotal = this.dealer.getMinScore();
        } else {
            dealerTotal = this.dealer.getMaxScore();
        }
    
        document.write("and his final score was " + dealerTotal);
    
        document.write("Your cards were: ");
        for (let card of this.player.hand) {
            if (card === this.player.hand[this.player.hand.length - 1]) {
                process.stdout.write("and ");
            }
            document.write("the " + card);
        }
    
        let playerTotal = -1;
        if (this.player.getMaxScore() > 21) {
            playerTotal = this.player.getMinScore();
        } else {
            playerTotal = this.player.getMaxScore();
        }
    
        document.write("and your final score was " + playerTotal);
    
        if (playerResult === 2 && playerTotal > dealerTotal) {
            document.write("You win!");
            return 1;
        } else if (playerResult === 4 && playerTotal > dealerTotal) {
            document.write("You win!");
            return 4;
        } else if (playerResult === 2 && dealerTotal > playerTotal) {
            document.write("You lose :(");
            return 0;
        } else if (playerResult === 4 && dealerTotal > playerTotal) {
            document.write("You lose :(");
            return 3;
        } else {
            document.write("It's a tie!");
            return 2;
        }
    }
}

let money = 32;
let wins = 0;
let losses = 0;
let ties = 0;
let gamenum = 0;

while (true) {
    if (money < 4) {
        document.write("Not enough money left to play. Brokey.");
        document.write(`Final wins: ${wins} | Final losses: ${losses} | Final ties: ${ties} | Final money: $${money}`);
        break;
    } else {
        gamenum++;
        if (gamenum > 1) {
            document.write("--------------------------------------------------------------");
            document.write(`Wins: ${wins} | Losses: ${losses} | Ties: ${ties} | Money: $${money}`);
            var newgame = prompt("Would you like to play again? (1)Yes (2)No ");
        } else {
            newgame = "yes";
        }

        if (newgame.toLowerCase() === "yes" || newgame === "1") {
            let bet = parseFloat(prompt(`You have $${money}, how much would you like to bet? $`));
            if (bet < 10) {
                document.write("You can't bet less than $10");
                continue;
            } else if (bet > money) {
                document.write("You don't have that much money");
                continue;
            } else if (bet > money * 0.5) {
                let game = new Blackjack();
                game.turn = 1;
                let result = game.play();
                if (result === 1) {
                    wins++;
                    money += bet * 0.5;
                    document.write(`You won $${bet * 0.5}!`);
                } else if (result === 4) {
                    wins++;
                    money += bet;
                    document.write(`You won $${bet}!`);
                } else if (result === 0) {
                    losses++;
                    money -= bet;
                    document.write(`You lost $${bet}!`);
                } else if (result === 3) {
                    losses++;
                    money -= bet * 2;
                    document.write(`You lost $${bet * 2}!`);
                } else {
                    ties++;
                }
            } else {
                let game = new Blackjack();
                let result = game.play();
                if (result === 1) {
                    wins++;
                    money += bet * 0.5;
                    document.write(`You won $${bet * 0.5}!`);
                } else if (result === 4) {
                    wins++;
                    money += bet;
                    document.write(`You won $${bet}!`);
                } else if (result === 0) {
                    losses++;
                    money -= bet;
                    document.write(`You lost $${bet}!`);
                } else if (result === 3) {
                    losses++;
                    money -= bet * 2;
                    document.write(`You lost $${bet * 2}!`);
                } else {
                    ties++;
                }
            }
        } else if (newgame.toLowerCase() === "no" || newgame === "2") {
            document.write(`Final wins: ${wins} | Final losses: ${losses} | Final ties: ${ties} | Final money: $${money}`);
            break;
        } else {
            document.write("Invalid input, please try again.");
        }
    }
}