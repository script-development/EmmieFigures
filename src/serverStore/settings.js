const weatherTypes = {
    precip: {
        title: 'Neerslag',
        unitOfMeasure: 'mm',
        steps: 1,
    },
    temp: {
        title: 'Temperatuur',
        unitOfMeasure: '°C',
        steps: 1,
    },
    windspeed: {
        title: 'Windsnelheid',
        unitOfMeasure: 'km/h',
        steps: 2,
    },
    cloudcover: {
        title: 'Bewolking',
        unitOfMeasure: '%',
        steps: 10,
    },
    pressure: {
        title: 'Druk',
        unitOfMeasure: 'bar',
        steps: 4,
    },
};

const trendLines = [
    {
        key: 'none',
        name: 'Geen',
    },
    {
        key: 'linear-regression',
        name: 'Lineaire regressie',
    },
    {
        key: 'loess-regression',
        name: 'LOESS regressie',
    },
];

export default {
    weatherTypes,
    trendLines,
};
