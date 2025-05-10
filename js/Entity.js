export function getLeft(entity) {
    return entity.x - entity.sizeX / 2;
}

export function getRight(entity) {
    return entity.x + entity.sizeX / 2;
}

export function getTop(entity) {
    return entity.y - entity.sizeY / 2;
}

export function getBottom(entity) {
    return entity.y + entity.sizeY / 2;
}

export function isBetween(value, start, end) {
    return start <= value && value < end;
}

export function areCollidingX(firstEntity, secondEntity) {
    return isBetween(getLeft(firstEntity), getLeft(secondEntity), getRight(secondEntity))
        || isBetween(getLeft(secondEntity), getLeft(firstEntity), getRight(firstEntity));
}

export function areCollidingY(firstEntity, secondEntity) {
    return isBetween(getTop(firstEntity), getTop(secondEntity), getBottom(secondEntity))
        || isBetween(getTop(secondEntity), getTop(firstEntity), getBottom(firstEntity));
}

export function areColliding(firstEntity, secondEntity) {
    return areCollidingX(firstEntity, secondEntity)
        && areCollidingY(firstEntity, secondEntity);
}

export let entities = [];

export function removeDead() {
    for (let entity of entities) {
        if (entity.dead) {
            entity.onDeath();
        }
    }
    entities = entities.filter((entity) => !entity.dead);
}
