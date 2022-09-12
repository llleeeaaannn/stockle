import './style.css';
import Game from './game.mjs';

const oppositeOrientation = screen.orientation.type.startsWith('portrait') ? 'portrait' : 'landscape';
console.log(oppositeOrientation);
screen.orientation.lock(oppositeOrientation);

const game = new Game();
game.play();
