import { preferences } from 'user-settings';
import document from 'document';

const timeText = document.getElementById('time');

function zeroPad(i) {

    return i < 10 ? "0" + i : i;
}

function setTimeDisplay(hours, minutes) {
  
    let hoursDisplay;

    if (preferences.clockDisplay === '12h') {

        let postfix = hours < 13 ? 'am' : 'pm';

        hoursDisplay = hours % 12 || 12;

    } else {

        hoursDisplay = zeroPad(hours);
    }

    let minutesDisplay = zeroPad(minutes);

    timeText.text = `${hoursDisplay}:${minutesDisplay}`;
}

export default setTimeDisplay;