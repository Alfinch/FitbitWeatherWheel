import document from 'document';

const minTempText = document.getElementById('minTemp');
const maxTempText = document.getElementById('maxTemp');

function setTempDisplay(show, temps) {

    if (show) {

        let next24 = temps.slice(0, 24);

        let minTemp = Math.floor(Math.min.apply(Math, next24));
        let maxTemp = Math.ceil(Math.max.apply(Math, next24));

        minTempText.style.visibility = maxTempText.style.visibility = 'visible';
        minTempText.text = `↓${minTemp}°C`;
        maxTempText.text = `↑${maxTemp}°C`;
    } else {
        minTempText.style.visibility = maxTempText.style.visibility = 'hidden';
    }
}

export default setTempDisplay;