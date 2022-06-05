// vector.js
'use strict'

class Vector extends GG.Point {
    constructor(x=0,y=0) {
        super(x,y);
    }

    clone() {
        return new Vector(this.x, this.y);
    }
    add(v) {
        if (typeof(v) === 'object' && v.constructor.name === 'Vector') {
            return new Vector(this.x + v.x, this.y + v.y);
        }
        return new Vector(this.x + v, this.y + v);
    }
    sub(v) {
        if (typeof v === 'object' && v.constructor.name === 'Vector') {
            return new Vector(this.x - v.x, this.y - v.y);
        }
        return new Vector(this.x - v, this.y - v);
    }
    mul(v) {
        if (typeof v === 'object' && v.constructor.name === 'Vector') {
            return new Vector(this.x * v.x, this.y * v.y);
        }
        return new Vector(this.x * v, this.y * v);
    }
    div(v) {
        if (typeof v === 'object' && v.constructor.name === 'Vector') {
            return new Vector(this.x / (v.x>0 ? v.x : 1),
                              this.y / (v.y>0 ? v.y : 1));
        }
        v = v > 0 ? v : 1;
        return new Vector(this.x / v, this.y / v);
    }
    lim(limx, limy) {
        if (Math.abs(this.x)>limx) {
            this.x = (this.x>0 && limx) || -limx
        }
        if (Math.abs(this.y)>limy)  {
            this.y = (this.y>0 && limy) || -limy
        }
        return new Vector(this.x, this.y)
    }
    abs() {
        return new Vector(Math.abs(this.x),Math.abs(this.y))
    }
    sign() {
        return new Vector(this.x>=0 ? 1 : -1, this.y>=0 ? 1 : -1)
    }
    equal(v) {
        return (this.x === v.x && this.y === v.y);
    }
    mag() {
        return (this.x**2 + this.y**2)**0.5;
    }
    mag2() {
        return (this.x**2 + this.y**2);
    }
    dot(v) {
        return this.x*v.x+this.y*v.y
    }
    dist(v) {
        return this.sub(v).mag();
    }
    unit() {
        return this.div(this.mag());
    }
    normal() {
        return new Vector(this.y,-this.x).unit();
    }
    head() {
        return Math.atan2(this.y, this.x);
    }

    rotate(matrix, v) {
        const dir = this.sub(v)
        return new Vector(dir.dot(matrix[0])+v.x, dir.dot(matrix[1])+v.y)
    }

    static matrix(radian) {
        const vcos=Math.cos(radian)
        const vsin=Math.sin(radian)
        return [new Vector(vcos,-vsin),new Vector(vsin,vcos)]
    }
    static random() {
        return new Vector(Math.random()*2-1, Math.random()*2-1).unit()
    }

    static direction(radian) {
        return new Vector(Math.cos(radian), Math.sin(radian));
    }
}


console.log('[Import -> Vector]')
