const isKeyDown = {}

onkeydown = (e) => {
    isKeyDown[e.code] = true;
};

onkeyup = (e) => {
    isKeyDown[e.code] = false;
}

const canvas = document.querySelector('.game');
const ctx = canvas.getContext('2d');

function areCollidingX(firstEntity, secondEntity) {
    return firstEntity.x <= secondEntity.x && secondEntity.x < firstEntity.x + firstEntity.size
        || secondEntity.x <= firstEntity.x && firstEntity.x < secondEntity.x + firstEntity.size;
}

function areCollidingY(firstEntity, secondEntity) {
   return firstEntity.y <= secondEntity.y && secondEntity.y < firstEntity.y + firstEntity.size
       || secondEntity.y <= firstEntity.y && firstEntity.y < secondEntity.y + firstEntity.size;
}

function areColliding(firstEntity, secondEntity) {
    return areCollidingX(firstEntity, secondEntity) 
        && areCollidingY(firstEntity, secondEntity);
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
    isSolid = true;

    respawnCooldownRemaining = 0;
    respawnCooldown = 120;

    update(entities) {
        if (isKeyDown['KeyD'] && !isKeyDown['KeyA']) {
            this.xVelocity = this.speed;       
        } else if (isKeyDown['KeyA'] && !isKeyDown['KeyD']) {
            this.xVelocity = -this.speed;
        } else if (!isKeyDown['KeyD'] && !isKeyDown['KeyA']) {
            this.xVelocity = 0;
        }
    
        this.x += this.xVelocity;
        if (this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size;
        }
        if (this.x < 0) {
            this.x = 0;
        }
    
        if (isKeyDown['KeyW'] && this.shotCooldownRemaining <= 0) {
            entities.push(new Bullet(this.x + this.size / 2, this.y + this.size / 2, true));
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
            this.invulnerable = false;
        } else {
            --this.respawnCooldownRemaining;
        }
    }

    onDeath() {
        --lives;
        this.dead = false;
        this.invulnerable = true;
        this.respawnCooldownRemaining = this.respawnCooldown;
    }
};

class Bullet {
    x;
    y;

    velocity;

    size = 20;
    fillStyle = 'rgb(255 255 255)';

    dead = false;
    isPlayerSide;
    invulnerable = false;
    isSolid = false;

    constructor(x, y, isPlayerSide) {
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
        this.isPlayerSide = isPlayerSide;
        this.velocity = (this.isPlayerSide ? -1 : 1) * 5;
    }

    update(entities) {
        this.y += this.velocity;

        if (this.y < 0 || this.y > canvas.height) {
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
    isSolid = true;

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

class ShootingDownEnemy {
    x;
    y;

    size = 50;
    fillStyle = 'rgb(255, 0, 0)';

    dead = false;
    isPlayerSide = false;
    invulnerable = false;
    isSolid = true;

    shotCooldown = 180;
    shotCooldownRemaining = this.shotCooldown / 2;

    constructor(x, y) {
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
    }

    update(entities) {
        this.y += enemySpeed;
        if (this.y > canvas.height) {
            this.dead = true;
        }

        let canShoot = true;
        for (let entity of entities) {
            if (!entity.invulnerable
             && areColliding(this, entity) && entity.isPlayerSide) {
                this.dead = true;
                entity.dead = true;
            }

            if (entity != this && entity.y > this.y && areCollidingX(this, entity) 
             && entity.isSolid && !entity.isPlayerSide) {
                canShoot = false;
            }
        }

        if (canShoot) {
            if (this.shotCooldownRemaining <= 0) {
                this.shotCooldownRemaining = this.shotCooldown;
                entities.push(new Bullet(
                    this.x + this.size / 2, 
                    this.y + this.size / 2, 
                    false))
            } else {
                this.shotCooldownRemaining -= enemySpeed;
            }
        }

        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    onDeath() {}
}

let lives = 3;

const player = new Player();
let entities = [player, new ShootingDownEnemy(canvas.width / 2, 100), new MovingDownEnemy(canvas.width / 2, 30)];

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

    while (document.getElementsByClassName('live').length > lives) {
        document.querySelector('.live:not(:has(~ .live))').remove();
    }
    while (document.getElementsByClassName('live').length < lives) {
        let newLiveIndicator = new HTMLDivElement();
        newLiveIndicator.classList.add('live')
        document.querySelector('.lives').appendChild(newLiveIndicator);
    }

    if (lives <= 0) {
        lives = 3; // prevent trying to change location multiple times
        window.location = 'gameover.html';
    }

    enemySpeed += 0.001;

    requestAnimationFrame(drawFrame);
}

drawFrame();
