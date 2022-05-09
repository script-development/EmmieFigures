import {reactive} from 'vue';

export const options = reactive({
    graph: [
        {
            id: 0,
            active: false,
            disabled: false,
            type: 'linear-regression',
            class: 'absolute bottom-25',
        },
        {
            id: 1,
            active: false,
            disabled: false,
            type: 'LOESS-regression',
            class: 'absolute bottom-20',
        },
    ],
});

/**
 * @param {HTMLInputElement} _el
 * @param {number} _id
 */
export const optionChange = (_el, _id) => {
    //
};
