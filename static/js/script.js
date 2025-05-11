import { clearCanvas } from './env.js';
import { Player } from './Player.js';
import { entities, removeDead } from './Entity.js';
import { trySpawnEnemies, updateEnemySpeed } from './Enemy.js';

entities.push(new Player());

// Change from dev console to pause
let pause = false;

function drawFrame() {
    if (!pause) {
        clearCanvas();

        for (let entity of entities) {
            entity.update();
        }
        removeDead();

        trySpawnEnemies();
        updateEnemySpeed();
    }

    requestAnimationFrame(drawFrame);
}

drawFrame();
