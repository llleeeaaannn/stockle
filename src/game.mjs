import './style.css';
import Day from './day.mjs';
import Storage from './storage.mjs';
import { keysArray, validLetters, colorKeys, darkStyle, darkContrastStyle, lightStyle, lightContrastStyle } from './variables.mjs';
import { validAnswers, validTickers } from './tickers.mjs';

export default class Game {

  constructor() {
    this.day = this.wordleNumber();
    this.wordle = validAnswers[this.day];
    this.l = this.wordle.length;
    this.guesses = this.makeGuessesArray(this.l)
    this.gameWon = false;
    this.gameOver = false;
    this.hardMode = false;
    this.darkTheme = true;
    this.contrastTheme = false;
    this.currentRow = 0;
    this.currentTile = 0;
    this.greenLetters = [];
    this.yellowLetters = [];
    this.missingGreenLetter = [];
    this.missingYellowLetter = [];
    this.emojiCopyPaste = "";
  }

  play() {
    this.createUI();
    this.addListeners();
    this.loadLocalStorage();
    this.afterLoad();
  }

  // On page load, do the following to set create UI
  createUI() {
    this.makeRows();
    this.makeTiles();
    this.makeKeyboardRows();
    this.makeKeyboardKeys();
    this.makePopUp();
    this.displayCountdown();
    this.populateWordleNumber()
  }

  // On page load, do the following to set event listeners
  addListeners() {
    this.keyPressListener();
    this.scoreboardButtonListener();
    this.scoreboardCloseListener();
    this.shareButtonListener();
    this.settingsButtonListener();
    this.switchHardModeListener();
    this.lightDarkThemeListener();
    this.contrastThemeListener();
    this.disabledCheckboxListener();
  }

  // On page load, do the following to set variables as those stored locally
  loadLocalStorage() {
    this.getStoredGameWon();
    this.getStoredGameOver();
    this.getStoredHardMode();
    this.getStoredDarkTheme();
    this.getStoredContrastTheme();
    this.getStoredCurrentRow();
    this.getStoredCurrentTile();
    this.getStoredLastWinRow();
    this.verifyStoredGuess();
  }

  // On page load, do the following to the UI
  afterLoad() {
    this.disableHardModeCheckbox();
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
      for (let x = 0; x < this.l; x++) {
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
        let addKey = document.createElement('div');
        let letter = document.createElement('span');
        letter.textContent = key;
        addKey.appendChild(letter);
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

  // Function to create guesses array
  makeGuessesArray(length) {
    let array = [];
    for (let i = 0; i < 6; i++) {
      array.push(Array(length).fill(''))
    }
    return array;
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
    if (currentRow < 6 && currentTile < this.l) {
      this.guesses[currentRow][currentTile] = letter;
      this.renderTile(letter, currentRow, currentTile)
      this.addToCurrentTile();
    }
  }

  // Function to remove a letter from the previous tile
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

    if (currentTile < this.l) {
      this.shake();
      this.setPopUpMessage('Not enough letters');
      this.togglePopUp();
      return;
    }

    if (!(validTickers.includes(currentGuess)) && currentGuess !== this.wordle) {
      this.shake();
      this.setPopUpMessage('Not a ticker ');
      this.togglePopUp();
      return;
    }

    if (currentGuess === this.wordle) {
      this.setGameWon(true);
      this.setGameOver(true);
      this.disableHardModeCheckbox();
      this.updateStatsOnWin();
      this.setPopUpMessage('HUZZAH');
      this.colorTiles();
      this.jump();
      this.saveGuess();
      this.copyResults();
      this.storeLastWinRow();
      setTimeout(() => {
        this.togglePopUp()
      }, 3500)
      setTimeout(() => {
        this.toggleAndLoadScoreboard();
      }, 4600)
      return;
    }

    if (currentTile === this.l && currentRow > 4) {
      this.setGameOver(true);
      this.disableHardModeCheckbox();
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
      this.disableHardModeCheckbox();
    }
  }

  // CheckGuess for Hard Mode
  checkGuessHard() {
    let currentRow = this.currentRow;
    let currentTile = this.currentTile;
    let currentGuess = this.guesses[currentRow].join('').toUpperCase();

    if (currentTile < this.l) {
      this.shake();
      this.setPopUpMessage('Not enough letters');
      this.togglePopUp();
      return;
    }

    if (!(validTickers.includes(currentGuess)) && currentGuess !== this.wordle) {
      this.shake();
      this.setPopUpMessage('Not a ticker ');
      this.togglePopUp();
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
      this.disableHardModeCheckbox();
      this.updateStatsOnWin();
      this.setPopUpMessage('HUZZAH');
      this.colorTiles();
      this.jump();
      this.saveGuess();
      this.copyResults();
      this.storeLastWinRow();
      setTimeout( () => {
        this.togglePopUp()
      }, 3500)
      setTimeout(() => {
        this.toggleAndLoadScoreboard();
      }, 4600)
      return;
    }

    if (currentTile === this.l && currentRow > 4) {
      this.setGameOver(true);
      this.disableHardModeCheckbox();
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
      this.disableHardModeCheckbox();
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
    if (this.l <= 0) return;
    setTimeout(() => {
      jumpArg(0, currentRow);
    }, 2000)

    if (this.l <= 1) return;
    setTimeout(() => {
      jumpArg(1, currentRow);
    }, 2300)

    if (this.l <= 2) return;
    setTimeout(() => {
      jumpArg(2, currentRow);
    }, 2600)

    if (this.l <= 3) return;
    setTimeout(() => {
      jumpArg(3, currentRow);
    }, 2900)

    if (this.l <= 4) return;
    setTimeout(() => {
      jumpArg(4, currentRow);
    }, 3200)

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

  // Function to make the row won on green in stats bar chart. Its winRow is either passed in from localStorage upon page load or is currentRow upon win
  makeWinRowGreen(winRow = this.currentRow) {
    for (let i = 1; i < 7; i++) {
      let bar = document.getElementById(`bar-chart-` + i);
      bar.classList.remove('green-bar');
    }
    let bar = document.getElementById(`bar-chart-${winRow + 1}`);
    bar.classList.add('green-bar');
  }

  // Function to store the row that the game was won on in localStorage
  storeLastWinRow() {
    let storedLastWinRow = {
      value: this.currentRow,
      expiry: this.getNowZeroTime()
    }
    localStorage.setItem('LastWinRow', JSON.stringify(storedLastWinRow));
  }

  // Function to get lastWinRow stored value upon page load if it isnt expired and call makeWinRowGreen
  getStoredLastWinRow() {
    let now = this.getNowZeroTime();
    let storedLastWinRow = JSON.parse(localStorage.getItem('LastWinRow'));
    if (storedLastWinRow === null) return;
    if (storedLastWinRow.expiry !== now) return;
    let winRow = Number(storedLastWinRow.value);
    this.makeWinRowGreen(winRow)
  }

  // Function to update stats upon win
  updateStatsOnWin() {
    this.addToWordlesCount();
    this.addToWinsCount();
    this.addToStreakCount();
    this.updateMaxStreak();
    this.trackWinRowStats();
    this.makeWinRowGreen();
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
    let scoreboard = document.getElementById('scoreboard');
    let clockShareContainer = document.getElementById('clock-share-container');
    scoreboard.classList.remove('scoreboard-hide');
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

  // Function to set listener for closing scoreboard
  scoreboardCloseListener() {
    let scoreboard = document.getElementById('scoreboard');
    let scoreboardContainer = document.getElementById('scoreboard-container');
    let scoreboardCloseButton = document.getElementById('close-scoreboard-button');
    scoreboard.addEventListener('click', function(e) {
      if (scoreboardCloseButton.contains(e.target) || !(scoreboardContainer.contains(e.target))) {
        scoreboard.classList.add('scoreboard-hide');
      }
    })
  }

  // Function to set event listener for share button allowing wordle to be copied to clipboard
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
    let settingsClose = document.getElementById('close-settings-button');
    let settingsContainer = document.getElementById('settings-container');
    let settingsInnerContainer = document.getElementById('settings-inner-container');

    settingsButton.addEventListener('click', () => {
      settingsContainer.classList.remove('settings-hide');
    })

    settingsContainer.addEventListener('click', function(e) {
      if (settingsClose.contains(e.target) || !(settingsInnerContainer.contains(e.target))) {
        settingsContainer.classList.add('settings-hide');
      }
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
    if (isNaN(winPercentage)) winPercentage = 0;
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

    let barChartLengths = barCharts.map(bar => Math.floor(bar / maxBar * 100));

    for (let i = 0; i < 6; i++) {
      let bar = document.getElementById(`bar-chart-${i + 1}`);
      bar.classList.remove('zero');
      bar.innerHTML = `<p>${barCharts[i]}</p>`;
      if (barCharts[i] === 0) {
        bar.classList.add('zero');
        bar.style.width = '';
      } else {
        bar.style.width = `${barChartLengths[i]}%`;
      }
    }
  }

  // Function to create countdown clock for scoreboard
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
      countdown.innerHTML = `<h5>NEXT STOCKLE</h5><span> ${hours.slice(-2)} : ${minutes.slice(-2)} : ${seconds.slice(-2)}`;
    }
  }

  // Function to update and display the countdown every second
  displayCountdown() {
    let that = this;
    setInterval(function() { that.makeCountdown() }, 1000);
  }

  // Code to populate wordle number at bottom right of settings
  populateWordleNumber() {
    let wordleNumberParagraph = document.getElementById('wordle-number');
    wordleNumberParagraph.textContent = `#${this.wordleNumber()}`;
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

  // Code to change to and from Hard Mode when switch is clicked
  switchHardModeListener() {
    let hardModeCheckbox = document.getElementById('hard-mode-checkbox');
    hardModeCheckbox.addEventListener('click', () => {
      hardModeCheckbox.checked === true ? this.hardMode = true : this.hardMode = false;
      this.storeHardMode();
    });
  }

  // Function to disable Hard Mode checkbox
  disableHardModeCheckbox() {
    let hardModeCheckbox = document.getElementById('hard-mode-checkbox');
    if (this.gameOver || this.currentRow === 0) {
      hardModeCheckbox.disabled = false;
    } else {
      hardModeCheckbox.disabled = true;
    }
  }

  // Function to set and trigger pop up message of hard mode switch is clicked while disabled (during game)
  disabledCheckboxListener() {
    let that = this;
    let hardModeSwitch = document.getElementById('hard-mode-switch');
    let hardModeCheckbox = document.getElementById('hard-mode-checkbox');
    hardModeSwitch.addEventListener('click', function(e) {
      if (hardModeCheckbox.disabled) {
        hardModeCheckbox.checked ? that.setPopUpMessage('Hard mode can only be disabled at the start of a round') : that.setPopUpMessage('Hard mode can only be enabled at the start of a round');
        that.togglePopUpLong();
      }
    })
  }

  // Code to store hardMode value in localStorage
  storeHardMode() {
    this.hardMode ? localStorage.setItem('HardMode', true) : localStorage.setItem('HardMode', false);
  }


  // Function to get stored Darktheme, apply it and set checkbox to match it
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

  // Function to get stored contrastTheme, apply it and set checkbox to match it
  getStoredContrastTheme() {
    let contrast = localStorage.getItem('contrast');
    if (contrast === null) return;
    this.contrastTheme = (contrast === 'true');
    this.contrastTheme ? this.addContrast() : this.removeContrast();
    this.checkContrastCheckbox();
  }

  // Function to set contrast checkbox
  checkContrastCheckbox() {
    let contrastThemeCheckbox = document.getElementById('contrast-theme-checkbox');
    contrastThemeCheckbox.checked = this.contrastTheme;
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

  // Code to change set contrastTheme and change theme when switch is clicked
  contrastThemeListener() {
    let that = this;
    let contrastThemeSwitch = document.getElementById('contrast-switch');
    let contrastThemeCheckbox = document.getElementById('contrast-theme-checkbox');
    contrastThemeSwitch.addEventListener('click', () => {
      if (contrastThemeCheckbox.checked) {
        that.setContrastTheme(true);
        that.addContrast();
      } else {
        that.setContrastTheme(false);
        that.removeContrast();
      }
    })
  }

  // Function to set and store darkTheme
  setDarkTheme(value) {
    this.darkTheme = value;
    localStorage.setItem('theme', value)
  }

  // Function to set and store contrastTheme
  setContrastTheme(value) {
    this.contrastTheme = value;
    localStorage.setItem('contrast', value)
  }

  // Function to apply dark theme
  makeDark() {
    let stylesheet = document.getElementById('rootStylesheet');
    if (this.contrastTheme) {
      stylesheet.textContent = darkContrastStyle;
    } else {
      stylesheet.textContent = darkStyle;
    }
  }

  // Function to apply light theme
  makeLight() {
    let stylesheet = document.getElementById('rootStylesheet');
    if (this.contrastTheme) {
      stylesheet.textContent = lightContrastStyle;
    } else {
      stylesheet.textContent = lightStyle;
    }
  }

  // Function to apply contrast theme
  addContrast() {
    let stylesheet = document.getElementById('rootStylesheet');
    if (this.darkTheme) {
      stylesheet.textContent = darkContrastStyle;
    } else {
      stylesheet.textContent = lightContrastStyle;
    }
  }

  // Function to apply contrast theme
  removeContrast() {
    let stylesheet = document.getElementById('rootStylesheet');
    if (this.darkTheme) {
      stylesheet.textContent = darkStyle;
    } else {
      stylesheet.textContent = lightStyle;
    }
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

  // Populate tiles and rows with stored guesses and color keys upon page load
  verifyStoredGuess() {
    let now = this.getNowZeroTime();
    for (let row = 0; row < 6; row++) {
      for (let tile = 0; tile < this.l; tile++) {
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

        let key = document.getElementById(letter);

        if (storedGuess.color === 'green-color') {
          this.greenLetters.push({letter: letter, position: tile});
          key.className = 'green-color-key';
        }

        if (storedGuess.color === 'yellow-color') {
          this.yellowLetters.push(letter);
          if (!(key.className === 'green-color-key')) {
            key.className = 'yellow-color-key';
          }
        }

        if (!(key.className === 'green-color-key') && !(key.className === 'yellow-color-key')) {
          key.className = 'darkgrey-color-key';
        }
      }
      this.setCurrentRow(row + 1);
      this.setCurrentTile(0);
    }
  }

  // STAND ALONE FUNCTIONS

  // Code to define which day it is
  wordleNumber() {
    let today = new Date();
    let milliSince1970 = today.getTime();
    let milliPerDay = 86400000;
    let daysSince1970 = Math.floor(milliSince1970/milliPerDay);
    let dailyDate = daysSince1970 - 19240 + 0;
    return dailyDate;
  }

  // Function to return the getTime of today at 00:00:00
  getNowZeroTime() {
    let now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0, 0);
    return now.getTime();
  }

}
