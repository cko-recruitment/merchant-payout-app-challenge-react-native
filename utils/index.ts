
/**
 * Formats a number to a currency string based on the provided currency code and locale.
 * For example, an amount of 123456 with a currency code of 'USD' would be formatted as '$1,234.56'.
 * @param amount 
 * @param currency 
 * @returns 
 */
export const formatedCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatter.format(amount / 100); // Assuming amount is in the smallest currency unit (e.g., cents)
};

/**
 * Formats a date string to a readable format eg: 25 Jan 2023
 * @param dateString 
 * @returns 
 */
export const formatedDate = (dateString: string) => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });

    return formatter.format(new Date(dateString));
};