import { me as companion } from 'companion'; 
import { geolocation } from 'geolocation';
import asap from 'fitbit-asap/companion';
import defaultSettings from './defaultSettings';
import { settingsStorage } from 'settings';
import openWeatherMapKey from './openWeatherMapKey';

const URL = `https://api.openweathermap.org/data/2.5/onecall`
  + `?appid=${openWeatherMapKey}&units=metric&exclude=minutely,daily,alerts`;

defaultSettings();

if (companion.launchReasons.settingsChanged) {
  onSettingsChanged();
}

settingsStorage.addEventListener('change', (evt) => {
  onSettingsChanged();
});

asap.onmessage = message => {
  
  console.log(`Received message: ${message.command}`);
  
  if (message.command === 'weather') {
    
    geolocation.getCurrentPosition(
      onLocationData,
      (err) => handleError('Location', err),
      { timeout: 60 * 1000 });
  }

  if (message.command === 'settings') {
    
    onSettingsChanged();
  }
}

function onLocationData(position) {
  
  console.log(`Received location data`);
  
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  
  fetch(`${URL}&lat=${lat}&lon=${lon}`)
    .then(response => response.json().then(onWeatherData))
    .catch(err => console.error(`Error fetching weather: ${err}`));
}

function onWeatherData(data) {
        
  console.log(`Received weather data`);
  
  let hourly = data.hourly;
  let hourlyTemp = hourly.map(h => h.temp);
  let maxTemp = Math.max.apply(Math, hourlyTemp);
  let minTemp = Math.min.apply(Math, hourlyTemp);
  
  let weather = {
    weather: data.current.weather[0].main,
    sunrise: data.current.sunrise,
    sunset: data.current.sunset,
    temp: data.current.temp,
    maxTemp: maxTemp,
    minTemp: minTemp,
    startTime: hourly[0].dt,
    hourlyRain: hourly.map(h => h.pop),
    hourlyTemp: hourly.map(h => h.temp)
  };

  console.log(`Sending weather data to app`);
  asap.send({ type: 'weather', weather: weather });
}

function onSettingsChanged() {

  console.log(`Settings changed`);

  let settings = {};

  for (let i = 0; i < settingsStorage.length; ++i) {

    let key = settingsStorage.key(i);
    switch (key) {

      case 'workingDays':
        settings[key] = JSON.parse(settingsStorage.getItem(key)).selected;
        break;

      default:
        settings[key] = JSON.parse(settingsStorage.getItem(key));
        break;
    }
  }

  asap.send({ type: 'settings', settings: settings });
}