const weatherTypes = [
    {
        key: 'precip',
        name: 'Neerslag',
        unitOfMeasure: 'mm',
        steps: 1,
    },
    {
        key: 'temp',
        name: 'Temperatuur',
        unitOfMeasure: '°C',
        steps: 1,
    },
    {
        key: 'windspeed',
        name: 'Windsnelheid',
        unitOfMeasure: 'km/h',
        steps: 2,
    },
    {
        key: 'cloudcover',
        name: 'Bewolking',
        unitOfMeasure: '%',
        steps: 10,
    },
    {
        key: 'pressure',
        name: 'Druk',
        unitOfMeasure: 'bar',
        steps: 4,
    },
];

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
