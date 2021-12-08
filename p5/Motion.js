import {Vector} from 'p5';
import p5 from './index.js';
// import p5 from 'p5';
// import p5 from 'p5';

// const P5 = new p5;

export default class Motion {
    constructor() {
        let x = 0;
        let y = 0;
        this.w = 0;
        this.h = 0;
        this.r = 0;
        if (arguments.length == 3) {
            x = arguments[0];
            y = arguments[1];
            this.r = arguments[2];
        }
        if (arguments.length == 4) {
            x = arguments[0];
            y = arguments[1];
            this.w = arguments[2];
            this.h = arguments[3];
        }
        this.pos = new Vector().set(x, y);
        this.vel = new Vector();
        // this.vel = p5.Vector.random2D();
        // this.vel = p5.constructor.Vector.random2D();
        // this.vel = Vector.random2D();
        // this.vel.setMag(5);
        // this.angle = this.vel.heading() + 0 / 2;
        this.angle = 0;
        this.acc = new Vector();
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.maxSpeed = 5;
        this.accSpeed = 0.05;
    }
    update() {
        // keyboard input
        // if (this.up) this.acc.y -= this.accSpeed;
        // if (this.down) this.acc.y += this.accSpeed;
        // if (this.left) this.acc.x -= this.accSpeed;
        // if (this.right) this.acc.x += this.accSpeed;
        if (this.left) this.angle -= 0.1;
        if (this.right) this.angle += 0.1;

        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    showTriangle() {
        p5.fill(255, 0, 0);
        p5.strokeWeight(2);
        p5.stroke(255);

        // modelVertexes
        let x1 = 0;
        let y1 = -this.r * 2;
        let x2 = -this.r;
        let y2 = this.r;
        let x3 = this.r;
        let y3 = this.r;

        // Rotate
        let xx1 = x1 * p5.cos(this.angle) - y1 * p5.sin(this.angle);
        let yy1 = x1 * p5.sin(this.angle) + y1 * p5.cos(this.angle);
        let xx2 = x2 * p5.cos(this.angle) - y2 * p5.sin(this.angle);
        let yy2 = x2 * p5.sin(this.angle) + y2 * p5.cos(this.angle);
        let xx3 = x3 * p5.cos(this.angle) - y3 * p5.sin(this.angle);
        let yy3 = x3 * p5.sin(this.angle) + y3 * p5.cos(this.angle);

        // Translate
        xx1 += this.pos.x;
        yy1 += this.pos.y;
        xx2 += this.pos.x;
        yy2 += this.pos.y;
        xx3 += this.pos.x;
        yy3 += this.pos.y;

        // Draw model
        p5.triangle(xx1, yy1, xx2, yy2, xx3, yy3);
    }
    showRect() {
        p5.fill(255, 0, 0);
        p5.strokeWeight(2);
        p5.stroke(255);
        p5.rect(this.pos.x, this.pos.y, this.w, this.h);
    }
    edgesRect() {
        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -1;
        } else if (this.pos.x + this.w > canvasWidth) {
            this.pos.x = canvasWidth - this.w;
            this.vel.x *= -1;
        }
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -1;
        } else if (this.pos.y + this.h > canvasHeight) {
            this.pos.y = canvasHeight - this.h;
            this.vel.y *= -1;
        }
    }
}
