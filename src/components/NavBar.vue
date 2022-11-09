<template>
    <!-- header -->
    <div class="flex p-4 justify-between items-center border-b border-gray-300 shadow-md shadow-gray-200 bg-light-200">
        <!-- left side -->
        <div>
            <a href="/">
                <slot name="logo" />
            </a>
        </div>

        <!-- middle -->
        <div class="font-poppins text-2xl">
            {{ title }}
        </div>

        <!-- right side -->
        <div :class="$slots.auth ? 'bg-gray-200' : 'invisible'">
            <slot name="auth" />
        </div>
    </div>
    <div class="sidenav">Test</div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: 'title',
    },
});
</script>

<style>
.sidenav {
    height: 85vh;
    width: 160px;
    /* position: fixed; */
    float: left;
    z-index: 1;
    margin-top: 32px;
    /* top: 128px; */
    left: 0;
    background-color: rgb(250, 250, 250);
    box-shadow: 5px 5px 20px #555;
    /* padding-left: 160px; */
}
</style>
