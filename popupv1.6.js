let timeOffsetHour = 1;   // 1 hour
let timeOffsetMin = 0;    // 5 minutes
let isInternetTimeAvailable = false;
let updateInterval;
let currentTimezoneOffset = 0; // Will be set from storage

/**
 * Converts hours and minutes into milliseconds for precise time calculations.
 * Useful for timezone offsets, time corrections, and timestamp adjustments.
 * 
 * @param {number} timeOffsetHour - Hours to offset (e.g., 1 for UTC+1).
 * @param {number} timeOffsetMin - Minutes to offset (e.g., 30 for UTC+1:30).
 * @returns {number} Total offset in milliseconds.
 * 
 * @example
 * // Convert 1 hour and 5 minutes to milliseconds:
 * const offset = timeOffset(1, 5); // Returns 3,900,000 ms (1h 5m)
 */
function timeOfftimeOffsetCalculating(timeOffsetHour, timeOffsetMin) {
    // Validate inputs
    if (typeof timeOffsetHour !== 'number' || typeof timeOffsetMin !== 'number') {
      throw new Error('Parameters must be numbers');
    }
  
    // Convert hours and minutes to milliseconds
    const hoursInMs = timeOffsetHour * 3600 * 1000; // 1 hour = 3,600,000 ms
    const minutesInMs = timeOffsetMin * 60 * 1000;  // 1 minute = 60,000 ms
  
    return hoursInMs + minutesInMs;
  }
  

async function fetchInternetTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        const internetUTCDate = new Date(data.utc_datetime);
        timeOffset = internetUTCDate.getTime() - Date.now();
        isInternetTimeAvailable = true;
        setTimeout(fetchInternetTime, 3600 * 1000);
    } catch (error) {
        console.error('Error:', error);
        isInternetTimeAvailable = false;
        timeOffset = 0;
    }
}

function updateDisplay() {
    const currentTimeUTC = Date.now() + timeOfftimeOffsetCalculating(timeOffsetHour, timeOffsetMin);
    const adjustedTime = currentTimeUTC + (currentTimezoneOffset * 3600 * 1000);
    const adjustedDate = new Date(adjustedTime);
    printTime(adjustedDate, currentTimezoneOffset);
}

function startUpdatingTime() {
    if (updateInterval) clearInterval(updateInterval);
    updateDisplay();
    updateInterval = setInterval(updateDisplay, 1000);
}

function printTime(adjustedDate, timezoneOffset) {
    const timeString = adjustedDate.toLocaleTimeString('nl-NL', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZone: 'UTC'
    });
    const dateString = adjustedDate.toLocaleDateString('nl-NL', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        timeZone: 'UTC'
    });
    document.getElementById('timeDisplay').textContent = 
        `Datum: ${dateString}\nTijd: ${timeString} (UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset})`;
}

// Universal storage handler
const storage = {
    get: (key) => new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get([key], (result) => resolve(result[key]));
        } else if (typeof browser !== 'undefined' && browser.storage) {
            browser.storage.sync.get(key).then((result) => resolve(result[key]));
        } else {
            resolve(localStorage.getItem(key));
        }
    }),
    set: (key, value) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.set({ [key]: value });
        } else if (typeof browser !== 'undefined' && browser.storage) {
            browser.storage.sync.set({ [key]: value });
        } else {
            localStorage.setItem(key, value);
        }
    }
};

async function initializeTimezone() {
    const savedTimezone = await storage.get('timezone');
    const timezoneSelect = document.getElementById('timezone-select');
    if (savedTimezone) {
        currentTimezoneOffset = parseFloat(savedTimezone);
        timezoneSelect.value = savedTimezone;
    } else {
        currentTimezoneOffset = parseFloat(timezoneSelect.value);
    }
}

function addButtonEventListeners() {
    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.getElementById('settingsPanelButton');
    const timezoneSelect = document.getElementById('timezone-select');

    settingsButton?.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
    });

    timezoneSelect?.addEventListener('change', function() {
        currentTimezoneOffset = parseFloat(this.value);
        storage.set('timezone', this.value);
        settingsPanel.classList.add('hidden');
        updateDisplay();
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeTimezone();
    await fetchInternetTime();
    startUpdatingTime();
    addButtonEventListeners();
});