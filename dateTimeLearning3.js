// 1. Get current time in ISO format
function getCurrentTimeISO() {
    // Creates a new Date object representing the current date and time
    // Calls toISOString() to convert the Date object to an ISO 8601 string
    return new Date().toISOString();
}

// 2. Convert ISO string to specific country's local time
function isoToCountryTime(isoString, countryCode = 'NL') {
    // Defines a mapping of country codes to their respective time zones
    const timeZones = {
        NL: 'Europe/Amsterdam',  // Netherlands
        US: 'America/New_York',  // United States (Eastern Time)
        JP: 'Asia/Tokyo',        // Japan
        IN: 'Asia/Kolkata',      // India
        BR: 'America/Sao_Paulo'  // Brazil
    };

    // Creates a new Date object from the provided ISO string
    const date = new Date(isoString);
    
    // Converts the date to a locale string using the specified time zone
    // Defaults to 'UTC' if an unknown country code is provided
    return date.toLocaleString('nl-NL', {
        timeZone: timeZones[countryCode] || 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// 3. Create an ISO string from individual date components
function createISOFromComponents({
    year = 1970,       // Default to 1970
    month = 0,         // Default to January (0-based index)
    day = 1,          // Default to the 1st day
    hour = 0,         // Default to midnight
    minute = 0,       // Default to 0 minutes
    second = 0,       // Default to 0 seconds
    millisecond = 0   // Default to 0 milliseconds
}) {
    // Creates a Date object using UTC time zone
    // The month is reduced by 1 because JavaScript months are 0-based (January = 0)
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
    
    // Converts the Date object to an ISO 8601 string
    return date.toISOString();
}

// 4. Check if a given time has already passed
function isTimePassed(targetISO) {
    // Gets the current date and time in ISO format
    const current = new Date(getCurrentTimeISO());
    
    // Converts the target ISO string into a Date object
    const target = new Date(targetISO);
    
    // Compares the target date with the current date
    // If the target date is earlier than the current date, return true (time has passed)
    return target < current;
}

// Test Cases
console.log('1. Current ISO Time:', getCurrentTimeISO()); // Displays the current time in ISO format

const testISO = '2024-05-31T12:00:00.000Z';
console.log('2. NL Time:', isoToCountryTime(testISO, 'NL')); // Converts testISO to Netherlands time
console.log('2. US Time:', isoToCountryTime(testISO, 'US')); // Converts testISO to US (Eastern Time)

const customTime = createISOFromComponents({
    year: 2027,  // Custom year
    month: 12,   // December
    day: 31,     // 31st
    hour: 23,    // 11 PM
    minute: 59   // 59 minutes
});
console.log('3. Custom Time:', customTime); // Outputs custom ISO-formatted time

// Checks if a past date has passed
const pastCheck = isTimePassed('1970-01-01T00:00:00.000Z');
// Checks if a future date has passed
const futureCheck = isTimePassed('2100-01-01T00:00:00.000Z');
console.log('4. Past Check:', pastCheck); // Should return true, as 1970 is in the past
console.log('4. Future Check:', futureCheck); // Should return false, as 2100 is in the future


const allTimeZones = Intl.supportedValuesOf('timeZone');
console.log(allTimeZones); // Array of 500+ IANA time zones