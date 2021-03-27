import { me as companion } from 'companion'; 
import { geolocation } from 'geolocation';
import asap from 'fitbit-asap/companion';
import defaultSettings from './defaultSettings';
import { settingsStorage } from 'settings';
import openWeatherMapKey from './openWeatherMapKey';
import { debounce } from 'debounce';

const URL = `https://api.openweathermap.org/data/2.5/onecall`
  + `?appid=${openWeatherMapKey}&units=metric&exclude=minutely,daily,alerts`;

defaultSettings();

if (companion.launchReasons.settingsChanged) {
  onSettingsChanged();
}

settingsStorage.addEventListener('change', debounce((evt) => {
  onSettingsChanged();
}, 1000));

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

  const takeHours = 36;
  
  let hourly = data.hourly;
  
  let weather = {
    startTime: hourly[0].dt,
    sunrise: data.current.sunrise,
    sunset: data.current.sunset,
    hourlyWeather: hourly.map(h => h.weather[0].id).slice(0, takeHours),
    hourlyPOP: hourly.map(h => h.pop).slice(0, takeHours),
    hourlyPVol: hourly.map(h => (h.rain ? h.rain["1h"] : 0) + (h.snow ? h.snow["1h"] : 0)).slice(0, takeHours),
    hourlyTemp: hourly.map(h => h.temp).slice(0, takeHours)
  };

  console.log(`Sending weather data to app (length: ${JSON.stringify(weather).length})`);
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

  console.log(`Sending settings data to app`);
  asap.send({ type: 'settings', settings: settings });
}