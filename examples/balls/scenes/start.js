// start.js
'use strict'

export class Start extends Scene {
    setup(context) {
        this.timer = new Timer();

        const midwid = GG.app.renderer.view.width/2;
        const midhei = GG.app.renderer.view.height/2;
        const padding = 4
        const sep = 8

        const menu = new VBox(
            'vbox', GG.ui, midwid, midhei,
            {
                shape: 'rectangle',
                fill: 'no',
                alpha: 0,
                padding: padding,
                sep: sep,
                align: 'center'
            },
            new Vector(0.5, 0.5)
        );

        const title = new Label(
           'label', GG.ui, 0, 0,
            {
                shape: 'rectangle',
                fill: 'fill',
                fillColor: Settings.colors.gray,
                lineColor: Settings.colors.black,
                border: 2,
                alpha: 1,
                text: 'TOY',
                size: 64,
                padding: 64,
                color: Settings.colors.red,
            },
            new Vector()
        );

        const clickButton = new Button(
            'button', GG.ui, 0, 0,
            {
                shape: 'rectangle',
                fill: 'no',
                lineColor: Settings.colors.black,
                border: 0,
                text: 'CLICK',
                size: 32,
                padding: padding,
                color: Settings.colors.gray,
                callback: () => {
                    title.setVisible(false);
                    this.addBalls();
                }
            },
            new Vector()
        );

        const quitButton = new Button(
            'button', GG.ui, 0, 0,
            {
                shape: 'rectangle',
                fill: 'no',
                lineColor: Settings.colors.black,
                border: 0,
                text: 'QUIT',
                size: 32,
                padding: padding,
                color: Settings.colors.gray,
                callback: () => {
                    SceneSystem.end();
                    window.close();
                }
            },
            new Vector()
        );

        menu.add(title, clickButton, quitButton);
    }

    events() {

    }

    addBalls() {
        for (let i=0; i<8; i++) {
            const x = Tools.randomRange(
                16, GG.app.renderer.view.width-16
            );
            const y = Tools.randomRange(
                -128, 16
            );

            const ball = new GG.objects.Ball(
                'ball', this, x, y,
                {
                    shape: 'circle',
                    wid: 8,
                    hei: 8,
                    fillColor: Settings.colors.red,
                    dynamic: true
                }
            );
        }
    }

    update(dt) {
        super.update(dt);

    }

    end() {
        super.end();
    }
}
