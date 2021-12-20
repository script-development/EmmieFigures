import P5 from 'p5';

/** @param {HTMLElement|null} id */
export const init = id => new P5(() => {}, id ? id : undefined);
