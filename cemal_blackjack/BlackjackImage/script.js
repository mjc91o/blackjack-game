//
// JavaScript Class Project: Blackjack
//
/*
//---
Blackjack Game
Blackjack is a card game where you are dealt two cards, one face down, and one face up to start out with. You decide at that point by counting the amount of the value of the card if you would like another card (hit) to get as close to 21 as you can. Once you decide to hit or stay, the next player has the same option and it goes around the table till the dealers turn comes up. The dealer has the same option as you do at that point. 
Points accrued on the cards go by face value, all numbered cards are the face value, an ace is valued at 1 point or 11 points, face cards are 10 points. When dealt an ace, you can determine how you would like the value to be used either 1 or 11 by the combination of points from other cards you already hold. Example: if you’re dealt a 6 face card, turn over an ace; you can use the ace as an 11 point card to make a total of 17. Or if you use it as a 1 point card, your total would be 7 and you have the option to hit again. The main objective while playing Blackjack really is not to bust or go over the amount of 21. The rule of thumb in most games of casino blackjack is that the dealer always hits a total of 16 or less and always stands on a total of 17 or more. 
Ultimately you need to beat dealer by getting 21 or as close to 21 as you can without going over 21.
Use the following structures:
- if/switch
- loops
- arrays
- objects
- functions
- DOM manipulation
//---
Suggested Pacing Guide:
Week 10:
- understand Blackjack and requirements 
Week 11:
- DOM variables; UI
- Card variables
- Game variables
Week 12:
- Event Listeners
Week 13:
- functions (suggestions listed below):
-- createDeck, 
-- shuffleDeck 
-- getNextCard
-- getCardNumericValue
-- getScore
-- updateScores
-- checkForEndOfGame
-- showStatus
Week 16 (weeks 14, 15, 16):
- Testing
Week 17:
- Demo to the class
Week 18:
- Incorporate feedback
//---
*/

/*
v4: adding images: Refs and images:
https://hackernoon.com/blackjack-application-with-javascript-2c76db51dea7
https://github.com/crobertsbmw/deckofcards
https://hackernoon.com/blackjack-application-with-javascript-2c76db51dea7
*/

var suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
var values = ['Ace', 'King', 'Queen', 'Jack', 
    'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'];
var deck = []; // global deck variable
var dealerCards = [], playerCards = [];
var gameOver = false;
var playerWon = false;
var dealerScore=0, playerScore=0;

var newGameButton = document.getElementById('new-game-button'),
    hitButton = document.getElementById('hit-button'),
    stayButton = document.getElementById('stay-button'),
    textAreaDealer = document.getElementById('text-area-dealer'),
    textAreaPlayer = document.getElementById('text-area-player'),
    bJImage = document.getElementById('BJImage');

showNewGameButton();

function showNewGameButton(){
  newGameButton.style.display = 'inline';
  hitButton.style.display = 'none';
  stayButton.style.display = 'none';
}

function showHitStayButton(){
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
}

newGameButton.addEventListener('click', function(){
  showHitStayButton();

  // createDeck
  createDeck();
  console.log(deck);

  for (i=0;i<deck.length;i++){
    console.log(deck[i].value + " of " + deck[i].suit + " - "+deck[i].code);
  }

  // shuffleDeck
  shuffleDeck();
  // console.log(deck);

  dealerCards = [ getNextCard(), getNextCard() ];
  playerCards = [ getNextCard(), getNextCard() ];
  console.log(dealerCards);
  console.log(playerCards);  

  showStatus();
});

hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  hitCheckForEndOfGame();
});

stayButton.addEventListener('click', function() {
  gameOver = true; // stay means game over
  stayCheckForEndOfGame();
});

function createDeck() {
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx],
                code: getCardCode(suits[suitIdx],values[valueIdx])
            };
            deck.push(card);
        }
    }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[i];
    deck[i] = deck[swapIdx];
    deck[swapIdx] = tmp;
  }
}

function getNextCard() {
  return deck.shift();
}

function showStatus() {

  let dealerCardString = '';
  document.getElementById('dealerCards').innerHTML='';
  for (let i=0; i < dealerCards.length; i++) {
    dealerCardString += dealerCards[i].value + " of " + dealerCards[i].suit +'<br>';
    
    console.log(dealerCards[i].code);
    var card = `<img style="transform: rotate(${randomIntBetween(180,210)}deg);-webkit-box-shadow: 3px 2px 32px 4px rgba(0,0,0,0.88);width:100px;height:120px;" src="./img/${dealerCards[i].code}.png"/>`;
    //var card = `<img src="./img/${dealerCards[i].code}.png" />`;
    document.getElementById('dealerCards').innerHTML += card;
    console.log(card);
  }

  let playerCardString = '';
  document.getElementById('playerCards').innerHTML='';
  for (let i=0; i < playerCards.length; i++) {
    playerCardString += playerCards[i].value + " of " + playerCards[i].suit +'<br>';

    console.log(playerCards[i].code);
    var card = `<img style="transform: rotate(${randomIntBetween(180,210)}deg);-webkit-box-shadow: 3px 2px 32px 4px rgba(0,0,0,0.88);width:100px;height:120px;" src="./img/${playerCards[i].code}.png"/>`;
    //var card = `<img src="./img/${playerCards[i].code}.png" />`;
    document.getElementById('playerCards').innerHTML += card;
    console.log(card);
  }
  
  textAreaDealer.innerHTML = 
    'Dealer has:<br>' +
    dealerCardString + 
    '<br><strong>(score: ' + getScore(dealerCards) +' )</strong><br><br>';
 
  textAreaPlayer.innerHTML =    
    'Player has:<br>' +
    playerCardString +
    '<strong>(score: ' + getScore(playerCards) + ' )</strong><br><br>';
}

function randomIntBetween(min,max) { // min and max included
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace') {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) { 
    return score + 10; // ace is 1 or 11; 1 alerady counted so add 10 only
  }
  return score;
}

function getCardNumericValue(card) {
  switch(card.value) {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five': 
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function getCardCode(suit, value) {
  var s=suit.charAt(0); // first character
  var v=value.charAt(0);

  switch(value) {
    case 'Ace':
      return 1+s;
    case 'Two':
      return 2+s;
    case 'Three':
      return 3+s;
    case 'Four':
      return 4+s;
    case 'Five': 
      return 5+s;
    case 'Six':
      return 6+s;
    case 'Seven':
      return 7+s;
    case 'Eight':
      return 8+s;
    case 'Nine':
      return 9+s;
    case 'Ten': 
      return 0+s;
    default:
      return v+s;
  }
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function hitCheckForEndOfGame() {
  console.log("in hitCheckForEndOfGame");
  updateScores();
  showStatus();

  // ??? if playerScore === 21 player wins regardless dealerScore
  if (playerScore === 21){
    gameOver = true;
    playerWon = true;
    gameResult();
  }
  else if (playerScore > 21 || dealerScore === 21){
    gameOver = true;
    playerWon = false;
    gameResult();
  }
}

function stayCheckForEndOfGame() {
  console.log("in stayCheckForEndOfGame");
  
  updateScores();
  showStatus();
  if (dealerScore === 21){
    gameOver = true;
    playerWon = false;
    gameResult();
  }
  else if (dealerScore > 21 || playerScore === 21){
    gameOver = true;
    playerWon = true;
    gameResult();
  } 
  else if (gameOver) {
    // let dealer take cards
    while(dealerScore < 17) { // if >= 17 it is soft 17 and dealer does not get cards
      dealerCards.push(getNextCard());
      updateScores();
    }
    showStatus();
    if (dealerScore === 21){
      playerWon = false;
    } 
    else if (dealerScore > 21) {
      playerWon = true;
    }
    else {
        if (playerScore > dealerScore) {
          playerWon = true;
        }
        else {
          playerWon = false;
        }
    }
    gameResult();
  }
}

function gameResult(){
  if (playerWon) {
      textAreaPlayer.innerHTML += "<strong>YOU WIN!</strong><br>";
  }
  else {
      textAreaDealer.innerHTML += "<strong>DEALER WINS!</strong><br>";
  }
  // new game ?
  createDeck();
  shuffleDeck();
  showNewGameButton();
}
