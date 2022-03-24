const vuetifyBreakpoints = [
    {
        code: 'xs',
        query: '(max-width: 599px)',
    },
    {
        code: 'sm',
        query: '(max-width: 959px) and (min-width: 600px)',
    },
    {
        code: 'md',
        query: '(max-width: 1263px) and (min-width: 960px)',
    },
    {
        code: 'lg',
        query: '(max-width: 1903px) and (min-width: 1264px)',
    },
    {
        code: 'xl',
        query: '(min-width: 1904px)',
    },
];

/** @type {Array<MediaQueryList>} */
const queryLists = [];

export default {
    /** @param {(breakpoint: string) => void} script */
    onChange: script => onChange(script),
};

const onChange = script => {
    // script('md');
};

const handleMql = evt => {
    console.log(evt);
};

const initBreakpoints = () => {
    vuetifyBreakpoints.forEach((bp, index) => {
        const mql = window.matchMedia(bp.query);
        mql.addEventListener('change', handleMql);
        queryLists.push(mql);
    });
};
// initBreakpoints();

// /**
//  * set responsive global width and height for canvas
//  * @param {HTMLCanvasElement} canvas
//  * @param {() => void} script
//  */
// const onResize = (canvas, script) => {
//     mql1 = window.matchMedia('(max-width: 639px)');
//     mql2 = window.matchMedia('(max-width: 1007px) and (min-width: 640px');
//     mql1.addEventListener('change', handleMql.bind(null, [canvas, script]));
//     mql2.addEventListener('change', handleMql.bind(null, [canvas, script]));
//     handleMql(null);
//     handleMql(null);
//     resize(canvas); // canvas size and global values initiation
// };

// /** @param {Array<HTMLCanvasElement|function>|null} args */
// const handleMql = args => {
//     setBreakPoint();
//     if (args && args[0] instanceof HTMLCanvasElement && typeof args[1] === 'function') resize(args[0], args[1]);
// };

// const setBreakPoint = () => {
//     if (mql1.matches) globals.breakpoint = 'sm';
//     else if (mql2.matches) globals.breakpoint = 'md';
//     else globals.breakpoint = 'lg';
// };

/**
 * @param {HTMLCanvasElement} canvas
 * @param {function} script
 * @param {string} breakpoint
 */
// const handleBreakpoint = (canvas, script, breakpoint) => {
//     globals.breakpoint = breakpoint;
//     let width = innerWidth;
//     if (breakpoint === 'md') width = 640;
//     else if (breakpoint === 'lg') width = 1008;
//     let height = (width * 9) / 16;
//     canvas.width = width;
//     canvas.height = height;
//     globals.canvas.width = width;
//     globals.canvas.height = height;
//     const rect = canvas.getBoundingClientRect();
//     globals.canvas.left = rect.left;
//     globals.canvas.top = rect.top;
//     if (script) script();
// };

// sketch.onResize(() => {
// graph.resize();
// graph = Graph(sketch, props.dataX, props.dataY);
// stats = Stats(sketch, graph, props.dataX, props.dataY);
// console.log('onResize function run');
// });
