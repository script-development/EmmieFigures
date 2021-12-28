<!-- <template>
    <div id="nature" />
</template>

<script setup>
import {onMounted} from '@vue/runtime-core';
// import Vehicle from 'p5js/motion';

onMounted(async () => {
    const {init} = await import('p5js/index');
    const Vehicle = (await import('p5js/motiontemp')).default;
    const p5 = init('nature');

    const canvas = p5.createCanvas(1200, 600);
    canvas.position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);

    // let target = Target(p5, {x: 200, y: 200, maxVel: 5});
    // let pursuer = Pursuer(p5, {x: 1000, y: 200, maxVel: 6});
    const vehicle = Vehicle(p5, {x: 600, y: 300});
    let fps = p5.frameRate().toFixed(0);

    p5.draw = () => {
        p5.background(0);
        // let target = p5.createVector(p5.mouseX, p5.mouseY);
        // let pursueForce = pursuer.seek(target, {arriving: true});
        // pursuer.applyForce(pursueForce);

        vehicle.wander();

        vehicle.update();
        vehicle.edges();
        vehicle.show();
        // let evadeForce = target.evade(pursuer);
        // target.applyForce(evadeForce);

        // target.update();
        // target.edges();
        // pursuer.update();
        // pursuer.edges();

        // target.show();
        // pursuer.show();
        if (p5.frameCount % 10 == 0) {
            fps = p5.frameRate().toFixed(0);
        }
        p5.fill(255);
        p5.textSize(20);
        p5.text(fps, 60, 550);
    };
    p5.mouseReleased = () => {
        //
    };
});
</script> -->
