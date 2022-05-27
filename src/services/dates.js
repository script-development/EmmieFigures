/**
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns {string}
 */
export const dateQueryString = (day, month, year) =>
    `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

export const yesterdayQueryString = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return dateQueryString(date.getDate(), date.getMonth() + 1, date.getFullYear());
};
