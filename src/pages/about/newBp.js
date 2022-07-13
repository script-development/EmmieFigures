const viewPort = {
    /** @type {function} */
    bPScript: () => {},
    /** @type {function} */
    orScript: () => {},
};

export const breakpoint = {
    value: 'small',
    /** @param {(bP: string) => void} script */
    onChange: script => {
        viewPort.bPScript = script;
        bPInitiate();
    },
};
export const orientation = {
    value: 'portrait',
    /** @param {(or: string) => void} script */
    onChange: script => {
        viewPort.orScript = script;
        orInitiate();
    },
};

const bPInitiate = () => {
    const mobile = window.matchMedia('(max-width: 600px)');
    const tablet = window.matchMedia('(min-width: 601px) and (max-width: 1200px)');
    const desktop = window.matchMedia('(min-width: 1201px)');

    // mobile = default, no check needed
    if (tablet.matches) breakpoint.value = 'medium';
    else if (desktop.matches) breakpoint.value = 'large';

    mobile.addEventListener('change', () => {
        if (mobile.matches) {
            breakpoint.value = 'small';
            viewPort.bPScript(breakpoint.value);
        }
    });
    tablet.addEventListener('change', () => {
        if (tablet.matches) {
            breakpoint.value = 'medium';
            viewPort.bPScript(breakpoint.value);
        }
    });
    desktop.addEventListener('change', () => {
        if (desktop.matches) {
            breakpoint.value = 'large';
            viewPort.bPScript(breakpoint.value);
        }
    });
};

const orInitiate = () => {
    const orientate = window.matchMedia('(orientation: landscape)');

    if (orientate.matches) orientation.value = 'landscape';

    orientate.addEventListener('change', () => {
        if (orientate.matches) {
            orientation.value = 'landscape';
            viewPort.orScript(orientation.value);
        } else {
            orientation.value = 'portrait';
            viewPort.orScript(orientation.value);
        }
    });
};
