// settings.js
'use strict'

const Settings = {
    about: {
        version: 0.1,
        title: 'BREAKOUT',
        author: 'Alex Veledzimovich',
        url: ''
    },
    game: {
        canvasWidth: 512,
        canvasHeight: 512,
        bgColor: 0x222222,
        scale: 1,
        fullScreen: false,
        info: true,
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
        cyan: 0x00FFFF,
        brickRed: 0xb03a48,
        brickOrange: 0xd4804d,
        brickGreen: 0x3e6958,
        brickYellow: 0xe0c872,
        brickBlue: 0x243d5c
    },
    cursors : {
        default: "inherit",
        pointer: "pointer",
        gui: "url(images/arrow.png), auto",
    }
}

console.log('[Import -> Settings]')
