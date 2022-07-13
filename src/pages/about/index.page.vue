<template>
    <div>About</div>
</template>

<script setup>
import {onMounted} from 'vue';
import {breakpoint, orientation} from './newBp';

onMounted(() => {
    breakpoint.onChange(bP => {
        console.log('bPChange: ' + bP);
    });
    orientation.onChange(or => {
        console.log('orChange: ' + or);
    });
});
</script>
