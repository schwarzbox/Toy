// main.js
'use strict'

LoadSystem.images(
    [
        'images/ship.png',
    ]
);

LoadSystem.sounds(
    [

    ]
);

LoadSystem.objects(
    [
        'objects/ship.js',
        'objects/bullet.js',
        'objects/asteroid.js'
    ]
);

LoadSystem.scenes(
    [
        'scenes/game.js'
    ]
);

function initLoop () {
    SceneSystem.init('Game', {}, true);
}

function updateLoop(dt) {
    SceneSystem.update(dt);
}

function endLoop() {
    SceneSystem.end();
}

console.log('[Import -> main.js]')
