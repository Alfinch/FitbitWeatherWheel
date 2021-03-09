
import document from 'document';

const weatherText = document.getElementById('weather');

function setWeatherDisplay(weather) {
    weatherText.text = weather;
}

export default setWeatherDisplay;