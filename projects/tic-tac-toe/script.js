const grid = [
  null, null, null,
  null, null, null,
  null, null, null
];
const gridDOM = [];

const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let player = 'X'
let startingPlayer = 'X';
let isBot = true;
let botMode = 1;
let isGameOver = false;
const container = document.getElementById('container');

const checkWin = (grid, player) => winningPatterns.some( pattern => pattern.every( index => grid[index] === player ) );

const getWinningIndices = (grid, player) => winningPatterns.filter( pattern => pattern.every( index => grid[index] === player ) );

const getWInningCell = (player) => grid.findIndex( (element, index, array) => {
    if (element) return false;
    array[index] = player;
    const hasWon = checkWin(array, player);
    array[index] = null;
    return hasWon;
})

const isBoardFull = board => board.every(Boolean);

const togglePlayer = ↀ => player = player === 'X' ? 'O'
                                                   : 'X';

const setWin = (cells) => {
    isGameOver = true;
    cells.forEach( i => gridDOM[i].classList.add(`${player}-win`) );
}

function setCell(index) {

    if (isGameOver)  return (console.log('game over'));
    if (grid[index]) return (console.log('cell taken'));

    grid[index] = player;
    gridDOM[index].classList.add(player);

    const winningIndices = getWinningIndices(grid, player);
    if (winningIndices.length) return setWin(winningIndices.flat());

    if (isBoardFull(grid)) return (console.log('grid full'))

    togglePlayer();

    if (isBot && player === 'O') setBotCell();
}

function setBotCell() {
        switch (botMode) {
            case 1: setCell( getRandomCell() )        ; break;
            case 2: setCell( centerThenCorners() )    ; break;
            case 3: setCell( minimax(grid, 0, true) ) ; break;
        }
}

(function createGrid(gridDOM, container) {

    for ( let i=0 ; i < 9 ; i++) {
        const cell = document.createElement('button');
        cell.addEventListener('click', ↀ => setCell(i));
        gridDOM.push(cell);
        container.appendChild(cell);
    }
}(gridDOM, container));


function getRandomCell() {
    const randomCell = Math.floor(Math.random() * 9);
    return grid[randomCell] ? getRandomCell() : randomCell;
}

/**
 * @returns {number} empty cell index
 * @description return an empty cell index in this order:
 * - center cell
 * - winning cell
 * - opponent winning cell
 * - corner
 * - random side
 */
function centerThenCorners() {
 // center
    if ( !grid[4] ) return 4

 // winning cell
    const O_winningCell = getWInningCell('O');
    if (O_winningCell > -1) return O_winningCell;

 // opponent winning cell
    const X_winningCell = getWInningCell('X');
    if (X_winningCell > -1) return X_winningCell;

 // corner
    for (const index of [0, 2, 6, 8]) {
        if ( !grid[index] ) return index;
    }

 // random side
    return getRandomCell();
}

function minimax(grid, depth, isMaximizing) {
    if (checkWin(grid, 'X')) return -1;
    if (checkWin(grid, 'O')) return  1;
    if (grid.every(Boolean)) return  0;

    let moveIndex = null;
    let score = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < 9; i++) {

        if ( grid[i] ) continue;

        grid[i] = isMaximizing ? 'O': 'X';
        const nextScore = Math[isMaximizing ? 'max': 'min']( score, minimax(grid, depth + 1, !isMaximizing) );

        if (nextScore !==  score) [moveIndex, score] =
                                  [i,     nextScore] ;
        grid[i] = null;
    }

    return depth === 0 ? moveIndex
                       : score;
}

function restart() {
    isGameOver = false;
    player = startingPlayer;
    grid.fill(null);
    gridDOM.forEach( cell => cell.classList = [] );
    if (player ==='O' && isBot) setBotCell();
}

// Restart if `r` key is pressed
document.addEventListener('keydown', ({ key }) => key === 'r' &&  restart());

document.querySelector('#btn-restart').addEventListener('click', restart);

document.querySelector('#bot-on').addEventListener('change',  _ => isBot = true);
document.querySelector('#bot-off').addEventListener('change', _ => isBot = false);

document.querySelector('#startingPlayerX').addEventListener('change', _ => startingPlayer = 'X');
document.querySelector('#startingPlayerO').addEventListener('change', _ => startingPlayer = 'O');

document.querySelector('#easy').addEventListener('change',   _ => botMode = 1);
document.querySelector('#medium').addEventListener('change', _ => botMode = 2);
document.querySelector('#hard').addEventListener('change',   _ => botMode = 3);