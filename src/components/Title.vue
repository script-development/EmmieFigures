<template>
    <!-- <h1>{{ title }}</h1> -->
    <div v-if="false">Title Component</div>
</template>

<script setup>
// @ts-nocheck

import opentype from 'opentype.js';
import {store} from 'services/store';
import {setRender} from 'sketches/engine';
import {onMounted} from 'vue';

defineProps({
    title: {
        type: String,
        required: true,
    },
});

const cmdToArr = cmd => {
    const arr = [cmd.type];
    if (cmd.type === 'M' || cmd.type === 'L') {
        // moveto or lineto
        arr.push(cmd.x, cmd.y);
    } else if (cmd.type === 'C') {
        arr.push(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
    } else if (cmd.type === 'Q') {
        arr.push(cmd.x1, cmd.y1, cmd.x, cmd.y);
    }
    // else if (cmd.type === 'Z') { /* no-op */ }
    return arr;
};

const splitPaths = cmds => {
    // console.log(cmds);
    const paths = [];
    let current;
    for (let i = 0; i < cmds.length; i++) {
        if (cmds[i].type === 'M') {
            if (current) {
                paths.push(current);
            }
            current = [];
        }
        current.push(cmdToArr(cmds[i]));
    }
    paths.push(current);

    return paths;
};

const textToPoints = (font, txt, x = 0, y = 0, fontSize = 32, options) => {
    let xoff = 0;
    const result = [];
    const glyphs = getGlyphs(font, txt)[0];
    console.log(glyphs);

    const isSpace = () => (glyphs.name && glyphs.name === 'space') || txt[0] === ' ';

    if (!isSpace(glyphs)) {
        const gpath = glyphs.getPath(x, y, fontSize);
        const paths = splitPaths(gpath.commands);

        // for (let j = 0; j < paths.length; j++) {
        // const pts = pathToPoints(paths[j], options);
    }
};

const getGlyphs = (font, txt) => {
    return font.stringToGlyphs(txt);
};

onMounted(async () => {
    // const P5 = await import('p5');
    // console.log(P5);
    opentype.load('src/assets/fonts/Roboto-Black.ttf', function (err, font) {
        if (err) {
            alert('Font could not be loaded: ' + err);
        } else {
            textToPoints(font, 'A');

            // Now let's display it on a canvas with id "canvas"
            // const ctx = document.getElementById('canvas1').getContext('2d');
            // Construct a Path object containing the letter shapes of the given text.
            // The other parameters are x, y and fontSize.
            // Note that y is the position of the baseline.
            // const path = font.getPath('R', 500, 500, 400);
            // console.log(font);
            // console.log(path);
            // If you just want to draw the text you can also use font.draw(context, text, x, y, fontSize).
            const showw = () => {
                // ctx.fillStyle = 'black';
                // path.draw(ctx);
                // font.drawPoints(ctx, 'R', 500, 500, 400);
                // ctx.fillStyle = 'green';
                // ctx.beginPath();
                // ctx.arc(path.commands[17].x, path.commands[17].y, 20, 0, Math.PI * 2);
                // ctx.fill();
            };
            setRender(['asdf', showw]);
        }
    });
});

/** @type {{paint: import('types/paint').Paint, ctx: CanvasRenderingContext2D}} */
// const {paint, ctx} = store.sketch;
</script>

<style>
h1 {
    color: black;
    background: white;
    font-size: 5vw;
    position: absolute;
    top: 25%;
    left: 50%;
    -ms-transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
</style>
