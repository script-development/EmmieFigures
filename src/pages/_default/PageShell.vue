<template>
    <NavBar title="Clientcloud Presence">
        <template #logo>
            <Logo />
        </template>
        <template #auth />
    </NavBar>
    <button>{{ count }}</button>
    <slot />
</template>

<script setup>
import NavBar from 'components/NavBar.vue';
import Logo from 'components/Logo.vue';
</script>

<style>
body {
    margin: 0;
    font-family: sans-serif;
}
* {
    box-sizing: border-box;
}
</style>
