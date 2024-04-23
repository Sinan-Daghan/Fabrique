const [ playerMoves,  botMoves, [infoBar], [restartBtn]] =
      ['playerMove', 'botMove', 'infoBar', 'restartBtn'].map(i => document.querySelectorAll(`.${i}`));

/** The code above is equivalent to the following:
 *
 * const playerMoves = document.querySelectorAll('.playerMove');
 * const botMoves = document.querySelectorAll('.botMove');
 * const infoBar = document.querySelector('.infoBar');
 * const restartBtn = document.querySelector('.restartBtn');
 */

let isGameOver = false;

/**
 * @param {HTMLElement} icon
 * @param {Number} offsetDirection
 * @description Move the icon close to the center of the screen
 */
function move(icon, offsetDirection=1) {
    const rect = icon.getBoundingClientRect();
    icon.style.transform = `translate(
        ${ (window.innerWidth  / 2) - (rect.width  / 2) - rect.x - ( offsetDirection * rect.width) }px,
        ${ (window.innerHeight / 2) - (rect.height / 2) - rect.y }px
    )`;
}

function restart() {
    [...playerMoves, ...botMoves].forEach( icon => icon.style.transform = '');

    infoBar.textContent = '';
    isGameOver = false;
    restartBtn.disabled = true;
    restartBtn.style.opacity = 0;
}
restartBtn.addEventListener('click', restart);

// Add event an listener to each player move
playerMoves.forEach( (icon, playerIndex) => icon.addEventListener('click', () => {
    if (isGameOver) return;

    const botIndex = Math.round(Math.random() * 2);

    move(botMoves[botIndex], -1);
    move(playerMoves[playerIndex] );

    infoBar.textContent = playerIndex === botIndex ? 'Draw' :
                playerIndex === (botIndex + 1) % 3 ? 'You win'
                                                   : 'You loose';
    isGameOver = true;
    restartBtn.disabled = false;
    restartBtn.style.opacity = 1;
}));

// Restart if space key is pressed and game is over
document.addEventListener('keydown', ({ key }) => key === ' ' && isGameOver && restart());