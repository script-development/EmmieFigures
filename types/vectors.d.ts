interface vec2 {
    x: number;
    y: number;
    add: (v: vec2) => vec2;
    sub: (v: vec2) => vec2;
    mult: (n: number) => vec2;
    div: (n: number) => vec2;
    set: (x: number, y: number) => void;
    copy: () => vec2;
    mag: () => number;
    magSq: () => number;
    norm: () => vec2;
    setMag: (n: number) => vec2;
    random2D: () => vec2;
    limit: (max: number) => void;
}

export interface vec {
    add: (v1: vec2, v2: vec2) => vec2;
    sub: (v1: vec2, v2: vec2) => vec2;
    mult: (v: vec2, n: number) => vec2;
    div: (v: vec2, n: number) => vec2;
    random2D: () => vec2;
}