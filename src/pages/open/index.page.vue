<template>
    <div>Open Weater Maps Org</div>
    <img src="http://openweathermap.org/img/wn/04d.png" />
</template>

<script setup>
import {onMounted} from 'vue';

import {getFromApi} from 'services/api';

let weather;

onMounted(async () => {
    weather = await getFromApi(
        'https://api.openweathermap.org/data/2.5/weather?lat=53.21&lon=6.57&lang=nl&appid=511c9d2156ef7861f4fdd2b2181a0be4&units=metric',
    );
    // const img = new Image();

    // 'https://api.openweathermap.org/data/2.5/weather?lat=53.21&lon=6.57&appid=511c9d2156ef7861f4fdd2b2181a0be4',
    // reports.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/report-data`);
    // setDateInputs();
    console.log(weather);
});
</script>
