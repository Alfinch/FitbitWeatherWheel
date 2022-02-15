import document from 'document';

const debugView = document.getElementById('debugView');
const clickMask = document.getElementById('clickMask');

const currentMemoryText = document.getElementById('currentMemory');
const totalMemoryText = document.getElementById('totalMemory');
const peakMemoryText = document.getElementById('peakMemory');
const memoryPressureText = document.getElementById('memoryPressure');

const weatherOutOfDateText = document.getElementById('weatherOutOfDate');

function setDebugMemory(currentMemory, totalMemory, peakMemory, memoryPressure) {

    currentMemoryText.text = `Current: ${currentMemory / 1000}kb`;
    totalMemoryText.text = `Total: ${totalMemory / 1000}kb`;
    peakMemoryText.text = `Peak: ${peakMemory / 1000}kb`;
    memoryPressureText.text = `Pressure: ${memoryPressure}`;
}

function setDebugWeather(hoursOutOfDate) {

    weatherOutOfDateText.text = `Weather: ${hoursOutOfDate} hours old`;
}

function setDebugToggle() {

    console.log(`Set up debug toggle`);
    clickMask.addEventListener('click', () => toggleDebugView());
}

function toggleDebugView() {

    console.log(`Toggle debug view`);

    if(debugView.style.display == 'none') {
        debugView.style.display = 'inline';
    } else {
        debugView.style.display = 'none';
    }
}

export { setDebugToggle, setDebugMemory, setDebugWeather };