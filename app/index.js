import clock from 'clock';
import asap from 'fitbit-asap/app';
import dateFormat from 'dateformat';
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
import setRainVolumeDisplay from './watchface/rainVolumeDisplay';

var weatherCache;
var secondaryAType;
var secondaryBType;
var showChartValues;

clock.granularity = 'minutes';
clock.ontick = (evt) => {

  console.log(`Clock tick`);

  let today = evt.date;
  let hours = today.getHours();
  let minutes = today.getMinutes();

  setTimeDisplay(hours, minutes);
  setDayHand(hours, minutes);

  if (secondaryAType === 3) {
    setSecondaryDisplayA(dateFormat(today, 'mmm dS'));
  }

  if (secondaryBType === 3) {
    setSecondaryDisplayB(dateFormat(today, 'mmm dS'));
  }

  if (weatherCache) {
    setTimeout(() => setWeatherData(weatherCache), 100);
  }
}

requestWeatherData();
requestSettings();
setWeatherTimeout();

asap.onmessage = message => {

  console.log(`Received message: ${message.type}`);

  if (message.type === 'settings') {

    applySettings(message.settings);
  }

  else if (message.type === 'weather') {

    weatherCache = message.weather;
    setWeatherData(weatherCache);
  }
}

function setWeatherTimeout() {

  let now = new Date();
  let lastHour = new Date().setMinutes(0, 0, 0);
  let msUntilNextHour = (60 * 60 * 1000) - (now - lastHour);

  setTimeout(() => {

    console.log(`Initial timeout has expired - app should now be synchronised with the hour`);

    requestWeatherData();
    setInterval(requestWeatherData, 60 * 60 * 1000);
  }, msUntilNextHour);
}

function requestSettings() {

  console.log(`Requesting settings`);
  asap.send({ command: 'settings' });
}

function applySettings(settings) {

  console.log(`Applying settings`);

  secondaryAType = settings.secondaryA.selected[0];
  secondaryBType = settings.secondaryB.selected[0];
  showChartValues = settings.showChartValues;

  setTheme(settings.colorScheme.selected[0]);
  setWorkArc(settings.showWorkingHours, settings.workingDays, settings.workingStartTime, settings.workingEndTime);
}

function requestWeatherData() {

  console.log(`Requesting weather data`);
  asap.send({ command: 'weather' });
}

function setWeatherData(weather) {

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

  setNightArc(weather.sunset, weather.sunrise);

  //let pop = weather.hourlyRainPop.slice(skipHours, Math.max(24, weather.hourlyRainPop.length) - 1);
  let vol = weather.hourlyRainVol.slice(skipHours, Math.max(24, weather.hourlyRainVol.length) - 1);
  let minVol = Math.floor(Math.min.apply(Math, vol));
  let maxVol = Math.ceil(Math.max.apply(Math, vol));
  let totalVol = vol.reduce((total, v) => total + v);
  let volRange = maxVol - minVol;
  let rain = vol.map((v, i) => volRange ? ((v - minVol) / volRange) : 0); //* pop[i]);

  setRainVolumeDisplay(showChartValues, totalVol);
  setRainBars(startTime, rain);

  setTempDisplay(showChartValues, minTemp, maxTemp);

  setSecondaryDisplay(secondaryAType, weather, setSecondaryDisplayA);
  setSecondaryDisplay(secondaryBType, weather, setSecondaryDisplayB);

  setTempGraph(currentTime, temps, minTemp, maxTemp, 8);
}

function setSecondaryDisplay(type, weather, set) {
  switch (type) {
    case 0: // Hide
      set('');
      break;
    case 1: // Temperature
      `${weather.temp.toFixed(1)}°C`
      break;
    case 2: // Weather
      set(weather.weather);
      break;
  }
}