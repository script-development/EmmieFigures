import P5 from 'p5'

/** @param {HTMLElement|null} el */
export const init = el => new P5(() => {}, el ? el : undefined);
