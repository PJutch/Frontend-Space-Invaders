import { ctx, height, gameover } from './env.js';
import { entities, getLeft, getTop, areColliding, areCollidingX, getBottom } from './Entity.js';
import { Bullet } from './Bullet.js';
import { enemyWidth, enemySpeed } from './script.js';

export class Shooter {
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
    shotCooldownRemaining = Shooter.shotCooldown / 2;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.y += enemySpeed;
        if (getBottom(this) > height) {
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
                this.shotCooldownRemaining = Shooter.shotCooldown;
                entities.push(new Bullet(this.x, this.y, false));
            } else {
                this.shotCooldownRemaining -= enemySpeed;
            }
        }

        ctx.drawImage(Shooter.sprite, getLeft(this), getTop(this), this.sizeX, this.sizeY);
    }

    onDeath() { }
}
