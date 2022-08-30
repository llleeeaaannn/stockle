import './style.css';
import Day from './day.mjs';
import Storage from './storage.mjs';
import { keysArray, validLetters, colorKeys } from './variables.mjs';
import { validAnswers, validTickers, validTickers2, validTickers3, validTickers4, validTickers5 } from './tickers.mjs';

export default class Game {

  constructor() {
    this.wordle = 'AMD';
    this.gameWon = false;
    this.gameOver = false;
    this.hardMode = false;
    this.darkTheme = true;
    this.currentRow = 0;
    this.currentTile = 0;
    this.greenLetters = [];
    this.yellowLetters = [];
    this.missingGreenLetter = [];
    this.missingYellowLetter = [];
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
    this.displayCountdown();
  }

  addListeners() {
    this.keyPressListener();
    this.scoreboardButtonListener();
    this.scoreboardCloseListener();
    this.shareButtonListener();
    this.settingsButtonListener();
    this.switchHardModeListener();
    this.lightDarkThemeListener();
  }

  // On page load, do the following to set variables as those stored locally:
  loadLocalStorage() {
    this.getStoredGameWon();
    this.getStoredGameOver();
    this.getStoredHardMode();
    this.getStoredDarkTheme();
    this.getStoredCurrentRow();
    this.getStoredCurrentTile();
    this.verifyStoredGuess();
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
    if (this.gameOver) return;
    if (letter === 'ENTER') {
      this.hardMode ? this.checkGuessHard() : this.checkGuess();
    } else if (letter === 'BACK') {
      this.removeLetter();
    } else {
      this.addLetter(letter)
    }
  }

  // Function to handle keyboard being clicked
  keyPressed(event, that) {
    if (this.gameOver) return;
    let letter = event.key.toUpperCase();
    if (validLetters.includes(letter)) {
      that.click(letter);
    } else if (letter == 'ENTER') {
      this.hardMode ? this.checkGuessHard() : this.checkGuess();
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
      this.colorTiles();
      this.saveGuess();
      this.addToCurrentRow();
      this.resetCurrentTile();
      this.disableHardmodeCheckbox();
    }
  }

  // CheckGuess for Hard Mode
  checkGuessHard() {
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

    if (!this.hardModeColor()) {
      this.missingGreenLetter.length > 0 ? this.setPopUpMessage(`${this.greenMissingPosition()} letter must be ${this.missingGreenLetter[0].letter}`) : this.setPopUpMessage(`<p>Guess must contain ${this.missingYellowLetter[0]}<p>`);
      this.shake();
      this.togglePopUp();
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
      setTimeout( () => {
        this.togglePopUp()
      }, 3500)
      setTimeout(() => {
        this.toggleLoadScoreboard();
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
        this.toggleLoadScoreboard();
      }, 4200)
    } else {
      this.colorTiles();
      this.saveGuess();
      this.addToCurrentRow();
      this.resetCurrentTile();
      this.disableHardmodeCheckbox();
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
    let tiles = document.querySelector('#row' + this.currentRow).childNodes;
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
      if (this.greenLetters.length === 0) {
        return;
      } else if (letter.letter === enteredLetter) {
        greenTotal += 1;
      } else {
        this.missingGreenLetter.push({letter: letter.letter, position: letterPosition + 1});
      }
    });

    this.yellowLetters.forEach((yellowletter) => {
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
    this.storeCurrentTile(this.currentTile);
  }

  // Function to remove 1 from currentTile and save it to localStorage
  removeFromCurrentTile() {
    this.currentTile--;
    this.storeCurrentTile(this.currentTile);
  }

  // Function to set currentTile to a value and save it to localStorage
  setCurrentTile(value) {
    this.currentTile = value;
    this.storeCurrentTile(this.currentTile);
  }

  // Function to set currentTile to 0 and save it to localStorage
  resetCurrentTile() {
    this.currentTile = 0;
    this.storeCurrentTile(this.currentTile);
  }

  // Function to store currentTile value in localStorage
  storeCurrentTile(currentTile) {
    let storedCurrentTile = {
      value: currentTile,
      expiry: this.getNowZeroTime()
    }
    localStorage.setItem('CurrentTile', JSON.stringify(storedCurrentTile));
  }

  // Function to add 1 to currentRow value and save it to localStorage
  addToCurrentRow() {
    this.currentRow++;
    this.storeCurrentRow(this.currentRow);
  }

  // Function to set currentRow to a value and save it to localStorage
  setCurrentRow(value) {
    this.currentRow = value;
    this.storeCurrentTile(this.currentTile);
  }

  // Function to set currentRow to 0 and save it to localStorage
  resetCurrentRow() {
    this.currentRow = 0;
    this.storeCurrentRow(this.currentRow);
  }

  // Function to store currentRow value in localStorage
  storeCurrentRow(currentRow) {
    let storedCurrentRow = {
      value: currentRow,
      expiry: this.getNowZeroTime()
    }
    localStorage.setItem('CurrentRow', JSON.stringify(storedCurrentRow));
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

  // Function to set gameOver along with date
  setGameOver(value) {
    this.gameOver = value;
    let storedGameOver = {
      value: value,
      expiry: this.getNowZeroTime()
    }
    localStorage.setItem('GameOver', JSON.stringify(storedGameOver))
  }

  // Function to disable Hard Mode checkbox
  disableHardmodeCheckbox() {
    let hardModeCheckbox = document.getElementById('hard-mode-checkbox');
    if (this.gameOver || this.currentRow === 0) {
      hardModeCheckbox.disabled = false;
    } else {
      hardModeCheckbox.disabled = true;
    }
  }

  // Code to change to and from Hard Mode when switch is clicked
  switchHardModeListener() {
    let hardModeCheckbox = document.getElementById('hard-mode-checkbox');
    hardModeCheckbox.addEventListener('click', () => {
      hardModeCheckbox.checked === true ? this.hardMode = true : this.hardMode = false;
      this.storeHardMode();
    });
  }

  // Code to store hardMode value in localStorage
  storeHardMode() {
    this.hardMode ? localStorage.setItem('HardMode', true) : localStorage.setItem('HardMode', false);
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
    if (this.gameOver) {
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

  // Function to return the position of earliest missing green letter for hard mode in necessary vocab (1st, 2nd...)
  greenMissingPosition() {
    switch(this.missingGreenLetter[0].position) {
      case 1:
        return '1st';
        break;
      case 2:
        return '2nd';
        break;
      case 3:
        return '3rd';
        break;
      case 4:
        return '4th';
        break;
      case 5:
        return '5th';
        break;
    }
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
      if (this.hardMode) {
        this.emojiCopyPaste += `Stockle ${this.wordleNumber()} ${this.currentRow + 1}/6*\n`
      } else {
        this.emojiCopyPaste += `Stockle ${this.wordleNumber()} ${this.currentRow + 1}/6\n`
      }
    } else {
      if (this.hardMode) {
        this.emojiCopyPaste += `Stockle ${this.wordleNumber()} X/6*\n`
      } else {
        this.emojiCopyPaste += `Stockle ${this.wordleNumber()} X/6\n`
      }
    }

    for (let i = 0; i <= this.currentRow; i++) {
      let thisGuessRow = this.guesses[i];
      let checkWordle = this.wordle;
      let guess = [];
      let guessOuter = [];
      let guessEmojiColors = [];
      console.log(this.guesses);
      console.log(thisGuessRow);

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
      console.log(this.emojiCopyPaste);
    }
  }

  makeCountdown() {
    let date = new Date();
    date.setDate(date.getDate() + 1)
    date.setHours(0, 0, 0);
    let total = Date.parse(date) - Date.parse(new Date());
    let seconds = Math.floor( (total/1000) % 60 );
    let minutes = Math.floor( (total/1000/60) % 60 );
    let hours = Math.floor( (total/(1000*60*60)) % 24 );

    hours = '0' + hours;
    minutes = '0' + minutes
    seconds = '0' + seconds;

    if (this.gameOver) {
      let countdown = document.getElementById('countdown-container');
      countdown.innerHTML = `<h5>NEXT WORDLE</h5><span> ${hours.slice(-2)} : ${minutes.slice(-2)} : ${seconds.slice(-2)}`;
    }
  }

  displayCountdown() {
    let that = this;
    setInterval(function() { that.makeCountdown() }, 1000);
  }

  // Function to get stored theme, apply it and set checkbox to match it
  getStoredDarkTheme() {
    let theme = localStorage.getItem('theme');
    if (theme === null) return;
    this.darkTheme = (theme === 'true');
    this.darkTheme ? this.makeDark() : this.makeLight();
    this.checkThemeCheckbox();
  }

  // Function to set theme checkbox
  checkThemeCheckbox() {
    let lightDarkThemeCheckbox = document.getElementById('dark-theme-checkbox');
    lightDarkThemeCheckbox.checked = this.darkTheme;
  }

  // Code to change set darkTheme and change theme when switch is clicked
  lightDarkThemeListener() {
    let that = this;
    let lightDarkThemeSwitch = document.getElementById('dark-theme-switch');
    let lightDarkThemeCheckbox = document.getElementById('dark-theme-checkbox');
    lightDarkThemeSwitch.addEventListener('click', () => {
      if (lightDarkThemeCheckbox.checked) {
        that.setDarkTheme(true);
        that.makeDark();
      } else {
        that.setDarkTheme(false);
        that.makeLight();
      }
    })
  }

  // Function to set and store darkTheme
  setDarkTheme(value) {
    this.darkTheme = value;
    localStorage.setItem('theme', value)
  }

  // Function to apply light theme
  makeLight() {
    let stylesheet = document.getElementById('rootStylesheet')
    stylesheet.textContent = ":root { --fontColor: #000; --oppositeFont: #fff; --colorBG: #fff; --oppositeBG: #000; --secondFontColor: #888484; --offsetColorBG: #fff; --tileBorderColor: 2px solid rgba(83, 83, 91, 0.3); --tileOnRowBorderColor: 2px solid rgba(83, 83, 91, 0.75); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: #588c4c; --yellowBG: #b89c3c; --darkGreyBG: #403c3c; --lightGreyBG: #d8d4dc; --uncheckedKey: #000; --checkedKey: #fff; --white: #fff;}";
  }

  // Function to apply dark theme
  makeDark() {
    let stylesheet = document.getElementById('rootStylesheet')
    stylesheet.textContent = ":root { --fontColor: #fff; --oppositeFont: #000; --colorBG: #000; --oppositeBG: #fff; --secondFontColor: #888484; --offsetColorBG: #141414; --tileBorderColor: 2px solid rgba(60, 60 ,60, 0.6); --tileOnRowBorderColor: 2px solid rgba(83, 83, 91, 0.75); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: #588c4c; --yellowBG: #b89c3c; --darkGreyBG: #403c3c; --lightGreyBG: #888484; --uncheckedKey: #fff; --checkedKey: #fff; --white: #fff;}";
  }

  // Function to get currentRow stored value upon page load if it isnt expired
  getStoredCurrentRow() {
    let now = this.getNowZeroTime();
    let storedCurrentRow = JSON.parse(localStorage.getItem('CurrentRow'));
    if (storedCurrentRow === null) return;
    if (storedCurrentRow.expiry !== now) return;
    this.currentRow = Number(storedCurrentRow.value);
  }

  // Function to get currentTile stored value upon page load if it isnt expired
  getStoredCurrentTile() {
    let now = this.getNowZeroTime();
    let storedCurrentTile = JSON.parse(localStorage.getItem('CurrentTile'));
    if (storedCurrentTile === null) return;
    if (storedCurrentTile.expiry !== now) return;
    this.currentTile = Number(storedCurrentTile.value);
  }

  // Function to get gameWon stored value upon page load if it isnt expired
  getStoredGameWon() {
    let now = this.getNowZeroTime();
    let storedGameWon = JSON.parse(localStorage.getItem('GameWon'));
    if (storedGameWon === null) return;
    if (storedGameWon.expiry !== now) return;
    this.gameWon = storedGameWon.value;
  }

  // Function to get gameOver stored value upon page load if it isnt expired
  getStoredGameOver() {
    let now = this.getNowZeroTime();
    let storedGameOver = JSON.parse(localStorage.getItem('GameOver'));
    if (storedGameOver === null) return;
    if (storedGameOver.expiry !== now) return;
    this.gameOver = storedGameOver.value;
  }

  // Function to get hardMode stored value upon page load
  getStoredHardMode() {
    let mode = localStorage.getItem('HardMode');
    this.hardMode = (mode === 'true');
    this.checkHardModeCheckbox()
  }

  // Function to check/uncheck hardMode checkbox upon load
  checkHardModeCheckbox() {
    let hardModeCheckbox = document.getElementById('hard-mode-checkbox');
    hardModeCheckbox.checked = this.hardMode;
  }

  // Populate tiles and rows with stored guesses upon page load
  verifyStoredGuess() {
    let now = this.getNowZeroTime();
    for (let row = 0; row < 6; row++) {
      for (let tile = 0; tile < 3; tile++) {
        let thisTile = 'row' + row + 'tile' + tile;
        if (localStorage.getItem(thisTile) === null) {
          this.setCurrentRow(row);
          this.setCurrentTile(0);
          return;
        }

        let storedGuess = JSON.parse(localStorage.getItem(thisTile));
        let tileElement = document.getElementById(thisTile);
        let letter = storedGuess.value;

        if (storedGuess.expiry !== now) {
          localStorage.removeItem(thisTile);
          this.setCurrentRow(row);
          this.setCurrentTile(0);
          return;
        }

        this.guesses[row][tile] = letter;

        tileElement.textContent = letter;
        tileElement.setAttribute('data', letter);
        tileElement.classList.add(storedGuess.color);

        if (storedGuess.color === 'green-color') {
          this.greenLetters.push({letter: letter, position: tile});
        }

        if (storedGuess.color === 'yellow-color') {
          this.yellowLetters.push(letter);
        }
      }
      this.setCurrentRow(row + 1);
      this.setCurrentTile(0);
    }
  }



  // Add ETFs to validTickers














}
