import { clearCanvas, addScore } from './env.js';
import { Player } from './Player.js';
import { entities, removeDead } from './Entity.js';
import { updateEnemies } from './Enemy.js';

entities.push(new Player());

// Change from dev console to pause
let pause = false;

function drawFrame() {
    clearCanvas();

    for (let entity of entities) {
        entity.update();
    }
    removeDead();
    updateEnemies();

    addScore(1 / 60);
    
    requestAnimationFrame(drawFrame);
}

drawFrame();
