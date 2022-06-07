// scene.js
'use strict'

class SceneSystem {
    static initUI(ui) {
        GG.app.stage.addChild(ui.container);
    }
    static endUI(ui, clear) {
        if (clear) {
            ui.end();
        }
        GG.app.stage.removeChild(ui.container);
    }

    static initScene(scene, context) {
        if (!scene.initialized) {
            scene.init(context);
        } else {
            scene.events();
            scene.objects.forEach((obj) => {
                obj.events();
            });
        }
        GG.app.stage.addChild(scene.container);
    }

    static endScene(scene, clear=false) {
        if (clear) {
            scene.end();
        }
        GG.app.stage.removeChild(scene.container);
    }

    static init(tag, context={}, clear=false) {
        if (GG.scene) {
            SceneSystem.endScene(GG.scene, clear)
            SceneSystem.endUI(GG.ui, clear)
        }

        if (Object.keys(GG.scenes).length !== 0) {
            GG.scene = GG.scenes[tag];
            GG.ui = GG.uis[tag];

            SceneSystem.initScene(GG.scene, context);
            SceneSystem.initUI(GG.ui)

        } else {
            console.log('[Warning -> No Scenes]');
        }
    }

    static update(dt) {
        GG.ui.update(dt);
        GG.scene.update(dt);
    }

    static end() {
        GG.ui.end();
        GG.scene.end();
    }
}


class UI {
    constructor(tag) {
        this.tag=tag;

        this.container = new GG.Container();
        this.objects = [];
        this.trash = new Set();

        this.container.visible = true;
        this.container.interactiveChildren = true;
        this.container.interactive = true;
    }

    addImage(
        x, y,
        image,
        anchor=new Vector(0.5, 0.5),
        zindex=null,
        frame=null,
        alpha=1
    ) {
        const texture = new GG.Texture(image);
        if (frame) {
            texture.frame = frame;
        }
        const sprite = new GG.Sprite();
        sprite.texture = texture
        sprite.position.set(x, y);
        sprite.anchor.set(anchor.x, anchor.y)
        sprite.zIndex = zindex;
        sprite.alpha = alpha;
        if (zindex!==null) {
            this.container.addChildAt(sprite, zindex);
        } else {
            this.container.addChild(sprite);
        }

        return sprite;
    }

    addSprite(object, zindex=null) {
        if (zindex!==null) {
            this.container.addChildAt(object.body, zindex);
        } else {
            this.container.addChild(object.body);
        }
        this.objects.push(object);
    }

    update(dt) {
        this.objects = [...this.objects].filter(
            x => !this.trash.has(x)
        );
        this.trash.clear();

        for (let index in this.objects) {
            const object = this.objects[index];
            if (object.isDead()) {
                this.trash.add(object);
                this._remove(object);
                continue
            }
            object.update(dt);
        }
    }

    _remove(object) {
        this.container.removeChild(object.body || object.container);
        object.destroy();
    }

    _removeAll() {
        this.objects.forEach(obj => obj.setDead(true));
        // this.container.children.forEach((obj) => {obj.destroy()});
    }

    end() {
        Events.removeAll(this, this.objects);
        this._removeAll();
    }
}


class SceneReactor {
    constructor() {
        this.reactors = {};
        this.emitters = {};
    }

    addSignal(reactor, signal) {
        if (!this.reactors[reactor.uuid]) {
            this.reactors[reactor.uuid] = {};
        }
        this.reactors[reactor.uuid][signal] = (args) => {
            if (args) {
                reactor[signal](...args);
            } else {
                reactor[signal]();
            }
        };
    }

    removeSignal(reactor, signal) {
        if (
            this.reactors[reactor.uuid]
            && this.reactors[reactor.uuid][signal]
        ) {
            delete this.reactors[reactor.uuid][signal];
        }
    }

    addEmitter(reactor, emitter) {
        if (!this.emitters[emitter.uuid]) {
            this.emitters[emitter.uuid] = new Set();
        }
        this.emitters[emitter.uuid].add(reactor.uuid);
    }

    copyEmitter(source, dest) {
        if (this.emitters[source.uuid]) {
            this.emitters[dest.uuid] = new Set(
                this.emitters[source.uuid]
            );
        }
    }

    removeReactors() {
        for (let key in this.reactors) {
            this._removeReactor(this.reactors[key]);
        }
    }

    removeReactor(reactor) {
        this._removeReactor(reactor.uuid);
    }

    _removeReactor(reactorUuid) {
        if (this.reactors[reactorUuid]) {
            delete this.reactors[reactorUuid];
            for (let key in this.emitters) {
                if (this.emitters[key].has(reactorUuid)) {
                    this.emitters[key].delete(reactorUuid);
                }
            }
        }
    }

    removeEmitters() {
        for (let key in this.emitters) {
            this._removeEmitter(this.emitters[key]);
        }
    }

    removeEmitter(emitter) {
        this._removeEmitter(emitter.uuid);
    }

    _removeEmitter(emitterUuid) {
        if (this.emitters[emitterUuid]) {
            delete this.emitters[emitterUuid];
        }
    }

    emit(emitter, signal, args) {
        const reactors = this.emitters[emitter.uuid];
        if (reactors) {
            reactors.forEach((uuid) => {
                if (this.reactors[uuid] && this.reactors[uuid][signal]) {
                    this.reactors[uuid][signal](args);
                }
            });
        }
    }
}


class Scene {
    constructor(tag) {
        this.tag=tag;

        this.reactor = new SceneReactor();

        this.container = new GG.Container();
        this.container.interactive = true;
        this.container.interactiveChildren = true;

        this.pos = new Vector();
        this.angle = 0;
        this.rotation = 0;
        this.scale = new Vector(1, 1);
        this.pivot = new Vector();
        this.objects = [];
        this.particleSystems = [];

        this.trash = new Set();

        this.camera = null;
        this.timer = null;

        this.initialized = false;
    }

    init(context) {
        this.initialized = true;
        this.setup(context);
        this.events();
    }

    setup(context) {
        throw new Error("Abstract method!");
    }

    events() {
        throw new Error("Abstract method!");
    }

    addImage(
        x, y,
        image,
        anchor=new Vector(0.5, 0.5),
        zindex=null,
        frame=null,
        alpha=1
    ) {
        const texture = new GG.Texture(image);
        if (frame) {
            texture.frame = frame;
        }
        const sprite = new GG.Sprite();
        sprite.texture = texture
        sprite.position.set(x, y);
        sprite.anchor.set(anchor.x, anchor.y)
        sprite.zIndex = zindex;
        sprite.alpha = alpha;
        if (zindex!==null) {
            this.container.addChildAt(sprite, zindex);
        } else {
            this.container.addChild(sprite);
        }

        return sprite;
    }
    removeImage(sprite) {
        this.container.removeChild(sprite);
        sprite.destroy();
    }

    addSprite(object, zindex=null) {
        if (zindex!==null) {
            this.container.addChildAt(object.body, zindex);
        } else {
            this.container.addChild(object.body);
        }
        this.objects.push(object);
    }

    addParticleSystem(ps) {
        this.container.addChild(ps.container);
        this.particleSystems.push(ps);
    }

    setMask(type, x, y, wid, hei) {
        if (type==='rect') {
            this.container.mask = new GG.Graphics()
                .beginFill(0xffffff)
                .drawRect(x,y,wid,hei)
                .endFill();
        } else if (type==='circle') {
            this.container.mask = new GG.Graphics()
                .beginFill(0xffffff)
                .drawCircle(x,y,wid/2)
                .endFill();
        }
    }

    setCursor(cursor) {
        this.container.cursor = cursor;
    }

    setPosition(x, y) {
        this.pos.set(x,y);
    }
    setAngle(angle) {
        this.angle = angle;
    }
    setScale(scale) {
        this.scale = scale;
    }
    setPivot(x, y) {
        this.pivot.set(x, y);
    }

    updatePosition() {
        this.container.position.set(this.pos.x, this.pos.y);
    }
    updateAngle() {
        this.container.angle = this.angle;
        this.rotation = this.container.rotation;
    }
    updateScale() {
        this.container.scale.set(this.scale.x, this.scale.y);
    }
    updatePivot() {
        this.container.pivot.set(this.pivot.x, this.pivot.y);
    }

    getClosestObjects(object, radius=0, tags=[]) {
        let objects = [];
        for (let index in this.objects) {
            const other = this.objects[index];
            if (other.body.visible && other !== object) {
                let dist = other.collider.center.dist(object.pos);

                if (dist <= radius) {

                    if (tags.length>0) {
                        if (tags.includes(other.tag)) {
                            objects.push(other);
                        }
                    } else {
                        objects.push(other);
                    }
                }
            }
        }
        return objects;
    }

    getObjectsByTag(...args) {
        let objects = [];
        for (let index in this.objects) {
            const object = this.objects[index];
            if (args.includes(object.tag)) {
                objects.push(object);
            }
        }
        return objects;
    }

    getObjectByUUID(uuid) {
        for (let index in this.objects) {
            const object = this.objects[index];
            if (object.uuid == uuid) {
                return object;
            }
        }
    }

    isCollide(self, other) {
        return !(self.collider.right < other.collider.left
            || self.collider.left > other.collider.right
            || self.collider.bottom < other.collider.top
            || self.collider.top > other.collider.bottom);
    }

    update(dt) {
        this.objects = [...this.objects].filter(
            x => !this.trash.has(x)
        );
        this.particleSystems = [...this.particleSystems].filter(
            x => !this.trash.has(x)
        );
        this.trash.clear();

        if (this.camera) {
            this.camera.update(dt);
            this.setPosition(this.camera.pos.x, this.camera.pos.y);
            this.setAngle(this.camera.angle);
            this.setScale(
                new Vector(this.camera.scale, this.camera.scale)
            );
            this.setPivot(this.camera.pivot.x, this.camera.pivot.y);
        }
        this.updatePosition();
        this.updateAngle();
        this.updateScale();
        this.updatePivot();

        const cx = this.camera
                    ? Math.floor(this.camera.pivot.x)
                    : GG.app.renderer.view.width / 2;
        const cy = this.camera
                    ? Math.floor(this.camera.pivot.y)
                    : GG.app.renderer.view.height / 2;
        const dvwid = Math.floor(GG.app.renderer.view.width);
        const dvhei = Math.floor(GG.app.renderer.view.height);
        const svwid = Math.floor(dvwid + dvwid / 2);
        const svhei = Math.floor(dvhei + dvhei / 2);

        const nView = cy-svhei
        const sView = cy+svhei
        const wView = cx-svwid
        const eView = cx+svwid

        const dnView = cy-dvhei
        const dsView = cy+dvhei
        const dwView = cx-dvwid
        const deView = cx+dvwid

        for (let index in this.particleSystems) {
            const ps = this.particleSystems[index];

            if (ps.isDead()) {
                this.trash.add(ps);
                this._remove(ps);
                continue
            }
            let onScreen = (
                ps.pos.y > dnView
                && ps.pos.y < dsView
                && ps.pos.x > dwView
                && ps.pos.x < deView
            );

            ps.update(dt);
            ps.container.renderable = onScreen;
            ps.setVisible(onScreen);
        }

        // disable off-screen render
        // visible large than screen for scene camera
        const visible = []
        for (let index in this.objects) {
            const object = this.objects[index];
            if (object.isDead()) {
                // cleanup signals and emitters
                this.reactor.removeReactor(object);
                this.reactor.removeEmitter(object);

                this.trash.add(object);
                this._remove(object);
                continue
            }
            let onScreen = false
            // dynamic & collided object has less visible
            if (object.type.dynamic || object.type.collide) {
                onScreen = (
                    object.pos.y > dnView
                    && object.pos.y < dsView
                    && object.pos.x > dwView
                    && object.pos.x < deView
                );
            } else {
                onScreen = (
                    object.pos.y > nView
                    && object.pos.y < sView
                    && object.pos.x > wView
                    && object.pos.x < eView
                );
            }

            object.body.renderable = onScreen;

            if (onScreen) {
                visible.push(object);
            }
        }


        for (let selfIndex in visible) {
            const self = visible[selfIndex];

            self.update(dt);

            // important for optimization for totally static objects
            if (self.type.collide) {
                for (const otherIndex in visible) {
                    const other = visible[otherIndex];
                    if (self !== other
                        && !other.isDead()
                        && self.type.toCollide.has(other.tag)
                        && this.isCollide(self, other)
                    ) {
                        self.onCollision(other);
                    }
                }
                // bounce once in one iteration
                self._isBounce = false;
            }
        }
    }

    _remove(object) {
        this.container.removeChild(object.body || object.container);
        object.destroy();

        if (this.camera && this.camera.object === object) {
            this.camera.reset();
            this.camera = null;
        }
    }

    _removeAll() {
        this.particleSystems.forEach(ps => ps.setDead(true));
        this.objects.forEach(obj => obj.setDead(true));

        // this.container.children.forEach(obj => obj.destroy());

        this.reactor.removeReactors();
        this.reactor.removeEmitters();

        this.camera = null;
        this.timer = null;

        this.pos = new Vector();
        this.angle = 0;
        this.rotation = 0;
        this.scale = new Vector(1, 1);
        this.pivot = new Vector();

        this.initialized = false;
    }

    end() {
        Events.removeAll(this, this.objects);
        this._removeAll();
    }
}

console.log('[Import -> SceneSystem, GUI, SceneReactor, Scene]')
