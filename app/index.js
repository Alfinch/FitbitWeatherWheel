import clock from 'clock';
import document from 'document';
import * as util from './utils';
import asap from 'fitbit-asap/app';
import setTimeDisplay from './watchface/timeDisplay';
import setDayHand from './watchface/dayHand';
import setNightArc from './watchface/nightArc';
import setRainBars from './watchface/rainBars';
import setTempGraph from './watchface/tempGraph';
import setTempDisplay from './watchface/tempDisplay';
import setWorkArc from './watchface/workArc';

const weatherText = document.getElementById('weather');
const dataHandTransform = document.getElementById('dataHandTransform');

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
    setWeatherData(weatherCache);
  }
}

let now = new Date();
let lastHour = new Date().setMinutes(0, 0, 0);
let msUntilNextHour = (60 * 60 * 1000) - (now - lastHour);

setTimeout(() => {
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

    if (weatherCache == null) {

      setWeatherData(message.weather);
    }

    weatherCache = message.weather;
  }
}

function requestSettings() {

  console.log(`Requesting settings`);
  asap.send({ command: 'settings' });
}

function applySettings(settings) {

  console.log(`Applying settings`);

  setWorkArc(settings.showWorkingHours, settings.workingDays, settings.workingStartTime, settings.workingEndTime);
}

function requestWeatherData() {

  console.log(`Requesting weather data`);
  asap.send({ command: 'weather' });
}

function setWeatherData(weather) {
  
  console.log(`Applying weather data`);

  let startTime = util.unixTimeToDate(weather.startTime);
  
  dataHandTransform.groupTransform.rotate.angle = util.dateToFaceAngle(startTime);
  
  weatherText.text = weather.weather;
  
  setNightArc(weather.sunset, weather.sunrise);
  
  let rain = weather.hourlyRain;
  
  setRainBars(startTime, rain);
  
  let currTemp = weather.temp;
  let minTemp = Math.floor(weather.minTemp);
  let maxTemp = Math.ceil(weather.maxTemp);
  
  setTempDisplay(currTemp, minTemp, maxTemp);
  
  setTempGraph(startTime, weather.hourlyTemp, minTemp, maxTemp, 8);
}