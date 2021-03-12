import document from 'document';

const rainVolumeText = document.getElementById('rainVolume');

function setRainVolumeDisplay(rainVolume) {

    rainVolumeText.text = `${Math.round(rainVolume)}mm`;
}

export default setRainVolumeDisplay;