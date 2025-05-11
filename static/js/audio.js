export const deathSounds = [
    new Audio('./audio/explosion.wav'),
    new Audio('./audio/explosion2.wav')
];

for (let sound of deathSounds) {
    sound.volume = 0.008;
}

export const shotSounds = [
    new Audio('./audio/shoot.wav'),
    new Audio('./audio/shoot.wav')
];

for (let sound of shotSounds) {
    sound.volume = 0.01;
}

export function playRandom(sounds) {
    sounds[Math.floor(Math.random() * sounds.length)].play();
}
