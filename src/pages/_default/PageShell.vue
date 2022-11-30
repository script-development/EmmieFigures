<template>
    <NavBar :title="Application_Title">
        <template #logo>
            <Logo />
        </template>
        <template #auth />
    </NavBar>
    <slot />
</template>

<script setup>
import NavBar from 'components/NavBar.vue';
import Logo from 'components/Logo.vue';
import {Application_Title} from 'services/constants';
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
