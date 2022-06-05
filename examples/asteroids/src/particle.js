// particle.js
'use strict'

class Particle extends Sprite {
    interpolateProperty(array, time, dt, func) {
        let index = Math.floor(this.pass/time);
        if (index < array.length-1) {
            let factor = (
                (this.pass - time * index) / time
            );
            array[index] = func(
                array[index], array[index+1],
                factor * dt * array.length,
            );
            return array[index];
        }
    }
    update(dt) {
        super.update(dt);

        this.applyForce(this.direction.mul(this.speed));
        this.applyTorque(this.torque);
        this.applyMove(dt);

        if (this.time <= 0) {
            this.setDead(true);
        }

        let color = this.interpolateProperty(
            this.rgbs, this.colorTime, dt, Tools.interpolateColorArray
        );
        if (color) {
            this.setColor(Tools.toHex(color));
        }

        let alpha = this.interpolateProperty(
            this.alphas, this.alphaTime, dt, Tools.interpolateNumber
        );
        if (alpha) {
            this.setAlpha(alpha);
        }

        let scale = this.interpolateProperty(
            this.scales, this.scaleTime, dt, Tools.interpolateNumber
        );
        if (scale) {
            this.setScale(new Vector(scale, scale));
        }

        this.pass+=dt;
        this.time-=dt;
    }
}

class ParticleSystem  {
    constructor(
        tag, object, offset=new Vector(), maxSize=1024,
        // uvs used to change particle textures
        properties={
            vertices: false,
            scale: true, position: true, rotation: true,
            uvs: false, alpha: true, tint: true},
        batchSize=1024,
        autoResize=false
    ) {
        this.tag = tag;
        this.dead = false;

        this.container = new GG.ParticleContainer(
            maxSize, properties, batchSize, autoResize
        );

        this.object = object;
        this.offset = offset;
        this.side = this.offset.sign();

        this.emission = 1;
        this.lifetime = null;
        this._lifetime = this.lifetime;

        this.pos = new Vector(this.object.pos.x, this.object.pos.y);
        this.updatePosition();

        this.emiting = false;

        this.type = {};
        this.particles = [];
        this.trash = new Set();

        this.scene = this.object.scene || this.object;
        this.scene.addParticleSystem(this);
    }
    setObject(object) {
        this.object = object;
    }
    setOffset(x,y){
        this.offset.set(x,y);
        this.side = this.offset.sign();
    }
    setLifetime(lifetime){
        this.lifetime = lifetime;
        this._lifetime = lifetime;
    }
    setEmission(emission){
        this.emision = emission;
    }

    setPosition(x,y){
        this.pos.set(x,y);
    }
    updatePosition() {
        this.container.position.set(this.pos.x,this.pos.y);
    }
    setVisible(bool) {
        this.container.visible = bool;
    }

    addSprite(object) {
        this.container.addChild(object.body);
        this.particles.push(object);
    }

    setParticle(type) {
        this.type.texture = type.texture || this.type.texture;
        this.type.tiles = type.tiles || this.type.tiles || {x:1, y:1};
        this.type.color = (
            type.color
            || this.type.color
            ||  [0xFFFFFF, 0xFFFFFF, 0xFFFFFF]
        );
        this.type.alpha = type.alpha || this.type.alpha || [1,0];

        this.type.angle = type.angle || this.type.angle || 0;
        this.type.scale = type.scale || this.type.scale || [0, 1, 0];

        this.type.time = type.time || this.type.time || [0, 1];

        this.type.spread = type.spread || this.type.spread || 0;
        this.type.area = type.area || this.type.area || 0;

        this.type.direction = (
            type.direction || this.type.direction || new Vector(0,0)
        );
        this.type.relative = type.relative || this.type.relative || false;

        this.type.speed = (
            type.speed || this.type.speed || [0, 0]
        );
        this.type.torque = type.torque || this.type.torque || 0;

        this.type.vel = type.vel || this.type.vel || new Vector(0,0);
        this.type.angVel = type.angVel || this.type.angVel || 0;
        this.type.damp = type.damp || this.type.damp || 0.8;
        this.type.angDamp = type.angDamp || this.type.angDamp || 0.8;
    }

    emit(number) {
        let rgbs = []
        for (let i = 0; i < this.type.color.length; i++) {
            rgbs.push(Tools.toRGB(this.type.color[i]));
        }
        for (let i = number - 1; i >= 0; i--) {
            let particle = new Particle(
                'particle', this, 0, 0,
                {
                    texture: this.type.texture || GG.Texture.WHITE,
                    tiles: this.type.tiles,
                    color: this.type.color[0],
                    alpha: this.type.alpha[0],
                    dynamic: true,
                }
            );

            const time = Tools.randomFloatRange(
                this.type.time[0], this.type.time[1]
            );

            particle.pass = 0;
            particle.time = time;

            particle.rgbs = rgbs.slice();
            particle.colorTime = time/(particle.rgbs.length-1);

            particle.alphas =  this.type.alpha.slice();
            particle.alphaTime = time/(particle.alphas.length-1);

            particle.scales = this.type.scale.slice();
            const scale = this.type.scale[particle.scales[0]];
            particle.setScale(new Vector(scale, scale));
            particle.scaleTime = time/(particle.scales.length-1);

            particle.setAngle(
                Tools.randomRange(-this.type.angle, this.type.angle)
            );

            if (this.type.area>0) {
                const area = Tools.randomRange(-this.type.area,
                                               this.type.area);
                const randArea = Tools.randomRange(
                    0, 360
                );
                const radian = Tools.toRadian(randArea);

                const cos = Math.cos(radian);
                const sin = Math.sin(radian);
                particle.setPosition(cos*area, sin*area);
            }

            let dir = this.type.direction;
            if (this.type.spread > 0) {
                const angle = dir.head()
                const half = this.type.spread / 2
                const spread = Tools.randomRange(-half, half)
                const radian = Tools.toRadian(spread);
                const cos = Math.cos(angle+radian);
                const sin = Math.sin(angle+radian);
                dir = Vector.direction(angle+radian)
            }
            if (this.type.relative) {
                const vel = this.type.vel.add(dir);
                particle.setAngle(Tools.toAngle(vel.head()));
            }

            particle.setDirection(dir.unit());
            particle.setSpeed(
                Tools.randomRange(
                    this.type.speed[0], this.type.speed[1])
            );
            particle.setTorque(
                Tools.randomRange(-this.type.torque, this.type.torque)
            );
            particle.setLinearVelocity(
                this.type.vel.mul(Math.random())
            );
            particle.setAngularVelocity(
                Math.random() * this.type.angVel
            );
            particle.setLinearDamping(this.type.damp);
            particle.setAngularDamping(this.type.angDamp);

            // update intial position
            particle.update(
                Settings.game.fps || GG.app.ticker.deltaMS / 1000
            );
        }
    }

    play() {
        this.emiting = true;
        this.setLifetime(this._lifetime);
    }
    stop() {
        this.emiting = false;
    }
    isPlaying() {
        return this.emiting;
    }
    isDead() {
        if (this.lifetime) {
            return this.particles.length === 0;
        }
        return false || this.dead;
    }
    setDead(bool) {
        this.dead = bool;
    }

    update(dt) {
        this.particles = [...this.particles].filter(
            x => !this.trash.has(x)
        );
        this.trash.clear();


        if (this.lifetime !== null) {
            if (this.lifetime >= 0 && this.emiting) {
                this.lifetime -= dt;
            } else {
                this.emiting = false;
            }
        }
        if (this.emiting) {
            this.emit(this.emission);
        }

        let pos = this.pos;
        if (this.object.matrix) {
            pos = this.offset.add(this.object.pos).rotate(
                this.object.matrix, this.object.pos
            );
        }

        this.setPosition(pos.x, pos.y);
        this.updatePosition();

        for (let i in this.particles) {
            const particle = this.particles[i];
            if (particle.isDead()) {
                this.trash.add(particle);
                this._remove(particle);
                continue
            }
            particle.update(dt);
        }
    }

    _remove(object) {
        object.object = null
        this.container.removeChild(object.body);
        object.destroy();
    }

    _removeAll() {
        this.particles.forEach(obj => obj.setDead(true));
    }

    destroy() {
        this.stop();
        this._removeAll();
    }
}

console.log('[Import -> Particle, ParticleSystem]')
