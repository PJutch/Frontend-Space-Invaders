import { drawRect, height } from './env.js';
import { getLeft, getTop, getBottom } from './Entity.js';
import { shotSounds, playRandom } from './audio.js';

export class Bullet {
    x;
    y;

    velocity;

    sizeX = 3;
    sizeY = 15;

    dead = false;
    invulnerable = false;
    isSolid = false;

    owner;

    constructor(x, y, isPlayerSide, owner) {
        this.x = x;
        this.y = y;
        this.isPlayerSide = isPlayerSide;
        this.velocity = (this.isPlayerSide ? -5 : 3);
        this.owner = owner;

        if (!isPlayerSide) {
            playRandom(shotSounds);
        }
    }

    update() {
        this.y += this.velocity;

        if (getTop(this) < 0 || getBottom(this) > height) {
            this.dead = true;
        }

        drawRect(this.isPlayerSide ? '#639bff' : 'red', 
            getLeft(this), getTop(this), this.sizeX, this.sizeY);
    }

    onDeath() {
        if (this.isPlayerSide) {
            this.owner.hasBullet = true;
        }
    }
}
