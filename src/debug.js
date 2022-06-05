// debug.js
'use strict'

class Debug {
    constructor(object) {
        this.object = object;
        this.marks = [];
    }

    print(...value) {
        debugPrint.innerHTML=`${value}`
    }

    setMark(pos, color=0xFF2222, size=4) {
        const mark = new Shape('debug', this.object.scene,
             pos.x,
             pos.y,
            {
                shape: 'rectangle', wid: size, hei:  size,
                fillColor: color,
                lineColor: color,
                border: 1,
            }
        )
        this.marks.push(mark);
    }

    removeAllMarks() {
        this.marks.forEach((obj) => {
            obj.setDead(true);
        });
        this.marks = [];
    }

    initCollider(size=4) {
        this.debugCollide = new Shape('debug', this.object.scene,
             this.object.pos.x,
             this.object.pos.y,
            {
                shape: 'rectangle', wid: size, hei:  size,
                fillColor: 0xFF2222,
                lineColor: 0xFF2222,
                border: 1,
            }
        )
        this.debugCollideC = new Shape('debug', this.object.scene,
             this.object.pos.x,
             this.object.pos.y,
            {
                shape: 'rectangle', wid: size, hei:  size,
                fillColor: 0x22FF22,
                lineColor: 0x22FF22,
                border: 1,
            }
        )
        this.debugCollideT = new Shape('debug', this.object.scene,
             this.object.pos.x,
             this.object.pos.y,
            {
                shape: 'rectangle', wid: size, hei:  size,
                fillColor: 0x22FF22,
                lineColor: 0x22FF22,
                border: 1,
            }
        )
        this.debugCollideB = new Shape('debug', this.object.scene,
             this.object.pos.x,
             this.object.pos.y,
            {
                shape: 'rectangle', wid: size, hei:  size,
                fillColor: 0x22FF22,
                lineColor: 0x22FF22,
                border: 1,
            }
        )
        this.debugCollideR = new Shape('debug', this.object.scene,
             this.object.pos.x,
             this.object.pos.y,
            {
                shape: 'rectangle', wid: size, hei:  size,
                fillColor: 0x22FF22,
                lineColor: 0x22FF22,
                border: 1,
            }
        )
        this.debugCollideL = new Shape('debug', this.object.scene,
             this.object.pos.x,
             this.object.pos.y,
            {
                shape: 'rectangle', wid: size, hei:  size,
                fillColor: 0x22FF22,
                lineColor: 0x22FF22,
                border: 1,
            }
        )
    }

    updateCollider() {
        this.debugCollide.pos.set(
            this.object.pos.x, this.object.pos.y
        );
        this.debugCollideC.pos.set(
            this.object.collider.center.x,
            this.object.collider.center.y
        );
        this.debugCollideT.pos.set(
            this.object.collider.center.x,
            this.object.collider.top
        );
        this.debugCollideB.pos.set(
            this.object.collider.center.x,
            this.object.collider.bottom
        );
        this.debugCollideR.pos.set(
            this.object.collider.right,
            this.object.collider.center.y
        );
        this.debugCollideL.pos.set(
            this.object.collider.left,
            this.object.collider.center.y
        );
    }
}
