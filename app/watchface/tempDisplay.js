import document from 'document';

const minTempText = document.getElementById('minTemp');
const maxTempText = document.getElementById('maxTemp');

function setTempDisplay(minTemp, maxTemp) {

    minTempText.text = `↓${minTemp}°C`;
    maxTempText.text = `↑${maxTemp}°C`;
}

export default setTempDisplay;