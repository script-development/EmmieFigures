// let loc = 'groningen'; // || longitude & latitude
// let outputSection = 'days'; // other options: current, hours, events, alerts (seperate with '%2C')
// let elements = 'precip'; // other options: datetime,description
// let qString = BASE_URL + `/${location}/${y}-${m}-${d}/${year}-${month + 1}-${day}`;
// qString += `?unitGroup=metric&include=${outputSection}&key=${API_KEY}&elements=${elements}&contentType=json`;
// const BASE_URL = getEnv('WEATHER_API_BASE_URL');
// const API_KEY = getEnv('WEATHER_API_KEY');

// if (!getFromCache('weatherData')) {

const date = new Date('1 Januari 2000');
// const date = new Date();
let [day, month, year] = [date.getDate(), date.getMonth(), date.getFullYear()];

// end date = today minus a day
day -= 1;
if (day < 1) {
    if (month < 1) {
        month = 11;
        year--;
    }
    day = new Date(year, month + 1, day).getDate(); // + 1 on month when day is 0 to get last day from previous month
}
const endDate = dateQueryString(day, month + 1, year);

// start date = today minus a day minus historyLength in months (max 6 months / query on history visual crossing weather with free account)
const historyLength = 3;
month -= historyLength;
if (month < 0) {
    year--;
    month += 12;
}
const maxDay = new Date(year, month + 1, 0).getDate();
if (day > maxDay) day = maxDay;
const startDate = dateQueryString(day, month + 1, year);
console.log(startDate, endDate);
// }

/**
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns {String}
 */
const dateQueryString = (day, month, year) =>
    `${year}/${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`;
