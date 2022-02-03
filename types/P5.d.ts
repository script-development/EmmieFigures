import P5, { Vector } from 'p5'

export interface CustomP5 extends P5{
    constructor(sketch: (...args: any[]) => any, node:string)
}
export interface Motion {
    pos: Vector,
    vel: Vector,
    acc: Vector,
    maxVel: number,
    maxForce: number,
    addAcc: function,
    upd: function,
    seek: function
}

export interface QuadTree {
    x: number,
    y: number,
    w: number,
    h: number,
    capacity: number,
    northwest: function,
    northeast: function,
    southwest: function,
    southeast: function
    points: Array,
    subdivide: function,
    insert: function
}

export interface vec2 {
    x: number,
    y: number,
    add: function,
}