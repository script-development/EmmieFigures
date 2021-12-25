import P5, { Vector } from 'p5'

export class CustomP5 extends P5 {
    constructor(sketch: (...args: any[]) => any, node:string)
}

export interface Motion {
    pos: Vector,
    applyForce: function,
    update: function
}