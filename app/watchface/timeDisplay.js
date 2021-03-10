import { preferences } from 'user-settings';
import document from 'document';

const timeText = document.getElementById('time');

function zeroPad(i) {

    return i < 10 ? "0" + i : i;
}

function setTimeDisplay(hours, minutes) {
  
    let hoursDisplay;
    let minutesDisplay = zeroPad(minutes);
    let postfix = '';

    if (preferences.clockDisplay === '12h') {

        hoursDisplay = (hours % 12 || 12);
        postfix = hours < 12 ? 'am' : 'pm';
        timeText.style.fontSize = 50;
        timeText.y = 185;

    } else {

        hoursDisplay = zeroPad(hours);
        timeText.style.fontSize = 60;
        timeText.y = 190;
    }

    timeText.text = `${hoursDisplay}:${minutesDisplay}${postfix}`;
}

export default setTimeDisplay;