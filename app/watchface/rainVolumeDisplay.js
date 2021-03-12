import document from 'document';

const rainVolumeText = document.getElementById('rainVolume');

function setRainVolumeDisplay(show, rainVolume) {

    if (show) {
        rainVolumeText.text = `${Math.round(rainVolume)}mm`;
    } else {
        rainVolumeText.text = '';
    }
}

export default setRainVolumeDisplay;