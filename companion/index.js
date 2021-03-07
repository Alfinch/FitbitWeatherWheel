import { geolocation } from "geolocation";
import asap from "./asap";
import defaultSettings from "./defaultSettings";
import { settingsStorage } from "settings";

const KEY = "81fdb02366c073581e31e883c6614769";
const URL = `https://api.openweathermap.org/data/2.5/onecall?appid=${KEY}&units=metric&exclude=minutely,daily,alerts`;

defaultSettings();

settingsStorage.addEventListener('change', (evt) => {
  
  console.log(`Companion sends setting change to app`);
  
  asap.send({ type: 'setting', setting: { key: evt.key, value: evt.newValue }});
});

asap.onmessage = message => {
  
  console.log(`Companion receives message: ${message.command}`);
  
  if (message.command === 'weather') {
    
    geolocation.getCurrentPosition(
      onLocationData,
      (err) => handleError('Location', err),
      { timeout: 60 * 1000 });
  }
}

function onLocationData(position) {
  
  console.log(`Companion receives location data`);
  
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  
  fetch(`${URL}&lat=${lat}&lon=${lon}`)
    .then(response => response.json().then(onWeatherData))
    .catch(err => console.error(`Error fetching weather: ${err}`));
}

function onWeatherData(data) {
        
  console.log(`Companion receives weather data`);
  
  let hourly = data['hourly'].slice(0, 24);
  let hourlyTemp = hourly.map(h => h['temp']);
  let maxTemp = Math.max.apply(Math, hourlyTemp);
  let minTemp = Math.min.apply(Math, hourlyTemp);
  
  let weather = {
    weather: data['current']['weather'][0]['main'],
    sunrise: data['current']['sunrise'],
    sunset: data['current']['sunset'],
    temp: data['current']['temp'],
    maxTemp: maxTemp,
    minTemp: minTemp,
    hourly: hourly
      .map(h => {
        return {
          time: h['dt'],
          rain: h['pop'],
          temp: h['temp']
        };
      })
  };

  console.log(`Companion sends weather data to app`);
  asap.send({ type: 'weather', weather: weather });
}