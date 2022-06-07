// sprite.js
'use strict'

class Sprite extends Proto {
    constructor(tag, scene, x, y, type, anchor, angle, scale) {
        super(tag, x, y, anchor, angle, scale);
        this.scene = scene;
        this.type = {
            texture: type.texture,
            frame: type.frame,
            tiles: type.tiles || {x:1, y:1},
            color: type.color || 0xFFFFFF,
            alpha: type.alpha || (type.alpha >= 0 ? type.alpha : 1),
            interactive: type.interactive || false,
            collide: type.collide || false,
            toCollide: new Set(type.toCollide) || new Set(),
            colliderOffset: (
                type.colliderOffset || {
                    left: 0, right: 0, top: 0, bottom: 0
                }
            ),
            dynamic: type.dynamic || false,
            callback: type.callback,
            zindex: type.zindex
        };
        this.body = new GG.Sprite();
        this.init(type);
    }

    setBody(type) {
        // order important for gui update
        this.updatePosition();
        this.updateAngle();
        this.updateScale();
        this.updateAnchor();

        this.type.frame = type.frame || this.type.frame;
        this.type.tiles = type.tiles || this.type.tiles;

        this.type.texture = new GG.Texture(
            type.texture || this.type.texture
        );

        if (this.type.texture && this.type.frame) {
            this.type.texture.frame=this.type.frame;
        }
        this.body.texture = this.type.texture

        this.setAlpha(type.alpha || this.type.alpha);
        this.setColor(type.color || this.type.color);

        this.type.wid = this.body.width;
        this.type.hei = this.body.height;

        this.setRigidBody(type);
    }
}


class AnimatedSprite extends Proto {
    constructor(tag, scene, x, y, type,anchor, angle, scale) {
        super(tag, x, y, anchor, angle, scale);
        this.scene = scene;
        this.type = {
            texture: type.texture,
            frame: type.frame,
            tiles: type.tiles || {x:1, y:1},
            color: type.color || 0xFFFFFF,
            alpha: type.alpha || (type.alpha >= 0 ? type.alpha : 1),
            interactive: type.interactive || false,
            collide: type.collide || false,
            colliderOffset: (
                type.colliderOffset || new GG.Rectangle(0,0,1,1)
            ),
            toCollide: new Set(type.toCollide) || new Set(),
            colliderOffset: (
                type.colliderOffset || {
                    left: 0, right: 0, top: 0, bottom: 0
                }
            ),
            dynamic: type.dynamic || false,
            callback: type.callback,
            zindex: type.zindex,
        };
        this.animations = {};
        this.setAnimation(
            'idle',
            this.type.texture,
            this.type.tiles,
            this.type.frame
        );
        this.body = new GG.AnimatedSprite(this.animations['idle']);
        this.init(type);
    }

    setBody(type) {
        // important for gui update
        this.updatePosition();
        this.updateAngle();
        this.updateScale();
        this.updateAnchor();

        this.type.frame = type.frame || this.type.frame;
        this.type.tiles = type.tiles || this.type.tiles;
        this.type.texture = type.texture || this.type.texture;

        this.setAlpha(type.alpha || this.type.alpha);
        this.setColor(type.color || this.type.color);

        this.type.wid = this.body.width;
        this.type.hei = this.body.height;

        this.setRigidBody(type);
    }

    setAnimation(name, texture, tiles, rect) {
        const frame = rect || new GG.Rectangle(
            0, 0, texture.width, texture.height
        )
        let track = [];
        let x = 0;
        let y = 0;
        const wid = Math.floor(frame.width / tiles.x);
        const hei = Math.floor(frame.height / tiles.y);

        let textures = [];
        for (let i=0; i < tiles.y; i++) {
            y = frame.y + i * hei;
            for (let j=0; j < tiles.x; j++) {
                x = frame.x + j * wid;
                const tx = new GG.Texture(
                    texture, new GG.Rectangle(x, y, wid, hei)
                )
                track.push(tx);
            }
        }
        this.animations[name] = track;
    }

    setAnimationSpeed(speed) {
        this.body.animationSpeed = speed;
    }

    playAnimation(name, frame=0, loop=true) {
        this.body.textures = this.animations[name];
        this.body.loop = loop;
        this.body.gotoAndPlay(frame)
    }
    isPlayingAnimation(name) {
        return (
            this.body.playing
            && this.body.textures === this.animations[name]
        );
    }
    isPlaying() {
        return this.body.playing;
    }

    // totalFrames
    stopAnimation(goto=null) {
        goto ? this.body.gotoAndStop(goto) : this.body.stop()
    }
}

console.log('[Import -> Sprite, AnimatedSprite]')
