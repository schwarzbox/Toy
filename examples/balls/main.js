// main.js
'use strict'

LoadSystem.images(
    [

    ]
);

LoadSystem.sounds(
    [

    ]
);

LoadSystem.objects(
    [
        'objects/ball.js'
    ]
);

LoadSystem.scenes(
    [
        'scenes/start.js',
    ]
);

function initLoop () {
    SceneSystem.init('Start', {}, true);
}

function updateLoop(dt) {
    SceneSystem.update(dt);
}

function endLoop() {
    SceneSystem.end();
}

console.log('[Import -> main.js]')
