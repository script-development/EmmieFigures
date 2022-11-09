<template>
    <div v-if="false">Top Bar</div>
</template>

<script setup>
import {store} from 'services/store';
import {onMounted, ref} from 'vue';
import {setRender, setUpdate} from 'sketches/engine';
import {Line} from 'sketches/paint';

const slider1 = {
    type: 'basic',
    label: 'Shadowcolor Alpha',
    step: 0.01,
};

let stage = 0;
const slider1v = ref('0.2');
const slider2v = ref('8');

const emit = defineEmits(['marginTop']);

// /** @param {Event} evt */
// const updateValue = evt => {
//     if (evt.target instanceof HTMLSelectElement) emit('update:modelValue', evt.target.value);
// };

const initialize = () => {
    const ctx = store.sketch.context;
    const line1 = Line({weight: 1});
    const line2 = Line({x1: innerWidth, x2: innerWidth, weight: 1});
    setUpdate({
        id: 'topbar',
        update: () => {
            switch (stage) {
                case 0:
                    line1.pos.x2 += 5;
                    line2.pos.x2 -= 5;
                    if (line2.pos.x2 <= line1.pos.x2) {
                        line1.pos.x2 = innerWidth / 2;
                        line2.pos.x2 = innerWidth / 2;
                        stage = 1;
                    }
                    break;
                case 1:
                    line1.pos.y1 += 1;
                    line1.pos.y2 += 1;
                    line2.pos.y1 += 1;
                    line2.pos.y2 += 1;
                    emit('marginTop', 1);
                    if (line1.pos.y1 >= 65) {
                        line1.pos.y1 = 65;
                        line1.pos.y2 = 65;
                        line2.pos.y1 = 65;
                        line2.pos.y2 = 65;
                        stage = 2;
                    }
                    break;
                case 2:
                    //
                    break;
                default:
                    break;
            }
        },
    });
    setRender({
        id: 'topbar',
        show: () => {
            if (stage === 2) {
                // Shadow
                store.sketch.paint.line(line1);
                store.sketch.paint.line(line2);
                ctx.shadowColor = `rgba(0, 0, 0, ${slider1v.value})`;
                ctx.shadowBlur = slider2v.value;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                ctx.strokeStyle = 'black';
                ctx.fillStyle = 'white';
                // ctx.fillRect(0, 0, innerWidth, 64);
                // Filled rectangle
                // ctx.fillStyle = 'rgba(0, 255, 0, .2)';
                // ctx.fillRect(10, 10, 150, 100);

                // Stroked rectangle
                // ctx.lineWidth = 10;
                // ctx.strokeStyle = 'rgba(0, 0, 255, .6)';
                // ctx.strokeRect(10, 10, 150, 100);
            } else {
                store.sketch.paint.line(line1);
                store.sketch.paint.line(line2);
            }

            //         // const gradient = context.createLinearGradient(0, 0, 0, gheight);
            //         // // Add three color stops
            //         // gradient.addColorStop(0, '#fff');
            //         // gradient.addColorStop(1, '#eee');
            //         // // Set the fill style and draw a rectangle
            //         // context.fillStyle = gradient;
            //         // context.fillRect(0, 0, width, gheight);
        },
    });
    // localStorage.setItem('1st', 'true');
};

const fastBuild = () => {
    //
};

onMounted(() => {
    localStorage.getItem('1st') ? fastBuild() : initialize();
    // buildTopBar(sketch);
    // const {width, height} = context.canvas;
    // let gheight = 0;
    // let gspeed = 0.5;
    // let lineS = 5;
    // let stage = 1;
    // setUpdate({
    //     id: 'topbar',
    //     update: () => {
    //         switch (stage) {
    //             case 1:
    //                 line1.pos.x2 += lineS;
    //                 line2.pos.x2 -= lineS;
    //                 if (line2.pos.x2 <= line1.pos.x2) stage = 2;
    //                 break;
    //             case 2:
    //                 break;
    //             default:
    //                 break;
    //         }
    //         // if (gheight > innerHeight || gheight < 0) gspeed *= -1;
    //         // gheight += gspeed;
    //     },
    // });
    //
    store.sketch.run();
});
</script>

<style>
#slider1 {
    position: absolute;
    top: 200px;
    left: 200px;
    z-index: 2;
}
#slider2 {
    position: absolute;
    top: 220px;
    left: 200px;
    z-index: 2;
}
#label1 {
    position: absolute;
    top: 195px;
    left: 50px;
    z-index: 2;
}
#label2 {
    position: absolute;
    top: 215px;
    left: 50px;
    z-index: 2;
}
#span1 {
    position: absolute;
    top: 195px;
    left: 350px;
    z-index: 2;
}
#span2 {
    position: absolute;
    top: 215px;
    left: 350px;
    z-index: 2;
}
</style>
