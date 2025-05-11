import { drawSprite } from './env.js';
import { getLeft, getTop } from './Entity.js';

const explosionSprite = document.getElementById('explosion');

export class Explosion {
    x;
    y;

    sizeX = 40;
    sizeY = 40;

    toLive = 40;

    dead = false;
    invulnerable = true;
    isSolid = false;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update(dt) {
        this.toLive -= dt;
        if (this.toLive <= 0) {
            this.dead = true;
        }

        drawSprite(explosionSprite, getLeft(this), getTop(this), this.sizeX, this.sizeY);
    }

    onDeath() { }
}
