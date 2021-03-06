// settings.js
'use strict'

const Settings = {
    about: {
        version: 0.1,
        title: 'ASTEROIDS',
        author: 'Alex Veledzimovich',
        url: 'https://github.com/schwarzbox/Toy'
    },
    game: {
        canvasWidth: 512,
        canvasHeight: 512,
        bgColor: 0x111111,
        scale: 1,
        fullScreen: false,
        info: false,
        fps: 1/60,
        loadTimeout: 500
    },
    colors : {
        white: 0xFFFFFF,
        black: 0x000000,
        gray: 0x888888,
        red: 0xFF0000,
        green: 0x00FF00,
        blue: 0x0000FF,
        magenta: 0xFF00FF,
        yellow: 0xFFFF00,
        cyan: 0x00FFFF
    },
    cursors : {
        default: "inherit",
        pointer: "pointer"
    }
}

console.log('[Import -> Settings]')
