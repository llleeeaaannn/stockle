export { keysArray, validLetters, colorKeys, darkStyle, darkContrastStyle, lightStyle, lightContrastStyle }

// Array of all keys necessary for each row of the keyboard
const keysArray = [
  [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P'
],
  [
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L'
],
  [
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'BACK'
]
]

// Code to allow physical keyboard to work

let validLetters = [
'Q',
'W',
'E',
'R',
'T',
'Y',
'U',
'I',
'O',
'P',
'A',
'S',
'D',
'F',
'G',
'H',
'J',
'K',
'L',
'Z',
'X',
'C',
'V',
'B',
'N',
'M',
]

// Code to color each key on the virtual keyboard the necessary color (dark grey, yellow or green)
let colorKeys = [
  {letter : 'U'},
  {letter : 'I'},
  {letter : 'O'},
  {letter : 'P'},
  {letter : 'Q'},
  {letter : 'W'},
  {letter : 'E'},
  {letter : 'R'},
  {letter : 'T'},
  {letter : 'Y'},
  {letter : 'A'},
  {letter : 'S'},
  {letter : 'D'},
  {letter : 'F'},
  {letter : 'G'},
  {letter : 'H'},
  {letter : 'J'},
  {letter : 'K'},
  {letter : 'L'},
  {letter : 'Z'},
  {letter : 'X'},
  {letter : 'C'},
  {letter : 'V'},
  {letter : 'B'},
  {letter : 'N'},
  {letter : 'M'}
]

// Dark Theme without contrast
const darkStyle = ":root { --fontColor: #fff; --oppositeFont: #000; --colorBG: #000; --oppositeBG: #fff; --secondFontColor: #888484; --offsetColorBG: #141414; --tileBorderColor: 2px solid rgba(60, 60 ,60, 0.6); --tileOnRowBorderColor: 2px solid rgba(83, 83, 91, 0.75); --chartBarColor: rgba(70, 70, 70, 0.8); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: #588c4c; --yellowBG: #b89c3c; --darkGreyBG: #403c3c; --lightGreyBG: #888484; --shadowGrey: rgba(0, 0, 0, 0); --opaqueBG: rgba(0, 0, 0, 0.5); --uncheckedKey: #fff; --checkedKey: #fff; --white: #fff; --black: #000;}";

// Dark Theme with contrast
const darkContrastStyle = ":root { --fontColor: #fff; --oppositeFont: #000; --colorBG: #000; --oppositeBG: #fff; --secondFontColor: #888484; --offsetColorBG: #141414; --tileBorderColor: 2px solid rgba(60, 60 ,60, 0.6); --tileOnRowBorderColor: 2px solid rgba(83, 83, 91, 0.75); --chartBarColor: rgba(70, 70, 70, 0.8); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: #88c4fc; --yellowBG: #f87c3c; --darkGreyBG: #403c3c; --lightGreyBG: #888484; --shadowGrey: rgba(0, 0, 0, 0); --opaqueBG: rgba(0, 0, 0, 0.5); --uncheckedKey: #fff; --checkedKey: #fff; --white: #fff; --black: #000;}";

// Light Theme without contrast
const lightStyle = ":root { --fontColor: #000; --oppositeFont: #fff; --colorBG: #fff; --oppositeBG: #000; --secondFontColor: #888484; --offsetColorBG: #fff; --tileBorderColor: 2px solid rgba(83, 83, 91, 0.3); --tileOnRowBorderColor: 2px solid rgba(83, 83, 91, 0.75); --chartBarColor: rgba(70, 70, 70, 0.8); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: #588c4c; --yellowBG: #b89c3c; --darkGreyBG: #403c3c; --lightGreyBG: #d8d4dc; --shadowGrey: rgba(200, 200, 200, 0.4); --opaqueBG: rgba(255, 255, 255, 0.5); --uncheckedKey: #000; --checkedKey: #fff; --white: #fff; --black: #000;}";

// Light Theme with contrast
const lightContrastStyle = ":root { --fontColor: #000; --oppositeFont: #fff; --colorBG: #fff; --oppositeBG: #000; --secondFontColor: #888484; --offsetColorBG: #fff; --tileBorderColor: 2px solid rgba(83, 83, 91, 0.3); --tileOnRowBorderColor: 2px solid rgba(83, 83, 91, 0.75); --chartBarColor: rgba(70, 70, 70, 0.8); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: #88c4fc; --yellowBG: #f87c3c; --darkGreyBG: #403c3c; --lightGreyBG: #d8d4dc; --shadowGrey: rgba(200, 200, 200, 0.4); --opaqueBG: rgba(255, 255, 255, 0.5); --uncheckedKey: #000; --checkedKey: #fff; --white: #fff; --black: #000;}";
