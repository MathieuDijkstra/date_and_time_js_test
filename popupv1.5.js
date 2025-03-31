let timeOffsetHour = -1;   // -1 hour
let timeOffsetMin = 0;    // 5 minutes
let timeOffset = timeOfftimeOffsetCalculating(timeOffsetHour, timeOffsetMin);
let isInternetTimeAvailable = false;
let updateInterval;
let currentTimezoneOffset = parseFloat(document.querySelector('#timezone-select [selected]').value);

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
    const currentTime = Date.now() + timeOffset + (currentTimezoneOffset * 3600 * 1000);
    const adjustedDate = new Date(currentTime);
    printTime(adjustedDate, currentTimezoneOffset);
}

function startUpdatingTime() {
    if (updateInterval) clearInterval(updateInterval);
    updateDisplay();
    updateInterval = setInterval(updateDisplay, 1000);
}

function printTime(localDate, timezoneOffset) {
    const timeString = localDate.toLocaleTimeString('nl-NL', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    const dateString = localDate.toLocaleDateString('nl-NL', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
    document.getElementById('timeDisplay').textContent = 
        `Datum: ${dateString}\nTijd: ${timeString} (UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset})`;
}

function addButtonEventListeners() {
    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.getElementById('settingsPanelButton');
    const timezoneSelect = document.getElementById('timezone-select');

    // Toggle settings panel
    settingsButton?.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
    });

    // Handle timezone change
    timezoneSelect?.addEventListener('change', function() {
        currentTimezoneOffset = parseFloat(this.value);
        chrome.storage.sync.set({ timezone: this.value }, () => {
            settingsPanel.classList.add('hidden');
            updateDisplay();
        });
    });

    // // Load saved timezone
    // chrome.storage.sync.get(['timezone'], (result) => {
    //     if (result.timezone) {
    //         timezoneSelect.value = result.timezone;
    //         currentTimezoneOffset = parseFloat(result.timezone);
    //     }
    // });


// Universal storage handler
const storage = {
    get: (key, callback) => {
      // Try Chrome extension API first
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([key], callback);
      } 
      // Then try Firefox extension API
      else if (typeof browser !== 'undefined' && browser.storage) {
        browser.storage.sync.get(key).then(callback);
      }
      // Fallback to localStorage for testing
      else {
        const value = localStorage.getItem(key);
        callback({ [key]: value });
      }
    },
    set: (data, callback) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(data, callback);
      } else if (typeof browser !== 'undefined' && browser.storage) {
        browser.storage.sync.set(data).then(callback);
      } else {
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, data[key]);
        });
        if (callback) callback();
      }
    }
  };
  
  // Usage:
  storage.get('timezone', (result) => {
    if (result.timezone) {
      timezoneSelect.value = result.timezone;
      currentTimezoneOffset = parseFloat(result.timezone);
      updateDisplay();
    }
  });



}

document.addEventListener('DOMContentLoaded', () => {
    fetchInternetTime()
        .then(startUpdatingTime)
        .catch(startUpdatingTime);
    addButtonEventListeners();
});

// Get system's current timezone offset in hours
const getSystemTimezoneOffset = () => {
    return -new Date().getTimezoneOffset() / 60;
  };
  
  console.log(getSystemTimezoneOffset()); // Example: 1 for Amsterdam (UTC+1)