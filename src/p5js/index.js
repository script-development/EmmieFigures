import P5 from 'p5';

const sketch = /** @param {P5} p */ p => {
    let fps = p.frameRate().toFixed(0);
    // @ts-ignore
    p.fps = () => {
        if (p.frameCount % 10 == 0) {
            fps = p.frameRate().toFixed(0);
        }
        p.fill(255);
        p.noStroke();
        p.textSize(20);
        p.text(fps, 50, p.height - 50);
    };
};

const preloadSketch = /** @param {P5} p */ p => {
    let fps = p.frameRate().toFixed(0);
    // @ts-ignore
    p.preload = () => {
        // @ts-ignore
        p.font = p.loadFont('./src/assets/AvenirNextLTPro-Demi.otf');
    };
    // @ts-ignore
    p.fps = () => {
        if (p.frameCount % 10 == 0) {
            fps = p.frameRate().toFixed(0);
        }
        p.fill(255);
        p.noStroke();
        p.textSize(20);
        p.text(fps, 50, p.height - 50);
    };
};

/**
 * @param {String} id
 * @param {Boolean} preload
 */
export const init = (id, preload = false) => {
    const el = document.getElementById(id);
    // eslint-disable-next-line no-console
    if (!el) console.log(`element with id ${id} not found`);
    return new P5(preload ? preloadSketch : sketch, el ? el : undefined);
};
