const isKeyDown = {}

onkeydown = (e) => {
    isKeyDown[e.key] = true;
};

onkeyup = (e) => {
    isKeyDown[e.key] = false;
}

const canvas = document.querySelector('.game');
const ctx = canvas.getContext('2d');

class Player {
    x = canvas.width / 2;
    y = canvas.height - 100;

    speed = 2;
    xVelocity = 0;

    shotCooldownRemaining = 0;
    shotCooldown = 60;

    size = 50;
    fillStyle = 'rgb(255 255 255)';

    alive = true;

    update(entities) {
        if (isKeyDown['d'] && !isKeyDown['a']) {
            this.xVelocity = this.speed;       
        } else if (isKeyDown['a'] && !isKeyDown['d']) {
            this.xVelocity = -this.speed;
        } else if (!isKeyDown['d'] && !isKeyDown['a']) {
            this.xVelocity = 0;
        }
    
        this.x += this.xVelocity;
        if (this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size;
        }
        if (this.x < 0) {
            this.x = 0;
        }
    
        if (isKeyDown['w'] && this.shotCooldownRemaining <= 0) {
            entities.push(new PlayerBullet(this.x + this.size / 2, this.y + this.size / 2));
            this.shotCooldownRemaining = this.shotCooldown;
        }
        
        if (this.shotCooldownRemaining) {
            --this.shotCooldownRemaining;
        }
    }
};

class PlayerBullet {
    x;
    y;

    speed = 5;

    size = 20;
    fillStyle = 'rgb(255 255 255)';

    alive = true;

    constructor(x, y) {
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
    }

    update() {
        this.y -= this.speed;
        if (this.y < 0) {
            this.alive = false;
        }
    }
}

const player = new Player();
let entities = [player];

function drawFrame() {
    ctx.fillStyle = 'rgb(0 0 127)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (entity of entities) {
        entity.update(entities);

        ctx.fillStyle = entity.fillStyle;
        ctx.fillRect(entity.x, entity.y, entity.size, entity.size);
    }

    entities = entities.filter((entity) => entity.alive);

    requestAnimationFrame(drawFrame);
}

drawFrame();
