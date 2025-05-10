import { ctx, width, height, adjustLifes } from './env.js';
import { Player } from './Player.js';
import { Shooter } from './Shooter.js';
import { NonShooter } from './NonShooter.js';
import { entities, removeDead } from './Entity.js';

export let enemySpeed = 0;

entities.push(new Player());

function areThereEnemies() {
    for (let entity of entities) {
        if (!entity.isPlayerSide && entity.isSolid) {
            return true;
        }
    }
    return false;
}

export const enemyWidth = 48;
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
                entities.push(new Shooter(x, y));
            } else {
                entities.push(new NonShooter(x, y));
            }
        }
    }
}

// Change from dev console to pause
let pause = false;

function drawFrame() {
    if (!pause) {
        ctx.clearRect(0, 0, width, height)

        for (let entity of entities) {
            entity.update();
        }

        removeDead();
        adjustLifes();

        if (!areThereEnemies()) {
            spawnEnemies();
        }

        enemySpeed += 0.0001;
    }

    requestAnimationFrame(drawFrame);
}

drawFrame();
