import './style.css';
import Day from './day.mjs';
import Storage from './storage.mjs';
import { keysArray, validLetters, colorKeys } from './variables.mjs';
import { validAnswers, validTickers, validTickers2, validTickers3, validTickers4, validTickers5 } from './tickers.mjs';

export default class Game {

  constructor() {
    this.wordle = 'AMD';
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
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
  }

  createUI() {
    this.makeRows();
    this.makeTiles();
    this.makeKeyboardRows();
    this.makeKeyboardKeys();
    this.makePopUp();
  }

  addListeners() {
    this.keyPressListener();
    this.scoreboardButtonListener();
    this.scoreboardCloseListener();
    this.shareButtonListener();
    this.settingsButtonListener();
  }

  // On page load, do the following to set variables as those stored locally:
  loadLocalStorage() {

  }

  // Function to create tile row divs
  makeRows() {
    let tileContainer = document.getElementById('tile-container');
    for (let i = 0; i < 6; i++) {
      let addRow = document.createElement('div');
      addRow.setAttribute('id', 'row' + i);
      tileContainer.appendChild(addRow);
    }
  }

  // Function to create tile divs
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

  // Function to create keyboard rows
  makeKeyboardRows() {
    let keyboardContainer = document.getElementById('keyboard-container');
    for (let i = 0; i < 3; i++) {
      let addKeyboardRow = document.createElement('div');
      addKeyboardRow.setAttribute('id', 'keyboard-row' + i);
      keyboardContainer.appendChild(addKeyboardRow)
    }
  }

  // Function to create keyboard keys
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

  // Function to create and insert the popup div
  makePopUp() {
    let popUpContainer = document.getElementById('tile-container')
    let popUp = document.createElement('div');
    popUp.setAttribute('id', 'popup');
    popUpContainer.appendChild(popUp);
  }

  // Function to handle key onscreen keyboard being clicked
  click(letter) {
    if (this.isGameOver) return;
    if (letter === 'ENTER') {
      this.isHardModeOn ? this.checkGuessHard() : this.checkGuess();
    } else if (letter === 'BACK') {
      this.removeLetter();
    } else {
      this.addLetter(letter)
    }
  }

  // Function to handle keyboard being clicked
  keyPressed(event, that) {
    if (this.isGameOver) return;
    let letter = event.key.toUpperCase();
    if (validLetters.includes(letter)) {
      that.click(letter);
    } else if (letter == 'ENTER') {
      this.isHardModeOn ? this.checkGuessHard() : this.checkGuess();
    } else if (letter == 'BACKSPACE') {
      this.removeLetter();
    }
  }

  // Function to add event listener to keyboard keydowns
  keyPressListener() {
    let that = this;
    document.addEventListener('keydown', function() {
      that.keyPressed(event, that);
    });
  }

  // Function to add a letter to the current tile & row
  addLetter(letter) {
    let currentTile = this.currentTile;
    let currentRow = this.currentRow;
    if (currentRow < 6 && currentTile < 3) {
      this.guesses[currentRow][currentTile] = letter;
      this.renderTile(letter, currentRow, currentTile)
      this.addToCurrentTile();
    }
  }

  removeLetter() {
  let currentRow = this.currentRow;
  let currentTile = this.currentTile;
  if (currentTile > 0) {
    this.removeFromCurrentTile();
    currentTile = this.currentTile;
    this.guesses[currentRow][currentTile] = '';
    this.renderEmptyTile(currentRow, currentTile);
    }
  }

  // Function to check guess
  checkGuess() {
    let currentRow = this.currentRow;
    let currentTile = this.currentTile;
    let currentGuess = this.guesses[currentRow].join('').toUpperCase();

    if (currentTile < 3) {
      this.setPopUpMessage('Not enough letters');
      this.invalidAnswerDisplay();
      return;
    }

    if (!(validTickers.includes(currentGuess)) && currentGuess !== this.wordle) {
      this.setPopUpMessage('Not a ticker ');
      this.invalidAnswerDisplay();
      return;
    }

    if (currentGuess === this.wordle) {
      this.setGameWon(true);
      this.setGameOver(true);
      this.disableHardmodeCheckbox();
      this.updateStatsOnWin();
      this.setPopUpMessage('HUZZAH');
      this.colorTiles();
      this.jump();
      this.saveGuess();
      this.copyResults();
      setTimeout(() => {
        this.togglePopUp()
      }, 3500)
      setTimeout(() => {
        this.toggleAndLoadScoreboard();
      }, 4600)
      return;
    }

    if (currentTile === 3 && currentRow > 4) {
      this.setGameOver(true);
      this.disableHardmodeCheckbox();
      this.updateStatsOnLoss();
      this.setPopUpMessage(this.wordle.toUpperCase());
      this.colorTiles();
      this.saveGuess();
      this.copyResults();
      setTimeout( () => {
        this.togglePopUpLong()
      }, 2000)
      setTimeout(() => {
        this.toggleAndLoadScoreboard();
      }, 4200)
    } else {
      this.disableHardmodeCheckbox();
      this.colorTiles();
      this.saveGuess();
      this.addToCurrentRow();
      this.resetCurrentTile();
    }
  }

  // Function to color tiles and run function to color keys once answer is checked and then flip the row of tiles
  colorTiles() {
    let tiles = document.querySelector('#row' + this.currentRow).childNodes;
    let checkWordle = this.wordle;
    let guess = [];
    let guessOuter = [];
    this.greenLetters = [];

    tiles.forEach(tile => {
      guess.push({letter: tile.getAttribute('data'), color: 'darkgrey-color', num : 1})
      guessOuter.push({letter: tile.getAttribute('data'), color: 'darkgrey-color', num: 1})
    })

    guess.forEach((guess, index) => {
      let letter = guess.letter.toUpperCase();
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
        let letter = outer.letter.toUpperCase();
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

  // Function to color onscreen keys
  colorEachKey(guess) {
    guess.forEach((g) => {
      let key = document.getElementById(g.letter);
      if (key.className === 'green-color-key') {
        return;
      } else if (key.className === 'yellow-color-key') {
        if (g.color === 'green-color') key.className = 'green-color-key';
      } else {
        if (g.color === 'green-color') {
          key.className = 'green-color-key';
        } else if (g.color === 'yellow-color') {
          key.className = 'yellow-color-key';
        } else if (g.color === 'darkgrey-color') {
          key.className = 'darkgrey-color-key';
        }
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

  // Function to render value into a tile element
  renderTile(letter, row, tile) {
    let tileElement = document.getElementById('row' + row + 'tile' + tile);
    tileElement.textContent = letter;
    tileElement.setAttribute('data', letter);
    tileElement.classList.add('on-row');
  }

  // Function to tile element empty
  renderEmptyTile(row, tile) {
    let tileElement = document.getElementById('row' + row + 'tile' + tile);
    tileElement.textContent = '';
    tileElement.removeAttribute('data');
    tileElement.classList.remove('on-row');
  }

  // Code to populate previous guesses of that day upon page reload
  saveGuess() {
    let currentRow = this.currentRow;
    for (let tile = 0; tile < this.guesses[currentRow].length; tile++) {
      let guess = this.guesses[currentRow][tile];
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
      expiry: this.getNowZeroTime()
  	}
  	localStorage.setItem(key, JSON.stringify(valueWithExpiry))
  }

  // Function to return the getTime of today at 00:00:00
  getNowZeroTime() {
    let now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0, 0);
    return now.getTime();
  }

  // Function to call necessary functions when answer is not valid
  invalidAnswerDisplay() {
    this.shake();
    this.togglePopUp();
  }

  // Function to set popup message text
  setPopUpMessage(message) {
    let popUpMessage = document.getElementById('popup');
    popUpMessage.innerHTML = `<p>${message}</p>`;
  }

  // Function to make pop up message to appear temporarily
  togglePopUp() {
    let popUpMessage = document.getElementById('popup');
    popUpMessage.classList.toggle('popup-hide');
    setTimeout(() => {
      popUpMessage.classList.toggle('popup-hide');
    }, 1000 );
  }

  // Function to make pop up message to appear temporarily but for longer
  togglePopUpLong() {
    let popUpMessage = document.getElementById('popup');
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

    let currentRow = this.currentRow;

    function jumpArg(tile, row) {
      let tileElement = document.getElementById('row' + row + 'tile' + tile);
      tileElement.classList.toggle('jump');
    }

    setTimeout(() => {
      jumpArg(0, currentRow);
    }, 2000)

    setTimeout(() => {
      jumpArg(1, currentRow);
    }, 2300)

    setTimeout(() => {
      jumpArg(2, currentRow);
    }, 2600)

  }

  // Function to make pop up message to appear temporarily
  togglePopUp() {
    let popUpMessage = document.getElementById('popup');
    popUpMessage.classList.toggle('popup-hide');
    setTimeout(() => {
      popUpMessage.classList.toggle('popup-hide');
    }, 1000 );
  }

  // Function to make pop up message to appear temporarily but for longer
  togglePopUpLong() {
    let popUpMessage = document.getElementById('popup');
    popUpMessage.classList.toggle('popup-hide');
    setTimeout(() => {
      popUpMessage.classList.toggle('popup-hide');
    }, 2000 );
  }

  // Function to set gameWon along with date
  setGameWon(value) {
    this.gameWon = value;
    let storedGameWon = {
      value: value,
      expiry: this.getNowZeroTime()
    }
    localStorage.setItem('GameWon', JSON.stringify(storedGameWon))
  }

  // Function to set isGameOver along with date
  setGameOver(value) {
    this.isGameOver = value;
    let storedIsGameOver = {
      value: value,
      expiry: this.getNowZeroTime()
    }
    localStorage.setItem('GameOver', JSON.stringify(storedIsGameOver))
  }

  // Function to disable Hard Mode checkbox
  disableHardmodeCheckbox() {
    let hardModeCheckbox = document.getElementById('hard-mode-checkbox');
    if (this.isGameOver || this.currentRow === 0) {
      hardModeCheckbox.disabled = false;
    } else {
      hardModeCheckbox.disabled = true;
    }
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

  // Function to toggle scoreboard
  toggleAndLoadScoreboard() {
    this.addScoreValues();
    this.barChartLength();
    let scoreboardContainer = document.getElementById('scoreboard-container');
    let clockShareContainer = document.getElementById('clock-share-container');
    scoreboardContainer.classList.toggle('scoreboard-hide');
    if (this.isGameOver) {
      clockShareContainer.classList.remove('hide-clock-share')
    } else {
      clockShareContainer.classList.add('hide-clock-share')
    }
  }

  // Function to add event listener to scoreboard button
  scoreboardButtonListener() {
    let that = this;
    let scoreboardButton = document.getElementById('scoreboard-button');
    scoreboardButton.addEventListener('click', function() {
      that.toggleAndLoadScoreboard();
    });
  }

  scoreboardCloseListener() {
    let scoreboardButton = document.getElementById('scoreboard-button');
    let scoreboardContainer = document.getElementById('scoreboard-container');
    let scoreboardCloseButton = document.getElementById('scoreboard-close');
    document.addEventListener('click', function(e) {
      if (!scoreboardButton.contains(e.target) && !scoreboardContainer.contains(e.target)) {
        scoreboardContainer.classList.add('scoreboard-hide');
      }
    });
    document.addEventListener('click', function(e) {
      if (scoreboardCloseButton.contains(e.target)) scoreboardContainer.classList.add('scoreboard-hide');
    })
  }

  shareButtonListener() {
    let that = this;
    let popUpMessage = document.getElementById('popup');
    let shareButton = document.getElementById('scoreboard-share-button');
    shareButton.addEventListener('click', () => {
      navigator.clipboard.writeText(this.emojiCopyPaste);
      popUpMessage.innerHTML = `<p>Copied results to clipboard</p>`;
      this.togglePopUp();
      console.log(this.emojiCopyPaste);
    })
  }

  // Code to toggle settings when clicked etc
  settingsButtonListener() {
    let settingsButton = document.getElementById('settings-button');
    let settingsContainer = document.getElementById('settings-container');
    let settingsClose = document.getElementById('close-settings-button');

    settingsButton.addEventListener('click', () => {
      settingsContainer.classList.toggle('settings-hide');
    })

    settingsClose.addEventListener('click', () => {
      settingsContainer.classList.toggle('settings-hide');
    })
  }

  // Code to populate scoreboard with current scores
  addScoreValues() {
    let playedValue = document.getElementById('played-value');
    let winPercentageValue = document.getElementById('win-percentage-value');
    let currentStreakValue = document.getElementById('current-streak-value');
    let maxStreakValue = document.getElementById('max-streak-value');
    let played = Number(localStorage.getItem('TotalGames'));
    let wins = Number(localStorage.getItem('TotalWins'));
    let winPercentage =  Math.floor(wins / played * 100);
    let currentStreak = Number(localStorage.getItem('CurrentStreak'));
    let maxStreak = Number(localStorage.getItem('MaxStreak'));
    playedValue.textContent = `${played}`;
    winPercentageValue.textContent = `${winPercentage}`;
    currentStreakValue.textContent = `${currentStreak}`;
    maxStreakValue.textContent = `${maxStreak}`;
  }

  // Code to define and calculate bar chart bar lengths
  barChartLength() {
    let barChartOne = Number(localStorage.getItem('Row1Wins'));
    let barChartTwo = Number(localStorage.getItem('Row2Wins'));
    let barChartThree = Number(localStorage.getItem('Row3Wins'));
    let barChartFour = Number(localStorage.getItem('Row4Wins'));
    let barChartFive = Number(localStorage.getItem('Row5Wins'));
    let barChartSix = Number(localStorage.getItem('Row6Wins'));

    let barCharts = [barChartOne, barChartTwo, barChartThree, barChartFour, barChartFive, barChartSix];
    let maxBar = Math.max.apply(Math.max, barCharts);

    let barChartOneLength = Math.floor(barChartOne / maxBar * 100);
    let barChartTwoLength = Math.floor(barChartTwo / maxBar * 100);
    let barChartThreeLength = Math.floor(barChartThree / maxBar * 100);
    let barChartFourLength = Math.floor(barChartFour / maxBar * 100);
    let barChartFiveLength = Math.floor(barChartFive / maxBar * 100);
    let barChartSixLength = Math.floor(barChartSix / maxBar * 100);

    let barOne = document.getElementById('bar-chart-one');
    barOne.style.width = `${barChartOneLength}%`
    barOne.innerHTML = `<p>${barChartOne}</p>`

    let barTwo = document.getElementById('bar-chart-two');
    barTwo.style.width = `${barChartTwoLength}%`
    barTwo.innerHTML = `<p>${barChartTwo}</p>`

    let barThree = document.getElementById('bar-chart-three');
    barThree.style.width = `${barChartThreeLength}%`
    barThree.innerHTML = `<p>${barChartThree}</p>`

    let barFour = document.getElementById('bar-chart-four');
    barFour.style.width = `${barChartFourLength}%`
    barFour.innerHTML = `<p>${barChartFour}</p>`

    let barFive = document.getElementById('bar-chart-five');
    barFive.style.width = `${barChartFiveLength}%`
    barFive.innerHTML = `<p>${barChartFive}</p>`

    let barSix = document.getElementById('bar-chart-six');
    barSix.style.width = `${barChartSixLength}%`
    barSix.innerHTML = `<p>${barChartSix}</p>`
  }

  // Code to define which day it is
  wordleNumber() {
    let today = new Date();
    let milliSince1970 = today.getTime();
    let milliPerDay = 86400000;
    let daysSince1970 = Math.floor(milliSince1970/milliPerDay);
    let dailyDate = daysSince1970 - 19227 + 0;
    return dailyDate;
  }

  // Code to copy the results of the users daily wordle to the clipboard upon them clicking on the Share button in thr scoreboard
  copyResults() {
    if (this.gameWon === true) {
      if (this.isHardModeOn) {
        this.emojiCopyPaste += `Wordle ${this.wordleNumber()} ${this.currentRow + 1}/6*\n`
      } else {
        this.emojiCopyPaste += `Wordle ${this.wordleNumber()} ${this.currentRow + 1}/6\n`
      }
    } else {
      if (this.isHardModeOn) {
        this.emojiCopyPaste += `Wordle ${this.wordleNumber()} X/6*\n`
      } else {
        this.emojiCopyPaste += `Wordle ${this.wordleNumber()} X/6\n`
      }
    }

    for (let i = 0; i <= this.currentRow; i++) {
      let thisGuessRow = this.guesses[i];
      let checkWordle = this.wordle;
      let guess = [];
      let guessOuter = [];
      let guessEmojiColors = [];

      thisGuessRow.forEach(guessLetter => {
          guess.push({letter: guessLetter, color: 'darkgrey'})
          guessOuter.push({letter: guessLetter, color: 'darkgrey'})
      })

      guess.forEach((guessLetter, index) => {
          let thisLetter = guessLetter.letter.toUpperCase();
          if (thisLetter === this.wordle[index]) {
              guessLetter.color = 'green';
              checkWordle = checkWordle.replace(thisLetter, '');
              guessOuter[index] = ' ';
          }
      })

      guessOuter.forEach((outer, index) => {
        if (!(guess[index].color === 'green')) {
          let thisLetter = outer.letter.toUpperCase();
          if (checkWordle.includes(thisLetter)) {
            guess[index].color = 'yellow';
            checkWordle = checkWordle.replace(thisLetter, '');
          }
        }
      })

      for (let x = 0; x < guess.length; x++) {
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








  // Make function to get isGameOver from localStorage upon page load. If it exists and the date is todays date set it as that stored value. If it doesnt exist or is not from today, set it as true.

  // Work on showing the clock in scoreboard

  // Add ETFs to validTickers














}
