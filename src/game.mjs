import './style.css';
import Day from './day.mjs';
import Storage from './storage.mjs';
import { keysArray, validLetters, colorKeys } from './variables.mjs';
import { validAnswers, validWords } from './tickers.mjs';

export default class Game {

  constructor() {
    this.wordle = 'level';
    this.gameWon = false;
    this.isGameOver = false;
    this.isHardModeOn = false;
    this.currentRow = 0;
    this.currentTile = 0;
    this.greenLetters = [];
    this.yellowLetters = [];
    this.missingGreenLetter = [];
    this.missingYellowLetter = [];
    this.hardModeOn = true;
    this.emojiCopyPaste = "";
    this.guesses = [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ];
  }

  createUI() {
    this.makeRows();
    this.makeTiles();
    this.makeKeyboardRows();
    this.makeKeyboardKeys();
  }

  // On page load, do the following to set variables as those stored locally:
  loadLocalStorage() {

  }

  makeRows() {
    let tileContainer = document.getElementById('tile-container');
    for (let i = 0; i < 6; i++) {
      let addRow = document.createElement('div');
      addRow.setAttribute('id', 'row' + i);
      tileContainer.appendChild(addRow);
    }
  }

  makeTiles() {
    for (let i = 0; i < 6; i++) {
      let rowContainer = document.getElementById('row' + i);
      for (let x = 0; x < 3; x++) {
        let addTile = document.createElement('div');
        addTile.setAttribute('id', 'row' + i + 'tile' + x);
        rowContainer.appendChild(addTile);
      }
    }
  }

  makeKeyboardRows() {
    let keyboardContainer = document.getElementById('keyboard-container');
    for (let i = 0; i < 3; i++) {
      let addKeyboardRow = document.createElement('div');
      addKeyboardRow.setAttribute('id', 'keyboard-row' + i);
      keyboardContainer.appendChild(addKeyboardRow)
    }
  }

  makeKeyboardKeys() {
    let that = this;
    keysArray.forEach((array, index) => {
      let keyboardRow = document.getElementById('keyboard-row' + index);
      array.forEach((key) => {
        let addKey = document.createElement('button');
        addKey.textContent = key;
        addKey.setAttribute('data-key', key);
        addKey.setAttribute('id', key);
        addKey.classList.add('lightgrey-color-key');
        addKey.addEventListener('click', () => that.click(key));
        keyboardRow.appendChild(addKey);
      });
    });
  }

  // Function to handle key on keyboard being clicked and call relevant function
  click(letter) {
    if (!this.isGameOver.value) {
      if (letter === 'ENTER') {
        this.isHardModeOn === 'On' ? this.checkGuessHard() : this.checkGuess();
      } else if (letter === 'BACK') {
        this.removeLetter();
      } else {
        this.addLetter(letter)
      }
    }
  }

  // Function to add a letter to the current tile & row
  addLetter(letter) {
    let currentTile = this.currentTile;
    let currentRow = this.currentRow;
    if (currentRow < 6 && currentTile < 5) {
      this.guesses[currentRow][currentTile] = letter;
      this.renderTile(letter, currentRow, currentTile)
      this.addToCurrentTile();
    }
  }

  removeLetter() {
  let currentRow = this.currrentRow;
  let currentTile = this.currentTile;
  if (currentTile > 0) {
    this.removeFromCurrentTile();
    currentTile = this.currentTile;
    this.guesses[currentRow][currentTile] = '';
    this.renderEmptyTile(currentRow, currentTile);
    }
  }

  // Function to add 1 to currentTile and save it to localStorage
  addToCurrentTile() {
    this.currentTile++;
    localStorage.setItem('CurrentTile', this.currentTile);
  }

  // Function to remove 1 from currentTile and save it to localStorage
  removeFromCurrentTile() {
    this.currentTile--;
    localStorage.setItem('CurrentTile', this.currentTile);
  }

  // Function to set currentTile to 0 and save it to localStorage
  resetCurrentTile() {
    this.currentTile = 0;
    localStorage.setItem('CurrentTile', this.currentTile);
  }

  // Function to add 1 to currentRow value and save it to localStorage
  addToCurrentRow() {
    this.currentRow++;
    localStorage.setItem('CurrentRow', this.currentRow);
  }

  // Function to set currentRow to 0 and save it to localStorage
  resetCurrentRow() {
    this.currentRow = 0;
    localStorage.setItem('CurrentRow', this.currentRow);
  }

  renderTile(letter, row, tile) {
    let tileElement = document.getElementById('row' + row + 'tile' + tile);
    tileElement.textContent = letter;
    tile.setAttribute('data', letter);
    tile.classList.add('on-row');
  }

  renderEmptyTile(row, tile) {
    let tileElement = document.getElementById('row' + row + 'tile' + tile);
    tileElement.textContent = '';
    tile.removeAttribute('data');
    tile.classList.remove('on-row');
  }

  keyPressed(e) {
    let letter = e.key.toUpperCase();
    if (validLetters.includes(letter)) {
      this.click(letter);
    } else if (letter == 'ENTER') {
      this.isHardModeOn === 'On' ? this.checkGuessHard() : this.checkGuess()
    } else if (letter == 'BACKSPACE') {
      this.removeLetter();
    }
  }

  checkGuess() {
    let currentRow = this.currentRow;
    let currentTile = this.currentTile;
    let currentGuess = guesses[currentRow].join('').toLowerCase();
    if (currentTile < 5) {
      this.setPopUpMessage('Not enough letters');
      this.invalidAnswerErrorDisplay();
    } else if (validWords.includes(currentGuess) || validAnswers.includes(currentGuess) || currentGuess === wordle) {
      if (currentTile === 5 && currentRow < 6) {
        if (currentGuess === wordle) {
          this.setGameOver(true);
          this.setGameOngoing(false);
          this.disableHardmodeCheckbox();
          this.gameWon = true;
          this.updateStatsOnWin();
          this.setPopUpMessage('GIMME DAT');
          this.colorTiles();
          this.jump();
          this.saveGuess();
          this.copyResults();
          setTimeout( () => {
            this.togglePopUp()
          }, 3500)
          setTimeout(() => {
            this.toggleLoadScoreboard();
          }, 4600)
        } else if (currentTile === 5 && currentRow > 4) {
          this.setGameOver(true);
          this.setGameOngoing(false);
          this.disableHardmodeCheckbox();
          this.updateStatsOnLoss();
          this.setPopUpMessage(wordle.toUpperCase());
          this.colorTiles();
          this.saveGuess();
          this.copyResults();
          setTimeout( () => {
            this.togglePopUpLong()
          }, 2000)
          setTimeout(() => {
            this.toggleLoadScoreboard();
          }, 4200)
        } else {
          this.setGameOngoing(true);
          this.disableHardmodeCheckbox();
          this.colorTiles();
          this.saveGuess();
          this.addToCurrentRow();
          this.resetCurrentTile();
        }
      }
    } else {
      this.setPopUpMessage('Not in word list');
      this.invalidAnswerErrorDisplay();
    }
  }

  // Function to color tiles and run function to color keys once answer is checked and then flip the row of tiles
  colorTiles() {
    let tiles = document.querySelector('#row' + this.currentRow).childNodes;
    let checkWordle = wordle;
    let guess = [];
    let guessOuter = [];
    this.greenLetters = [];

    tiles.forEach(tile => {
      guess.push({letter: tile.getAttribute('data'), color: 'darkgrey-color', num : 1})
      guessOuter.push({letter: tile.getAttribute('data'), color: 'darkgrey-color', num: 1})
    })

    guess.forEach((guess, index) => {
      let letter = guess.letter.toLowerCase();
      if (letter === this.wordle[index]) {
        guess.color = 'green-color';
        guess.num = 3;
        checkWordle = checkWordle.replace(letter, '');
        guessOuter[index] = ' ';
        this.greenLetters.push({letter: guess.letter, position: index});
      }
    })


    guessOuter.forEach((outer, index) => {
      if (!(guess[index].color === 'green-color')) {
        let letter = outer.letter.toLowerCase();
        if (checkWordle.includes(letter)) {
          guess[index].color = 'yellow-color';
          guess[index].num = 2;
          checkWordle = checkWordle.replace(letter, '');
          this.yellowLetters.push(outer.letter);
        }
      }
    })


    tiles.forEach((tile, index) => {
      tile.dataset.color = guess[index].color;
      setTimeout(() => {
        tile.classList.toggle('flip');
      }, 400 * index);
      setTimeout(() => {
        tile.classList.add(guess[index].color);
      }, 400 * index + 400);
      setTimeout(() => {
        tile.classList.toggle('flip');
      }, 1000 + 400 * index);
    })


    setTimeout(() => {
      this.colorEachKey(guess);
    }, 1700)
  }

  //
  colorEachKey(guess) {
    guess.forEach((g) => {
      let key = document.getElementById(g.letter);
      if (g.color === 'green-color') {
        key.className = 'green-color-key';
      } else if (g.color === 'yellow-color') {
        key.className = 'yellow-color-key';
      } else if (g.color === 'darkgrey-color') {
        key.className = 'darkgrey-color-key';
      }
    });
  }

  // Function for Hard Mode to check that yellow and green letters from previous guesses are used in ths guess and returns true or false
  hardModeColor() {
    let tiles = document.querySelector('#row' + currentRow).childNodes;
    let greenTotal = 0;
    let yellowTotal = 0;
    let guess = [];
    let yellowGuess = [];
    this.missingGreenLetter = [];
    this.missingYellowLetter = [];

    tiles.forEach((tile, i) => {
      guess.push({letter: tile.getAttribute('data'), position: i});
      yellowGuess.push(tile.getAttribute('data'));
    })

    this.greenLetters.forEach((letter) => {
      let letterPosition = letter.position;
      let enteredLetter = guess[letterPosition].letter
      if (greenLetters.length === 0) {
        return;
      } else if (letter.letter === enteredLetter) {
        greenTotal += 1;
      } else {
        this.missingGreenLetter.push({letter: letter.letter, position: letterPosition + 1});
      }
    });

    yellowLetters.forEach((yellowletter) => {
      if (yellowGuess.includes(yellowletter)) {
        yellowTotal += 1;
      } else {
        this.missingYellowLetter.push(yellowletter);
      }
    });

    if (greenTotal === this.greenLetters.length && yellowTotal === this.yellowLetters.length) {
      return true;
    } else {
      return false;
    }
  }

  // Code to populate previous guesses of that day upon page reload
  saveGuess() {
    for (let tile = 0; tile < this.guesses[this.currentRow].length; tile++) {
      let guess = this.guesses[this.currentRow][tile];
      let key = 'row' + currentRow + 'tile' + tile;
      let color = document.getElementById(key).dataset.color;
      this.setGuessWithExpiry(key, guess, color);
    }
  }

  // Save each letter of a entered guess alongside the time(day) and color
  setGuessWithExpiry(key, value, color) {
  	let valueWithExpiry = {
  		value: value,
      color: color,
      expiry: getNowZeroTime()
  	}
  	localStorage.setItem(key, JSON.stringify(valueWithExpiry))
  }


  // Function to call necessary functions when answer is not valid
  invalidAnswerDisplay() {
    this.shake();
    this.togglePopUp();
  }

  // Function to set popup message text
  setPopUpMessage(message) {
    popUpMessage.innerHTML = `<p>${message}</p>`;
  }

  // Function to make pop up message to appear temporarily
  togglePopUp() {
    popUpMessage.classList.toggle('popup-hide');
    setTimeout(() => {
      popUpMessage.classList.toggle('popup-hide');
    }, 1000 );
  }

  // Function to make pop up message to appear temporarily but for longer
  togglePopUpLong() {
    popUpMessage.classList.toggle('popup-hide');
    setTimeout(() => {
      popUpMessage.classList.toggle('popup-hide');
    }, 2000 );
  }

  // Function to shake current row of tiles when guess is invalid
  shake() {
    let shakeRow = document.getElementById('row' + this.currentRow);
    shakeRow.classList.toggle('shake')
    setTimeout(() => {
      shakeRow.classList.toggle('shake');
    }, 500 );
  }

  // Function to jump current row of tiles when guess is correct
  jump() {

    function jumpArg(tile) {
      let tileElement = document.getElementById('row' + this.currentRow + 'tile' + tile);
      tileElement.classList.toggle('jump');
    }

    setTimeout(() => {
      jumpArg(0);
    }, 2000)

    setTimeout(() => {
      jumpArg(1);
    }, 2300)

    setTimeout(() => {
      jumpArg(2);
    }, 2600)

    setTimeout(() => {
      jumpArg(3);
    }, 2900)

    setTimeout(() => {
      jumpArg(4);
    }, 3200)
  }

  // Function to make pop up message to appear temporarily
  togglePopUp() {
    popUpMessage.classList.toggle('popup-hide');
    setTimeout(() => {
      popUpMessage.classList.toggle('popup-hide');
    }, 1000 );
  }

  // Function to make pop up message to appear temporarily but for longer
  togglePopUpLong() {
    popUpMessage.classList.toggle('popup-hide');
    setTimeout(() => {
      popUpMessage.classList.toggle('popup-hide');
    }, 2000 );
  }

  // Function to set isGameOver along with date
  setGameOver(value) {
    this.isGameOver = value;
    let storedIsGameOver = {
      value: value,
      expiry: getNowZeroTime()
    }
    localStorage.setItem('GameOver', JSON.stringify(storedIsGameOver))
  }

  // Function to set isGameOngoing along with date
  setGameOngoing(value) {
    this.isGameOngoing = value;
    let storedIsGameOngoing = {
      value: value,
      expiry: getNowZeroTime()
    }
    localStorage.setItem('GameOngoing', JSON.stringify(storedIsGameOngoing))
  }

  // Function to diable Hard Mode checkbox if IsGameOngoing is true and the expiry is today
  disableHardmodeCheckbox() {
    this.isGameOngoing ? hardModeCheckbox.disabled = true : hardModeCheckbox.disabled = false;
  }

  // Function to add to number of games completed
  addToWordlesCount() {
    let totalGames = Number(localStorage.getItem('TotalGames'));
    totalGames++;
    localStorage.setItem('TotalGames', totalGames);
  }

  // Function to add to number of wins
  addToWinsCount() {
    let totalWins = Number(localStorage.getItem('TotalWins'));
    totalWins++;
    localStorage.setItem('TotalWins', totalWins);
  }

  // Function to add to current streak count
  addToStreakCount() {
    let currentStreak = Number(localStorage.getItem('CurrentStreak'));
    currentStreak++;
    localStorage.setItem('CurrentStreak', currentStreak);
  }

  // Function to update max streak
  updateMaxStreak() {
    let currentStreak = Number(localStorage.getItem('CurrentStreak'));
    let maxStreak = Number(localStorage.getItem('MaxStreak'));
    if (currentStreak > maxStreak) localStorage.setItem('MaxStreak', currentStreak);
  }

  // Function to set streak to 0 without condition (to be used upon loss)
  endStreak() {
    localStorage.setItem('CurrentStreak', 0);
  }

  // Code to track stats for how many guesses each win took
  trackWinRowStats() {
    let row = 'Row' + (this.currentRow + 1) + 'Wins';
    let currentScore = Number(localStorage.getItem(row));
    currentScore++;
    localStorage.setItem(row, currentScore);
  }

  // Function to update stats upon win
  updateStatsOnWin() {
    this.addToWordlesCount();
    this.addToWinsCount();
    this.addToStreakCount();
    this.updateMaxStreak();
    this.trackWinRowStats();
  }

  // Function to update stats upon loss
  updateStatsOnLoss() {
    this.addToWordlesCount();
    this.endStreak();
  }

  // Code to copy the results of the users daily wordle to the clipboard upon them clicking on the Share button in thr scoreboard
  copyResults() {
    if (this.gameWon === true) {
      if (this.isHardModeOn()) {
        this.emojiCopyPaste += `Wordle ${this.wordleNumber()} ${this.currentRow + 1}/6*\n`
      } else {
        this.emojiCopyPaste += `Wordle ${this.wordleNumber()} ${this.currentRow + 1}/6\n`
      }
    } else {
      if (this.isHardModeOn()) {
        this.emojiCopyPaste += `Wordle ${this.wordleNumber()} X/6*\n`
      } else {
        this.emojiCopyPaste += `Wordle ${this.wordleNumber()} X/6\n`
      }
    }

    for (let i = 0; i <= this.currentRow; i++) {
      let thisGuessRow = guesses[i];
      let checkWordle = wordle;
      let guess = [];
      let guessOuter = [];
      let guessEmojiColors = [];

      thisGuessRow.forEach(guessLetter => {
          guess.push({letter: guessLetter, color: 'darkgrey'})
          guessOuter.push({letter: guessLetter, color: 'darkgrey'})
      })

      guess.forEach((guessLetter, index) => {
          thisLetter = guessLetter.letter.toLowerCase();
          if (thisLetter === wordle[index]) {
              guessLetter.color = 'green';
              checkWordle = checkWordle.replace(thisLetter, '');
              guessOuter[index] = ' ';
          }
      })

      guessOuter.forEach((outer, index) => {
        if (!(guess[index].color === 'green')) {
          thisLetter = outer.letter.toLowerCase();
          if (checkWordle.includes(thisLetter)) {
            guess[index].color = 'yellow';
            checkWordle = checkWordle.replace(thisLetter, '');
          }
        }
      })

      for (x = 0; x < guess.length; x++) {
        if (guess[x].color === 'green') {
          this.emojiCopyPaste += String.fromCodePoint(0x1F7E9);
        } else if (guess[x].color === 'yellow') {
          this.emojiCopyPaste += String.fromCodePoint(0x1F7E8);
        } else if (guess[x].color === 'darkgrey') {
          this.emojiCopyPaste += String.fromCodePoint(0x2B1B);
        }
      }

      this.emojiCopyPaste += '\n';
    }
  }








  // Make function to get isGameOngoing from localStorage upon page load. If it exists and the date is todays date set it as that stored value. If it doesnt exist or is not from today, set it as true.














}
