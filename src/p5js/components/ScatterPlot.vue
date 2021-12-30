<template>
    <div id="p5graph" />
    <!-- <div>{{ test }}</div> -->
    <!-- <button @click="put">Set WeatherData to True</button>
    <button @click="get">True of False</button> -->
</template>

<script setup>
import {onMounted, ref} from '@vue/runtime-core';
// import {getFromCache, putInCache, OneDayTTL} from 'services/cache';
// import {getFromApi} from 'services/api';

let cache = ref();
// cache.value = getFromCache('weatherData');

// const put = () => {
//     putInCache('WeatherData', true, OneDayTTL);
// };
// let weth = ref();

// const get = () => {
//     cache.value = getFromCache('WeatherData');
// console.log(weth.value);
// };

// const getData = () => {
// console.log(data);
// };

onMounted(async () => {
    const {init} = await import('p5js/index');
    // console.log(weth);
    //     console.log('WeatherData present');
    // } else {
    //     console.log('WeatherData NOT present');
    // }
    // data = await getFromApi(
    //     'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/
    // groningen?unitGroup=metric&include=days&key=3FJUUWA7WURVMNPM2ZNQWF7C6&contentType=json',
    // ).then(data => {
    //     console.log(data);
    // });
    // return data;
    // console.log(data);
    const p5 = init('p5graph');
    const canvas = p5.createCanvas(1600, 400);
    canvas.position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);
    let posX = 100;
    let posY = 100;
    p5.draw = () => {
        p5.background(200);
    };
});
</script>
