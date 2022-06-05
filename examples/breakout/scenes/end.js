// end.js
'use strict'

export class End extends Scene {
    setup(context) {

        this.timer = new Timer('timer');

        const midwid = GG.app.renderer.view.width/2;
        const midhei = GG.app.renderer.view.height/2;
        const padding = 4
        const sep = 16

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
                fill: 'no',
                lineColor: Settings.colors.black,
                border: 0,
                alpha: 1,
                text: context.message,
                size: 64,
                padding: padding,
                color: Settings.colors.brickYellow,
            },
            new Vector(0.5, 0.5)
        );

        const score = new Label(
           'label', GG.ui, 0, 0,
            {
                shape: 'rectangle',
                fill: 'no',
                lineColor: Settings.colors.black,
                border: 0,
                alpha: 1,
                text: context.score,
                size: 32,
                padding: padding,
                color: Settings.colors.gray,
            },
            new Vector(0.5, 0.5)
        );

        menu.add(title, score);

        this.timer.after(3000, () => {
            SceneSystem.init('Start', {}, true);
        })
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
