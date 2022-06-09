<template>
    <canvas id="test" />
</template>

<script setup>
import Sketch from 'sketches/index.js';
import {onMounted} from 'vue';

onMounted(() => {
    const sketch = Sketch('test');
    const c = sketch.context;
    sketch.render(() => {
        c.arc(20, 20, 20, 0, Math.PI * 2);
        c.stroke();
    });
});
</script>
