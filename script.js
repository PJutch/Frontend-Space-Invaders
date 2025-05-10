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

function getLeft(entity) {
    return entity.x - entity.sizeX / 2;
}

function getRight(entity) {
    return entity.x + entity.sizeX / 2;
}

function getTop(entity) {
    return entity.y - entity.sizeY / 2;
}

function getBottom(entity) {
    return entity.y + entity.sizeY / 2;
}

function isBetween(value, start, end) {
    return start <= value && value < end;
}

function areCollidingX(firstEntity, secondEntity) {
    return isBetween(getLeft(firstEntity), getLeft(secondEntity), getRight(secondEntity))
        || isBetween(getLeft(secondEntity), getLeft(firstEntity), getRight(firstEntity));
}

function areCollidingY(firstEntity, secondEntity) {
   return isBetween(getTop(firstEntity), getTop(secondEntity), getBottom(secondEntity))
       || isBetween(getTop(secondEntity), getTop(firstEntity), getBottom(firstEntity));
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

    static sprite = document.getElementById("player");

    x = canvas.width / 2 - this.sizeX / 2;
    y = canvas.height - 100;

    static speed = 2;
    xVelocity = 0;

    shotCooldownRemaining = 0;
    static shotCooldown = 60;

    dead = false;
    isPlayerSide = true;
    invulnerable = false;
    isSolid = true;

    respawnCooldownRemaining = 0;
    static respawnCooldown = 120;

    update(entities) {
        if (isKeyDown['KeyD'] && !isKeyDown['KeyA']) {
            this.xVelocity = Player.speed;       
        } else if (isKeyDown['KeyA'] && !isKeyDown['KeyD']) {
            this.xVelocity = -Player.speed;
        } else if (!isKeyDown['KeyD'] && !isKeyDown['KeyA']) {
            this.xVelocity = 0;
        }
    
        this.x += this.xVelocity;
        if (getRight(this) > canvas.width) {
            this.x = canvas.width - this.sizeX / 2;
        }
        if (this.x < 0) {
            this.x = 0;
        }
    
        if (isKeyDown['KeyW'] && this.shotCooldownRemaining <= 0) {
            entities.push(new Bullet(this.x, this.y, true));
            this.shotCooldownRemaining = Player.shotCooldown;
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

        if (this.respawnCooldownRemaining <= 0 
         || this.respawnCooldownRemaining / 10 % 2 == 0) {
            ctx.drawImage(Player.sprite, getLeft(this), getTop(this), this.sizeX, this.sizeY);
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
        this.respawnCooldownRemaining = Player.respawnCooldown;
    }
};

class Bullet {
    x;
    y;

    velocity;

    sizeX = 3;
    sizeY = 15;

    dead = false;
    invulnerable = false;
    isSolid = false;

    constructor(x, y, isPlayerSide) {
        this.x = x;
        this.y = y;
        this.isPlayerSide = isPlayerSide;
        this.velocity = (this.isPlayerSide ? -1 : 1) * 5;
    }

    update(entities) {
        this.y += this.velocity;

        if (this.y < 0 || this.y > canvas.height) {
            this.dead = true;
        }

        ctx.fillStyle = this.isPlayerSide ? '#639bff' : 'red';
        ctx.fillRect(getLeft(this), getTop(this), this.sizeX, this.sizeY);
    }

    onDeath() {}
}

let enemySpeed = 0;

class MovingDownEnemy {
    x;
    y;

    sizeX = enemyWidth;
    sizeY = 32
    static sprite = document.getElementById("lander");

    dead = false;
    isPlayerSide = false;
    invulnerable = false;
    isSolid = true;

    constructor(x, y) {
        this.x = x;
        this.y = y;
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

        ctx.drawImage(MovingDownEnemy.sprite, getLeft(this), getTop(this), this.sizeX, this.sizeY);
    }

    onDeath() {}
}

class ShootingDownEnemy {
    x;
    y;

    sizeX = enemyWidth;
    sizeY = 28;
    static sprite = document.getElementById("shooter");

    dead = false;
    isPlayerSide = false;
    invulnerable = false;
    isSolid = true;

    static shotCooldown = 180;
    shotCooldownRemaining = ShootingDownEnemy.shotCooldown / 2;

    constructor(x, y) {
        this.x = x;
        this.y = y;
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
                this.shotCooldownRemaining = ShootingDownEnemy.shotCooldown;
                entities.push(new Bullet(this.x, this.y, false));
            } else {
                this.shotCooldownRemaining -= enemySpeed;
            }
        }

        ctx.drawImage(ShootingDownEnemy.sprite, getLeft(this), getTop(this), this.sizeX, this.sizeY);
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

function adjustLifes() {
    while (document.getElementsByClassName('live').length > lives) {
        document.querySelector('.live:not(:has(~ .live))').remove();
    }
    while (document.getElementsByClassName('live').length < lives) {
        let newLiveIndicator = new HTMLDivElement();
        newLiveIndicator.classList.add('live');
        document.querySelector('.lives').appendChild(newLiveIndicator);
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
        
        adjustLifes();

        if (!areThereEnemies()) {
            spawnEnemies();
        }

        enemySpeed += 0.0001;
    }

    requestAnimationFrame(drawFrame);
}

drawFrame();
