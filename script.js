//JS:
console.log(" in script");


var suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
var values = ['Ace', 'King', 'Queen', 'Jack',
   'Ten', 'Nine', 'Eight', 'Seven', 'Six',
   'Five', 'Four', 'Three', 'Two'];
var deck = []; // global deck variable
var dealerCards = [], playerCards = [];
var gameOver = false;
var playerWon = false;
var dealerScore = 0, playerScore = 0;

var newGameButton = document.getElementById("new-game-button");
var hitButton = document.getElementById("hit-game-button");
var stayButton = document.getElementById("stay-game-button");
var textArea = document.getElementById("text-area");

function showNewGameButton(){
	newGameButton.style.display="inline";
	hitButton.style.display="none";
	stayButton.style.display="none";
}

function showHitStayButton(){
	newGameButton.style.display="none";
	hitButton.style.display="inline";
	stayButton.style.display="inline";
}

showNewGameButton();

newGameButton.addEventListener("click",function(){
	showHitStayButton();
	createDeck();
	shuffleDeck();

	console.log(deck);
	// what else?

	dealerCards = [getNextCard(), getNextCard()];
	playerCards = [getNextCard(), getNextCard()];

	showStatus();

});

hitButton.addEventListener("click",function(){
	playerCards.push(getNextCard());
	//showPlayerCardScore();
	hitCheckForEndOfGame();
	// what else?
});

stayButton.addEventListener("click",function(){
	// game ends; dealer may get card 
	// who won?
	// what else?
});

function createDeck(){
	for(var suitIdx=0;suitIdx<suits.length;suitIdx++){
		for(var valueIdx=0;valueIdx<values.length; valueIdx++){
			var card={
				suit:suits[suitIdx],
				value:values[valueIdx]
			};
			deck.push(card);
		}
	}
}

function shuffleDeck() {
	for (var i=0;i<deck.length;i++){
		var swapIdx=Math.trunc(Math.random()*deck.length);
		var tmp=deck[i];

		deck[i]=deck[swapIdx];
		deck[swapIdx]=tmp;
	}
}

function getNextCard() {
	return deck.shift();
}



function showStatus () {
	let dealerCardString = "";
	for (let i = 0; i < dealerCards.length; i ++){
		dealerCardString += dealerCards[i].value + " of " + dealerCards[i].suit + '\n';
	}

	let playerCardString = "";
	for (let i = 0; i < playerCards.length; i ++){
		playerCardString += playerCards[i].value + " of " + playerCards[i].suit + '\n';
	}
	textArea.innerText ='Dealer has:\n' + dealerCardString + '(score: ' + getScore(dealerCards) +' )\n\n' +

   'Player has:\n' +
   playerCardString +
   '(score: ' + getScore(playerCards) + ' )\n\n';
}

function getScore (cardArray) {
	let score = 0;
	let hasAce = false;
	for (let i = 0; i < cardArray.length; i ++) {
		let card = cardArray[i];
		score += getCardNumericValue(card);
		if (card.value === "Ace"){
			hasAce = true;
		}
	}

	if (hasAce && score + 10 <= 21) {
		return score + 10;
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

function updateScore () {
	dealerScore = getScore(dealerCards);
	playerScore = getScore(playerCards);
}

function hitCheckForEndOfGame() {
	updateScore();
	showStatus();

	if (playerScore === 21) {
		gameOver = true;
		playerWon = true;
		gameResult();
	}
	else if (playerScore > 21 || dealerScore === 21) {
		gameOver = true;
		playerWon = false;
		gameResult();
	}
}

function gameResult() {
	if (playerWon) {
		textArea.innerText += "You win!";
	}
	else {
		textArea.innerText += "You lose!";
	}
	//new game?

	/*
	createDeck();
	shuffleDeck():
	showNewGameButton();
	*/
}













