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
        <div :class="$slots.auth ? '' : 'invisible'">
            <slot name="auth" />
        </div>
    </div>
</template>

<script setup>
// import Logo from './Logo.vue';

import {onMounted} from 'vue';

defineProps({
    title: {
        type: String,
        default: 'title',
    },
});
</script>
