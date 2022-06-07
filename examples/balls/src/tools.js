// tools.js
'use strict'

const Tools = {
    getScreenshot() {
        // load from image
        // let base = new PIXI.BaseTexture(anyImageObject),
        // let texture = new PIXI.Texture(base),
        // let sprite = new PIXI.Sprite(texture);
        // load from canvas
        // let base = new PIXI.BaseTexture.fromCanvas(anyCanvasElement)

        // texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

        let renderTexture = new GG.RenderTexture.create(
            GG.app.renderer.width, GG.app.renderer.height
        );
        GG.app.renderer.render(GG.app.stage, renderTexture);
        // const img = GG.app.renderer.plugins.extract.image(renderTexture);
        // document.body.appendChild(image);

        const imageUrl = GG.app.renderer.plugins.extract.base64(
            renderTexture, 'image/jpeg'
        );
        const downloadLink = document.createElement('a');

        downloadLink.setAttribute('download', 'filename.jpg');
        downloadLink.href = imageUrl;
        downloadLink.download = `screenshot-${Date.now()}.png`;
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
        renderTexture.destroy();
    },
    baseName(path, ext=false) {
        let name = path.split('/').reverse()[0]
        if (ext) {
            return name
        }
        return name.split('.')[0]
    },
    titleCase(str) {
        return str[0].toUpperCase() + str.slice(1);
    },
    randomFloatRange: function (min, max) {
        let fmin = min * 1000
        let fmax = max * 1000
        return (
            Math.floor(Math.random() * (fmax - fmin + 1)) + fmin
        ) / 1000;
    },
    randomRange: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    toHexString: function(hex) {
        return '#' + (hex | 0).toString(16);
    },
    toColorString: function(array, rgba=false) {
        if (rgba) {
            return `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${array[3]})`;
        }
        return `rgb(${array[0]}, ${array[1]}, ${array[2]})`;
    },
    toColorArray: function(str) {
        return str.match(/\d+/g);
    },
    randomHex: function () {
        return parseInt(Math.random()*0xffffff, 16);
    },
    randomHexa: function () {
        return parseInt(Math.random()*0xffffffff, 16);
    },
    toRGB: function(hex) {
        return [((hex >> 16) & 0xFF), ((hex >> 8) & 0xFF), hex & 0xFF];
    },
    toRGBA: function(hex) {
        return [
            ((hex >> 24) & 0xFF),
            ((hex >> 16) & 0xFF),
            ((hex >> 8) & 0xFF),
            hex & 0xFF
        ];
    },
    toHex: function(rgb) {
        return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
    },
    toHexa: function(rgba) {
        return (rgba[1] << 24) + (rgba[1] << 16) + (rgba[2] << 8) + rgba[3];
    },
    clamp(n, min, max) {
        if (n>max) {
            return max;
        } else if (n<min) {
            return min;
        } else {
            return n;
        }
    },
    interpolateNumber: function(a, b, factor=0.5) {
        return a + factor * (b-a);
    },
    interpolateColorArray: function(clrArray1, clrArray2, factor) {
        let color = clrArray1.slice();
        for (let i=0; i<color.length; i++) {
            color[i] = Tools.interpolateNumber(
                color[i], clrArray2[i], factor
            );
        }
        return color;
    },
    toRadian(angle) {
        return angle * Math.PI/180;
    },
    toAngle(radian) {
        return radian * 180 / Math.PI;
    }
}

console.log('[Import -> Tools]')
