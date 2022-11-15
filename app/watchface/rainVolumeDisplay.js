import document from 'document';

const rainVolumeText = document.getElementById('rainVolume');
const rainChanceText = document.getElementById('rainChance');

function setRainVolumeDisplay(show, volumes) {

    if (show) {
        let next24 = volumes.slice(0, 24);

        let maxVolume = Math.max.apply(Math, next24);
        let maxVolumeDisplay = maxVolume < 10 ? Math.round(maxVolume * 10) / 10 : Math.round(maxVolume);

        let totalVolume = volumes.reduce((v1, v2) => v1 + v2);

        rainVolumeText.style.visibility = rainChanceText.style.visibility = 'visible';
        rainVolumeText.text = `↑${maxVolumeDisplay}mm`;
        rainChanceText.text = `${Math.round(totalVolume)}mm`
    } else {
        rainVolumeText.style.visibility = rainChanceText.style.visibility = 'hidden';
    }
}

export default setRainVolumeDisplay;