"use strict";
let suits = {
    spades: '1F0A',
    hearts: '1F0B',
    clubs: '1F0D',
    diamonds: '1F0C'
};

let cards = {
    6: ['6', 6],
    7: ['7', 7],
    8: ['8', 8],
    9: ['9', 9],
    10: ['A', 10],
    jack: ['B', 11],
    queen: ['D', 12],
    king: ['E', 13],
    ace: ['1', 14]
};

let deckArray = [],
    firstPlayerHandArray = [],
    secondPlayerHandArray = [],

    trumpSuit,
    firstPlayerScore = 0,
    secondPlayerScore = 0,
    movesCount = 0,

    gameStartModalDiv = document.querySelector('.game-start-modal-wrap'),
    spinningCircle = document.querySelector('.game-start-spinning-circle'),
    startMessage = document.querySelector('.game-start-message'),
    nextMoveButton = document.getElementById('next-move-button'),
    firstPlayerName = document.getElementById('first-player-name'),
    secondPlayerName = document.getElementById('second-player-name'),
    firstPlayerHand = document.getElementById('first-player-hand'),
    secondPlayerHand = document.getElementById('second-player-hand'),
    firstPlayerScoreSpan = document.getElementById('first-player-score'),
    secondPlayerScoreSpan = document.getElementById('second-player-score'),
    suitIndicators = [...document.querySelectorAll('.player-suit-indicator')],
    firstPlayerSuitIndicator = document.getElementById('first-player-suit-indicator'),
    secondPlayerSuitIndicator = document.getElementById('second-player-suit-indicator'),
    winnerMessage = document.querySelector('.winner-message'),
    drawMessages = [...document.querySelectorAll('.draw-message')],
    // used in updateLeadingPlayerIndication()
    firstPlayerDivArray = [firstPlayerSuitIndicator, firstPlayerName, firstPlayerScoreSpan],
    secondPlayerDivArray = [secondPlayerSuitIndicator, secondPlayerName, secondPlayerScoreSpan],
    leadingClassArray = ['leading-indicator', 'leading-player', 'leading-score'],

    moveGenerator = generateMoves();

function* generateMoves() {
    while (movesCount < 18) {
        movesCount++;
        yield [firstPlayerHandArray.pop(), secondPlayerHandArray.pop()];
    }
}

function doRandomSpin() {
    let randomSuitIndex = getRandomNumber(0, 3),
        degrees = 2880 + [-45, 45, 135, 215][randomSuitIndex];
    trumpSuit = ['spades', 'hearts', 'clubs', 'diamonds'][randomSuitIndex];
    spinningCircle.style.transform  = 'rotate(' + degrees + 'deg)';
    spinningCircle.classList.add('circle_no-select');
}

function generateDeck() {
    Object.keys(suits).forEach(i => {
        Object.keys(cards).forEach(k => {
            deckArray.push({
                suit: i,
                card: k,
                symbol: generateCardUnicode(i, k),
                cardValue: cards[k][1],
                isTrump: i === trumpSuit
            });
        });
    });
}

function generateCardUnicode(suit, card) {
    return '&#' + parseInt(suits[suit] + cards[card], 16) + ';';
}

/**
 * Function randomly gets an element from the deck array
 * and pushes it to player's hands successively
 */
function shuffleAndDeal() {
    let currentHand = 0;
    while (deckArray.length > 0) {
        let randomItemIndex = getRandomNumber(0, deckArray.length - 1);
        if (currentHand === 0) {
            firstPlayerHandArray.push(deckArray.splice(randomItemIndex, 1)[0]);
            currentHand = 1;
        } else if (currentHand === 1) {
            secondPlayerHandArray.push(deckArray.splice(randomItemIndex, 1)[0]);
            currentHand = 0;
        }
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function appendCardDiv(player, cardObject) {
    let card = document.createElement('div');
    card.classList.add('card');
    if (cardObject.isTrump) {
        card.classList.add('card_trump');
    } else if (cardObject.suit === 'hearts' || cardObject.suit === 'diamonds') {
        card.classList.add('card_red');
    } else if (cardObject.suit === 'spades' || cardObject.suit === 'clubs') {
        card.classList.add('card_black');
    }
    card.innerHTML = cardObject.symbol;
    if (player === 0) {
        firstPlayerHand.appendChild(card);
    } else if (player === 1) {
        secondPlayerHand.appendChild(card);
    }
}

function shiftCardsInGrid() {
    let firstPlayerCards = [...firstPlayerHand.children],
        secondPlayerCards = [...secondPlayerHand.children];
    firstPlayerCards[firstPlayerCards.length - 1].style.gridRowStart = firstPlayerCards.length;
    secondPlayerCards[secondPlayerCards.length - 1].style.gridRowStart = secondPlayerCards.length;
}

function compareCardValues(firstPlayerCard, secondPlayerCard) {
    if (firstPlayerCard.isTrump && !secondPlayerCard.isTrump) {
        firstPlayerScore++;
    } else if (!firstPlayerCard.isTrump && secondPlayerCard.isTrump) {
        secondPlayerScore++;
    } else {
        if (firstPlayerCard.cardValue > secondPlayerCard.cardValue) {
            firstPlayerScore++;
        } else if (firstPlayerCard.cardValue < secondPlayerCard.cardValue) {
            secondPlayerScore++;
        }
    }
}

function updateLeadingPlayerIndication() {
    firstPlayerScoreSpan.innerHTML = firstPlayerScore;
    secondPlayerScoreSpan.innerHTML = secondPlayerScore;

    if (firstPlayerScore > secondPlayerScore) {
        firstPlayerDivArray.forEach((div, index) => div.classList.add(leadingClassArray[index]));
        secondPlayerDivArray.forEach((div, index) => div.classList.remove(leadingClassArray[index]));
    } else if (firstPlayerScore < secondPlayerScore) {
        firstPlayerDivArray.forEach((div, index) => div.classList.remove(leadingClassArray[index]));
        secondPlayerDivArray.forEach((div, index) => div.classList.add(leadingClassArray[index]));
    } else {
        firstPlayerDivArray.forEach((div, index) => div.classList.remove(leadingClassArray[index]));
        secondPlayerDivArray.forEach((div, index) => div.classList.remove(leadingClassArray[index]));
    }
}

function endGame() {
    nextMoveButton.classList.remove('hoverable');
    if (firstPlayerScore > secondPlayerScore) {
        winnerMessage.classList.add('winner-first-player');
        setInterval(() => winnerMessage.classList.toggle('winner-message_hidden'), 500);
    } else if (firstPlayerScore < secondPlayerScore) {
        winnerMessage.classList.add('winner-second-player');
        setInterval(() => winnerMessage.classList.toggle('winner-message_hidden'), 500);
    } else {
        [firstPlayerSuitIndicator, secondPlayerSuitIndicator].forEach(indicator => indicator.classList.add('leading-indicator'));
        drawMessages.forEach(msg => msg.classList.remove('draw-message_hidden'));
    }
}
