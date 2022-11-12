import document from 'document';

const rainVolumeText = document.getElementById('rainVolume');
const rainChanceText = document.getElementById('rainChance');

function setRainVolumeDisplay(show, volumes) {

    let next24 = volumes.slice(0, 24);

    let maxVolume = Math.max.apply(Math, next24);
    let totalVolume = volumes.reduce((v1, v2) => v1 + v2);

    if (show) {
        rainVolumeText.style.visibility = rainChanceText.style.visibility = 'visible';
        rainVolumeText.text = `↑${Math.round(maxVolume)}mm`;
        rainChanceText.text = `${Math.round(totalVolume)}mm`
    } else {
        rainVolumeText.style.visibility = rainChanceText.style.visibility = 'hidden';
    }
}

export default setRainVolumeDisplay;