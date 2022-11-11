<template>
    <div class="text">{{ msg }}</div>
</template>

<script setup>
defineProps({
    msg: {
        type: String,
        required: true,
    },
});
</script>

<style>
.text {
    position: absolute;
    font-size: xx-large;
    font-weight: 900;
}
</style>
