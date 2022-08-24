import './style.css';
import Day from './day.mjs';
import Game from './game.mjs';
import { validTickers, validAnswers } from './tickers.mjs';
import Storage from './storage.mjs';
import { keysArray } from './variables.mjs';

let game = new Game();
game.createUI();
game.addListeners();
