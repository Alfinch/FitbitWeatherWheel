import document from 'document';

const tempText = document.getElementById('temp');
const hiTempText = document.getElementById('hiTemp');
const loTempText = document.getElementById('loTemp');

function setTempDisplay(currTemp, minTemp, maxTemp) {

    tempText.text = `${currTemp.toFixed(1)}°C`;
    loTempText.text = `↓ ${minTemp}°C`;
    hiTempText.text = `↑ ${maxTemp}°C`;
}

export default setTempDisplay;