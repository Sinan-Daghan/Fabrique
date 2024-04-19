const keyboard = document.getElementById('keyboard');
const screen = document.getElementById('screen');
// An even shorter version of the code above:
// const [ keyboard ,  screen ] = ['keyboard', 'screen'].map(id => document.getElementById(id));

[
     1 , 2,  3 , '+',
     4 , 5,  6 , '-',
     7 , 8,  9 , '*',
    '=', 0,'CE', '/',

].forEach(key =>
    keyboard.appendChild(Object.assign(document.createElement('button'), {
        textContent: key,

        // This function short circuit if the last character of the screen and the key pressed are both not numbers
        // if 'CE' is pressed, it clears the screen
        // if '=' is pressed, it prints to the screen the evaluation of its content
        // else it appends the pressed key to the screen, and if the key is not a number, it surrounds it with spaces
        onclick: () => (isNaN(key) && isNaN(screen.textContent.slice(-2))) || (screen.textContent = key === 'CE'  ?  '' :
                                                                                                    key ===  '='  ?  eval(screen.textContent)
                                                                                                                  :  screen.textContent + (isNaN(key) ? ` ${key} ` : key))},
        // An even shorter version of the first line above could be:
        // onclick: () => [key, screen.textContent.slice(-2)].every(isNaN) || (screen.textContent = key === 'CE'  ?  '' :
    ))
);