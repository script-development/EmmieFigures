<template>
    <TopBar @margin-top="setMarginTop" />
    <!-- <NavBar :title="Application_Title">
        <template #logo>
            <Logo />
        </template>
        <template #auth>
            <div>Auth</div>
        </template>
    </NavBar> -->
</template>

<script setup>
import {store} from 'services/store';
import TopBar from './TopBar.vue';
// import Logo from 'components/Logo.vue';
// import NavBar from 'components/NavBar.vue';
// import {Application_Title} from 'services/constants';
const setMarginTop = value => {
    // console.log(store);
    store.pageShell.marginTop = '400px';
};
</script>
