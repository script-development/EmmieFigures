import p5 from 'p5';
import Motion from './Motion.js';

const vehicles = [];

const canvasElement = document.getElementById('canvas');
const script = P5 => {
    P5.setup = () => {
        // P5.createCanvas(window.innerWidth, window.innerHeight);
        P5.createCanvas(1024, 576);
        for (let i = 0; i < 1; i++) {
            vehicles.push(new Motion(400, 200, 20));
        }
    };
    P5.draw = () => {
        P5.background(0);
        for (let i = 0; i < 1; i++) {
            vehicles[i].update();
            // vehicles[i].edgesRect();
            vehicles[i].showTriangle();
        }
    };
    P5.keyPressed = () => {
        if (P5.keyCode == P5.UP_ARROW) vehicles[0].up = true;
        if (P5.keyCode == P5.DOWN_ARROW) vehicles[0].down = true;
        if (P5.keyCode == P5.LEFT_ARROW) vehicles[0].left = true;
        if (P5.keyCode == P5.RIGHT_ARROW) vehicles[0].right = true;
    };
    P5.keyReleased = () => {
        if (P5.keyCode == P5.UP_ARROW) vehicles[0].up = false;
        if (P5.keyCode == P5.DOWN_ARROW) vehicles[0].down = false;
        if (P5.keyCode == P5.LEFT_ARROW) vehicles[0].left = false;
        if (P5.keyCode == P5.RIGHT_ARROW) vehicles[0].right = false;
    };
};
const actualP5 = new p5(script, canvasElement || undefined);
export default actualP5;
