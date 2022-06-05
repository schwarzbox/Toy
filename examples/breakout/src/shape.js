// shape.js
'use strict'

class Shape extends Proto {
    constructor(tag, scene, x, y, type, anchor, angle, scale) {
        super(tag, x, y, anchor, angle, scale);
        this.scene = scene;
        this.type={
            shape: type.shape,
            wid: type.wid || 0,
            hei: type.hei || 0,
            fillColor: type.fillColor,
            fill: type.fill || "fill",
            lineColor: type.lineColor,
            border: type.border || 0,
            vertices: type.vertices || [],
            close: type.close || "close",
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
            zindex: type.zindex,
        };
        this.body = new GG.Graphics();
        this.init(type);
    }

    setBody(type) {
        // important for gui update
        this.updatePosition();
        this.updateAngle();
        this.updateScale();
        this.updateAnchor();

        this.body.clear();
        this.type.shape = type.shape || this.type.shape;
        this.type.wid = (type.wid || type.wid>=0) ? type.wid : this.type.wid;
        this.type.hei = (type.hei || type.hei>=0) ? type.hei : this.type.hei;
        this.type.fillColor = type.fillColor || this.type.fillColor;
        this.type.fill = type.fill || this.type.fill;
        this.type.lineColor = type.lineColor || this.type.lineColor;
        this.type.border = type.border || this.type.border;
        this.type.vertices = type.vertices || this.type.vertices;
        this.type.close = type.close || this.type.close;

        this.setAlpha(type.alpha || this.type.alpha);

        let shape = this.type.shape;
        let wid = this.type.wid;
        let hei = this.type.hei;
        let midwid = wid/2;
        let midhei = hei/2;

        this.body.lineStyle(this.type.border, this.type.lineColor);
        if (shape != 'line') {
            if (this.type.fill === "fill") {
                this.body.beginFill(this.type.fillColor);
            }
            switch (shape.toLowerCase()) {
                case 'circle':
                    this.body.drawEllipse(midwid, midhei, wid, hei);
                    break;
                case 'triangle':
                    this.body.drawPolygon([
                        midwid, 0,
                        wid, hei,
                        0, hei
                    ]);
                    break;
                case 'rectangle':
                    this.body.drawRect(0, 0, wid, hei);
                    break;
                case 'pentagon':
                    let pentWid = wid * 0.381966011727603 * 0.5
                    let pentHei = hei * 0.381966011727603
                    this.body.drawPolygon([
                        midwid, 0,
                        wid, pentHei,
                        wid-pentWid, hei,
                        pentWid, hei,
                        0, pentHei
                    ]);
                    break;
                case 'hexagon':
                    let hexhei = hei * 0.25
                    this.body.drawPolygon([
                        midwid, 0, wid, hexhei, wid, hei-hexhei,
                        midwid, hei, 0, hei-hexhei, 0, hexhei
                    ]);
                    break;
                case 'star':
                    let starWid = wid * 0.381966011727603 * 0.5
                    let starHei = hei * 0.381966011727603
                    let starMinWid = wid * 0.116788321167883
                    let starMaxWid = wid * 0.187956204379562
                    let starMinHei = hei * 0.62043795620438
                    let starMaxHei = hei * 0.755474452554745
                    this.body.drawPolygon([
                        midwid, 0, midwid+starMinWid, starHei,wid,
                        starHei, midwid+starMaxWid, starMinHei,
                        wid-starWid, hei, midwid, starMaxHei,
                        starWid, hei, midwid-starMaxWid, starMinHei,
                        0, starHei, midwid-starMinWid, starHei, midwid, 0
                    ]);
                    break;
                case 'polygon':
                    let polygon = new GG.Polygon(this.type.vertices);
                    polygon.closeStroke = false;
                    if (this.type.close === "close") {
                        polygon.closeStroke = true
                    }
                    this.body.drawPolygon(polygon);
                    this.type.wid = this.body.width
                    this.type.hei = this.body.height
                    break;
                default:
                    console.log('[Warning -> Wrong Shape type]');
            }
            this.body.endFill();
        } else {
            this.body.moveTo(0,0).lineTo(this.type.wid,this.type.hei);
            this.type.wid = this.body.width - type.border;
            this.type.hei = this.body.height - type.border;
        }

        this.setRigidBody(type);
    }

    setColor(fillColor, lineColor) {
        this.setBody({fillColor: fillColor, lineColor: lineColor});
    }

    updateScale() {
        const sx = parseFloat(this.body.position.scope.scale.x);
        const sy = parseFloat(this.body.position.scope.scale.y);
        this.body.position.scope.scale.set(this.scale.x, this.scale.y);
        if (sx === parseFloat(this.scale.x)
            && sy === parseFloat(this.scale.y)
        ) {
            return false;
        }
        return true
    }

    updateAnchor() {
        const ax = parseFloat(this.body.position.scope.pivot.x);
        const ay = parseFloat(this.body.position.scope.pivot.y);
        const px = this.type.wid*this.anchor.x;
        const py = this.type.hei*this.anchor.y
        this.body.position.scope.pivot.set(px, py);
        if (ax === parseFloat(px)
            && ay === parseFloat(py)
        ) {
            return false;
        }
        return true
    }
}

console.log('[Import -> Shape]')
