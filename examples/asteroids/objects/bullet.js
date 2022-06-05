// bullet.js
'use strict'

export class Bullet extends Shape {
    static tag = 'bullet';
    static toCollide = ['asteroid'];

    setup(type) {
        this.setSpeed(512);
        this.setLinearDamping(0);
    }

    events() {

    }

    onCollision(other) {
        if (other.tag == 'asteroid') {
            other.onHit(this);
            this.onHit(other);
        }
    }

    update(dt) {
        super.update(dt);
        this.applyMove(dt);

        if (this.pos.x > GG.app.renderer.view.width
            || this.pos.x < 0
            || this.pos.y > GG.app.renderer.view.height
            || this.pos.y < 0
        ) {
            this.setDead(true);
        }
    }

    onHit(other) {
        this.setDead(true);
    }
}
