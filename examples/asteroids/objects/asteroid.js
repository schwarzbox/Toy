// asteroid.js
'use strict'

export class Asteroid extends Shape {
    static tag = 'asteroid';
    static toCollide = ['ship'];

    setup(type) {
        this.setSpeed(64);
        this.setTorque(128);
        this.setLinearDamping(0);
        this.setAngularDamping(0);
        this.applyTorque(
            Tools.randomRange(-this.torque, this.torque)
        );
        this.applyForce(
            Vector.random().mul(this.speed)
        );
    }

    events() {

    }

    onCollision(other) {
        if (other.tag === 'ship') {
            other.onHit(this);
            this.onHit(other);
        } else {
            this.moveAndBounce(other);
        }
    }

    update(dt) {
        super.update(dt);
        this.applyMove(dt);

        let pos = this.pos;
        if (this.pos.x > GG.app.renderer.view.width) {
            pos.x = 0;
        } else if (this.pos.x < 0) {
            pos.x = GG.app.renderer.view.width;
        }
        if (this.pos.y > GG.app.renderer.view.height) {
            pos.y = 0;
        } else if (this.pos.y < 0) {
            pos.y = GG.app.renderer.view.height;
        }
        this.setPosition(pos.x, pos.y);
    }

    onHit(other) {
        if (this.size < 4) {
            this.size*=2;
            this.scene.addAsteroids(
                this.pos.x, this.pos.y, 3, this.size
            );
        } else {
            this.scene.gameOver();
        }
        this.setDead(true);
    }
}
