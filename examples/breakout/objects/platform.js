// platform.js
'use strict'

export class Platform extends Sprite {
    static tag = 'platform';
    static image = 'images/platform.png';
    static toCollide = ['bonus', 'border'];
    static colliderOffset = {left: 0, right: 0, top: 0, bottom: 0}

    setup(type) {
        this.setSpeed(128);
        this.setLinearDamping(8);

        this.life = 3;
        this.begin = false;

        this.plaforms = [
            'images/platformS.png',
            'images/platform.png',
            'images/platformL.png',
        ]
        this.currentPlatform = 1;

        this.balls = [];
        this.ball = this.addBall();

        this.scene.reactor.addSignal(this, 'restartGame');
        this.scene.reactor.addSignal(this, 'updateScore');
    }

    events() {
        Events.addWindowEvent('keyup', this.onKeyUp.bind(this));
        Events.addWindowEvent('keydown', this.onKeyDown.bind(this));
    }

    restartGame(uuid) {
        this.balls = [...this.balls].filter(
            x => x.uuid !== uuid
        );
        if (this.balls.length === 0) {
            this.updateLife(-1);

            if (this.life <= 0) {
                this.begin == false;
                this.ball = null;
                GG.Sound.play('sounds/take.mp3');
                this.scene.gameOver('GAME OVER');
            } else {
                this.ball = this.addBall();
            }
        }
    }

    updateScore(value) {
        this.scene.updateScoreLabel(-1);
        if (this.scene.bricks === 0) {
            GG.Sound.play('sounds/win.mp3');
            this.scene.gameOver('VICTORY');
        }
    }

    updateLife(value) {
        this.life+=value;
        this.scene.updateLifeLabel(value);
    }

    updatePlatform(value) {
        let mass = this.mass;
        this.currentPlatform += value;
        if (this.currentPlatform < 0) {
            this.currentPlatform = 0;
        } else if (this.currentPlatform >= this.plaforms.length-1){
            this.currentPlatform = this.plaforms.length-1;
        }

        this.setBody(
            {
                texture: GG.Resources[
                    this.plaforms[this.currentPlatform]
                ].texture
            }
        )
        // correct platform pos after increase size
        if (this.collider.left < 0) {
            this.setPosition(
                this.pos.x - this.collider.left, this.pos.y
            )
        }
        if (this.collider.right > GG.app.renderer.view.width) {
            this.setPosition(
                this.pos.x - (
                    this.collider.right - GG.app.renderer.view.width
                ),
                this.pos.y
            )
        }
        this.setMass(mass);
    }

    updateBalls(value) {
        for (let i=0; i<value; i++) {
            const ball = this.addBall();
            ball.updateMove();
            this.balls.push(ball);
        }
    }

    updateFire(value) {
        this.balls.forEach(b => {
            b.updateFire(value);
        });
    }

    addRicoshet(other) {
        const side = this.collider.center.sub(
            other.collider.center
        )
        const dist = side.mag();

        const force = other.vel.mag();
        const mod = (dist/this.type.wid)*2;
        let dir = other.vel.unit();
        dir.x += mod;
        dir.y -= mod;

        other.vel = dir.unit().mul(force * 1.01);
        if (side.x > 0) {
            other.vel.x = -Math.abs(other.vel.x);
        } else {
            other.vel.x = Math.abs(other.vel.x);
        }
    }

    addBall() {
        const ball = new GG.objects.Ball(
            GG.objects.Ball.tag, this.scene,
            this.collider.center.x, this.collider.top-8,
            {
                texture: GG.Resources[
                    GG.objects.Ball.image
                ].texture,
                interactive: true,
                collide: true,
                toCollide: GG.objects.Ball.toCollide,
                colliderOffset: GG.objects.Ball.colliderOffset,
                dynamic: true,
            },
            new Vector(0.5, 0.5)
        )
        this.scene.reactor.addEmitter(this, ball);
        this.balls.push(ball);
        return ball;
    }

    onCollision(other) {
        if (other.tag === 'bonus') {
            other.onHit(this);
            GG.Sound.play('sounds/take.mp3');
        }
        else if (other.tag === 'border') {
            this.moveAndSlide(other);
        } else {
            this.moveAndSlide(other);
        }
    }

    onKeyUp(event) {
        if (event.key === 'd' || event.key === 'ArrowRight') {
            this.right = false;
        }
        if (event.key === 'a' || event.key === 'ArrowLeft') {
            this.left = false;
        }
        if (event.key === ' ') {
            this.begin = false;
        }
    }

    onKeyDown(event) {
        if (event.key === 'd' || event.key === 'ArrowRight') {
            this.right = true;
        }
        if (event.key === 'a' || event.key === 'ArrowLeft') {
            this.left = true;
        }
        if (event.key === ' ') {
            this.begin = true;
        }
    }

    onHit(other) {
        this.setDead(true);
    }

    update(dt) {
        super.update(dt);

        let move = new Vector(0, 0);
        if (this.right) {
            move = move.add(new Vector(1, 0));
        }

        if (this.left) {
            move = move.add(new Vector(-1, 0));
        }

        if (this.begin && !this.ball.isMove) {
            this.ball.applyForce(new Vector(0, -this.ball.speed));
            this.ball.isMove = true;
        }

        if (!this.ball.isMove) {
            this.ball.setPosition(this.pos.x, this.ball.pos.y);
        }

        this.applyForce(move.unit().mul(this.speed).rotate(
                this.matrix, this.vel
            )
        );

        this.applyMove(dt);
    }
}
