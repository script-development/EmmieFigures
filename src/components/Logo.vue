<template>
    <svg
        id="Laag_1"
        data-name="Laag 1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 35 23"
        :style="'width: ' + width"
    >
        <defs>
            <linearGradient
                id="gradient1"
                x1="-15.88"
                y1="17.87"
                x2="-7.36"
                y2="-3.23"
                gradientTransform="translate(29.29 6.91)"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0" stop-color="#01a6eb" />
                <stop offset="1" stop-color="#0b62c0" />
            </linearGradient>
            <linearGradient id="gradient2" x1="-15.88" y1="16.77" x2="-7.36" y2="-4.33" xlink:href="#gradient1" />
        </defs>
        <path
            class="cls-1"
            d="M2.15,11.4a9.27,9.27,0,0,1,5-7.64c5.37-3,11.58-.7,14,5.06.18.45.31.57.78.22a7.45,7.45,0,0,1,12,
            6.07c0,4.71-4,7-7.53,6.92-3.19,0-6.39.1-9.58.06a39.15,39.15,0,0,1-7.2-.34C4.24,20.15,2.15,16.33,2.15,11.4Z"
        />
        <path
            class="cls-2"
            d="M2.15,10.3a9.27,9.27,0,0,1,5-7.64c5.37-3,11.58-.7,14,5.07.18.44.31.56.78.21A7.45,7.45,0,0,
            1,33.9,14c0,4.7-4,7-7.53,6.91-3.19,0-6.39.1-9.58.07a40,40,0,0,1-7.2-.35C4.24,19.06,2.15,15.24,2.15,10.3Z"
        />
    </svg>
</template>

<script setup>
defineProps({
    width: {
        type: String,
        default: '35px',
    },
});
</script>
<style>
.cls-1,
.cls-2 {
    fill: none;
    stroke-width: 2.64px;
}
.cls-1 {
    stroke: url(#gradient1);
}
.cls-2 {
    opacity: 0.54;
    stroke: url(#gradient2);
}
</style>
