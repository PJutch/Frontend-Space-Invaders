const isKeyDown = {}

onkeydown = (e) => {
    isKeyDown[e.key] = true;
};

onkeyup = (e) => {
    isKeyDown[e.key] = false;
}

const canvas = document.querySelector(".game");
const ctx = canvas.getContext("2d");

class Entity {
    x;
    y;
    size;
    fillStyle;

    constructor(x, y, size, fillStyle) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.fillStyle = fillStyle;
    }
};

const entities = [new Entity(canvas.width / 2, canvas.height - 150, 50, "rgb(255 255 255)")];
const player = entities[0];

const playerSpeed = 2;
let playerVelocity = 0;

function drawFrame() {
    ctx.fillStyle = "rgb(0 0 127)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (entity of entities) {
        ctx.fillStyle = entity.fillStyle;
        ctx.fillRect(entity.x, entity.y, entity.size, entity.size);
    }

    if (isKeyDown['d'] && !isKeyDown['a']) {
        playerVelocity = playerSpeed;       
    } else if (isKeyDown['a'] && !isKeyDown['d']) {
        playerVelocity = -playerSpeed;
    } else if (!isKeyDown['d'] && !isKeyDown['a']) {
        playerVelocity = 0;
    }

    player.x += playerVelocity;
    if (player.x > canvas.width - player.size) {
        player.x = canvas.width - player.size;
    }
    if (player.x < 0) {
        player.x = 0;
    }

    if (isKeyDown['w']) {
        console.log('Pew-pew');
    }

    requestAnimationFrame(drawFrame);
}

drawFrame();
