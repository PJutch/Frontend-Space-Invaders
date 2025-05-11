import { width, height, drawSprite, gameover, addScore } from './env.js';
import { 
    entities, 
    getLeft, getRight, getTop, getBottom, 
    areColliding, areCollidingX 
} from './Entity.js';
import { Bullet } from './Bullet.js';

class Enemy {
    x;
    y;

    sizeX;
    sizeY;

    dead = false;
    isPlayerSide = false;
    invulnerable = false;
    isSolid = true;

    shotCooldown;
    shotCooldownRemaining;

    onDeathScore;

    constructor(x, y, sizeX, sizeY, sprite, shotCooldown, onDeathScore) {
        this.x = x;
        this.y = y;

        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.sprite = sprite;

        this.shotCooldown = shotCooldown;
        this.shotCooldownRemaining = this.shotCooldown / 2;

        this.onDeathScore = onDeathScore;
    }

    canShoot() {
        if (this.shotCooldown < 0) {
            return false;
        }

        for (let entity of entities) {
            if (entity != this && entity.y > this.y && areCollidingX(this, entity)
             && entity.isSolid && !entity.isPlayerSide) {
                return false;
            }
        }
        return true;
    }

    update() {
        this.x += (enemiesMoveRight ? enemySpeed : -enemySpeed);

        for (let entity of entities) {
            if (!entity.invulnerable && areColliding(this, entity) && entity.isPlayerSide) {
                this.dead = true;
                entity.dead = true;
            }
        }

        if (this.canShoot()) {
            if (this.shotCooldownRemaining <= 0) {
                this.shotCooldownRemaining = this.shotCooldown;
                entities.push(new Bullet(this.x, this.y, false));
            } else {
                this.shotCooldownRemaining -= enemySpeed;
            }
        }

        drawSprite(this.sprite, getLeft(this), getTop(this), this.sizeX, this.sizeY);
    }

    onDeath() {
        addScore(this.onDeathScore);
    }
}

const shooterSprite = document.getElementById("shooter");

function makeShooter(x, y) {
    return new Enemy(x, y, enemyWidth, 28, shooterSprite, 180, 20);
}

const landerSprite = document.getElementById("lander");

function makeLander(x, y) {
    return new Enemy(x, y, enemyWidth, 32, landerSprite, -1, 10);
}

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
    let enemiesInRow = Math.floor(width / spacePerEnemyX);
    let spaceLeftX = width - enemiesInRow * spacePerEnemyX;

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < enemiesInRow; ++j) {
            let x = j * (enemyWidth + enemyGapX) + enemyWidth / 2 + spaceLeftX / 2;
            let y = enemyHeight / 2 + i * (enemyHeight + enemyGapY);

            if (j == 2 || j == enemiesInRow - 3) {
                entities.push(makeShooter(x, y));
            } else {
                entities.push(makeLander(x, y));
            }
        }
    }
}

let enemySpeed = 0;
let enemiesMoveRight = true;

function enemiesReachedBorder() {
    for (let entity of entities) {
        if (!entity.isPlayerSide && entity.isSolid) {
            if (enemiesMoveRight && getRight(entity) >= width 
            || !enemiesMoveRight && getLeft(entity) <= 0) {
                console.log(entity);
                return true;
            }
        }
    }
    return false;
}

function enemiesReachedBottom() {
    for (let entity of entities) {
        if (!entity.isPlayerSide && entity.isSolid && getBottom(entity) >= height) {
            return true;
        }
    }
    return false;
}

export function updateEnemies() {
    if (!areThereEnemies()) {
        spawnEnemies();
    }

    if (enemiesReachedBorder()) {
        for (let entity of entities) {
            if (!entity.isPlayerSide && entity.isSolid) {
                entity.y += enemyHeight;
            }
        }
        enemiesMoveRight = !enemiesMoveRight;
    }

    if (enemiesReachedBottom()) {
        gameover();
    }

    enemySpeed += 0.00001;
}
