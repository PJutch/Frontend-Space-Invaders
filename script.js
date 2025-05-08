const isKeyDown = {}

onkeydown = (e) => {
    isKeyDown[e.key] = true;
};

onkeyup = (e) => {
    isKeyDown[e.key] = false;
}

const canvas = document.querySelector('.game');
const ctx = canvas.getContext('2d');

class Player {
    x = canvas.width / 2;
    y = canvas.height - 150;

    speed = 2;
    xVelocity = 0;

    size = 50;
    fillStyle = 'rgb(255 255 255)';

    update() {
        if (isKeyDown['d'] && !isKeyDown['a']) {
            this.xVelocity = this.speed;       
        } else if (isKeyDown['a'] && !isKeyDown['d']) {
            this.xVelocity = -this.speed;
        } else if (!isKeyDown['d'] && !isKeyDown['a']) {
            this.xVelocity = 0;
        }
    
        this.x += this.xVelocity;
        if (this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size;
        }
        if (this.x < 0) {
            this.x = 0;
        }
    
        if (isKeyDown['w']) {
            console.log('Pew-pew');
        }
    }
};

const player = new Player();
const entities = [player];

function drawFrame() {
    ctx.fillStyle = 'rgb(0 0 127)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (entity of entities) {
        entity.update();

        ctx.fillStyle = entity.fillStyle;
        ctx.fillRect(entity.x, entity.y, entity.size, entity.size);
    }

    requestAnimationFrame(drawFrame);
}

drawFrame();
