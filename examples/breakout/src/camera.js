// camera.js
'use strict'

class Camera {
    constructor(
        tag,
        x=GG.app.renderer.view.width/2,
        y=GG.app.renderer.view.height/2
    ) {
        this.tag = tag;

        this.pos = new Vector(x, y);
        this.origin = this.pos.clone();
        this.angle = 0;
        this.scale = 1;
        this.setScaleRange(0.5, 1);
        this.pivot = new Vector();

        this.damp = 0.92;
        this.angDamp = 0.8;

        this.followOffset = 0.1;
        this.lookOffset = 0.25;

        this.vel = new Vector();
        this.acc = new Vector();

        this.angVel=0;
        this.angAcc=0;

        this.object = null;
        this.action = null;

        this.actions = {
            'focus': this.focus,
            'look': this.look,
            'follow': this.follow
        };
        this.effects = {'shake': null, 'zoom': null, 'angle': null};
        this.zoomOut = 0.1;
    }

    setObject(object, action='focus') {
        this.object = object;
        if (this.object.pos) {
            this.action = this.actions[action];
        }
    }
    setEffect(effect, power=1) {
        if (effect) {
            this.effects[effect] = power;
        }
    }

    setPosition(x, y) {
        this.pos.set(x,y);
        this.origin = this.pos.clone();
    }
    setLinearDamping(damp) {
        this.damp = damp;
    }
    setAngularDamping(damp) {
        this.angDamp = damp;
    }
    setScaleRange(min, max) {
        this.scaleRange = {
            'min': min < 0 ? 0: min,
            'max': max < 0 ? 0: max
        };
    }
    setFollowOffset(offset) {
        this.followOffset = offset;
    }
    setLookOffset(offset) {
        this.lookOffset = offset;
    }

    focus(dt) {
        this.pivot.set(this.object.pos.x, this.object.pos.y);
    }

    look(dt) {
        const mouse = Events.mouseLocal(this.object.scene.container);
        const dir = this.object.pos.sub(mouse);
        const dist = dir.mag() * this.lookOffset;

        // to apply shake effect
        this.vel = this.vel.add(this.acc.mul(dt));
        this.vel = this.vel.sub(this.vel.mul(this.damp * dt));
        this.pos = this.origin.add(
            dir.unit().mul(dist).add(this.vel)
        );
        this.acc.set(0,0);
        this.focus();
    }
    follow(dt) {
        const dir = this.origin.sub(this.pos)
        const dist = dir.mag();

        this.acc = this.object.vel.mul(-1);
        this.acc = this.acc.add(
            dir.unit().mul(dist * this.followOffset)
        );

        if (this.effects.shake && dist>this.effects.shake * 2) {
             this.shake(this.effects.shake);
        }

        if (this.effects.zoom) {
            this.zoom(this.effects.zoom, this.object.vel.mag(), dt);
        }

        this.vel = this.vel.add(this.acc.mul(dt))
        this.vel = this.vel.sub(this.vel.mul(this.damp * dt));
        this.pos = this.pos.add(this.vel)

        this.acc.set(0,0);
        this.focus();

        if (this.effects.angle) {
            this.angAcc = this.object.angVel
            this.angVel = this.angVel + this.angAcc * dt;
            this.angVel = (
                this.angVel - this.angVel * this.angDamp * dt
            );
            this.angle = Tools.clamp(
                this.angle + this.angVel,
                -this.effects.angle,
                this.effects.angle
            );
            this.angAcc = 0;
        }
    }
    shake(power) {
        this.acc = this.acc.add(Vector.random().mul(power));
    }
    zoom(power, force, dt) {
        const delta = power * (1/(force+1)) * dt;
        if (force < 1) {
            this.scale = Tools.clamp(
                this.scale + delta,
                this.scaleRange.min,
                this.scaleRange.max
            );
        } else {
            this.scale = Tools.clamp(
                this.scale - delta,
                this.scaleRange.min,
                this.scaleRange.max
            );
        }
    }

    update(dt) {
        if (this.object) {
            this.action(dt);
        } else {
            this.vel = this.vel.sub(this.vel.mul(this.damp * dt));
            this.pos = this.pos.add(this.vel);
            this.zoom(this.zoomOut, this.vel.mag(), dt);
        }
    }

    reset() {
        this.object = null;
        this.action = null;
        this.effects = {'shake': null, 'zoom': null, 'angle': null};
    }
}

console.log('[Import -> Camera]')
