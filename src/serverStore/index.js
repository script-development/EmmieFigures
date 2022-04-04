const serverData = {};

/**
 *
 * @param {string} key
 * @param {Array<{}>|{}} data
 */
export const setData = (key, data) => {
    if (typeof data === 'string') {
        serverData[key] = data;
    } else if (typeof data === 'object') {
        serverData[key] = data;
    } else throw new Error('Data must be a typeof string or object');
};

/** @param {string} key */
export const getData = key => {
    if (typeof key === 'string') return serverData[key];
    else throw new Error('key must be a typeof string');
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
