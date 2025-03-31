let timeOffset = 0; // Stores difference between internet time and system time in ms
let isInternetTimeAvailable = false;
let updateInterval;

async function fetchInternetTime(timezoneOffset) {
    try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        const internetUTCDate = new Date(data.utc_datetime);
        const internetTime = internetUTCDate.getTime();
        const systemTime = Date.now();

        timeOffset = internetTime - systemTime;
        isInternetTimeAvailable = true;

        // Schedule next sync in 1 hour
        setTimeout(() => fetchInternetTime(timezoneOffset), 3600 * 1000);
    } catch (error) {
        console.error('Error fetching internet time:', error);
        isInternetTimeAvailable = false;

        // Fallback to local system time
        timeOffset = 0; // No offset, use system time directly
    }
}

function updateDisplay(timezoneOffset) {
    const currentTime = Date.now() + (isInternetTimeAvailable ? timeOffset : 0) + (timezoneOffset * 3600 * 1000);
    const adjustedDate = new Date(currentTime);
    printTime(adjustedDate, timezoneOffset);
}

function startUpdatingTime(timezoneOffset) {
    // Clear existing interval if it exists
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    // Update immediately and then every second
    updateDisplay(timezoneOffset);
    updateInterval = setInterval(() => updateDisplay(timezoneOffset), 1000);
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

document.addEventListener('DOMContentLoaded', function() {
    // Initial time setup
    fetchInternetTime(1)
        .then(() => startUpdatingTime(1))
        .catch(() => startUpdatingTime(1));
});

function addButtonEventListeners() {
    const button = document.getElementById('addAgendaItemButton');
    if (button) {
        button.addEventListener('click', function() {
            console.log('add agenda item button is pressed');
        });
    } else {
        console.warn('Add Agenda Item button not found.');
    }

    const editButton = document.getElementById('settingsButton');
    if (editButton) {
        editButton.addEventListener('click', function() {
            console.log('Settings button is pressed');
            // Open settings page in a new tab
            const settingsPanel = document.getElementById('settingsPanelButton');
            if (settingsPanel) {
                settingsPanel.classList.remove('hidden');
            } else {
                console.warn('Settings panel not found.');
            }
        });
    } else {
        console.warn('Settings button not found.');
    }

    // const settingsPanelButton = document.getElementById('timezone-select');
    // if (settingsPanelButton) {
    //     const observer = new MutationObserver((mutationsList) => {
    //         for (const mutation of mutationsList) {
    //             if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
    //                 // Check if the button is now visible
    //                 if (!settingsPanelButton.classList.contains('hidden')) {
    //                     console.log('Settings panel button is now visible. Fetching internet time...');
    //                     fetchInternetTime(1); // Call fetchInternetTime with a timezone offset
    //                 }
    //             }
    //         }
    //     });
    
    //     observer.observe(settingsPanelButton, { attributes: true });
    // } else {
    //     console.warn('Settings panel button not found.');
    // }



    document.getElementById('timezone-select').addEventListener('change', function() {
        const selected = this.options[this.selectedIndex];
        if (selected.value) {
          console.log('Selected:', selected.textContent);
          document.getElementById('output').textContent = 
            `Selected: ${selected.textContent}`;
        }
      });





}

addButtonEventListeners();