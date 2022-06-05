// game.js
'use strict'

export class Game extends Scene {
    setup(context) {
        GG.Sound.play('sounds/select.mp3');

        this.timer = new Timer('timer');

        const wid = GG.app.renderer.view.width;
        const hei = GG.app.renderer.view.height;
        const midwid = wid/2;
        const midhei = hei/2;
        const gap = 32

        this.addImage(
            0, 0, GG.Resources['images/bg.png'].texture, new Vector()
        );

        this.platform = new GG.objects.Platform(
            GG.objects.Platform.tag, this, midwid, hei - gap,
            {
                texture: GG.Resources[
                    GG.objects.Platform.image
                ].texture,
                collide: true,
                toCollide: GG.objects.Platform.toCollide,
                colliderOffset: GG.objects.Platform.colliderOffset,
                dynamic: true,
            },
            new Vector(0.5, 0.5)
        );

        const rows = 8;
        const columns = 14;
        this.bricks = 0;
        this.addBricks(rows, columns, gap);
        this.addBorders(wid, hei, midwid, midhei, 0);
        this.addHud(wid, hei);

        this.setCursor('gui');
    }

    gameOver(message, score) {
        SceneSystem.init(
            'End',
            {
                message: message,
                score: this.bricks
            },
            true
        );
    }

    updateLifeLabel(value) {
        if (value>0) {
            this.addLifeLabel()
        } else {
            this.removeLifeLabel()
        }
    }

    updateScoreLabel(value) {
        this.bricks += value;
        this.score.onChange(this.bricks)
    }

    addLifeLabel() {
        const life = new Label(
           'label', GG.ui, 0, 0,
            {
                shape: 'rectangle',
                fill: 'no',
                lineColor: Settings.colors.black,
                border: 0,
                alpha: 1,
                image: GG.Resources[
                    GG.objects.Ball.image
                ].texture,
                size: 16,
                padding: 0,
                color: Settings.colors.gray,
            },
            new Vector(1, 0)
        );
        this.lifes.add(life)
    }

    removeLifeLabel() {
        this.lifes.objects[this.platform.life].setDead(true);
    }

    addHud(wid, hei) {
        const padding = 16;
        const sep = 4;

        this.lifes = new HBox(
            'vbox', GG.ui, 0, 0,
            {
                shape: 'rectangle',
                fill: 'no',
                alpha: 0,
                padding: padding,
                sep: sep,
                align: 'center'
            },
            new Vector(0, 0)
        );

        for (let i=0; i<this.platform.life; i++) {
            this.addLifeLabel();
        }

        this.score = new Label(
           'label', GG.ui, wid, 0,
            {
                shape: 'rectangle',
                fill: 'no',
                lineColor: Settings.colors.black,
                border: 0,
                alpha: 1,
                text: this.bricks,
                size: 18,
                padding: padding,
                color: Settings.colors.gray,
            },
            new Vector(1, 0)
        );
    }

    addBricks(rows, columns, gap) {
        for (let i=0; i<rows; i++) {
            let rnd = Tools.randomRange(
                0, GG.objects.Brick.colors.length-1
            );
            for (let j=0; j<columns; j++) {
                this.bricks += 1;
                new GG.objects.Brick(
                    GG.objects.Brick.tag, this,
                    gap + j * 32, gap + i * 16,
                    {
                        texture: GG.Resources[
                            GG.objects.Brick.image
                        ].texture,
                        color: GG.objects.Brick.colors[rnd]
                    },
                    new Vector(0, 0)
                );
            }
        }
    }

    addBorders(wid, hei, midwid, midhei, alpha=0) {
        const doubleWid = wid * 2;
        const doubleHei = hei * 2;
        const thickness = 128
        new Shape(
            'border', this, midwid, 0,
            {
                shape: 'rectangle',
                wid: wid, hei: thickness,
                fillColor: Settings.colors.red,
                alpha: alpha
            },
            new Vector(0.5, 1)
        )
        new Shape(
            'border', this, 0, midhei,
            {
                shape: 'rectangle',
                wid: thickness, hei: doubleHei,
                fillColor: Settings.colors.red,
                alpha: alpha
            },
            new Vector(1, 0.5)
        )
        new Shape(
            'border', this, wid,  midhei,
            {
                shape: 'rectangle',
                wid: thickness, hei: doubleHei,
                fillColor: Settings.colors.red,
                alpha: alpha
            },
            new Vector(0, 0.5)
        )

        new Shape(
            'out', this, midwid, hei,
            {
                shape: 'rectangle',
                wid: doubleWid, hei: thickness,
                fillColor: Settings.colors.red,
                alpha: alpha
            },
            new Vector(0.5, 0)
        )
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
