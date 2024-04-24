/**
 * In this project each time a frame is created, the current time is retrieved
 * then the clock hands angles are scaled according to the current time.
 * It is expensive but using an increment value for each hand and incrementing
 * in the rendering loop can easily lead to a desynchronization.
 */

const tau = 2 * Math.PI;
const halfPi = Math.PI / 2;

let msSinceMidnight = 0;
const framePerSecond = 100;
const frameTime = 1000 / framePerSecond;

let isSliderRod1 = false;
let isSliderRod2 = false;
let colorRod1 = 'white';
let colorRod2 = 'red';

const msInOne = {
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000
}

const tauOver = {
    msInOneDay: tau / msInOne.day,
    msInOneHour: tau / msInOne.hour,
    msInOneMinute: tau / msInOne.minute
}

const getMsSince = {
    day: () =>  msSinceMidnight % msInOne.day,
    hour: () =>  msSinceMidnight % msInOne.hour,
    minute: () => msSinceMidnight % msInOne.minute
}

const canvasTop = document.getElementById('canvasTop').getContext('2d');
const ctxClockFrame = document.getElementById('canvasClockFrame').getContext('2d');

const clearCanvas = (ctx) => {
    // we use this function because canvases are translated and we can't use 'clearRect' with negative values

    // save the current transformations
    ctx.save();
    // reset the canvas transformations with an identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // clear the canvas
    ctx.clearRect(0, 0, 800, 800);
    // restore the saved transformations
    ctx.restore();
}

function decreaseOpacity(ctx , fraction) {

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const data = imageData.data;
    const fractionValue = fraction * 255;
    // loop through all pixels, there are 4 values per pixel: R, G, B, A
    for (let i = 0; i < data.length; i += 4) {
        // continue if alpha is fully transparent
        if (data[i + 3] === 0) continue
        // decrease the alpha value by the fraction, the value is clamped to stay positive
        data[i + 3] = Math.max(0, data[i + 3] - fractionValue);
    }

    ctx.putImageData(imageData, 0, 0);
}

class Clock {
    loopId = null;
    prevTime = 0;

    second = {
        name: 'second',
        rod1Length: 120,
        rod2Length: 10,
        angleMultiplier: 20,
        get angle() { return tau / msInOne.minute * getMsSince.minute() },
        radius: 3,
        get color() { return `hsl(${this.angle}rad, 100%, 50%)` },
        ctx: document.getElementById('canvasSecond').getContext('2d')
    };

    minute = {
        name: 'minute',
        rod1Length: 150,
        get angle() { return tau / msInOne.hour * getMsSince.hour() },
        color: 'cornflowerblue',
        radius: 6,
        ctx: (document.getElementById('canvasMinute').getContext('2d')),
    }

    hour = {
        name: 'hour',
        rod1Length: 85,
        get angle() { return  tau / msInOne.day * getMsSince.day() },
        color: 'lightcoral',
        radius: 8,
        ctx: document.getElementById('canvasHour').getContext('2d')
    }

    hands = [this.minute, this.hour, this.second];

    constructor() {

        document.querySelectorAll('canvas').forEach( canvas => {
            const ctx = canvas.getContext('2d');
            // set the origin to the center of the canvas
            ctx.translate(400, 400);
            // rotate the canvas so that the 0 degree is at the top
            ctx.rotate(-halfPi);
        });
        this.drawClockFrame();

        this.loopId = window.requestAnimationFrame( this.loop.bind(this) );
    }

    drawClockFrame() {
        const ctx = ctxClockFrame;
        const color = 'rgba(255, 255, 255, 0.8)'
        // draw hour markers
        for(let i=0 ; i < 12; i++) {
            ctx.beginPath();
            ctx.moveTo(0, -130);
            ctx.lineTo(0, -140);
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.rotate(tau / 12);
        }
        // draw outer circle
        ctx.beginPath();
        ctx.arc(0, 0, 150, 0, tau);
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    drawCircle(x, y, radius, color, ctx = this.ctx) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, tau);
        ctx.fillStyle = color;
        ctx.fill();
    }

    drawRod(xStart, yStart, xEnd, yEnd, color) {
        canvasTop.beginPath();
        canvasTop.moveTo(xStart, yStart);
        canvasTop.lineTo(xEnd, yEnd);
        canvasTop.strokeStyle = color;
        canvasTop.stroke();
    }

    drawHand(hand) {

        const xHat = Math.cos(hand.angle);
        const yHat = Math.sin(hand.angle);

        let xRod1 = hand.rod1Length * xHat;
        let yRod1 = hand.rod1Length * yHat;

        if ( ! hand.rod2Length ) return (this.drawCircle(xRod1, yRod1, hand.radius, hand.color, hand.ctx));

        const xRod2 = xHat * hand.rod2Length * Math.cos(hand.angle * hand.angleMultiplier);
        const yRod2 = yHat * hand.rod2Length * Math.cos(hand.angle * hand.angleMultiplier);

        this.drawCircle(xRod1 + xRod2, yRod1 + yRod2, hand.radius, hand.color, hand.ctx);

        if ( hand.name === 'second' && isSliderRod1 || isSliderRod2 ) {
            [colorRod1, colorRod2] = isSliderRod1 ? ['red', 'white'] : ['white', 'red'];
            clearCanvas(canvasTop);
            this.drawRod(0, 0, xRod1, yRod1, colorRod1);
            this.drawRod(xRod1, yRod1, xRod1 + xRod2, yRod1 + yRod2, colorRod2);
        }
    }

    loop(time) {
        const deltaTime = time - this.prevTime;
        if (deltaTime < frameTime) return window.requestAnimationFrame( this.loop.bind(this) );

        this.prevTime = time;

        clearCanvas(this.minute.ctx);
        clearCanvas(this.hour.ctx);
        decreaseOpacity(this.second.ctx, 0.01);

        const date = new Date();
        msSinceMidnight = date.getTime() - date.setHours(-1,0,0,0);

        this.hands.forEach( hand => { this.drawHand(hand) });

        window.requestAnimationFrame( this.loop.bind(this) );
    }
}
const clock = new Clock();

const sliderRod1 = document.getElementById('sliderRod1');
sliderRod1.addEventListener('input', (e) => { clock.second.rod1Length = e.target.value });
sliderRod1.addEventListener('mousedown', () => { isSliderRod1 = true });

const sliderRod2 = document.getElementById('sliderRod2');
sliderRod2.addEventListener('input', (e) => { clock.second.rod2Length = e.target.value });
sliderRod2.addEventListener('mousedown', () => { isSliderRod2 = true });

const sliderAngleMultiplier =document.getElementById('sliderAngleMultiplier');
sliderAngleMultiplier.addEventListener('input', (e) => { clock.second.angleMultiplier = e.target.value });

document.addEventListener('mouseup', () => {
    isSliderRod1 = false;
    isSliderRod2 = false;
    clearCanvas(canvasTop);
});