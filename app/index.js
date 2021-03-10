import clock from 'clock';
import asap from 'fitbit-asap/app';
import * as util from './utils';
import setTheme from './theme';

import setTimeDisplay from './watchface/timeDisplay';
import setDayHand from './watchface/dayHand';
import setNightArc from './watchface/nightArc';
import setRainBars from './watchface/rainBars';
import setTempGraph from './watchface/tempGraph';
import setTempDisplay from './watchface/tempDisplay';
import setWorkArc from './watchface/workArc';
import setSecondaryDisplayA from './watchface/secondaryDisplayA';
import setSecondaryDisplayB from './watchface/secondaryDisplayB';

var weatherCache;

clock.granularity = 'minutes';
clock.ontick = (evt) => {
  
  console.log(`Clock tick`);

  let today = evt.date;
  let hours = today.getHours();
  let minutes = today.getMinutes();
  
  setTimeDisplay(hours, minutes);
  setDayHand(hours, minutes);

  if (weatherCache) {
    setTimeout(() => setWeatherData(weatherCache, false), 100);
  }
}

let now = new Date();
let lastHour = new Date().setMinutes(0, 0, 0);
let msUntilNextHour = (60 * 60 * 1000) - (now - lastHour);

setTimeout(() => {

  console.log(`Initial timeout has expired - app should now be synchronised with the hour`);

  requestWeatherData();
  setInterval(requestWeatherData, 60 * 60 * 1000);
}, msUntilNextHour);

requestWeatherData();
requestSettings();

asap.onmessage = message => {
  
  console.log(`Received message: ${message.type}`);
  
  if (message.type === 'settings') {

    applySettings(message.settings);
  }
  
  else if (message.type === 'weather') {

    weatherCache = message.weather;
    setWeatherData(weatherCache, true);
  }
}

function requestSettings() {

  console.log(`Requesting settings`);
  asap.send({ command: 'settings' });
}

function applySettings(settings) {

  console.log(`Applying settings`);

  setTheme(settings.colorScheme.selected[0]);
  setWorkArc(settings.showWorkingHours, settings.workingDays, settings.workingStartTime, settings.workingEndTime);
}

function requestWeatherData() {

  console.log(`Requesting weather data`);
  asap.send({ command: 'weather' });
}

function setWeatherData(weather, dataChanged) {
  
  console.log(`Applying weather data`);

  let startTime = util.unixTimeToDate(weather.startTime);
  let currentTime = new Date();
  currentTime.setMinutes(0, 0, 0);

  // Whole hours between start time and current time
  let skipHours = (currentTime - startTime) / 3600000;

  console.log(`Skipping ${skipHours} hour(s) of weather data`);

  let temps = weather.hourlyTemp.slice(skipHours, Math.max(25, weather.hourlyTemp.length) - 1);
  let minTemp = Math.floor(Math.min.apply(Math, temps));
  let maxTemp = Math.ceil(Math.max.apply(Math, temps));

  if (dataChanged) {
  
    setNightArc(weather.sunset, weather.sunrise);
    
    let rain = weather.hourlyRain;
    
    setRainBars(startTime, rain);
    
    let currTemp = weather.temp;
    
    setTempDisplay(minTemp, maxTemp);

    setSecondaryDisplayA(`${currTemp.toFixed(1)}°C`);
    setSecondaryDisplayB(weather.weather);
  }
  
  setTempGraph(currentTime, temps, minTemp, maxTemp, 8);
}