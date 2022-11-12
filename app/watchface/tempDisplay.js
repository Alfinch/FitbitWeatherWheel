import document from 'document';

const minTempText = document.getElementById('minTemp');
const maxTempText = document.getElementById('maxTemp');

function setTempDisplay(show, mode, temps) {

    if (show) {
        minTempText.style.visibility = maxTempText.style.visibility = 'visible';

        let next24 = temps.slice(0, 24);

        let maxTemp = Math.max.apply(Math, next24);
        let minTemp = Math.min.apply(Math, next24);

        if (mode === 0) {

            minTempText.text = `↓${Math.round(minTemp)}°C`;
            maxTempText.text = `↑${Math.round(maxTemp)}°C`;

        } else if (mode === 1) {

            let meanTemp = Math.floor(minTemp + (maxTemp - minTemp) / 2);
            let tempRange = maxTemp - meanTemp;

            minTempText.text = `${Math.round(meanTemp)}°C`;
            maxTempText.text = `±${Math.round(tempRange)}°C`;
        }
    } else {
        minTempText.style.visibility = maxTempText.style.visibility = 'hidden';
    }
}

export default setTempDisplay;