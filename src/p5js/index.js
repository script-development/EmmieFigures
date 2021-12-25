import P5 from 'p5';

/** @param {String} id */
export const init = id => {
    const el = document.getElementById(id);
    // eslint-disable-next-line no-console
    if (!el) console.log(`element with id ${id} not found`);
    return new P5(() => {}, el ? el : undefined);
};
