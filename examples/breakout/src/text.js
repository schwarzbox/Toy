// text.js
'use strict'

class Text extends Proto {
    constructor(tag, scene, x, y, type, anchor, angle, scale) {
        super(tag, x, y, anchor, angle, scale);
        this.scene = scene;
        this.type = {
            text: type.text.toString() || "",
            font: type.font || "Andale Mono",
            size: type.size || 16,
            align: type.align || "center",
            wid: 0,
            hei: 0,
            color: type.color || 0xFFFFFFFF,
            alpha: type.alpha || (type.alpha >= 0 ? type.alpha : 1),
            fillColor: type.fillColor,
            lineColor: type.lineColor,
            border: type.border || 0,
            shadowColor: type.shadowColor,
            shadowAlpha: (
                type.shadowAlpha
                || (type.shadowAlpha >= 0 ? type.shadowAlpha : 1)
            ),
            shadowBlur: type.shadowBlur || 0,
            shadowAngle: Tools.toRadian(type.shadowAngle || 45),
            shadowDistance: type.shadowDistance || 0,
            wordWrap: type.wordWrap,
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
        this.body = new GG.Text(this.type.text);
        this.init(type);
    }

    setBody(type) {
        // important for gui update
        this.updatePosition();
        this.updateAngle();
        this.updateScale();
        this.updateAnchor();

        this.type.text = type.text.toString() || this.type.text;
        this.type.font = type.font || this.type.font;
        this.type.size = type.size || this.type.size;
        this.type.align = type.align || this.type.align;

        this.type.color = type.color || this.type.color;
        this.type.alpha = type.alpha || this.type.alpha;
        this.type.fillColor = type.fillColor || this.type.fillColor;
        this.type.lineColor = type.lineColor || this.type.lineColor;
        this.type.border = type.border || this.type.border;
        this.type.shadowColor = type.shadowColor || this.type.shadowColor;
        this.type.dropShadowAlpha = type.dropShadowAlpha || this.type.dropShadowAlpha;
        this.type.shadowBlur = type.shadowBlur || this.type.shadowBlur;
        this.type.shadowAngle = type.shadowAngle || this.type.shadowAngle;
        this.type.shadowDistance = type.shadowDistance || this.type.shadowDistance;
        this.type.wordWrap = type.wordWrap || this.type.wordWrap;

        this.setAlpha(type.alpha || this.type.alpha);

        this.body.text = this.type.text
        let style = new PIXI.TextStyle({
            fontFamily: this.type.font,
            fontSize: this.type.size,
            align: this.type.align,
            fill: this.type.fillColor,
            stroke: this.type.lineColor,
            strokeThickness: this.type.border,
            dropShadow: this.type.shadowColor ? true : false,
            dropShadowColor: this.type.shadowColor,
            dropShadowAlpha: this.type.shadowAlpha,
            dropShadowBlur: this.type.shadowBlur,
            dropShadowAngle: this.type.shadowAngle,
            dropShadowDistance: this.type.shadowDistance,
            wordWrap: this.type.wordWrap ? true : false,
            wordWrapWidth: this.type.wordWrap,
        });
        this.body.style=style;

        this.setColor(this.type.color);

        this.type.wid = this.body.width;
        this.type.hei = this.body.height;

        this.setRigidBody(type);
    }
}

console.log('[Import -> Text]')
