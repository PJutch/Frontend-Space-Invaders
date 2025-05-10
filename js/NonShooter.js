import { ctx, height, gameover } from './env.js';
import { entities, getLeft, getTop, areColliding, getBottom } from './Entity.js';
import { enemyWidth, enemySpeed } from './script.js';

export class NonShooter {
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

    update() {
        this.y += enemySpeed;
        if (getBottom(this) > height) {
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

        ctx.drawImage(NonShooter.sprite, getLeft(this), getTop(this), this.sizeX, this.sizeY);
    }

    onDeath() { }
}
