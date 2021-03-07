import clock from 'clock';
import document from 'document';
import { preferences } from 'user-settings';
import * as util from './utils';
import { Vector, Path, Line, Polar } from './vector';
import asap from './asap';
import Spline from './spline';

const TAU = 2 * Math.PI;

const tempText = document.getElementById('temp');
const timeText = document.getElementById('time');
const weatherText = document.getElementById('weather');
const hiTempText = document.getElementById('hiTemp');
const loTempText = document.getElementById('loTemp');

const dayHandTransform = document.getElementById('dayHandTransform');
const dataHandTransform = document.getElementById('dataHandTransform');

const nightArcA = document.getElementById('nightArcA');
const nightArcB = document.getElementById('nightArcB');

const rainBarsA = document.getElementById('rainBarsA').getElementsByTagName('arc');
const rainBarsB = document.getElementById('rainBarsB').getElementsByTagName('arc');

const graphSegments = document.getElementById('graphLineTransform').getElementsByTagName('line');

clock.granularity = 'minutes';
clock.ontick = (evt) => {
  
  let today = evt.date;
  let hours = today.getHours();
  let minutes = today.getMinutes();
  
  setTimeDisplay(hours, minutes);
  setDayHand(hours, minutes);
}

setInterval(function () {
  console.log(`App requests weather data`);
  asap.send({ command: 'weather' });
}, 30 * 60 * 1000)

console.log(`App requests weather data`);
asap.send({ command: 'weather' });

asap.onmessage = message => {
  
  console.log(`App receives message: ${message.type}`);
  
  if (message.type === 'setting') {
    setSetting(message.setting);
  }
  
  else if (message.type === 'weather') {
    setWeatherData(message.weather);
  }
}

function setSetting(setting) {
  console.log(JSON.stringify(setting));
}

function setWeatherData(weather) {
  
  let hourly = getNext24HoursWeatherData(weather.hourly);
  console.log(JSON.stringify(hourly));
  
  let startTime = util.unixTimeToDate(hourly[0].time);
  console.log(`Weather data start time: ${startTime}`);
  
  dataHandTransform.groupTransform.rotate.angle = util.dateToFaceAngle(startTime);
  
  weatherText.text = weather.weather;
  
  setNightArc(weather.sunset, weather.sunrise);
  
  let rain = weather.hourly.map(h => h.rain);
  
  setRadialRainBars(startTime, rain);
  
  tempText.text = `${weather.temp.toFixed(1)}°C`;
  
  let minTemp = Math.floor(weather.minTemp);
  let maxTemp = Math.ceil(weather.maxTemp);
  
  hiTempText.text = `↑ ${maxTemp}°C`;
  loTempText.text = `↓ ${minTemp}°C`;
  
  let tempRange = maxTemp - minTemp;
  let temp = weather.hourly.map(h => (h.temp - minTemp) / tempRange);
  
  setRadialTempGraphNew(startTime, temp, 8);
}

function setTimeDisplay(hours, minutes) {
  
  let hoursDisplay = preferences.clockDisplay === '12h'
    ? hours % 12 || 12
    : util.zeroPad(hours);
  
  let minutesDisplay = util.zeroPad(minutes);
  
  timeText.text = `${hoursDisplay}:${minutesDisplay}`;
}

function setDayHand(hours, minutes) {
  
  let degrees = ((hours * 60) + minutes) / 4;
  
  dayHandTransform.groupTransform.rotate.angle = degrees;
}

function setNightArc(sunset, sunrise) {
  
  let startAngle = util.unixTimeToFaceAngle(sunset);
  let endAngle = util.unixTimeToFaceAngle(sunrise);
  let sweepAngle = endAngle - startAngle;
  
  nightArcA.startAngle = startAngle;
  nightArcA.sweepAngle = sweepAngle;
  nightArcB.startAngle = startAngle;
  nightArcB.sweepAngle = sweepAngle;
}

function setRadialRainBars(startTime, values) {
  
  let startAngle = util.dateToFaceAngle(startTime);
  
  for(let i = 0; i < 24; ++i) {
    
    let a = rainBarsA[i];
    let b = rainBarsB[i];
    let h = Math.round(values[i] * 60);
    
    if (h === 0) {
      b.x = a.x = 0;
      b.y = a.y = 0;
      b.width = a.width = 0;
      b.height = a.height = 0;
      b.arcWidth = a.arcWidth = 0;
      b.startAngle = a.startAngle = 0;
      b.sweepAngle = a.sweepAngle = 0;
      continue;
    }
    
    let barStartAngle = startAngle + 5 + (15 * i);
    let ah = h > 30 ? 30 : h % 30;
    
    a.x = 63 - ah;
    a.y = 63 - ah;
    a.width = 336 - (a.x * 2);
    a.height = 336 - (a.y * 2);
    a.arcWidth = ah;
    a.startAngle = barStartAngle;
    a.sweepAngle = 5;
    
    if (h < 30) {
      b.x = 0;
      b.y = 0;
      b.width = 0;
      b.height = 0;
      b.arcWidth = 0;
      b.startAngle = 0;
      b.sweepAngle = 0;
      continue;
    }
    
    let bh = h % 30;
    
    b.x = 33 - bh;
    b.y = 33 - bh;
    b.width = 336 - (b.x * 2);
    b.height = 336 - (b.y * 2);
    b.arcWidth = bh;
    b.startAngle = barStartAngle;
    b.sweepAngle = 5;
  }
}

function setRadialTempGraphNew(startAngle, values, segments) {

  const startAngleRadians = (((startAngle - 180) / 360) % 1) * TAU;
  
  let xValues = Array
    .apply(null, { length: values.length })
    .map((_, i) => i / 2);
  
  let spline = new Spline(xValues, values)
  
  let polarCoordinates = Array
    .apply(null, { length: values.length * segments })
    .map((_, i) => 
      new Polar(
        spline.at(i / (segments * 2)) * 60 + 105,
        (i / (values.length * segments)) * TAU + startAngleRadians
      )
    );
  
  let cartesianCoordinates = polarCoordinates
    .map(p => p.toCartesian());
  
  for(let i = 0; i < cartesianCoordinates.length; ++i) {
    
    let j = i;
    if ((i + 1) < cartesianCoordinates.length) {
      j++;
    } else console.log('Last segment');
    
    if (i === graphSegments.length) {
      console.error('Not enough graph segments!');
    }
    
    let v1 = cartesianCoordinates[i];
    let v2 = cartesianCoordinates[j];
    let s = graphSegments[i];
    
    s.x1 = v1.x;
    s.y1 = v1.y;
    s.x2 = v2.x;
    s.y2 = v2.y;
  }
}

function getNext24HoursWeatherData(hourly) {
  
  hourly.forEach(h => console.log(util.unixTimeToDate(h.time)));
  
  let now = Date.now() / 1000;
  var i = hourly.indexOf(h => h.time > now ) - 1;
  return hourly.slice(i, 24);
}