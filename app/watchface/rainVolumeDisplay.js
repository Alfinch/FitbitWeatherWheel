import document from 'document';

const rainVolumeText = document.getElementById('rainVolume');
const rainChanceText = document.getElementById('rainChance');

function setRainVolumeDisplay(show, rainVolume, rainChance) {

    if (show) {
        rainVolumeText.text = `${Math.round(rainVolume)}mm`;
        rainChanceText.text = `${Math.round(rainChance * 100)}%`
    } else {
        rainVolumeText.text = '';
        rainChanceText.text = '';
    }
}

export default setRainVolumeDisplay;