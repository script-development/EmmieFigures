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

const DateHelper = {
    /**
     * @param {Date} aDate
     * @param {number} numberOfDays
     */
    addDays: (aDate, numberOfDays) => {
        aDate.setDate(aDate.getDate() + numberOfDays); // Add numberOfDays
        return aDate; // Return the date
    },
    /** @param {Date} date */
    format: date =>
        [
            date.getFullYear(), // Get full year
            ('0' + (date.getMonth() + 1)).slice(-2), // Get month and pad it with zeroes
            ('0' + date.getDate()).slice(-2), // Get day and pad it with zeroes
        ].join('-'), // Glue the pieces together
};

/**
 * @param {string} date
 * @param {number} addOrSub
 */
export const addOrSubtractDays = (date, addOrSub) => DateHelper.format(DateHelper.addDays(new Date(date), addOrSub));
