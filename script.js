const isKeyDown = {}

onkeydown = (e) => {
    isKeyDown[e.code] = true;
};

onkeyup = (e) => {
    isKeyDown[e.code] = false;
}

const canvas = document.querySelector('.game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const playerSprite = document.getElementById("player");
const movingDownEnemySprite = document.getElementById("lander");
const shootingDownEnemySprite = document.getElementById("shooter");

function areCollidingX(firstEntity, secondEntity) {
    return firstEntity.x <= secondEntity.x && secondEntity.x < firstEntity.x + firstEntity.sizeX
        || secondEntity.x <= firstEntity.x && firstEntity.x < secondEntity.x + secondEntity.sizeX;
}

function areCollidingY(firstEntity, secondEntity) {
   return firstEntity.y <= secondEntity.y && secondEntity.y < firstEntity.y + firstEntity.sizeY
       || secondEntity.y <= firstEntity.y && firstEntity.y < secondEntity.y + secondEntity.sizeY;
}

function areColliding(firstEntity, secondEntity) {
    return areCollidingX(firstEntity, secondEntity) 
        && areCollidingY(firstEntity, secondEntity);
}

let isGameover = false;

function gameover() {
    if (!isGameover) {
        window.location.href = 'gameover.html';
    }
    isGameover = true;
}

class Player {
    sizeX = 48;
    sizeY = 32;
    sprite = playerSprite;

    x = canvas.width / 2 - this.sizeX / 2;
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
        if (this.x > canvas.width - this.sizeX) {
            this.x = canvas.width - this.sizeX;
        }
        if (this.x < 0) {
            this.x = 0;
        }
    
        if (isKeyDown['KeyW'] && this.shotCooldownRemaining <= 0) {
            entities.push(new Bullet(this.x + this.sizeX / 2, this.y + this.sizeY / 2, true));
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
            ctx.drawImage(this.sprite, this.x, this.y, this.sizeX, this.sizeY);
        }

        if (this.respawnCooldownRemaining <= 0) {
            this.invulnerable = false;
        } else {
            --this.respawnCooldownRemaining;
        }
    }

    onDeath() {
        --lives;
        if (lives <= 0) {
            gameover();
        }

        this.dead = false;
        this.invulnerable = true;
        this.respawnCooldownRemaining = this.respawnCooldown;
    }
};

class Bullet {
    x;
    y;

    velocity;

    sizeX = 3;
    sizeY = 15;
    fillStyle;

    dead = false;
    isPlayerSide;
    invulnerable = false;
    isSolid = false;

    constructor(x, y, isPlayerSide) {
        this.x = x - this.sizeX / 2;
        this.y = y - this.sizeY / 2;
        this.isPlayerSide = isPlayerSide;
        this.velocity = (this.isPlayerSide ? -1 : 1) * 5;
        this.fillStyle = (this.isPlayerSide ? '#639bff' : 'red')
    }

    update(entities) {
        this.y += this.velocity;

        if (this.y < 0 || this.y > canvas.height) {
            this.dead = true;
        }

        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
    }

    onDeath() {}
}

let enemySpeed = 0;

class MovingDownEnemy {
    x;
    y;

    sizeX = enemyWidth;
    sizeY = 32
    sprite = movingDownEnemySprite;

    dead = false;
    isPlayerSide = false;
    invulnerable = false;
    isSolid = true;

    constructor(x, y) {
        this.x = x - this.sizeX / 2;
        this.y = y - this.sizeY / 2;
    }

    update(entities) {
        this.y += enemySpeed;
        if (this.y > canvas.height) {
            gameover();
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
        ctx.drawImage(this.sprite, this.x, this.y, this.sizeX, this.sizeY);
    }

    onDeath() {}
}

class ShootingDownEnemy {
    x;
    y;

    sizeX = enemyWidth;
    sizeY = 28;
    sprite = shootingDownEnemySprite;

    dead = false;
    isPlayerSide = false;
    invulnerable = false;
    isSolid = true;

    shotCooldown = 180;
    shotCooldownRemaining = this.shotCooldown / 2;

    constructor(x, y) {
        this.x = x - this.sizeX / 2;
        this.y = y - this.sizeY / 2;
    }

    update(entities) {
        this.y += enemySpeed;
        if (this.y > canvas.height) {
            gameover();
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
                    this.x + this.sizeX / 2, 
                    this.y + this.sizeY / 2, 
                    false))
            } else {
                this.shotCooldownRemaining -= enemySpeed;
            }
        }

        ctx.fillStyle = this.fillStyle;
        ctx.drawImage(this.sprite, this.x, this.y, this.sizeX, this.sizeY);
    }

    onDeath() {}
}

let lives = 3;

const player = new Player();
let entities = [player];

function areThereEnemies() {
    for (let entity of entities) {
        if (!entity.isPlayerSide && entity.isSolid) {
            return true;
        }
    }
    return false;
}

const enemyWidth = 48;
const enemyHeight = 32;

const enemyGapX = 20;
const enemyGapY = 10;

function spawnEnemies() {
    let spacePerEnemyX = enemyWidth + enemyGapX;
    let enemiesInRow = Math.floor(canvas.width / spacePerEnemyX);
    let spaceLeftX = canvas.width - enemiesInRow * spacePerEnemyX;

    for (let i = 0; i < 3; ++i) { 
        for (let j = 0; j < enemiesInRow; ++j) {
            let x = j * (enemyWidth + enemyGapX) + enemyWidth / 2 + spaceLeftX / 2;
            let y = enemyHeight / 2 + i * (enemyHeight + enemyGapY);

            if (j == 2 || j == enemiesInRow - 3) {
                entities.push(new ShootingDownEnemy(x, y));
            } else {
                entities.push(new MovingDownEnemy(x, y));
            }
        }
    }
}

// Change from dev console to pause
let pause = false;

function drawFrame() {
    if (!pause) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

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
            newLiveIndicator.classList.add('live');
            document.querySelector('.lives').appendChild(newLiveIndicator);
        }

        if (!areThereEnemies()) {
            spawnEnemies();
        }

        enemySpeed += 0.0001;
    }

    requestAnimationFrame(drawFrame);
}

drawFrame();
