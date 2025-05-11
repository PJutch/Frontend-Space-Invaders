import { width, height, gameover, drawSprite } from './env.js';
import { entities, getLeft, getTop, areColliding, areCollidingX, getBottom } from './Entity.js';
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

    constructor(x, y, sizeX, sizeY, sprite, shotCooldown) {
        this.x = x;
        this.y = y;

        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.sprite = sprite;

        this.shotCooldown = shotCooldown;
        this.shotCooldownRemaining = this.shotCooldown / 2;
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
        this.y += enemySpeed;
        if (getBottom(this) > height) {
            gameover();
            this.dead = true;
        }

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

    onDeath() { }
}

const shooterSprite = document.getElementById("shooter");

function makeShooter(x, y) {
    return new Enemy(x, y, enemyWidth, 28, shooterSprite, 180);
}

const landerSprite = document.getElementById("lander");

function makeLander(x, y) {
    return new Enemy(x, y, enemyWidth, 32, landerSprite, -1);
}

let enemySpeed = 0;

export function updateEnemySpeed() {
    enemySpeed += 0.0001;
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

export function trySpawnEnemies() {
    if (areThereEnemies()) {
        return;
    }

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
