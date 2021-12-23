import P5 from 'p5';

/** @param {String} id */
export const init = id => {
    const el = document.getElementById(id);
    return new P5(() => {}, el ? el : undefined);
};
