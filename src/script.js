import './style.css';
import Day from './day.mjs';
import Game from './game.mjs';
import Storage from './storage.mjs';
import { keysArray, validLetters, colorKeys } from './variables.mjs';
import { validAnswers, validTickers, validTickers2, validTickers3, validTickers4, validTickers5 } from './tickers.mjs';

let game = new Game();
game.play()
