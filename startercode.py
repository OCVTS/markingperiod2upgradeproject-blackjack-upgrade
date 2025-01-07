import random

class Card:
    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit
      
    def __str__(self):
        return f"{self.rank} of {self.suit}"

    def get_value(self):
      if self.rank in ['2', '3', '4', '5', '6', '7', '8', '9', '10']:
          return int(self.rank)
      elif self.rank in ['Jack', 'Queen', 'King']:
          return 10
      elif self.rank == 'Ace':
          return 11

class Deck:
    def __init__(self):
        self.cards = [Card(rank, suit) for suit in ['Hearts', 'Diamonds', 'Clubs', 'Spades'] for rank in ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']]

        random.shuffle(self.cards)

    def deal_card(self):
        return self.cards.pop(0)

class Player:
    def __init__(self):
        self.hand = []

    def hit(self, card):
        self.hand.append(card)

    def get_max_score(self):
        score = sum(card.get_value() for card in self.hand)
        aces = 0
        for card in self.hand:
            if card.rank == 'Ace':
                aces += 1
        if aces > 0:
            aces -= 1
        return score - aces * 10

    def get_min_score(self):
        if 'Ace' in [card.rank for card in self.hand]:
            return self.get_max_score() - 10
        else:
            return self.get_max_score()

    def get_score(self):
        if 'Ace' in [card.rank for card in self.hand]:
            if self.get_max_score() > 21:
                return f"{str(self.get_min_score())}"
            else:
                return f"{str(self.get_min_score())} or {str(self.get_max_score())}"
        else:
            return f"{str(self.get_max_score())}"

class Blackjack:
    def __init__(self):
        self.player = Player()
        self.dealer = Player()
        self.deck = Deck()
        self.turn = 0

    def deal(self):
        self.player.hit(self.deck.deal_card())
        print("The dealer deals you a card face down")
        self.dealer.hit(self.deck.deal_card())
        print("The dealer deals himself one card face up, it's the " + str(self.dealer.hand[0]))
        self.player.hit(self.deck.deal_card())
        print("The dealer deals you a card face down")
        self.dealer.hit(self.deck.deal_card())
        print("The dealer takes another card, this time face down")
        print(f"You check your cards, you have the {str(self.player.hand[0])} and the {str(self.player.hand[1])}")

    def player_turn(self):
        self.turn += 1
        if self.turn == 1:
            choice = input(f"Your score is {self.player.get_score()}, would you like to (1)hit or (2)stand or (3)double down? ")
            if choice == "hit" or choice == "Hit" or choice == "HIT" or choice == "H" or choice == "h" or choice == "1":
                self.player.hit(self.deck.deal_card())
                print(f"You got the {str(self.player.hand[-1])}, your score is now {self.player.get_score()}")
                if self.player.get_min_score() > 21:
                    return 0
                elif self.player.get_min_score() < 21:
                    return 1
            elif choice == "stand" or choice == "Stand" or choice == "STAND" or choice == "S" or choice == "s" or choice == "stay" or choice == "Stay" or choice == "STAY" or choice == "2":
                print(f"You stand with a score of {self.player.get_score()}")
                return 2
            elif choice == "double down" or choice == "Double down" or choice == "DOUBLE DOWN" or choice == "DD" or choice == "dd" or choice == "d" or choice == "D" or choice == "3":
                self.player.hit(self.deck.deal_card())
                print(f"You got the {str(self.player.hand[-1])}, your score is now {self.player.get_score()}")
                if self.player.get_min_score() > 21:
                    return 3
                elif self.player.get_min_score() <= 21:
                    return 4
        else:
            choice = input(f"Your score is {self.player.get_score()}, would you like to (1)hit or (2)stand? ")
            if choice == "hit" or choice == "Hit" or choice == "HIT" or choice == "H" or choice == "h" or choice == "1":
                self.player.hit(self.deck.deal_card())
                print(f"You got the {str(self.player.hand[-1])}, your score is now {self.player.get_score()}")
                if self.player.get_min_score() > 21:
                    return 0
                elif self.player.get_min_score() < 21:
                    return 1
            elif choice == "stand" or choice == "Stand" or choice == "STAND" or choice == "S" or choice == "s" or choice == "stay" or choice == "Stay" or choice == "STAY" or choice == "2":
                print(f"You stand with a score of {self.player.get_score()}")
                return 2

    def dealer_turn(self):
        if self.dealer.get_max_score() < 17:
            self.dealer.hit(self.deck.deal_card())
            print("The dealer takes another card, face down")
            if self.dealer.get_min_score() > 21:
                return 0
            elif self.dealer.get_min_score() < 21:
                return 1
        elif self.dealer.get_max_score() > 17 and self.dealer.get_max_score() <= 21 or self.dealer.get_min_score() > 17 and self.dealer.get_min_score() <= 21:
            print("The dealer stands")
            return 2
        elif self.dealer.get_min_score() < 17 and (self.dealer.get_max_score() == self.dealer.get_min_score() or self.dealer.get_max_score() > 21):
            self.dealer.hit(self.deck.deal_card())
            print("The dealer takes another card, face down")
            if self.dealer.get_min_score() > 21:
                return 0
            elif self.dealer.get_min_score() < 21:
                return 1
        else:
            if 'Ace' in [card.rank for card in self.dealer.hand]:
                move = random.choice(["hit", "stand"])
                if move == "hit":
                    self.dealer.hit(self.deck.deal_card())
                    print("The dealer takes another card, face down")
                    if self.player.get_min_score() > 21:
                        return 0
                    elif self.player.get_min_score() < 21:
                        return 1
                elif move == "stand":
                    print("The dealer stands")
                    return 2
            else:
                print("The dealer stands")
                return 2

    def play(self):
        self.deal()
        player_result = 1
        dealer_result = 1
        
        while True:
            player_result = self.player_turn()
            if player_result == 0:
                print("You went bust, you lose ):, but let's see the dealer's cards anyway:")
                for card in self.dealer.hand:
                    if card == self.dealer.hand[-1]:
                        print("and ", end = "")

                    print("the " + str(card))
                return 0
            elif player_result == 2:
                break
            elif player_result == 3:
                print("You doubled down and went bust, you lose double your bet D:, but let's see the dealer's cards anyway:")
                for card in self.dealer.hand:
                    if card == self.dealer.hand[-1]:
                        print("and ", end = "")

                    print("the " + str(card))
                return 3
            elif player_result == 4:
                break
            # dealer_result = self.dealer_turn()
            # if dealer_result == 0:
            #     print("The dealer went bust, you win! Let's see the dealer's cards:")
            #     for card in self.dealer.hand:
            #         if card == self.dealer.hand[-1]:
            #             print("and ", end = "")

            #         print("the " + str(card))
            #     return
            # elif dealer_result == 2:
            #     break

        if player_result == 2 and dealer_result == 1:
            while dealer_result != 2:
                dealer_result = self.dealer_turn()
                if dealer_result == 0:
                    print("The dealer went bust, you win! Let's see the dealer's cards:")
                    for card in self.dealer.hand:
                        if card == self.dealer.hand[-1]:
                            print("and ", end = "")

                        print("the " + str(card))
                    return 1
        elif player_result == 1 and dealer_result == 2:
            while player_result != 2:
                player_result = self.player_turn()
                if player_result == 0:
                    print("You went bust, you lose :(, but let's see the dealer's cards anyway:")
                    for card in self.dealer.hand:
                        if card == self.dealer.hand[-1]:
                            print("and ", end = "")

                        print("the " + str(card))
                    return 0
        elif player_result == 4 and dealer_result == 1:
            while dealer_result != 2:
                dealer_result = self.dealer_turn()
                if dealer_result == 0:
                    print("You doubled down and the dealer went bust, you win :D! Let's see the dealer's cards:")
                    for card in self.dealer.hand:
                        if card == self.dealer.hand[-1]:
                            print("and ", end = "")

                        print("the " + str(card))
                    return 4

        print("You both stood, time for the reveal! The dealer's cards were: ")
        for card in self.dealer.hand:
            if card == self.dealer.hand[-1]:
                print("and ", end = "")

            print("the " + str(card))

        dealer_total = -1
        if self.dealer.get_max_score() > 21:
            dealer_total = self.dealer.get_min_score()
        else:
            dealer_total = self.dealer.get_max_score()

        print("and his final score was " + str(dealer_total))

        print("Your cards were: ")
        for card in self.player.hand:
          if card == self.player.hand[-1]:
              print("and ", end = "")

          print("the " + str(card))

        player_total = -1
        if self.player.get_max_score() > 21:
           player_total = self.player.get_min_score()
        else:
          player_total = self.player.get_max_score()

        print("and your final score was " + str(player_total))

        if player_result == 2 and player_total > dealer_total:
            print("You win!")
            return 1
        elif player_result == 4 and player_total > dealer_total:
            print("You win!")
            return 4
        elif player_result == 2 and dealer_total > player_total:
            print("You lose :(")
            return 0
        elif player_result == 4 and dealer_total > player_total:
            print("You lose :(")
            return 3
        else:
            print("It's a tie!")
            return 2
            
                
def main():
    money = 32
    wins = 0
    losses = 0
    ties = 0
    gamenum = 0
    while True:
        if money < 4:
            print("Not enough money left to play. Brokey.")
            print(f"Final wins: {wins} | Final losses: {losses} | Final ties: {ties} | Final money: ${money}")
            break
        else:
            gamenum += 1
            if gamenum > 1:
                print("--------------------------------------------------------------")
                print(f"Wins: {wins} | Losses: {losses} | Ties: {ties} | Money: ${money}")
                newgame = input("Would you like to play again? (1)Yes (2)No ")
            else:
                newgame = "yes"
                
            if newgame == "yes" or newgame == "Yes" or newgame == "YES" or newgame == "y" or newgame == "Y" or newgame == "1":
                bet = float(input(f"You have ${money}, how much would you like to bet? $"))
                if bet < 4:
                    print("You can't bet less than $10")
                    continue
                elif bet > money:
                    print("You don't have that much money")
                    continue
                elif bet > money * 0.5:
                    game = Blackjack()
                    game.turn = 1
                    result = game.play()
                    if result == 1:
                        wins += 1
                        money += bet * 0.5
                        print(f"You won ${bet * 0.5}!")
                    elif result == 4:
                        wins += 1
                        money += bet
                        print(f"You won ${bet}!")
                    elif result == 0:
                        losses += 1
                        money -= bet
                        print(f"You lost ${bet}!")
                    elif result == 3:
                        losses += 1
                        money -= bet * 2
                        print(f"You lost ${bet * 2}!")
                    else:
                        ties += 1
                else:
                    game = Blackjack()
                    result = game.play()
                    if result == 1:
                        wins += 1
                        money += bet * 0.5
                        print(f"You won ${bet * 0.5}!")
                    elif result == 4:
                        wins += 1
                        money += bet
                        print(f"You won ${bet}!")
                    elif result == 0:
                        losses += 1
                        money -= bet
                        print(f"You lost ${bet}!")
                    elif result == 3:
                        losses += 1
                        money -= bet * 2
                        print(f"You lost ${bet * 2}!")
                    else:
                        ties += 1
                
                    
            elif newgame == "no" or newgame == "No" or newgame == "NO" or newgame == "n" or newgame == "N" or newgame == "2":
                print(f"Final wins: {wins} | Final losses: {losses} | Final ties: {ties} | Final money: ${money}")
                break
            else:
                print("Invalid input, please try again.")

if __name__ == "__main__":
  main()