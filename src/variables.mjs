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
const darkStyle = ":root { --fontColor: rgba(255, 255, 255, 1); --oppositeFont: rgba(0, 0 ,0, 1); --colorBG: rgba(0, 0 ,0, 1); --oppositeBG: rgba(255, 255, 255, 1); --secondFontColor: rgba(136, 132, 132, 1); --offsetColorBG: rgba(20, 20, 20, 1); --tileBorder: 2px solid rgba(60, 60 ,60, 0.6); --tileOnRowBorder: 2px solid rgba(83, 83, 91, 0.75); --settingsLineColor: rgba(60, 60, 60, 0.5); --chartBarColor: rgba(70, 70, 70, 0.8); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: rgba(88, 140, 76, 1); --yellowBG: rgba(184, 155, 60, 1); --switchDisabledGreen: rgba(39, 64, 34, 1); --switchDisabledKnob: rgba(161, 161, 161, 1); --darkGreyBG: rgba(64, 60, 60, 1); --lightGreyBG: rgba(136, 132, 132, 1); --shadowGrey: rgba(0, 0, 0, 0); --opaqueBG: rgba(0, 0, 0, 0.5); --uncheckedKey: rgba(255, 255, 255, 1); --checkedKey: rgba(255, 255, 255, 1); --white: rgba(255, 255, 255, 1); --black: rgba(0, 0 ,0, 1); }";

// Dark Theme with contrast
const darkContrastStyle = ":root { --fontColor: rgba(255, 255, 255, 1); --oppositeFont: rgba(0, 0 ,0, 1); --colorBG: rgba(0, 0 ,0, 1); --oppositeBG: rgba(255, 255, 255, 1); --secondFontColor: rgba(136, 132, 132, 1); --offsetColorBG: rgba(20, 20, 20, 1); --tileBorder: 2px solid rgba(60, 60 ,60, 0.6); --tileOnRowBorder: 2px solid rgba(83, 83, 91, 0.75); --settingsLineColor: rgba(60, 60, 60, 0.5); --chartBarColor: rgba(70, 70, 70, 0.8); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: rgba(136, 196, 252, 1); --yellowBG: rgba(248, 124, 60, 1); --switchDisabledGreen: rgba(101, 149, 194, 1); --switchDisabledKnob: rgba(161, 161, 161, 1); --darkGreyBG: rgba(64, 60, 60, 1); --lightGreyBG: rgba(136, 132, 132, 1); --shadowGrey: rgba(0, 0, 0, 0); --opaqueBG: rgba(0, 0, 0, 0.5); --uncheckedKey: rgba(255, 255, 255, 1); --checkedKey: rgba(255, 255, 255, 1); --white: rgba(255, 255, 255, 1); --black: rgba(0, 0 ,0, 1); }";

// Light Theme without contrast
const lightStyle = ":root { --fontColor: rgba(0, 0 ,0, 1); --oppositeFont: rgba(255, 255, 255, 1); --colorBG: rgba(255, 255, 255, 1); --oppositeBG: rgba(0, 0 ,0, 1); --secondFontColor: rgba(136, 132, 132, 1); --offsetColorBG: rgba(255, 255, 255, 1); --tileBorder: 2px solid rgba(83, 83, 91, 0.3); --tileOnRowBorder: 2px solid rgba(83, 83, 91, 0.75); --settingsLineColor: rgba(60, 60, 60, 0.5); --chartBarColor: rgba(70, 70, 70, 0.8); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: rgba(88, 140, 76, 1); --yellowBG: rgba(184, 155, 60, 1); --switchDisabledGreen: rgba(39, 64, 34, 1); --switchDisabledKnob: rgba(161, 161, 161, 1); --darkGreyBG: rgba(64, 60, 60, 1); --lightGreyBG: rgba(216, 212, 220, 1); --shadowGrey: rgba(200, 200, 200, 0.4); --opaqueBG: rgba(255, 255, 255, 0.5); --uncheckedKey: rgba(0, 0 ,0, 1); --checkedKey: rgba(255, 255, 255, 1); --white: rgba(255, 255, 255, 1); --black: rgba(0, 0 ,0, 1); } ";

// Light Theme with contrast
const lightContrastStyle = ":root { --fontColor: rgba(0, 0 ,0, 1); --oppositeFont: rgba(255, 255, 255, 1); --colorBG: rgba(255, 255, 255, 1); --oppositeBG: rgba(0, 0 ,0, 1); --secondFontColor: rgba(136, 132, 132, 1); --offsetColorBG: rgba(255, 255, 255, 1); --tileBorder: 2px solid rgba(83, 83, 91, 0.3); --tileOnRowBorder: 2px solid rgba(83, 83, 91, 0.75); --settingsLineColor: rgba(60, 60, 60, 0.5); --chartBarColor: rgba(70, 70, 70, 0.8); --invisibleBG: rgba(0, 0 ,0, 0.0); --greenBG: rgba(136, 196, 252, 1); --yellowBG: rgba(248, 124, 60, 1); --switchDisabledGreen: rgba(101, 149, 194, 1); --switchDisabledKnob: rgba(161, 161, 161, 1); --darkGreyBG: rgba(64, 60, 60, 1); --lightGreyBG: rgba(216, 212, 220, 1); --shadowGrey: rgba(200, 200, 200, 0.4); --opaqueBG: rgba(255, 255, 255, 0.5); --uncheckedKey: rgba(0, 0 ,0, 1); --checkedKey: rgba(255, 255, 255, 1); --white: rgba(255, 255, 255, 1); --black: rgba(0, 0 ,0, 1); } ";
