// Some utils to interact with outside world

// Keyboard input

export const isKeyDown = {}

onkeydown = (e) => {
    isKeyDown[e.code] = true;
};

onkeyup = (e) => {
    isKeyDown[e.code] = false;
}

// Canvas

const canvas = document.querySelector('.game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

export const width = canvas.width;
export const height = canvas.height;

export function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}

export function drawSprite(sprite, x, y, sizeX, sizeY) {
    ctx.drawImage(sprite, x, y, sizeX, sizeY);
}

export function drawRect(fillColour, x, y, sizeX, sizeY) {
    ctx.fillStyle = fillColour;
    ctx.fillRect(x, y, sizeX, sizeY);
}

// Lives

let lives = 3;

export function removeLife() {
    --lives;
    document.querySelector('.live:not(:has(~ .live))').remove();

    if (lives <= 0) {
        gameover();
    }
}

// Gameover

let isGameover = false;

export function gameover() {
    if (!isGameover) {
        localStorage.setItem('score', Math.floor(score));
        window.location.href = 'gameover.html';
    }
    isGameover = true;
}

// Score

let score = 0;
const scoreText = document.getElementById('score');

export function addScore(value) {
    score += value;
    scoreText.textContent = Math.floor(score);
}
