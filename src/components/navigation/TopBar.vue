<template>
    <div v-if="false">Top Bar</div>
</template>

<script setup>
import {store} from 'services/store';
import {onMounted} from 'vue';
import {setRender, setUpdate, unsetRender, unsetUpdate} from 'sketches/engine';
import {Line} from 'sketches/paint';

const topBar = {
    blur: 0,
    offsetY: 0,
    /** @type {CanvasGradient|null} */
    gradient: null,
    speedX: 5,
    speedY: 1,
    height: 65,
    line: Line({x2: innerWidth}),
    line1: Line(),
    line2: Line({x1: innerWidth, x2: innerWidth}),
};

/** @type {{paint: import('types/paint').Paint, context: CanvasRenderingContext2D}} */
const {paint, context} = store.sketch;

const {speedX, speedY, height, line, line1, line2} = topBar;

const show1 = () => {
    paint.line(topBar.line1);
    paint.line(topBar.line2);
};
const show2 = () => {
    context.fillStyle = topBar.gradient ?? '#fff';
    context.fillRect(0, 0, (line.pos.y1 / height) * innerWidth, topBar.line.pos.y1);
    paint.line(topBar.line);
};
const show3 = () => {
    // context.fillStyle = topBar.gradient ?? '#fff';
    // context.fillRect(0, 0, innerWidth, topBar.line.pos.y1);
    context.shadowColor = 'rgba(128, 128, 128, 1)';
    context.shadowBlur = 8;
    // context.shadowOffsetX = 0;
    context.shadowOffsetY = 30;
    topBar.line.weight = 5;
    paint.line(topBar.line);
    // topBar.gradient = context.createLinearGradient(0, 0, innerWidth, 0);
    // topBar.gradient.addColorStop(0, '#eee');
    // topBar.gradient.addColorStop(1, '#fff');
    // context.fillStyle = topBar.gradient;
    // context.fillRect(0, 0, innerWidth, topBar.line.pos.y1);
    // paint.line(topBar.line);
    // show2();
};
const show4 = () => {
    show3();
};
const update1 = () => {
    line1.pos.x2 += speedX;
    line2.pos.x2 -= speedX;
    if (line2.pos.x2 <= line1.pos.x2) {
        unsetUpdate('top-bar-1');
        unsetRender('top-bar-1');
        setUpdate(updates.phase2);
        setRender(render.phase2);
    }
};
const update2 = () => {
    topBar.gradient = context.createLinearGradient(0, 0, (line.pos.y1 / height) * innerWidth, 0);
    topBar.gradient.addColorStop(0, '#eee');
    topBar.gradient.addColorStop(1, '#fff');
    line.pos.y1 += speedY;
    line.pos.y2 += speedY;
    if (line.pos.y1 >= height) {
        topBar.gradient = context.createLinearGradient(0, 0, innerWidth, 0);
        topBar.gradient.addColorStop(0, '#eee');
        topBar.gradient.addColorStop(1, '#fff');
        line.pos.y1 = height;
        line.pos.y2 = height;
        unsetUpdate('top-bar-2');
        unsetRender('top-bar-2');
        setUpdate(updates.phase3);
        setRender(render.phase3);
    }
};
const update3 = () => {
    // line1.pos.x2 += speedX;
    // line2.pos.x2 -= speedX;
    // if (line2.pos.x2 <= line1.pos.x2) {
    //     unsetUpdate('top-bar-3');
    //     unsetRender('top-bar-3');
    //     // setUpdate(updates.phase4);
    //     setRender(render.phase4);
    // }
};
const update4 = () => {
    //
};

const updates = {
    phase1: {
        id: 'top-bar-1',
        update: update1,
    },
    phase2: {
        id: 'top-bar-2',
        update: update2,
    },
    phase3: {
        id: 'top-bar-3',
        update: update3,
    },
    phase4: {
        id: 'top-bar-4',
        update: update4,
    },
};
const render = {
    phase1: {
        id: 'top-bar-1',
        show: show1,
    },
    phase2: {
        id: 'top-bar-2',
        show: show2,
    },
    phase3: {
        id: 'top-bar-3',
        show: show3,
    },
    phase4: {
        id: 'top-bar-4',
        show: show4,
    },
};

const slowBuild = () => {
    console.log('slowBuild');

    setUpdate(updates.phase1);
    setRender(render.phase1);
};

const fastBuild = () => {
    console.log('fastBuild');
    // localStorage.removeItem('1st-load-done');
};

onMounted(() => {
    localStorage.getItem('1st-load-done') ? fastBuild() : slowBuild();
});
</script>
