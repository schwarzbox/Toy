// game.js
'use strict'

export class Game extends Scene {
    setup(context) {
        this.timer = new Timer('timer');

        const wid = GG.app.renderer.view.width;
        const hei = GG.app.renderer.view.height;
        const midwid = wid/2;
        const midhei = hei/2;

        this.ship = new GG.objects.Ship(
            GG.objects.Ship.tag, this,
            midwid, midhei,
            {
                texture: GG.Resources[
                    GG.objects.Ship.image
                ].texture,
                collide: true,
                toCollide: GG.objects.Ship.toCollide,
                dynamic: true,
            },
            new Vector(0.5, 0.5)
        );

        for (let i=0; i<3; i++) {
            const x = Tools.randomRange(
                384, GG.app.renderer.view.width
            );
            const y = Tools.randomRange(
                0, GG.app.renderer.view.height
            );
            this.addAsteroids(x, y, 1, 1);
        }
    }

    addAsteroids(x, y, num, size) {
        for (let i=0; i<num; i++) {
            const ast = new GG.objects.Asteroid(
                GG.objects.Asteroid.tag, this,
                x, y,
                {
                    shape: 'hexagon',
                    fillColor: Settings.colors.gray,
                    wid: 48 / size,
                    hei: 48 / size,
                    collide: true,
                    toCollide: GG.objects.Asteroid.toCollide,
                    dynamic: true,
                },
                new Vector(0.5, 0.5)
            );
            ast.size = size;
        }
    }

    gameOver() {
        if (this.ship.isDead()) {
            SceneSystem.init('Game', {}, true);
        }

        if (this.getObjectsByTag('asteroid').length === 1) {
            SceneSystem.init('Game', {}, true);
        }
    }

    events() {

    }


    update(dt) {
        super.update(dt);

    }

    end() {
        super.end();
    }
}
