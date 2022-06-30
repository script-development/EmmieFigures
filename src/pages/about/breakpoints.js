import {reactive} from 'vue';

let bp = 'small';
/** @type {function} */
let onChangeScript;

export const breakpoint = reactive({
    /** @param {(bp: string) => void} script */
    onChange: script => {
        onChangeScript = script;
        initiatie();
    },
});

const initiatie = () => {
    const orientation = window.matchMedia('(orientation: portrait)');
    const mobile = window.matchMedia('(max-width: 600px)');
    const desktop = window.matchMedia('(min-width: 1200px)');

    function screenTest(o) {
        if (o.matches) {
            /* the viewport is 600 pixels wide or less and orientation is portrait */
            bp = 'portrait';
            onChangeScript(bp);
        } else {
            /* the viewport is more than than 600 pixels wide */
            bp = 'landscape';
            onChangeScript(bp);
        }
    }
    function screenTest2(s) {
        if (s.matches) {
            /* the viewport is 600 pixels wide or less and orientation is portrait */
            bp = 'small';
            onChangeScript(bp);
        } else {
            /* the viewport is more than than 600 pixels wide */
            bp = bp != 'desktop' ? 'medium' : 'desktop';
            onChangeScript(bp);
        }
    }
    function screenTest3(d) {
        if (d.matches) {
            /* the viewport is 600 pixels wide or less and orientation is portrait */
            bp = 'desktop';
            onChangeScript(bp);
        } else {
            /* the viewport is more than than 600 pixels wide */
            bp = bp != 'small' ? 'medium' : 'small';
            onChangeScript(bp);
        }
    }

    screenTest(orientation);
    screenTest2(mobile);
    screenTest3(desktop);
    orientation.addEventListener('change', screenTest);
    mobile.addEventListener('change', screenTest2);
    desktop.addEventListener('change', screenTest3);
};
