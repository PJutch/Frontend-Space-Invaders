import { width, height, isKeyDown, removeLife, drawSprite } from './env.js';
import { entities, getLeft, getRight, getTop, areColliding } from './Entity.js';
import { Bullet } from './Bullet.js';

export class Player {
    sizeX = 48;
    sizeY = 32;

    static sprite = document.getElementById("player");

    x = width / 2 - this.sizeX / 2;
    y = height - 100;

    static speed = 2;
    xVelocity = 0;

    hasBullet = true;

    dead = false;
    isPlayerSide = true;
    invulnerable = false;
    isSolid = true;

    respawnCooldownRemaining = 0;
    static respawnCooldown = 120;

    update() {
        if (isKeyDown['KeyD'] && !isKeyDown['KeyA']) {
            this.xVelocity = Player.speed;
        } else if (isKeyDown['KeyA'] && !isKeyDown['KeyD']) {
            this.xVelocity = -Player.speed;
        } else if (!isKeyDown['KeyD'] && !isKeyDown['KeyA']) {
            this.xVelocity = 0;
        }

        this.x += this.xVelocity;
        if (getRight(this) > width) {
            this.x = width - this.sizeX / 2;
        }
        if (getLeft(this) < 0) {
            this.x = this.sizeX / 2;
        }

        if (isKeyDown['KeyW'] && this.hasBullet) {
            entities.push(new Bullet(this.x, this.y, true, this));
            this.hasBullet = false;
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
            drawSprite(Player.sprite, getLeft(this), getTop(this), this.sizeX, this.sizeY);
        }

        if (this.respawnCooldownRemaining <= 0) {
            this.invulnerable = false;
        } else {
            --this.respawnCooldownRemaining;
        }
    }

    onDeath() {
        removeLife();

        this.dead = false;
        this.invulnerable = true;
        this.respawnCooldownRemaining = Player.respawnCooldown;
    }
};
