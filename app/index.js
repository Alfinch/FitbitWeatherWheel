import clock from 'clock';
import asap from 'fitbit-asap/app';
import { memory } from "system";
import * as util from './utils';
import setTheme from './theme';
import setHourMarkers from './hourMarkers';

import setTimeDisplay from './watchface/timeDisplay';
import setDayHand from './watchface/dayHand';
import setNightArc from './watchface/nightArc';
import setRainBars from './watchface/rainBars';
import setTempGraph from './watchface/tempGraph';
import setTempDisplay from './watchface/tempDisplay';
import setWorkArc from './watchface/workArc';
import setSecondaryDisplay from './watchface/secondaryDisplay';
import setRainVolumeDisplay from './watchface/rainVolumeDisplay';

var weatherMessageSections = [];
var weatherMessageTimestamp = null;
var weatherCache;
var settingsCache;
var secondaryAType;
var secondaryBType;
var showChartValues;
var tempValuesMode;

clock.granularity = 'minutes';
clock.ontick = (evt) => {

  console.log(`Clock tick`);
  console.log(`JS memory: ${memory.js.used} of ${memory.js.total} (Peak: ${memory.js.peak})`);
  console.log(`Memory pressure: ${memory.monitor.pressure}`);

  let today = evt.date;
  let hours = today.getHours();
  let minutes = today.getMinutes();

  setTimeDisplay(hours, minutes);
  setDayHand(hours, minutes);
  setWeatherDataAsync();

  if (settingsCache) {
    let settings = settingsCache;
    setWorkArc(settings.showWorkingHours, settings.workingDays, settings.workingStartTime, settings.workingEndTime);
  }
}

requestWeatherData();
requestSettings();

// Request weather data every 30 minutes
setInterval(requestWeatherData, 30 * 60 * 1000);

asap.onmessage = message => {

  console.log(`Received message: ${message.type}`);

  switch (message.type) {

    case 'settings':
      applySettings(message.settings);
      setWeatherDataAsync();
      break;

    case 'weather':
      processWeatherSection(message);
      break;

    default:
      console.error(`Unrecognised message type`);
  }
}

function processWeatherSection(message) {

  if (weatherMessageTimestamp === null) {
    weatherMessageTimestamp = message.t;

  } else if (weatherMessageTimestamp !== message.t) {
    return;
  }

  let sections = weatherMessageSections;
  
  console.log(`Processing weather data section ${sections.length + 1} of ${message.total}`);

  sections.push(message.section);

  if (sections.length === message.total) {
    
    console.log(`All sections received`);

    let weather = JSON.parse(sections.reduce((json, section) => json + section));

    weatherMessageSections = [];
    weatherCache = weather;
    setWeatherDataAsync();

  }
}

function requestSettings() {

  console.log(`Requesting settings`);
  asap.send({ command: 'settings' });
}

function applySettings(settings) {

  console.log(`Applying settings`);
  
  settingsCache = settings;

  secondaryAType = settings.secondaryA.selected[0];
  secondaryBType = settings.secondaryB.selected[0];
  showChartValues = settings.showChartValues;
  tempValuesMode = settings.temperatureValues.selected[0];

  setTheme(settings.colorScheme.selected[0]);
  setHourMarkers(settings.hourMarkers.selected[0]);
  setWorkArc(settings.showWorkingHours, settings.workingDays, settings.workingStartTime, settings.workingEndTime);
}

function requestWeatherData() {

  console.log(`Requesting weather data`);

  weatherMessageTimestamp = null;
  weatherMessageSections = [];

  asap.send({ command: 'weather' });
}

function setWeatherDataAsync() {

  if (weatherCache) {

    // Allow time to render the watchface before crunching numbers
    // This ensures the watch wakes quickly, then shows the correct data after a short while
    setTimeout(() => setWeatherData(), 100);
  }
}

function setWeatherData() {

  console.log(`Applying weather data`);
  const weather = getCurrentWeatherData();

  setNightArc(weather.sunset, weather.sunrise);

  setRainVolumeDisplay(showChartValues, weather.currentPVol, weather.currentPOP);
  setRainBars(weather.hourlyPVol);

  setTempDisplay(showChartValues, tempValuesMode, weather.hourlyTemp);

  setSecondaryDisplay(0, secondaryAType, weather);
  setSecondaryDisplay(1, secondaryBType, weather);

  setTempGraph(weather.hourlyTemp);
}

function getCurrentWeatherData() {

  let startTime = util.unixTimeToDate(weatherCache.startTime);
  let currentTime = new Date();
  currentTime.setMinutes(0, 0, 0);

  // Whole hours between start time and current time
  let skipHours = Math.floor((currentTime - startTime) / 3600000);

  if (skipHours > 0) {
    console.log(`Weather is ${skipHours} hour(s) out of date`);
  }

  return {
    sunrise: weatherCache.sunrise,
    sunset: weatherCache.sunset,
    currentWeather: weatherCache.hourlyWeather[skipHours],
    currentPOP: weatherCache.hourlyPOP[skipHours],
    currentPVol: weatherCache.hourlyPVol[skipHours],
    hourlyPVol: weatherCache.hourlyPVol.slice(skipHours),
    hourlyTemp: weatherCache.hourlyTemp.slice(skipHours),
  }
}