<template>
    <div v-if="false">Top Bar</div>
</template>

<script setup>
import {store} from 'services/store';
import {onMounted} from 'vue';
import {setRender, setUpdate, unsetRender, unsetUpdate} from 'sketches/engine';
import {Line} from 'sketches/paint';
import opentype from 'opentype.js';
// import { load } from 'opentype.js'

const topBar = {
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    /** @type {CanvasGradient|null} */
    gradient: null,
    speedX: 10,
    speedY: 2,
    height: 65,
    line: Line({x2: innerWidth}),
    line1: Line(),
    line2: Line({x1: innerWidth, x2: innerWidth}),
};

/** @type {{paint: import('types/paint').Paint, context: CanvasRenderingContext2D}} */
const {paint, context} = store.sketch;

const update1 = () => {
    topBar.line1.pos.x2 += topBar.speedX;
    topBar.line2.pos.x2 -= topBar.speedX;
    if (topBar.line2.pos.x2 <= topBar.line1.pos.x2) {
        topBar.line1.pos.x2 = innerWidth / 2;
        topBar.line2.pos.x2 = innerWidth / 2;
        topBar.line1.pos.y1 = topBar.height;
        topBar.line1.pos.y2 = topBar.height;
        topBar.line2.pos.y1 = topBar.height;
        topBar.line2.pos.y2 = topBar.height;
        unsetUpdate('top-bar-1');
        unsetRender('top-bar-1');
        setUpdate(updates.phase2);
        setRender(render.phase2);
    }
};
const show1 = () => {
    paint.line(topBar.line1);
    paint.line(topBar.line2);
};
const update2 = () => {
    topBar.gradient = context.createLinearGradient(0, 0, (topBar.line.pos.y1 / topBar.height) * innerWidth, 0);
    topBar.gradient.addColorStop(0, '#eee');
    topBar.gradient.addColorStop(1, '#fff');
    topBar.line.pos.y1 += topBar.speedY;
    topBar.line.pos.y2 += topBar.speedY;
    if (topBar.line.pos.y1 >= topBar.height) {
        topBar.gradient = context.createLinearGradient(0, 0, innerWidth, 0);
        topBar.gradient.addColorStop(0, '#eee');
        topBar.gradient.addColorStop(1, '#fff');
        topBar.line.pos.y1 = topBar.height;
        topBar.line.pos.y2 = topBar.height;
        unsetUpdate('top-bar-2');
        unsetRender('top-bar-2');
        setUpdate(updates.phase3);
        setRender(render.phase3);
    }
};
const show2 = () => {
    context.fillStyle = topBar.gradient ?? '#fff';
    context.fillRect(0, 0, (topBar.line.pos.y1 / topBar.height) * innerWidth, topBar.line.pos.y1);
    paint.line(topBar.line);
};
const update3 = () => {
    topBar.line1.pos.x2 -= topBar.speedX;
    topBar.line2.pos.x2 += topBar.speedX;
    if (topBar.line1.pos.x2 <= 0) {
        topBar.shadowBlur += 0.1;
        topBar.shadowOffsetX += 0.1;
        topBar.shadowOffsetY += 0.1;
        if (topBar.shadowOffsetY >= 4) {
            topBar.shadowBlur = 4;
            topBar.shadowOffsetX = 4;
            topBar.shadowOffsetY = 4;
            unsetUpdate('top-bar-3');
            unsetRender('top-bar-3');
            setUpdate(updates.phase4);
            setRender(render.phase4);
        }
    }
};
const show3 = () => {
    context.fillStyle = topBar.gradient ?? '#fff';
    context.shadowColor = 'rgb(192, 192, 192)';
    context.shadowBlur = topBar.shadowBlur;
    context.shadowOffsetX = topBar.shadowOffsetX;
    context.shadowOffsetY = topBar.shadowOffsetY;
    context.fillRect(0, 0, innerWidth, topBar.height);
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    paint.line(topBar.line1);
    paint.line(topBar.line2);
};
const update4 = () => {
    //
};
const show4 = () => {
    context.fillStyle = topBar.gradient ?? '#fff';
    context.shadowColor = 'rgb(192, 192, 192)';
    context.shadowBlur = topBar.shadowBlur;
    context.shadowOffsetX = topBar.shadowOffsetX;
    context.shadowOffsetY = topBar.shadowOffsetY;
    context.fillRect(0, 0, innerWidth, topBar.height);
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
};

const updates = {
    phase1: ['top-bar-1', update1],
    phase2: ['top-bar-2', update2],
    phase3: ['top-bar-3', update3],
    phase4: ['top-bar-4', update4],
};
const render = {
    phase1: ['top-bar-1', show1],
    phase2: ['top-bar-2', show2],
    phase3: ['top-bar-3', show3],
    phase4: ['top-bar-4', show4],
};

const slowBuild = () => {
    console.log('slowBuild');

    setUpdate(updates.phase1);
    setRender(render.phase1);
};

const fastBuild = () => {
    console.log('fastBuild');
};

onMounted(() => {
    // localStorage.getItem('topbar-loaded') ? fastBuild() : slowBuild();
    opentype.load('src/assets/fonts/Roboto-Black.ttf', function (err, font) {
        if (err) {
            alert('Font could not be loaded: ' + err);
        } else {
            // Now let's display it on a canvas with id "canvas"
            const ctx = document.getElementById('canvas1').getContext('2d');
            // Construct a Path object containing the letter shapes of the given text.
            // The other parameters are x, y and fontSize.
            // Note that y is the position of the baseline.
            const path = font.getPath('Hello, World!', 0, 150, 72);
            console.log(path);
            // If you just want to draw the text you can also use font.draw(context, text, x, y, fontSize).
            const showw = () => {
                path.draw(ctx);
                // console.log('drwaing');
            };
            setRender(['asdf', showw]);
        }
    });
});
</script>
