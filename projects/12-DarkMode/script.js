let texts = 0;
let isDarkMode = false;

setInterval( () => {
    const text = document.createElement('p');
    text.innerText = 'Test';
    Object.assign(text.style,
        {
            left: `${Math.random() * innerWidth}px`,
            top: `${Math.random() * innerHeight}px`,
            fontSize: `${Math.random() * 5 + 1}em`
        }
    );
    document.body.appendChild(text);

    if ( texts > 5) document.querySelector('p').remove();
    else texts++;

}, 500);

const btn = document.getElementById('btn')

btn.addEventListener('click', () => {

    isDarkMode = !isDarkMode;
    btn.classList.toggle('dark');
    document.body.classList.toggle('dark');

    // Dark mode state on paragraphs can be desynchronized due to toggling the class,
    // to ensure synchronization, we can explicitly set or remove the class for each paragraph
    document.querySelectorAll('p').forEach( p => {
        if (isDarkMode) p.classList.add('dark');
        else p.classList.remove('dark');
    });
});