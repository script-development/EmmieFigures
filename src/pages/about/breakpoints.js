import {reactive} from 'vue';

export const view = reactive({
    /** @param {(br: string) => void} script */
    onBpChange: script => {
        view.onBpChangeScript = script;
        initiateBp();
    },
    /** @param {(or: string) => void} script */
    onOrChange: script => {
        view.onOrChangeScript = script;
        initiateOr();
    },
    /** @type {"landscape"|"portrait"} */
    orientation: 'landscape',
    /** @type {"small"|"medium"|"large"} */
    breakpoint: 'medium',
    /** @type {function} */
    onBpChangeScript: () => {},
    /** @type {function} */
    onOrChangeScript: () => {},
});

const initiateBp = () => {
    const mobile = window.matchMedia('(max-width: 600px)');
    const desktop = window.matchMedia('(min-width: 1200px)');

    screenTest2(mobile);
    screenTest3(desktop);

    mobile.addEventListener('change', screenTest2);
    desktop.addEventListener('change', screenTest3);
};

const initiateOr = () => {
    const orientation = window.matchMedia('(orientation: portrait)');

    screenTest(orientation);

    orientation.addEventListener('change', screenTest);
};

/** @param {MediaQueryList|MediaQueryListEvent} orientation */
const screenTest = orientation => {
    if (!(orientation instanceof MediaQueryList || orientation instanceof MediaQueryListEvent))
        throw new Error('error retrieving MediaQueryList');
    if (orientation instanceof MediaQueryList) return;
    if (orientation.matches) {
        view.orientation = 'portrait';
        view.onOrChangeScript(view.orientation);
        return;
    }
    view.orientation = 'landscape';
    view.onOrChangeScript(view.orientation);
};

/** @param {MediaQueryList|MediaQueryListEvent} mobile */
const screenTest2 = mobile => {
    // if (mobile instanceof MediaQueryList) return;
    // console.log(first);
    if (!(mobile instanceof MediaQueryList || mobile instanceof MediaQueryListEvent))
        throw new Error('error retrieving MediaQueryList');
    if (mobile.matches) {
        view.breakpoint = 'small';
        view.onBpChangeScript(view.breakpoint);
        return;
    }
    view.breakpoint = view.breakpoint != 'large' ? 'medium' : 'large';
    view.onBpChangeScript(view.breakpoint);
};

/** @param {MediaQueryList|MediaQueryListEvent} desktop */
const screenTest3 = desktop => {
    if (!(desktop instanceof MediaQueryList || desktop instanceof MediaQueryListEvent))
        throw new Error('error retrieving MediaQueryList');
    if (desktop.matches) {
        view.breakpoint = 'large';
        view.onBpChangeScript(view.breakpoint);
        return;
    }
    view.breakpoint = view.breakpoint != 'small' ? 'medium' : 'small';
    view.onBpChangeScript(view.breakpoint);
};
