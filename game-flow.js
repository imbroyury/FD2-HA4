"use strict";

function startGame() {
    return new Promise(resolve => {
        spinningCircle.addEventListener('click', () => {
            doRandomSpin();
            resolve();
        }, {once: true});
    });
}

startGame()
    .then(() => {
        return new Promise(resolve => {
            // timeout length matches CSS transition duration
            setTimeout(() => {
                startMessage.innerHTML = `<div>...its <b>${trumpSuit}!</b></div><div>Click chosen suit to continue</div>`;
                let trumpSuitDiv = document.getElementById('suit-' + trumpSuit);
                trumpSuitDiv.classList.add('suit_trump');
                [...document.querySelectorAll('.available-suit')].forEach(suit => {
                    if (!suit.classList.contains('suit_trump')) suit.classList.add('suit_disabled')
                });
                suitIndicators.forEach(indicator => indicator.innerHTML = trumpSuitDiv.innerHTML);

                trumpSuitDiv.addEventListener('click', () => {
                    resolve();
                    gameStartModalDiv.classList.add('game-start-modal_hidden');
                }, {once: true});
            }, 7100);
        });
    })
    .then(() => {
        generateDeck();
        shuffleAndDeal();
    })
    .then(() => {
        return new Promise(resolve => {
            nextMoveButton.addEventListener('click', function nextMoveClick() {
                let moveGeneratorResult = moveGenerator.next(),
                    cardArray = moveGeneratorResult.value;

                cardArray.forEach((card, index) => appendCardDiv(index, card));
                shiftCardsInGrid();

                compareCardValues(...cardArray);

                updateLeadingPlayerIndication();

                if (movesCount === 18) {
                    nextMoveButton.removeEventListener('click', nextMoveClick);
                    resolve();
                }
            });
        })
    })
    .then(endGame);
