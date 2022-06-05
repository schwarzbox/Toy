// ship.js
'use strict'

export class Ship extends Sprite {
    static tag = 'ship';
    static image = 'images/ship.png';
    static toCollide = ['asteroid'];

    setup(type) {
        this.setSpeed(32);
        this.setTorque(12);
        this.setLinearDamping(0.5);
        this.delay = 0.2;
        this.fireDelay = this.delay;
    }

    events() {
        Events.addWindowEvent('keyup', this.onKeyUp.bind(this));
        Events.addWindowEvent('keydown', this.onKeyDown.bind(this));
    }

    onKeyUp(event) {
        if (event.code === 'KeyW') {this.top = false;}
        if (event.code === 'KeyD') {this.right = false;}
        if (event.code === 'KeyA') {this.left = false;}
        if (event.code === 'Space') {this.fire = false;}
    }

    onKeyDown(event) {
        if (event.code === 'KeyW') {this.top = true;}
        if (event.code === 'KeyD') {this.right = true;}
        if (event.code === 'KeyA') {this.left = true;}
        if (event.code === 'Space') {this.fire = true;}
    }

    onCollision(other) {
        if (other.tag == 'asteroid') {
            this.onHit(other);
        }
    }

    update(dt) {
        super.update(dt);
        this.applyMove(dt);

        let move = new Vector(0, 0);
        if (this.right) {
            this.applyTorque(this.torque);
        }
        if (this.left) {
            this.applyTorque(-this.torque);
        }
        if (this.top) {
            this.applyForce(new Vector(this.speed, 0).rotate(
                    this.matrix, this.vel
                )
            );
        }

        this.fireDelay-=dt;
        if (this.fire && this.fireDelay <= 0) {
            this.fireDelay = this.delay;
            const bullet = new GG.objects.Bullet(
                GG.objects.Bullet.tag, this.scene,
                this.pos.x, this.pos.y,
                {
                    shape: 'circle',
                    fillColor: Settings.colors.yellow,
                    wid: 4,
                    hei: 4,
                    collide: true,
                    toCollide: GG.objects.Bullet.toCollide,
                    dynamic: true,
                },
                new Vector(0.5, 0.5)
            );
            this.setZindex(1);

            bullet.applyForce(
                new Vector(bullet.speed, 0).rotate(
                    this.matrix, this.vel
                )
            );
        }

        let pos = this.pos;
        if (this.pos.x > GG.app.renderer.view.width) {
            pos.x = 0;
        } else if (this.pos.x < 0) {
            pos.x = GG.app.renderer.view.width;
        }
        if (this.pos.x > GG.app.renderer.view.height) {
            pos.y = 0;
        } else if (this.pos.y < 0) {
            pos.y = GG.app.renderer.view.height;
        }
        this.setPosition(pos.x, pos.y);
    }

    onHit(other) {
        this.setDead(true);
        this.scene.gameOver();
    }
}
