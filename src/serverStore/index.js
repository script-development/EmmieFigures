/** @type {any} */
const store = {};

/**
 *
 * @param {string} key
 * @param {Array<{}>|string} data
 */
export const setData = (key, data) => {
    if (typeof data === 'object') store[key] = data;
    else if (isJsonString(data)) store[key] = JSON.parse(data);
    else throw new Error('Data must be JSON string or object');
};

/** @param {string} key */
export const getData = key => {
    if (typeof key === 'string') return store[key];
    else throw new Error('key must be a string');
};

/** @param {string} subject */
const isJsonString = subject => {
    try {
        JSON.parse(subject);
        return true;
    } catch {
        return false;
    }
};

/**
 *
 * @param {import('types/data').WeatherTypeKeys} weatherType
 * @param {string} from
 * @param {string} to
 * @returns
 */
export const getSelectedWeatherData = (weatherType, from, to) => {
    const allData = getData('weatherData');
    const filteredData = allData.map(weather => ({date: weather.datetime, value: weather[weatherType]}));
    return filteredData;
    // wData.value = weather.value.map(weather => ({date: weather.datetime, value: weather[weatherSetting.value.key]}));
    // weather.value = await getFromApi(
    //     `${getEnv('VITE_APP_URL')}/api/weather/${weatherTypeKey.value}/${convert(selectedStartDate.value)}-${convert(
    //         selectedEndDate.value,
    //     )}`,
    // );
};
