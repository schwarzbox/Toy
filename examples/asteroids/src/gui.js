// gui.js
'use strict'

class GUI extends Shape {
    init(type) {
        this.scene.addSprite(this, type.zindex);
        this.type.zindex = this.body.zIndex;

        this.type.padding = type.padding > 1 ? type.padding : 2;
        this.halfPad = this.type.padding / 2;
        this.halfBorder = this.type.border / 2;

        let posx = this.pos.x + this.halfPad + this.halfBorder - this.type.padding * this.anchor.x - this.type.border * this.anchor.x;
        let posy = this.pos.y + this.halfPad + this.halfBorder - this.type.padding * this.anchor.y - this.type.border * this.anchor.y;

        if (type.image) {
            this.sprite = new Sprite(
                "GUI",
                this.scene,
                posx,
                posy,
                {
                    texture: type.image
                },
                this.anchor, this.angle, this.scale
            )
            this.setImageColor = (color) => {
                this.sprite.setColor(color);
            }

        } else if (type.text.toString()) {
            this.sprite = new Text(
                "GUI",
                this.scene,
                posx,
                posy,
                {
                    text: type.text,
                    font: type.font,
                    size: type.size,
                    fillColor: type.color,
                },
                this.anchor, this.angle, this.scale
            );

            this.setTextColor = (color) => {
                this.sprite.setColor(color);
            }
        }

        this.type.wid = (
            this.sprite.body.width + this.type.padding + this.type.border
        );
        this.type.hei = (
            this.sprite.body.height + this.type.padding + this.type.border
        );

        this.setBody(this.type);

        // use type to set additional options or combine objects
        this.setup(type);
        this.events();
    }

    setPosition(x, y) {
        super.setPosition(x, y);
        if (this.sprite) {
            let posx = this.pos.x + this.halfPad + this.halfBorder - this.type.padding * this.anchor.x - this.type.border * this.anchor.x;
            let posy = this.pos.y + this.halfPad + this.halfBorder - this.type.padding * this.anchor.y - this.type.border * this.anchor.y;
            this.sprite.setPosition(posx, posy);
        }
    }

    updatePosition(){
        super.updatePosition();
        if (this.sprite) {
            this.sprite.updatePosition();
        }
    }

    updateAnchor(){
        super.updateAnchor();
        if (this.sprite) {
            this.sprite.updateAnchor();
        }
    }

    setVisible(bool){
        super.setVisible(bool);
        if (this.sprite) {
            this.sprite.setVisible(bool);
        }
    }

    setup(type) {

    }

    events() {

    }

    onChange(value, isCallback=true) {

    }

    setValue(value) {
        if (
            typeof(value) === 'string'
            || typeof(value) === 'number'
        ) {
            this.sprite.setBody({text: value});
        } else {

            this.sprite.setBody({texture: value});
        }

        this.setBody({
            wid: this.sprite.body.width + this.type.padding + this.type.border,
            hei: this.sprite.body.height + this.type.padding + this.type.border
        });
        this.updatePosition();
    }

    update(dt) {
        super.update(dt);
    }

    destroy() {
        if (this.sprite) {
            this.sprite.setDead(true);
        }
        super.destroy();
    }
}

class Label extends GUI {
    onChange(value, isCallback=true) {
        if (value) {
            this.setValue(value);
        }

        if (this.type.callback && isCallback) {
            this.type.callback();
        }
    }
}

class Button extends GUI {
    setup(type) {
        this.setInteractive(true);
        this.sprite.setInteractive(true);

        this.setCursor('gui');
        this.sprite.setCursor('gui');
    }
    events() {
        Events.addObjectEvent(this.sprite, 'pointerdown', (x)=>{
            this.sprite.setColor(this.type.color << 2);
        });
        Events.addObjectEvent(this.sprite, 'pointerup', (x)=>{
            this.onChange();
        });
        Events.addObjectEvent(this.sprite, 'pointerupoutside', (x)=>{
            this.sprite.setColor(0xFFFFFF);
        });
    }
    onChange(value, isCallback=true) {
        if (value) {
            this.setValue(value);
        }

        if (this.type.callback && isCallback) {
            this.type.callback();
        }
        // reset after click
        this.sprite.setColor(0xFFFFFF);
    }
}

class Bar extends GUI {
    init(type) {
        this.scene.addSprite(this, type.zindex);
        this.type.zindex = this.body.zIndex;

        this.type.padding = type.padding > 1 ? type.padding : 2;
        this.halfPad = this.type.padding / 2;
        this.halfBorder = this.type.border / 2;

        this.sprite = new Shape("GUI",
                             this.scene,
                             this.pos.x+this.halfPad+this.halfBorder,
                             this.pos.y+this.halfPad+this.halfBorder,
                             {
                                shape: 'rectangle',
                                wid: this.type.wid,
                                hei: this.type.hei,
                                fillColor: type.color,
                                // lineColor: this.type.lineColor,
                                // border: 0,
                             },
                             this.anchor, this.angle, this.scale);


        this.sprite.max = type.max;
        this.sprite.min = type.min || 0;
        this.sprite.value = type.value || 0;
        this.type.wid = this.type.wid + this.type.padding + this.type.border;
        this.type.hei = this.type.hei + this.type.padding + this.type.border;

        this.setBody(this.type);

        // use type to set additional options or combine objects
        this.setup(type);
        this.events();
    }
    setup(type) {
        this.onChange(this.sprite.value, false);
    }

    setValue(value) {
        this.sprite.value = Tools.clamp(
            value, this.sprite.min, this.sprite.max
        );
        const diff =  this.sprite.value / this.sprite.max;
        const wid = (this.type.wid - this.type.padding - this.type.border) * diff;

        this.sprite.setBody({wid: wid>0 ? wid : 0});
    }

    onChange(value, isCallback=true) {
        this.setValue(value);
        if (this.type.callback && isCallback) {
            this.type.callback();
        }
    }

    setBarColor(color) {
        this.sprite.setColor(color);
    }
}

class Slider extends GUI {
    init(type) {
        this.scene.addSprite(this, type.zindex);
        this.type.zindex = this.body.zIndex;

        this.type.padding = type.padding > 1 ? type.padding : 2;
        this.halfPad = this.type.padding / 2;
        this.halfBorder = this.type.border / 2;

        this.sprite = new Shape("GUI",
                             this.scene,
                             this.pos.x+this.halfPad+this.halfBorder,
                             this.pos.y+this.halfPad+this.halfBorder,
                             {
                                shape: 'rectangle',
                                wid: this.type.hei,
                                hei: this.type.hei,
                                fillColor: type.color,
                                interactive: true,
                             },
                             this.anchor, this.angle, this.scale);

        this.type.color = type.color;
        this.sprite.max = type.max;
        this.sprite.min = type.min || 0;
        this.sprite.value = type.value || 0;
        this.type.wid = this.type.wid + this.type.padding + this.type.border;
        this.type.hei = this.type.hei + this.type.padding + this.type.border;

        this.setBody(this.type);

        // use type to set additional options or combine objects
        this.setup(type);
        this.events();
    }

    setup(type) {
        this.onChange(-this.sprite.value, false);

        this.dx = null;

        this.sprite.setCursor('gui');
        this.setBody(this.type);
    }

    events() {
        Events.addObjectEvent(this.sprite, 'pointerdown', (x)=>{
            this.sprite.setColor(0xFFFFFF);
            this.dx = x.data.global.x;
        });
        Events.addObjectEvent(this.sprite, 'pointermove', (x)=>{
            if (this.dx) {
                this.onChange(this.dx - x.data.global.x);
                this.dx = x.data.global.x;
            }
        });
        Events.addObjectEvent(this, 'pointermove', (x)=>{
            if (this.dx) {
                this.onChange(this.dx - x.data.global.x);
                this.dx = x.data.global.x;
            }
        });
        Events.addObjectEvent(this.sprite, 'pointerup', (x)=>{
            this.sprite.setColor(this.type.color);

            this.dx = null
        });
        Events.addObjectEvent(this.sprite, 'pointerupoutside', (x)=>{
            this.sprite.setColor(this.type.color);
            this.dx = null
        });
    }

    setValue(value) {
        this.sprite.value = Tools.clamp(
            this.sprite.value - value, this.sprite.min, this.sprite.max
        )

        const min = this.pos.x + this.halfPad + this.halfBorder
        const max = min + this.type.wid - this.type.padding - this.type.border
        const x = Tools.clamp(
            this.sprite.pos.x - value,
            min,
            max - this.sprite.type.wid
        )
        this.sprite.setPosition(x, this.sprite.pos.y);
        this.sprite.updatePosition();
    }

    onChange(value, isCallback=true) {
        this.setValue(value);

        if (this.type.callback && isCallback) {
            this.type.callback();
        }
    }

    setHandleColor(color) {
        this.sprite.setColor(color);
    }
}

class Box extends GUI {
    init(type) {
        this.isBox = true;
        this.objects = [];
        this.trash = new Set();

        this.scene.addSprite(this, type.zindex);
        if (type.zindex) {
            this.setZindex(type.zindex);
        }


        this.type.padding = type.padding > 1 ? type.padding : 2;
        this.halfPad = this.type.padding / 2;
        this.halfBorder = this.type.border / 2;

        this.type.sep = type.sep || 0;
        this.type.align = type.align || 'center';

        this.add();

        this.setup(type);
        this.events();
    }

    add(...objects) {
        if (objects) {
            this.objects.push(...objects);
        }

        this.setSize();
        this.setXY();

        this.setBody(this.type);
    }

    update(dt) {
        super.update(dt);
        this.objects = [...this.objects].filter(
            x => !this.trash.has(x)
        );
        this.trash.clear();

        for (let index in this.objects) {
            const object = this.objects[index];
            if (object.isDead()) {
                this.trash.add(object);
            }
        }
    }

    _removeAll() {
        this.objects.forEach(obj => obj.setDead(true));
    }

    destroy() {
        this._removeAll();
        super.destroy();
    }
}

class HBox extends Box {

    setAlign(hei) {
        let y = this.pos.y - this.type.hei * this.anchor.y;
        if (this.type.align == 'center') {
            y = y + (this.type.hei - hei) / 2
        } else if (this.type.align == 'top') {
            y = y + this.halfPad
        } else if (this.type.align == 'bottom') {
            y = y + this.type.hei - hei - this.halfPad
        }
        return y
    }

    setSize() {

        this.type.wid = this.type.border;
        let maxhei = 0;
        for (let obj in this.objects) {
            if (this.objects[obj].type.hei > maxhei) {
                maxhei = this.objects[obj].type.hei
            }
            this.type.wid += this.objects[obj].type.wid + this.type.sep;
        }
        this.type.wid += this.type.padding - this.type.sep;
        this.type.hei = maxhei + this.type.padding + this.type.border;

    }

    setXY() {
        let posx = this.pos.x - this.type.wid * this.anchor.x + this.halfPad + this.halfBorder;
        let posy = 0;

        for (let obj in this.objects) {
            posy = this.setAlign(this.objects[obj].type.hei);

            this.objects[obj].setAnchor(new Vector());
            this.objects[obj].updateAnchor();
            this.objects[obj].setPosition(posx, posy);
            this.objects[obj].updatePosition();

            posx += this.objects[obj].type.wid + this.type.sep;

            if (this.objects[obj].isBox) {
                this.objects[obj].setXY()
            }
        }
    }
}

class VBox extends Box {

    setAlign(wid) {
        let x = this.pos.x - this.type.wid * this.anchor.x;
        if (this.type.align == 'center') {
            x = x  + (this.type.wid - wid) / 2
        } else if (this.type.align == 'left') {
            x = x + this.halfPad
        } else if (this.type.align == 'right') {
            x = x + this.type.wid - wid - this.halfPad
        }
        return x
    }

    setSize() {
        let maxwid = 0;
        this.type.hei = this.type.border;
        for (let obj in this.objects) {
            if (this.objects[obj].type.wid > maxwid) {
                maxwid = this.objects[obj].type.wid
            }
            this.type.hei += this.objects[obj].type.hei + this.type.sep;

        }
        this.type.wid = maxwid + this.type.padding + this.type.border;
        this.type.hei += this.type.padding - this.type.sep;
    }

    setXY() {
        let posx = 0
        let posy = this.pos.y - this.type.hei * this.anchor.y + this.halfPad + this.halfBorder;

        for (let obj in this.objects) {
            posx = this.setAlign(this.objects[obj].type.wid);

            this.objects[obj].setAnchor(new Vector());
            this.objects[obj].updateAnchor();
            this.objects[obj].setPosition(posx, posy);
            this.objects[obj].updatePosition();


            posy += this.objects[obj].type.hei + this.type.sep;

            if (this.objects[obj].isBox) {
                this.objects[obj].setXY()
            }
        }
    }
}


console.log('[Import -> GUI, Label, Button, Bar, Slider, HBox, VBox]')
