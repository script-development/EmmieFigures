<template>
    <!-- header -->
    <div class="p-4 flex justify-between items-center border-b border-gray-400 shadow-xl shadow-gray-200 bg-light-200">
        <!-- left side -->
        <div>
            <a href="/">
                <Logo />
            </a>
        </div>

        <!-- middle -->
        <div>
            {{ title }}
        </div>

        <!-- right side -->
        <div>RIGHT</div>
    </div>
    <!-- <button class="p-4 m-4 border border-black shadow-xl shadow-blue-700">ASDF</button> -->
</template>

<script setup>
import Logo from './Logo.vue';

defineProps({
    title: {
        type: String,
        default: 'Insert Title',
    },
});
</script>
