import document from 'document';

const minTempText = document.getElementById('minTemp');
const maxTempText = document.getElementById('maxTemp');

function setTempDisplay(show, minTemp, maxTemp) {

    if (show) {
        minTempText.text = `↓${minTemp}°C`;
        maxTempText.text = `↑${maxTemp}°C`;
    } else {
        minTempText.text = '';
        maxTempText.text = '';
    }
}

export default setTempDisplay;