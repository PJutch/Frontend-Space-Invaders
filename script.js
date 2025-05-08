const isKeyDown = {}

onkeydown = (e) => {
    isKeyDown[e.key] = true;
};

onkeyup = (e) => {
    isKeyDown[e.key] = false;
}

const canvas = document.querySelector('.game');
const ctx = canvas.getContext('2d');

function areColliding(firstEntity, secondEntity) {
    return (firstEntity.x <= secondEntity.x && secondEntity.x <= firstEntity.x + firstEntity.size
         || secondEntity.x <= firstEntity.x && firstEntity.x <= secondEntity.x + firstEntity.size)
        && (firstEntity.y <= secondEntity.y && secondEntity.y <= firstEntity.y + firstEntity.size
         || secondEntity.y <= firstEntity.y && firstEntity.y <= secondEntity.y + firstEntity.size);
}

class Player {
    size = 50;
    fillStyle = 'rgb(255 255 255)';

    x = canvas.width / 2 - this.size / 2;
    y = canvas.height - 100;

    speed = 2;
    xVelocity = 0;

    shotCooldownRemaining = 0;
    shotCooldown = 60;

    dead = false;
    isPlayerSide = true;
    invulnerable = false;

    respawnCooldownRemaining = 0;
    respawnCooldown = 120;

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

        for (let entity of entities) {
            if (!this.invulnerable && !entity.invulnerable
             && areColliding(this, entity) && !entity.isPlayerSide) {
                console.log('Dead');
                this.dead = true;
                entity.dead = true;
            }
        }

        if (this.respawnCooldownRemaining <= 0 || this.respawnCooldownRemaining / 10 % 2 == 0) {
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }

        if (this.respawnCooldownRemaining <= 0) {
            console.log(this.respawnCooldownRemaining);
            this.invulnerable = false;
        } else {
            --this.respawnCooldownRemaining;
        }
    }

    onDeath() {
        document.querySelector('.live:not(:has(~ .live))').remove();
        this.dead = false;
        this.invulnerable = true;
        this.respawnCooldownRemaining = this.respawnCooldown;
    }
};

class PlayerBullet {
    x;
    y;

    speed = 5;

    size = 20;
    fillStyle = 'rgb(255 255 255)';

    dead = false;
    isPlayerSide = true;
    invulnerable = false;

    constructor(x, y) {
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
    }

    update(entities) {
        this.y -= this.speed;
        if (this.y < 0) {
            this.dead = true;
        }

        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    onDeath() {}
}

let enemySpeed = 0;

class MovingDownEnemy {
    x;
    y;

    size = 50;
    fillStyle = 'rgb(255, 0, 0)';

    dead = false;
    isPlayerSide = false;
    invulnerable = false;

    constructor(x, y) {
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
    }

    update(entities) {
        this.y += enemySpeed;
        if (this.y > canvas.height) {
            this.dead = true;
        }

        for (let entity of entities) {
            if (!entity.invulnerable
             && areColliding(this, entity) && entity.isPlayerSide) {
                this.dead = true;
                entity.dead = true;
            }
        }

        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    onDeath() {}
}

const player = new Player();
let entities = [player, new MovingDownEnemy(canvas.width / 2, 30)];

function drawFrame() {
    ctx.fillStyle = 'rgb(0 0 127)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let entity of entities) {
        entity.update(entities);
    }

    for (let entity of entities) {
        if (entity.dead) {
            entity.onDeath();
        }
    }
    entities = entities.filter((entity) => !entity.dead);

    enemySpeed += 0.001;

    requestAnimationFrame(drawFrame);
}

drawFrame();
