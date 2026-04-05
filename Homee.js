let randomNumber = parseInt(Math.random() * 100 + 1);

const submit = document.querySelector('#subt');
const userInput = document.querySelector('#guessField');
const guessSlot = document.querySelector('.guesses');
const remaining = document.querySelector('.lastResult');
const lowOrHi = document.querySelector('.lowOrHi');
const startOver = document.querySelector('.resultParas');
const progressFill = document.querySelector('#progressFill');
const highScoreEl = document.querySelector('.highScore');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const maxAttemptsEl = document.getElementById('maxAttempts');
const guessForm = document.getElementById('guessForm');

const p = document.createElement('p');

const MAX_ATTEMPTS = 10;
let prevGuess = [];
let numGuess = 1;
let playGame = true;
let gameWon = false;
let highScore = localStorage.getItem('guessHighScore') || MAX_ATTEMPTS;

// Init
highScoreEl.textContent = highScore;
maxAttemptsEl.textContent = MAX_ATTEMPTS;

function updateProgress() {
  const progress = ((numGuess - 1) / MAX_ATTEMPTS) * 100;
  progressFill.style.width = `${progress}%`;
  remaining.textContent = MAX_ATTEMPTS - (numGuess - 1);
}

if (playGame) {
  submit.addEventListener('click', function (e) {
    e.preventDefault();
    const guess = parseInt(userInput.value);
    validateGuess(guess);
  });

  // Keyboard support
  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      submit.click();
    }
  });

  guessForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const guess = parseInt(userInput.value);
    validateGuess(guess);
  });
}

function showError(message) {
  lowOrHi.textContent = message;
  lowOrHi.className = 'lowOrHi error';
  userInput.focus();
}

function validateGuess(guess) {
  if (isNaN(guess) || guess === '') {
    showError('Please enter a valid number!');
    return;
  } else if (guess < 1 || guess > 100) {
    showError(`Please enter a number between 1 and 100!`);
    return;
  }

  prevGuess.push(guess);
  
  if (numGuess > MAX_ATTEMPTS) {
    displayGuess(guess);
    displayMessage(`💥 Game Over! The number was ${randomNumber}`);
    endGame();
    return;
  }

  displayGuess(guess);
  checkGuess(guess);
}

function checkGuess(guess) {
  if (guess === randomNumber) {
    displayMessage('🎉 Congratulations! You guessed it right!');
    gameWon = true;
    checkHighScore();
    triggerConfetti();
    endGame();
  } else if (guess < randomNumber) {
    displayMessage('📈 Too low! Try higher.');
    lowOrHi.className = 'lowOrHi';
  } else if (guess > randomNumber) {
    displayMessage('📉 Too high! Try lower.');
    lowOrHi.className = 'lowOrHi';
  }
  
  shakeInput();
}

function displayGuess(guess) {
  userInput.value = '';
  guessSlot.innerHTML += `${guess} `;
  numGuess++;
  updateProgress();
  userInput.focus();
}

function displayMessage(message) {
  lowOrHi.innerHTML = message;
  lowOrHi.className = 'lowOrHi success';
}

function checkHighScore() {
  const attemptsUsed = numGuess - 1;
  if (attemptsUsed < highScore) {
    highScore = attemptsUsed;
    localStorage.setItem('guessHighScore', highScore);
    highScoreEl.textContent = highScore;
    highScoreDisplay.style.display = 'block';
    highScoreDisplay.textContent = `🎉 New High Score: ${highScore} attempts!`;
  }
}

function shakeInput() {
  userInput.style.animation = 'shake 0.5s ease-in-out';
  setTimeout(() => {
    userInput.style.animation = '';
  }, 500);
}

function triggerConfetti() {
  // Simple CSS confetti effect
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  document.body.appendChild(confetti);
  
  for (let i = 0; i < 100; i++) {
    const flake = document.createElement('div');
    flake.style.position = 'fixed';
    flake.style.left = Math.random() * 100 + '%';
    flake.style.width = Math.random() * 10 + 5 + 'px';
    flake.style.height = flake.style.width;
    flake.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    flake.style.top = '-10px';
    flake.style.animation = `fall ${3 + Math.random() * 2}s linear forwards`;
    confetti.appendChild(flake);
  }
  
  setTimeout(() => {
    document.body.removeChild(confetti);
  }, 5000);
}

function endGame() {
  userInput.setAttribute('disabled', '');
  submit.disabled = true;
  p.innerHTML = '<button id="newGame">🔄 New Game</button>';
  p.querySelector('#newGame').className = '';
  startOver.appendChild(p);
  playGame = false;
  newGame();
}

function newGame() {
  const newGameButton = document.querySelector('#newGame');
  if (newGameButton) {
    newGameButton.addEventListener('click', function () {
      randomNumber = parseInt(Math.random() * 100 + 1);
      prevGuess = [];
      numGuess = 1;
      gameWon = false;
      guessSlot.innerHTML = '';
      lowOrHi.textContent = '';
      lowOrHi.className = 'lowOrHi';
      remaining.textContent = MAX_ATTEMPTS;
      progressFill.style.width = '0%';
      submit.disabled = false;
      userInput.removeAttribute('disabled');
      startOver.removeChild(p);
      highScoreDisplay.style.display = 'none';

      playGame = true;
      userInput.focus();
    });
  }
}

