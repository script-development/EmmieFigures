import {setUpdate, unsetUpdate} from './engine';

const defaults = {
    stepAcc: 0,
    delay: false,
};

/** @type {{ idCount: number, [key: string]: any }} */
const props = {
    idCount: 0,
};

/**
 * @param {import('types/paint').Line} element
 * @param {number} duration in ms
 * @param {number} delay in ms
 */
export const grow = (element, duration, delay) => {
    const id = props.idCount;
    props.idCount++;
    props[id] = {...defaults};
    //
};

/**
 * @param {import('types/paint').Text} element
 * @param {number} duration in ms
 * @param {number} delay in ms
 */
export const fadeIn = (element, duration, delay) => {
    const id = props.idCount;
    props.idCount++;
    props[id] = {opacity: 0, ...defaults};
    element.color = `rgba(0, 0, 0, ${props[id].opacity})`;
    if (delay != undefined) props[id].delay = true;

    setUpdate({
        id: `fadeIn${id}`,
        /** @param {number} step */
        update: step => {
            if (props[id].delay) {
                props[id].stepAcc += step;
                if (props[id].stepAcc > delay) {
                    props[id].stepAcc = 0;
                    props[id].delay = false;
                }
                return;
            }

            props[id].stepAcc += step;
            props[id].opacity = props[id].stepAcc / duration;

            element.color = `rgba(0, 0, 0, ${props[id].opacity})`;
            if (props[id].stepAcc > duration) {
                props[id].stepAcc = 0;
                unsetUpdate(`fadeIn${id}`);
            }
        },
    });
};
