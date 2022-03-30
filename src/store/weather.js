/** @typedef {import("types/data").WeatherData} WeatherData */

/** @type {WeatherData[]} */
export let weatherData;

/** @param {string | WeatherData[]} data */
export const setWeatherData = data => {
    console.log('setWeatherData: ', typeof data);
    if (typeof data === 'string') weatherData = JSON.parse(data);
    if (typeof data === 'object') weatherData = data;
    // else throw new Error('data is not of type string or object');
};

export const weatherOptions = [
    {
        key: 'precip',
        name: 'Neerslag',
        unitOfMeasure: 'mm',
    },
    {
        key: 'temp',
        name: 'Temperatuur',
        unitOfMeasure: '°C',
    },
    {
        key: 'windspeed',
        name: 'Windsnelheid',
        unitOfMeasure: 'km/h',
    },
    {
        key: 'cloudcover',
        name: 'Bewolking',
        unitOfMeasure: '%',
    },
    {
        key: 'pressure',
        name: 'Druk',
        unitOfMeasure: 'bar',
    },
];
