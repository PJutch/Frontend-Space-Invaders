import { width, height, drawSprite, gameover, addScore } from './env.js';
import { 
    entities, 
    getLeft, getRight, getTop, getBottom, 
    areColliding, areCollidingX 
} from './Entity.js';
import { Bullet } from './Bullet.js';
import { Explosion } from './Explosion.js';
import { deathSounds, shotSounds, playRandom } from './audio.js';

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
        this.shotCooldownRemaining = Math.random() * this.shotCooldown;

        this.onDeathScore = onDeathScore;
    }

    update(dt) {
        this.x += (enemiesMoveRight ? enemySpeed : -enemySpeed) * dt;

        for (let entity of entities) {
            if (!entity.invulnerable && areColliding(this, entity) && entity.isPlayerSide) {
                this.dead = true;
                entity.dead = true;
            }
        }

        if (this.shotCooldown >= 0) {
            if (this.shotCooldownRemaining <= 0) {
                this.shotCooldownRemaining = this.shotCooldown;
                entities.push(new Bullet(this.x, this.y, false, this));
                playRandom(shotSounds);
            } else {
                this.shotCooldownRemaining -= enemySpeed * dt;
            }
        }

        drawSprite(this.sprite, getLeft(this), getTop(this), this.sizeX, this.sizeY);
    }

    onDeath() {
        addScore(this.onDeathScore);
        playRandom(deathSounds);
        entities.push(new Explosion(this.x, this.y));
    }
}

function areThereEnemies() {
    for (let entity of entities) {
        if (!entity.isPlayerSide && entity.isSolid) {
            return true;
        }
    }
    return false;
}

const lander1Sprite = document.getElementById("lander1");
const lander2Sprite = document.getElementById("lander2");
const shooterSprite = document.getElementById("shooter");

const enemyWidth = 48;
const enemyHeight = 32;

const enemyGapX = 20;
const enemyGapY = 10;

const spacePerEnemyX = enemyWidth + enemyGapX;
const enemiesInRow = Math.floor(width / spacePerEnemyX);
const spaceLeftX = width - enemiesInRow * spacePerEnemyX;

function spawnEnemies() {
    spaceCovered = 0;
    enemiesMoveRight = true;

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < enemiesInRow; ++j) {
            let x = j * (enemyWidth + enemyGapX) + enemyWidth / 2;
            let y = enemyHeight / 2 + i * (enemyHeight + enemyGapY);

            if (i == 2) {
                entities.push(new Enemy(x, y, enemyWidth, 28, lander1Sprite, -1, 20));
            } else if (i == 1) {
                entities.push(new Enemy(x, y, enemyWidth, 32, lander2Sprite, -1, 20));
            } else {
                entities.push(new Enemy(x, y, 32, 32, shooterSprite, 90, 40));
            }
        }
    }
}

let enemySpeed = 0.01;
let enemiesMoveRight = true;
let spaceCovered = 0;

function enemiesReachedBorder() {
    for (let entity of entities) {
        if (!entity.isPlayerSide && entity.isSolid) {
            if (enemiesMoveRight && getRight(entity) >= width 
            || !enemiesMoveRight && getLeft(entity) <= 0) {
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

export function updateEnemies(dt) {
    if (!areThereEnemies()) {
        spawnEnemies();
    }

    if (enemiesReachedBottom()) {
        gameover();
    }

    spaceCovered += enemySpeed * dt;
    if (spaceCovered >= spaceLeftX) {
        for (let entity of entities) {
            if (!entity.isPlayerSide && entity.isSolid) {
                entity.y += enemyHeight;
            }
        }
        enemiesMoveRight = !enemiesMoveRight;
        spaceCovered = 0;
    }

    enemySpeed += 0.00002 * dt;
}
