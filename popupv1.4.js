let timeOffset = 0; // Stores difference between internet time and system time in ms
let isInternetTimeAvailable = false;
let updateInterval;
let currentTimezoneOffset = 1; // Default to UTC+1 (London)

async function fetchInternetTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        const internetUTCDate = new Date(data.utc_datetime);
        const internetTime = internetUTCDate.getTime();
        const systemTime = Date.now();

        timeOffset = internetTime - systemTime;
        isInternetTimeAvailable = true;

        // Schedule next sync in 1 hour
        setTimeout(fetchInternetTime, 3600 * 1000);
    } catch (error) {
        console.error('Error fetching internet time:', error);
        isInternetTimeAvailable = false;
        timeOffset = 0;
    }
}

function updateDisplay() {
    const currentTime = Date.now() + (isInternetTimeAvailable ? timeOffset : 0) + (currentTimezoneOffset * 3600 * 1000);
    const adjustedDate = new Date(currentTime);
    printTime(adjustedDate, currentTimezoneOffset);
}

function startUpdatingTime() {
    // Clear existing interval if it exists
    if (updateInterval) clearInterval(updateInterval);
    
    // Update immediately and then every second
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
    // Add Agenda Item button
    const button = document.getElementById('addAgendaItemButton');
    if (button) {
        button.addEventListener('click', function() {
            console.log('Add agenda item button is pressed');
        });
    }

    // Settings button to show/hide panel
    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.getElementById('settingsPanelButton');
    if (settingsButton && settingsPanel) {
        settingsButton.addEventListener('click', function() {
            settingsPanel.classList.toggle('hidden');
        });
    }

    // Timezone selection
    const timezoneSelect = document.getElementById('timezone-select');
    if (timezoneSelect) {
        // Load saved timezone
        chrome.storage.sync.get(['timezone'], function(result) {
            if (result.timezone !== undefined) {
                timezoneSelect.value = result.timezone;
                currentTimezoneOffset = parseFloat(result.timezone);
                updateDisplay();
            }
        });

        timezoneSelect.addEventListener('change', function() {
            const selectedOffset = parseFloat(this.value);
            currentTimezoneOffset = selectedOffset;
            
            // Save to storage
            chrome.storage.sync.set({ timezone: selectedOffset });
            
            // Update display immediately
            updateDisplay();
            
            // Hide settings panel
            if (settingsPanel) settingsPanel.classList.add('hidden');
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    fetchInternetTime()
        .then(startUpdatingTime)
        .catch(startUpdatingTime);
    addButtonEventListeners();
});