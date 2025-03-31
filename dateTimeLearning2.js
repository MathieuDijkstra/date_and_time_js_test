// 1. Get current time in ISO format
function getCurrentTimeISO() {
    return new Date().toISOString();
  }
  
  // 2. Convert ISO string to specific country's local time
  function isoToCountryTime(isoString, countryCode = 'NL') {
    const timeZones = {
      NL: 'Europe/Amsterdam',
      US: 'America/New_York',
      JP: 'Asia/Tokyo',
      IN: 'Asia/Kolkata',
      BR: 'America/Sao_Paulo'
    };
  
    const date = new Date(isoString);
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
  
  // 3. Create ISO from date components
  function createISOFromComponents({
    year = 1970,
    month = 0,
    day = 1,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0
  }) {
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
    return date.toISOString();
  }
  
  // 4. Check if time has passed
  function isTimePassed(targetISO) {
    const current = new Date(getCurrentTimeISO());
    const target = new Date(targetISO);
    return target < current;
  }
  
  // Test Cases
  console.log('1. Current ISO Time:', getCurrentTimeISO());
  
  const testISO = '2024-05-31T12:00:00.000Z';
  console.log('2. NL Time:', isoToCountryTime(testISO, 'NL'));
  console.log('2. US Time:', isoToCountryTime(testISO, 'US'));
  
  const customTime = createISOFromComponents({
    year: 2027,
    month: 12,
    day: 31,
    hour: 23,
    minute: 59
  });
  console.log('3. Custom Time:', customTime);
  
  const pastCheck = isTimePassed('1970-01-01T00:00:00.000Z');
  const futureCheck = isTimePassed('2100-01-01T00:00:00.000Z');
  console.log('4. Past Check:', pastCheck); // Should be true
  console.log('4. Future Check:', futureCheck); // Should be false