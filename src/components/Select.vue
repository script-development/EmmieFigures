<template>
    <div>
        <div class="mb-3 xl:w-96 z-1">
            <label for="weather-options"><slot /></label>
            <select id="weather-options" :value="modelValue" :class="selectClass" @input="updateValue($event.target)">
                <option v-for="option in options" :key="option.key" :value="option">
                    {{ `${option.name} (${option.unitOfMeasure})` }}
                </option>
            </select>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: Object,
        required: true,
    },
    options: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

/** @param {HTMLSelectElement} target */
const updateValue = target => {
    emit('update:modelValue', target.value);
};

// Temporarily select classes
const selectClass =
    'appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding' +
    'bg-no-repeat border border-solid border-gray-300 rounded' +
    'transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';
</script>
