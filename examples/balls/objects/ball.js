// ball.js
'use strict'

export class Ball extends Shape {
    setup(type) {
        this.applyForce(new Vector(0, 256));

        const delay = Tools.randomRange(2000, 4000);
        this.lifetime = this.scene.timer.after(delay, () => {
            this.setDead(true);
        });

        this.trail = new ParticleSystem('ps', this);
        this.trail.setParticle({
            texture: GG.Texture.WHITE,
            color: [
                Settings.colors.red,
                Settings.colors.yellow,
                Settings.colors.white
            ],
            scale: [0.4, 0],
            alpha: [1, 0],
            time: [0.5, 1],
            spread: 30,
            direction: new Vector(0, -1),
            speed: [4, 8],
        });

        this.trail.setEmission(8);
        this.trail.play();
    }

    update(dt) {
        super.update(dt);
        this.applyMove(dt);
    }

    destroy() {
        if (this.lifetime) {
            this.lifetime.stop();
            this.lifetime = null;
        }

        this.trail.setDead(true);
        super.destroy();
    }
}
