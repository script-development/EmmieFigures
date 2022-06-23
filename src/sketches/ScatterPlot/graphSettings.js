import {setRender, setUpdate, unsetRender, unsetUpdate} from 'sketches/engine';

const switches = {
    currentWeather: false,
};

/** @param {number} h */
const loadingParticle = h => ({
    h,
    inc: 1,
});

const particles = Array.from({length: 40}, (_v, k) => loadingParticle(k));

/** @param {CanvasRenderingContext2D} ctx */
const loadingIndicator = ctx => {
    for (let i = 0; i < particles.length; i++) {
        particles[i].h += particles[i].inc;
        if (particles[i].h > 40) {
            particles[i].h = 40;
            particles[i].inc *= -1;
        } else if (particles[i].h < 0) {
            particles[i].h = 0;
            particles[i].inc *= -1;
        }
        ctx.fillStyle = 'green';
        ctx.fillRect(600 + i * 11, 600 - particles[i].h / 2, 10, particles[i].h);
    }
};

// const STATES = {
//     PHASE1: Symbol('phase1'),
//     PHASE2: Symbol('phase2'),
//     PHASE3: Symbol('phase3'),
// };

// let currentState = STATES.PHASE1;
// let timePassed = 0;
// let alpha = 0;
// let alphaChange = 0.01;

const settings = {
    currentWeatherEnable: () => {
        console.log('enable');
        switches.currentWeather = true;
        setRender({
            id: 'currentWeather',
            /** @param {import('./Graph').Paint} paint */
            show: paint => {
                const ctx = paint.ctx;
                // ctx.fiillStyle = 'black';
                // switch (currentState) {
                //     case STATES.PHASE1:

                //         ctx.fillText('LOADING');
                //         break;
                //     case STATES.PHASE2:
                //         ctx.fillStyle = 'orange';
                //         break;
                //     case STATES.PHASE3:
                //         ctx.fillStyle = 'green';
                //         break;

                //     default:
                //         break;
                // }
                loadingIndicator(ctx);
            },
        });
        setUpdate({
            id: 'currentWeather',
            // /** @param {DOMHighResTimeStamp} dT */
            update: () => {
                // timePassed += dT;
                // if (timePassed > 6000) currentState = STATES.PHASE3;
                // else if (timePassed > 3000) currentState = STATES.PHASE2;
                // else currentState = STATES.PHASE1;
            },
        });
    },
    currentWeatherDisable: () => {
        switches.currentWeather = false;
        // timePassed = 0;
        console.log('disable');
        unsetRender('currentWeather');
        unsetUpdate('currentWeather');
    },
};

/**
 * @param {"currentWeather"} type
 */
export default type => (switches[type] ? settings[`${type}Disable`]() : settings[`${type}Enable`]());
