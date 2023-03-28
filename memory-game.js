"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const CATS = [
  "1", "2", "3", "4", "5", "6", "7", "8",
  "1", "2", "3", "4", "5", "6", "7", "8",
];

let guesses, score, holdBoardState, firstCard, secondCard;
let record = 100;
let recordUser;



function newGame() {
  guesses = 0;
  score = 0;
  holdBoardState = false;
  firstCard = undefined;
  secondCard = undefined;
  updateScore();

  let gameBoard = document.getElementById("game");
  let divs = gameBoard.querySelectorAll('div');
  for (let div of divs) {
    div.remove();
  }
  let cats = shuffle(CATS);
  createCards(cats);
  document.getElementById("btn-start").className = "hidden";
  document.getElementById("btn-reset").className = "hidden";
}

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(cats) {
  const gameBoard = document.getElementById("game");

  for (let cat of cats) {
    let card = document.createElement("div");
    card.style.backgroundColor = "white";
    card.className = cat;
    gameBoard.append(card);
    card.addEventListener("click", handleCardClick);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.style.transform = "rotateY(180deg)";
  card.style.backgroundImage = "url('cat-images/" + card.className + ".jpg')";
}

/** Flip a card face-down. */

function unFlipCard(cards) {
  setTimeout(() => {
    for (let card of cards) {
      card.style.transform = "rotateY(180deg)";
      card.style.backgroundImage = "none";
    }
    holdBoardState = false;
    document.getElementById("btn-reset").className = "";
  }, 1000);

}

function updateScore() {
  document.getElementById("guesses-counter").innerHTML = "Guesses: " + guesses;
  if(recordUser != undefined){
    document.getElementById("guesses-best").innerHTML = "Best Guesses: "
    + record + " " + recordUser;
  }

}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  let clickedCard = evt.target;

  if (holdBoardState) {
    return;
  }

  if (clickedCard == firstCard) {
    return;
  }

  if (clickedCard != firstCard && firstCard == undefined) {
    flipCard(clickedCard);
    firstCard = clickedCard;
    return;
  }
  flipCard(clickedCard);
  secondCard = clickedCard;
  if (secondCard.className == firstCard.className) {
    score += 1;
    guesses += 1;
    firstCard.removeEventListener("click", handleCardClick);
    secondCard.removeEventListener("click", handleCardClick);
  }
  else {
    holdBoardState = true;
    guesses += 1;
    unFlipCard([firstCard, secondCard]);
  }

  updateScore();
  firstCard = undefined;
  secondCard = undefined;

  if (score == CATS.length / 2) {
    setTimeout(() => {
      if (guesses < record) {
        let userName = prompt("High Score! Please enter your name");
        record = guesses;
        recordUser = userName;
      }
      else {
        alert("you win!");
      }
      document.getElementById("btn-reset").className = "";
    }, 1000);
  }
}

