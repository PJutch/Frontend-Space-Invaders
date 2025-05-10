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
export const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

export const width = canvas.width;
export const height = canvas.height;

// Lives

let lives = 3;

export function removeLife() {
    --lives;
    if (lives <= 0) {
        gameover();
    }
}

export function adjustLifes() {
    while (document.getElementsByClassName('live').length > lives) {
        document.querySelector('.live:not(:has(~ .live))').remove();
    }
    while (document.getElementsByClassName('live').length < lives) {
        let newLiveIndicator = new HTMLDivElement();
        newLiveIndicator.classList.add('live');
        document.querySelector('.lives').appendChild(newLiveIndicator);
    }
}

// Gameover

let isGameover = false;

export function gameover() {
    if (!isGameover) {
        window.location.href = 'gameover.html';
    }
    isGameover = true;
}
