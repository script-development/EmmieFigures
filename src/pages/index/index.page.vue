<template>
    <div v-if="true">Index</div>
</template>

<script setup>
defineProps({
    settings: {
        /** @type {import('@vue/runtime-core').PropType<import('types/data').Settings>} */
        type: Object,
        required: true,
    },
});
</script>
