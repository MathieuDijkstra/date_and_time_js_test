// get curent date and time
const date=new Date();
console.log(date);
// javascript can get the current time and date by using text
console.log(new Date('january 1, 2023 00:00:00'));
// calculate the time in milliseconds sinsee january 1, 1970 00:00:00
let years=0;// 1 year = 365 days
let months=0;// 12 months = 1 year
let days=0;// 30 days = 1 month
let hours=0;// 24 hours = 1 day    
let minutes=0;// 60 minutes = 1 hour
let seconds=0;// 60 seconds = 1 minute
let milliseconds=0;//1000 milliseconds = 1 second
console.log(new Date(years*months*days*hours*minutes*seconds*milliseconds));


//
// different ways to get the current date and time UTC time = offset london tinme so 0!!!
//
// Calculate milliseconds for 1 year, 2 months, 3 days, etc. (UTC)
// Convert to UTC timestamp:
const timestamp = Date.UTC(
  1970 + years, 
  months, // Months are 0-indexed (0 = January)
  days, 
  hours, 
  minutes, 
  seconds,
  milliseconds
);

const date2 = new Date(timestamp);
console.log("UTC time: "+date2.toISOString()); // "1971-03-04T04:05:06.000Z"


// diferent way to get the current date and time UTC time = offset london tinme so 0!!!
const date3 = new Date(Date.UTC(years, months, days, hours, minutes, seconds, milliseconds));
console.log("UTC time: "+date3.toISOString()); // "1971-03-04T04:05:06.000Z"

// get curent date time UTC time = offset london tinme so 0!!!
const date4 = new Date();
console.log("UTC time curent data: "+date4.toISOString()); // "1971-03-04T04:05:06.000Z"

// get time stamp in miliseconds    
const timestamp2 = date4.getTime();
console.log("timestamp in miliseconds: "+timestamp2+" = date in utc: "+new Date(timestamp2).toISOString()); // "1971-03-04T04:05:06.000Z" 
 