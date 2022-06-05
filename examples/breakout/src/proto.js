// proto.js
'use strict'

class Proto {
    constructor(
        tag, x, y,
        anchor=new Vector(0.5, 0.5),
        angle=0,
        scale=new Vector(1, 1)
    ) {
        this.tag = tag;
        this.dead = false;

        this.pos = new Vector(x,y);

        this.anchor = anchor;
        this.scale = scale;

        this.collider = {
            left: 0, right: 0, top: 0, bottom: 0,
            center: new Vector(),
            offset: {left: 0, right: 0, top: 0, bottom: 0},
        };
        this._collider = {...this.collider};

        this.angle = angle;
        this.rotation = Tools.toRadian(this.angle);

        this.mass = 1;
        this.inertia = 0;

        this.speed = 0;
        this.torque = 0;
        this.damp = 0.5;
        this.angDamp = 0.5;

        this.pivot = new Vector();
        this.middle = new Vector();

        this.direction = new Vector();
        this.matrix = [new Vector(), new Vector()]

        this.vel = new Vector();
        this.acc = new Vector();

        this.angVel=0;
        this.angAcc=0;

        this.uuid=Proto.uuid++;
    }

    setup(type) {

    }
    events() {

    }

    init(type) {
        this.scene.addSprite(this, type.zindex);
        this.type.zindex = this.body.zIndex;

        this.setBody(this.type);

        // use type to set additional options or combine objects
        this.setup(type);
        this.events();
    }

    setBody(type) {
        throw new Error(`${this.tag}: Abstract method!`);
    }
    setRigidBody(type) {
        const mass = (
            this.type.wid * this.type.hei / 1000
        );
        this.mass = mass > 1 ? mass : 1;
        this.inertia = this.mass * 1.350;

        this.setInteractive(
            type.interactive === undefined
            ? this.type.interactive
            : type.interactive
        );
        this.setCollide(
            type.collide === undefined
            ? this.type.collide
            : type.collide
        );
        this.setToCollide(type.toCollide || this.type.toCollide);
        this.setColliderOffset(
            type.colliderOffset || this.collider.offset
        );

        this.setDynamic(
            type.dynamic === undefined
            ? this.type.dynamic
            : type.dynamic
        );

        this.updatePivot();
        this.updateMiddle();

        this.setupMatrix(this.rotation);
        this.setupCollider();
        this.saveCollider();
    }

    // collisions
    setCollide(bool) {
        this.type.collide = bool;
    }
    setToCollide(values) {
        this.type.toCollide = new Set(values);
    }
    setColliderOffset(offset) {
        this.collider.offset = {...offset};
    }
    setupCollider() {
        if (this.constructor.name=='Particle') {
            return
        }

        let center = this.pos.sub(this.pivot).add(this.middle);

        if (
            this.angle!==0
            && this.anchor.x !== 0.5
            && this.anchor.y !== 0.5
        ) {
            center = center.rotate(this.matrix, this.pos);
        }

        this.collider.left = (
            center.x - this.middle.x + 1 + this.collider.offset.left
        );
        this.collider.right = (
            center.x + this.middle.x - 1 -this.collider.offset.right
        );
        this.collider.top = (
            center.y - this.middle.y + 1 + this.collider.offset.top
        );
        this.collider.bottom = (
            center.y + this.middle.y - 1-this.collider.offset.bottom
        );
        this.collider.center = center
    }
    updatePivot(){
        this.pivot.set(
            this.type.wid*this.anchor.x,
            this.type.hei*this.anchor.y,
        );
    }
    updateMiddle(){
        this.middle.set(this.type.wid/2, this.type.hei/2
        );
    }
    updateCollider() {
        this.saveCollider();
        this.setupCollider();
    }
    saveCollider() {
        this._collider = {...this.collider};
    }
    onCollision(other) {
        if (this.type.collide) {
            throw new Error(`${this.tag}: Abstract method!`);
        }
    }
    onHit(other){

    }

    isContains(point) {
        return this.body.containsPoint(point);
    }
    setInteractive(bool) {
        this.type.interactive = bool;
        this.body.interactive = bool;
    }
    setDynamic(bool) {
        this.type.dynamic = bool;
    }

    // others
    setColor(color) {
        this.type.color=color;
        this.body.tint=color;
    }
    setAlpha(alpha) {
        this.type.alpha=alpha;
        this.body.alpha = this.type.alpha;
    }
    setScale(scale) {
        this.scale.set(scale.x, scale.y);
    }
    setAnchor(anchor) {
        this.anchor.set(anchor.x, anchor.y);
    }
    flipX(value) {
        if ((value < 0 && this.scale.x < 0)
            || (value > 0 && this.scale.x > 0)) {
            return
        }
        this.scale.x = value * Math.abs(this.scale.x);
    }
    flipY(value) {
        if ((value < 0 && this.scale.y < 0)
            || (value > 0 && this.scale.y > 0)) {
            return
        }
        this.scale.y = value * Math.abs(this.scale.y);
    }

    setVisible(bool) {
        this.body.visible = bool;
    }
    setCursor(cursor) {
        this.body.cursor = cursor;
    }

    setCallback(func) {
        this.type.callback = func
    }
    setZindex(zindex) {
        this.type.zindex = zindex;
        this.scene.container.setChildIndex(this.body, zindex);
    }

    setDead(bool) {
        this.dead = bool;
    }
    isDead() {
        return this.dead
    }

    // physics
    setupMatrix(radian) {
        if (this.constructor.name === 'Particle') {
            return
        }
        this.matrix = Vector.matrix(radian);
    }
    updateMatrix() {
        this.setupMatrix(this.rotation);
    }

    applyLinearAcceleration(dt) {
        this.vel = this.vel.add(this.acc.mul(dt));
        this.pos = this.pos.add(this.vel);
        this.vel = this.vel.sub(this.vel.mul(this.damp * dt));
        this.acc.set(0,0);
    }

    applyAngularAcceleration(dt) {
        this.angVel = this.angVel + this.angAcc * dt;
        this.angle = this.angle + this.angVel;
        this.angVel = this.angVel - (this.angVel * this.angDamp * dt);
        this.angAcc = 0;
    }

    applyMove(dt) {
        if (!this.type.dynamic) {
            return;
        }

        this.applyLinearAcceleration(dt);
        this.applyAngularAcceleration(dt);
    }

    moveAndSlide(other, offset=2, bounce=false) {
        if (!this.type.dynamic) {
            return;
        }

        const oldvel = this.vel.clone();
        // offset can help to avoid stuck in the wall
        if (this.collider.bottom >= other.collider.top
            && this._collider.bottom < other._collider.top) {
            // bottom
            this.collider.center.y = (
                other.collider.top - offset
                + this.collider.offset.bottom - this.middle.y
            );
            this.vel.y = other.vel.y;
        } else if (this.collider.top <= other.collider.bottom
                   && this._collider.top > other._collider.bottom) {
            // top
            this.collider.center.y = (
                other.collider.bottom + offset
                - this.collider.offset.top + this.middle.y
            );
            this.vel.y = other.vel.y;
        } else if (this.collider.right >= other.collider.left
                   && this._collider.right < other._collider.left) {
            // right
            this.collider.center.x = (
                other.collider.left - offset
                + this.collider.offset.right - this.middle.x
            );
            this.vel.x = other.vel.x;
        } else if (this.collider.left <= other.collider.right
                   && this._collider.left > other._collider.right) {
            // left
            this.collider.center.x = (
                other.collider.right + offset
                - this.collider.offset.left + this.middle.x
            );
            this.vel.x = other.vel.x;
        } else {
            // this.collider.center = this._collider.center
        }

        // to smoother slide (is not used with moveAndBounce)
        if (!bounce) {
            if (this.vel.x == 0) {
                this.vel.x = -oldvel.x/100;
            }
            if (this.vel.y == 0) {
                this.vel.y = -oldvel.y/100;
            }
        }

        const pos = this.collider.center.add(this.pivot).sub(this.middle);
        this.pos = pos.rotate(this.matrix, this.collider.center);
    }

    moveAndBounce(other, reduce=true) {
         if (!this.type.dynamic) {
            return;
        }

        const oldvel = this.vel.clone();
        // use offset based on mag
        this.moveAndSlide(
            other,
            this.vel.mag() + other.vel.mag(),
            true
        );
        // lower speed when bounce with random delta
        if (this.vel.x == 0) {
            let reduce = 0
            if (reduce) {
                const dx = Tools.randomRange(3, 8) - Math.random();
                reduce = oldvel.x / dx
            }
            this.vel.x = -(oldvel.x - reduce);
        }
        if (this.vel.y == 0) {
            let reduce = 0
            if (reduce) {
                const dy = Tools.randomRange(3, 8) - Math.random();
                reduce = oldvel.y / dy
            }
            this.vel.y = -(oldvel.y - reduce);
        }
    }

    applyForce(force) {
        this.acc = this.acc.add(force.div(this.mass));
    }
    applyLinearImpulse(force) {
        this.applyForce(force.mul(60));
    }
    setLinearVelocity(force) {
        this.vel.set(force.x, force.y)
    }

    applyTorque(torque) {
        this.angAcc += torque/this.inertia;
    }
    applyAngularImpulse(torque) {
        this.applyTorque(torque * 60);
    }
    setAngularVelocity(torque) {
        this.angVel = torque;
    }

    setPosition(x,y){
        this.pos.set(x,y);
    }
    setAngle(angle) {
        this.angle = angle;
    }
    setDirection(direction){
        this.direction = direction;
    }

    setMass(mass) {
        this.mass = mass > 1 ? mass : 1;
    }
    setInertia(inertia) {
        this.inertia = inertia > 1.350 ? inertia : 1.350;
    }

    setSpeed(speed) {
        this.speed = speed;
    }
    setTorque(torque) {
        this.torque = torque;
    }
    setLinearDamping(damp) {
        this.damp = damp;
    }
    setAngularDamping(damp) {
        this.angDamp = damp;
    }

    // update

    updatePosition(){
        const px = parseFloat(this.body.position.x);
        const py = parseFloat(this.body.position.y);

        this.body.position.set(this.pos.x, this.pos.y);
        if (px === parseFloat(this.pos.x) && py === parseFloat(this.pos.y)) {
            return false;
        }
        return true;
    }
    updateAngle() {
        const angle = parseFloat(this.body.angle);
        this.body.angle = this.angle;
        this.rotation = this.body.rotation;
        if (angle === parseFloat(this.angle)) {
            return false;
        }
        return true;
    }

    updateScale() {
        const sx = Math.abs(parseFloat(this.body.scale.x));
        const sy = Math.abs(parseFloat(this.body.scale.y));
        this.body.scale.set(this.scale.x, this.scale.y);
        if (sx === Math.abs(parseFloat(this.scale.x))
            && sy === Math.abs(parseFloat(this.scale.y))) {
            return false;
        }

        return true
    }
    updateAnchor() {
        const ax = parseFloat(this.body.anchor.x);
        const ay = parseFloat(this.body.anchor.y);
        this.body.anchor.set(this.anchor.x, this.anchor.y);
        if (ax === parseFloat(this.anchor.x)
            && ay === parseFloat(this.anchor.y)) {
            return false;
        }
        return true
    }

    update(dt) {
        if (!this.body) {
            return
        }

        const isUpdPos = this.updatePosition();
        const isUpdAngle = this.updateAngle();
        const isUpdScale = this.updateScale();
        const isUpdAnchor = this.updateAnchor();

        if (isUpdAngle) {
            this.updateMatrix();
        }

        if (isUpdAnchor || isUpdScale) {
            this.type.wid = this.body.width;
            this.type.hei = this.body.height;
            this.updatePivot();
            this.updateMiddle();
        }
        if (isUpdPos || isUpdAngle || isUpdScale || isUpdAnchor) {
            this.updateCollider();
        }
    }


    destroy() {
        Events.removeEvent(this.body);
        this.body.destroy();
    }
}

Proto.uuid=0;

console.log('[Import -> Proto]')
