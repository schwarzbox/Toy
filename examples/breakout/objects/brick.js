// brick.js
'use strict'

export class Brick extends Sprite {
    static tag = 'brick';
    static image = 'images/brick.png';
    static concrete = 'images/concrete.png';
    static colors = [
        Settings.colors.brickRed,
        Settings.colors.brickOrange,
        Settings.colors.brickGreen,
        Settings.colors.brickYellow,
        Settings.colors.brickBlue
    ]

    static colliderOffset = {left: 0, right: 0, top: 0, bottom: 0}
    static updateBrickTexture =  new GG.Runner('updateTexture');

    setup(type) {
        this.isConcrete = false;
        this.concreteTiker = null;
        this.lastColor = null;

        Brick.updateBrickTexture.add(this);
    }

    events() {

    }

    update(dt) {

    }

    updateTexture() {
        let concretetime = 10000;

        if (this.lastColor === null) {
            this.lastColor = this.type.color;
        }

        if (this.concreteTiker) {
            concretetime += this.concreteTiker.delay;
            this.concreteTiker.stop();
        }

        this.concreteTiker = this.scene.timer.after(concretetime,
            () => {
                this.setBody({
                    texture: GG.Resources[Brick.image].texture,
                    color: this.lastColor
                })
                this.isConcrete = false;
                this.lastColor = null;
            }
        )

        this.setBody({
            texture: GG.Resources[Brick.concrete].texture,
            color: Settings.colors.white
        })
        this.isConcrete = true;
    }

    onHit(other) {
        let color = this.type.color;

        if (this.isConcrete && !other.isFire) {
            color = Settings.colors.white;
        } else {
            if (Math.random() < 0.3) {
                const bonuses = [
                    GG.objects.Life,
                    GG.objects.Dead,
                    GG.objects.Multi,
                    GG.objects.Small,
                    GG.objects.Large,
                    GG.objects.Fireball,
                    GG.objects.Concrete
                ];
                const bonusClass = bonuses[
                    Tools.randomRange(0, bonuses.length-1)
                ];
                const bonus = new bonusClass(
                    bonusClass.tag, this.scene,
                    this.collider.center.x, this.collider.center.y,
                    {
                        texture: GG.Resources[
                            bonusClass.image
                        ].texture,
                        collide: true,
                        toCollide: bonusClass.toCollide,
                        colliderOffset: bonusClass.colliderOffset,
                        dynamic: true
                    },
                    new Vector(0.5, 0.5)
                )
                bonus.brick = this;
            }
            this.scene.reactor.emit(other, 'updateScore', [1]);
            this.setDead(true);
        }

        const eff = new ParticleSystem(
            'ps', this, new Vector(16,8)
        );
        eff.setParticle({
            texture: GG.Texture.WHITE,
            color: [color],
            scale: [0.2, 0.6],
            alpha: [1, 1],
            angle: 360,
            time: [0.2, 0.4],
            spread: 360,
            area: 4,
            relative: true,
            speed: [8, 16],
        });

        eff.setLifetime(0.5);
        eff.emit(16);

        GG.Sound.play('sounds/hit.mp3');
    }
    destroy() {
        if (this.concreteTiker) {
            this.concreteTiker.stop();
            this.concreteTiker = null;
        }
        // need time to finish task
        Brick.updateBrickTexture.remove(this);
        super.destroy(this)
    }
}
