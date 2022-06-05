// main.js
'use strict'

LoadSystem.images(
    [
        'images/title.png',
        'images/bg.png',
        'images/ball.png',
        'images/brick.png',
        'images/platform.png',
        'images/platformS.png',
        'images/platformL.png',
        'images/life.png',
        'images/dead.png',
        'images/multi.png',
        'images/pSmall.png',
        'images/pLarge.png',
        'images/fireball.png',
        'images/concrete.png',
    ]
);

LoadSystem.sounds(
    [
        'sounds/ball.mp3',
        'sounds/gameover.mp3',
        'sounds/hit.mp3',
        'sounds/miss.mp3',
        'sounds/select.mp3',
        'sounds/take.mp3',
        'sounds/win.mp3'
    ]
);

LoadSystem.objects(
    [
        'objects/ball.js',
        'objects/brick.js',
        'objects/platform.js',
        'objects/bonus.js'
    ]
);

LoadSystem.scenes(
    [
        'scenes/start.js',
        'scenes/game.js',
        'scenes/end.js',
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
