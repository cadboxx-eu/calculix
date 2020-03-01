/* the challenge object */
let challenge = {
  numberOne: undefined,
  numberTwo: undefined,
  operator: "*",
  table: false, // becomes true when user selects a specific table to train on
  score: 0,
  idealScore: 0,
  count: 0,
  rnd: true // true == generate random numbers (false if answer was not correct, i.e. run same numbers again)
}


/* on page load: start listening for answers */
window.addEventListener('load', function () {
  /* run a new challenge */
  if (challenge.count == 0) newChallenge();
  document.querySelector('#answer-input').focus(); // put cursor back in focus
  document.querySelector('#operator-select').addEventListener('change', setMode); // user can select *, + or - ('mode')
  document.querySelector('#table-select').addEventListener('change', setTable); // user can select a table when in multiplication 'mode'
  document.addEventListener("keydown", enterPress); // can also press enter to verify answer
  document.querySelector('#submit').addEventListener('click', verifyAnswer); // verify answer
  document.querySelector('#skip').addEventListener('click', skipChallenge); // skip a challenge
});


function verifyAnswer(evt) {
  evt.preventDefault(); // no form submit
  let input = document.querySelector('#answer-input');
  let answer = input.value; // the user answer to the question
  let result = null;
  switch (challenge.operator) {
    case "*":
      result = Number(challenge.numberOne) * Number(challenge.numberTwo);
      break;
    case "+":
      result = Number(challenge.numberOne) + Number(challenge.numberTwo);
      break;
    case "-":
      result = Number(challenge.numberOne) - Number(challenge.numberTwo);
  }

  if (answer == result) {
    success();
    input.value = ''; // clear input
    challenge.rnd = true; // generate new random numbers, answer was correct
    setTimeout(newChallenge, 3000);
  } else {
    fail();
    input.value = '';
    challenge.rnd = false; // run same numbers, answer was wrong
    setTimeout(newChallenge, 3000);
    input.focus();
  }
}

function newChallenge(random = true) {
  document.querySelector('#answer-input').focus();
  if (challenge.count == 10) refresh(); // new 'game' after 10 challenges, reset challenge object to initial state
  clearMsg(); // empty message box
  /* set new (random) numbers for challenge if 'true' i.e. correct answer was given - challenge.table equals true if user selected a specific table to train on*/
  if (challenge.rnd === true && challenge.table === false) {
    if (challenge.operator === "-") {
      getNumbersSubtraction(); // we ensure the first number is larger or equal to the second number for each subtraction challenge
    } else { // if its multiplication or addition any random number for numberOne and numberTwo is ok
      challenge.numberOne = getRandomNumber();
      challenge.numberTwo = getRandomNumber();
    }
  } else if (challenge.rnd === true && challenge.table === true) { // user selected a table to train on, so we do not change numberTwo.
    challenge.numberOne = getRandomNumber();
  }
  let one = document.querySelector('#one');
  one.textContent = challenge.numberOne;
  let op = document.querySelector('#operator');
  op.textContent = (challenge.operator !== '*') ? challenge.operator : 'X'; // we use 'X' for multiplication, because '*' is a snow flake for kids...
  let two = document.querySelector('#two');
  two.textContent = challenge.numberTwo;
}

function success() {
  /* play sound: applause.mp3 */
  const win = document.querySelector("#win");
  win.play();
  /* show message */
  let container = document.querySelector('#container');
  let success = document.createElement('div');
  let successMsgTxt = "&#128521 &nbsp" + "bravo!"; // &#128521 is happy emoticon
  let gameOver = "Game Over!";
  let successMsg = (challenge.count < 9) ? successMsgTxt : gameOver; // show 'Game Over!' after 10 challenges
  success.innerHTML = successMsg;

  let msg = document.querySelector('#msg');
  msg.appendChild(success);
  container.appendChild(msg);

  /* update score */
  getScore(true); // when answer correct, 'true', otherwise 'false'
  let score = document.querySelector('#score');
  score.innerHTML = "Score: " + challenge.score + ' / ' + challenge.idealScore;
}

function fail() {
  /* play sound: sad-trombone.mp3 */
  const lose = document.querySelector("#lose");
  lose.play();
  /* show message */
  let container = document.querySelector('#container');
  let fail = document.createElement('div');
  let failMsgTxt = "&#129300 &nbsp" + "essaie encore!"; // &#129300 is a emoticon thinking
  let gameOver = "Game Over!";
  let failMsg = (challenge.count < 9) ? failMsgTxt : gameOver; // show 'Game Over!' after 10 challenges
  fail.innerHTML = failMsg;
  let msg = document.querySelector('#msg');
  msg.appendChild(fail);
  container.appendChild(msg);
  getScore(false); // a wrong answer, so 'false' - we only up the ideal score
  let score = document.querySelector('#score');
  score.innerHTML = "Score: " + challenge.score + ' / ' + challenge.idealScore;
}

function refresh() {
  // reset challenge object
  challenge.score = 0;
  challenge.idealScore = 0;
  challenge.count = 0;

  // clear score board
  let score = document.querySelector('#score');
  score.innerHTML = 'Score: 0 / 0';
}

function clearMsg() {
  let msg = document.querySelector('#msg');
  msg.innerHTML = '';
}

function enterPress(e) {
  /*
  Check if enter key is pressed:
  we give 'e' as argument to verifyAnswer() here
  because it needs an event, it won't actually
  use this key-press event
  */
  if (e.key === "Enter") verifyAnswer(e);
}

function getScore(win = true) {
  if (win === true) challenge.score += 10;
  challenge.idealScore += 10;
  challenge.count += 1;
}

function skipChallenge() {
  challenge.rnd = true; // when we skip, we want a fresh set of numbers
  newChallenge();
}

/* user can select a specific table to train on */
function setTable() {
  let tableChoice = document.querySelector('#table-choice');
  let selectedTable = tableChoice.options[tableChoice.selectedIndex].value;
  if (selectedTable !== "") {
    challenge.numberTwo = selectedTable;
    challenge.table = true; // set flag, user wants to train a specific table
    newChallenge();
  }
}

/*
 * User can switch instantaneously between multiplications(*), additions(+) and subtractions(-)
 * Use setMode() to set the operator 'mode' to: '*', or '+' or '-'
 * When in '*' mode, we show the table select box, when in '+' or '-' we hide the box
 */
function setMode() {
  let mode = document.querySelector('#mode');
  challenge.operator = mode.options[mode.selectedIndex].value;
  if(challenge.operator !== '*') challenge.table = false; // turn off the fixed numberTwo (if set) when user changes from multiplication to additions or subtractions
  let tableChoice = document.querySelector('#table-choice');
  tableChoice.options.selectedIndex = 0; // reset the selected table option value to show default ("Je choisis ma table!")
  let tableSelect = document.querySelector('#table-select');
  tableSelect.style.visibility = (challenge.operator !== "*") ? "hidden" : "visible";  // only show multiplication table select box in '*' mode
  newChallenge();
}

function getNumbersSubtraction() {
  challenge.numberOne = getRandomNumber();
  challenge.numberTwo = getRandomNumber();
  if (challenge.numberOne < challenge.numberTwo) getNumbersSubtraction();
}

function getRandomNumber() {
  let randomNumber = (Math.floor(Math.random() * 10)) + 1; // number 1-9
  return randomNumber;
}
