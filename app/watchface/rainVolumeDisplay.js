import document from 'document';

const rainVolumeText = document.getElementById('rainVolume');
const rainChanceText = document.getElementById('rainChance');

function setRainVolumeDisplay(show, rainVolume, rainChance) {

    if (show) {
        rainVolumeText.style.visibility = rainChanceText.style.visibility = 'visible';
        rainVolumeText.text = `${Math.round(rainVolume)}mm`;
        rainChanceText.text = `${Math.round(rainChance * 100)}%`
    } else {
        rainVolumeText.style.visibility = rainChanceText.style.visibility = 'hidden';
    }
}

export default setRainVolumeDisplay;