import { clearCanvas, addScore } from './env.js';
import { Player } from './Player.js';
import { entities, removeDead } from './Entity.js';
import { updateEnemies } from './Enemy.js';

entities.push(new Player());

// Change from dev console to pause
let pause = false;

let prevTime = performance.now();

function drawFrame() {
    const dt = (performance.now() - prevTime) / 5;
    prevTime = performance.now();

    clearCanvas();

    for (let entity of entities) {
        entity.update(dt);
    }
    removeDead();
    updateEnemies(dt);

    addScore(dt / 60);
    
    requestAnimationFrame(drawFrame);
}

drawFrame(prevTime);
