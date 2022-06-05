// bonus.js
'use strict'

export class Bonus extends Sprite {
    static tag = 'bonus';
    static toCollide = ['out'];
    static colliderOffset = {left: 0, right: 0, top: 0, bottom: 0};

    setup(type) {
        this.setLinearDamping(0);
        this.applyLinearImpulse(new Vector(0, 1));
    }

    events() {

    }

    onCollision(other) {
        if (other.tag == 'out') {
            this.setDead(true);
        }

    }

    update(dt) {
        super.update(dt);
        this.applyMove(dt);
    }

    onHit(other) {
        this.setDead(true);
    }

    destroy() {
        this.brick = null;
        super.destroy(this)
    }
}

export class Life extends Bonus {
    static tag = 'bonus';
    static image = 'images/life.png';

    onHit(other) {
        other.updateLife(1);
        this.setDead(true);
    }
}

export class Dead extends Bonus {
    static tag = 'bonus';
    static image = 'images/dead.png';

    onHit(other) {
        other.updateLife(-1);
        this.setDead(true);
    }
}

export class Small extends Bonus {
    static tag = 'bonus';
    static image = 'images/pSmall.png';

    onHit(other) {
        other.updatePlatform(-1);
        this.setDead(true);
    }
}

export class Large extends Bonus {
    static tag = 'bonus';
    static image = 'images/pLarge.png';

    onHit(other) {
        other.updatePlatform(1);
        this.setDead(true);
    }
}

export class Multi extends Bonus {
    static tag = 'bonus';
    static image = 'images/multi.png';

    onHit(other) {
        other.updateBalls(2);
        this.setDead(true);
    }
}

export class Fireball extends Bonus {
    static tag = 'bonus';
    static image = 'images/fireball.png';

    onHit(other) {
        other.updateFire(8000);
        this.setDead(true);
    }
}

export class Concrete extends Bonus {
    static tag = 'bonus';
    static image = 'images/concrete.png';


    onHit(other) {
        GG.objects.Brick.updateBrickTexture.emit(this.brick);
        this.setDead(true);
    }
}
