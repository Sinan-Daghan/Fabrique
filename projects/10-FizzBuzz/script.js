function createTextDiv(iteration, interationColor, text) {
    const div = document.createElement('div');

    const number = document.createElement('p');
    number.innerText = iteration;
    number.style.color = interationColor;

    const paragraph = document.createElement('p');
    paragraph.innerText = text;

    div.appendChild(number);
    div.appendChild(paragraph);

    document.body.appendChild(div);
}

const iterations = 100;

for (let i=1 ; i <= iterations ; i++) {

    const text = (i % 3 === 0 && i % 5 === 0) ? 'FizzBuzz': // If i is divisible by 3 and 5
                                (i % 3 === 0) ? 'Fizz':     // If i is divisible by 3
                                (i % 5 === 0) ? 'Buzz'      // If i is divisible by 5
                                              : '';         // Else empty string

    createTextDiv(i, `hsl(${360 / iterations * i}deg, 100%, 50%)`, text);
}

// An illegal solution to perform the same as above on a single line:
// for (let i=0;i<100;i++,document.body.innerHTML += `<div><p style="color: hsl(${3.6*i} 100% 50%)">${i}</p><p>${ i%3 == 0 ? 'Fizz':''}${i%5 == 0 ? 'Buzz':''}</p></div>`);