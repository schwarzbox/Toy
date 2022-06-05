// ball.js
'use strict'

export class Ball extends Sprite {
    static tag = 'ball';
    static image = 'images/ball.png';
    static toCollide = ['brick', 'platform', 'border', 'out'];
    static colliderOffset = {left: 0, right: 0, top: 0, bottom: 0}

    setup(type) {
        this.setSpeed(256);
        this.setLinearDamping(0);
        this.isMove = false;
        this.isFire = false;
        this.fireTiker = null;

        this.trail = new ParticleSystem(
            'ps', this, new Vector(0,0)
        );

        this.trail.setParticle({
            texture: GG.Texture.WHITE,
            color: [
                Settings.colors.brickRed,
                Settings.colors.brickYellow,
                Settings.colors.white
            ],
            scale: [0.6, 0],
            alpha: [1, 0],
            angle: 0,
            time: [0.2, 0.8],
            spread: 30,
            area: 4,
            relative: true,
            speed: [2, 4],
            torque: 2
        });
        this.trail.setEmission(4);
    }

    events() {

    }

    onCollision(other) {
        if (other.tag === 'out') {
            this.onHit(other);
            this.scene.reactor.emit(this, 'restartGame', [this.uuid]);
            GG.Sound.play('sounds/miss.mp3');
        }

        if (this.isFire && other.tag === 'brick') {
            other.onHit(this);
        } else if (other.tag === 'brick') {
            this.moveAndBounce(other, false);
            other.onHit(this);
            GG.Sound.play('sounds/hit.mp3');
        } else if (other.tag === 'platform') {
            this.moveAndBounce(other, false);
            other.addRicoshet(this);
            GG.Sound.play('sounds/ball.mp3');
        } else if (other.tag === 'border') {
            this.moveAndBounce(other, false);
            GG.Sound.play('sounds/ball.mp3');
        } else {
            this.moveAndSlide(other);
        }
    }

    updateMove() {
        this.applyForce(
            new Vector(Tools.randomFloatRange(-1, 1), -1)
            .unit()
            .mul(this.speed)
        )
        this.isMove = true;
    }

    updateFire(value) {
        let firetime = value;
        this.isFire = true;

        if (this.fireTiker) {
            firetime += this.fireTiker.delay;
            this.fireTiker.stop();
        }
        this.fireTiker = this.scene.timer.after(
            firetime, () => this.isFire = false
        )
    }

    update(dt) {
        super.update(dt);
        if (this.isFire) {
            this.trail.setParticle(
                {direction: this.vel.mul(-1).unit()}
            );
            if (!this.trail.isPlaying()) {
                this.trail.play();
            }
        } else {
            this.trail.stop();
        }
        this.applyMove(dt);
    }

    onHit(other) {
        if (this.fireTiker) {
            this.fireTiker.stop();
            this.fireTiker = null;
        }
        this.trail.setDead(true);
        this.setDead(true);
    }
}
